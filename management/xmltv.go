package management

import (
	"encoding/xml"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"
)

type EPGProgramme struct {
	XMLName        xml.Name `xml:"programme"`
	Start          string   `xml:"start,attr"`
	Stop           string   `xml:"stop,attr"`
	StartTimestamp string   `xml:"start_timestamp,attr"`
	StopTimestamp  string   `xml:"stop_timestamp,attr"`
	Channel        string   `xml:"channel,attr"`
	Title          string   `xml:"title"`
	Desc           string   `xml:"desc"`
	Items          []XMLAny `xml:",any"`
}

type Tv struct {
	XMLName  xml.Name `xml:"tv"`
	Channels []struct {
		ID             string `xml:"id,attr"`
		EpgDisplayName string `xml:"display-name"`
		Icon           struct {
			Src string `xml:"src,attr"`
		} `xml:"icon"`
		Extra []XMLAny `xml:",any"`
	} `xml:"channel"`
	Programmes []EPGProgramme `xml:"programme"`
	XMLAny     []xml.Token
}

type XMLAny struct {
	XMLName xml.Name
	Content string `xml:",innerxml"`
}

func UpdateDBEPG(checkLastProcessed bool) {
	log.Printf("Start Updating the EPG Database")
	if _, err := os.Stat("epg"); os.IsNotExist(err) {
		os.MkdirAll("epg", os.ModePerm) // os.ModePerm is 0777
	}

	playlists, err := GetPlaylists()
	if err != nil {
		log.Fatal(err)
	}

	// Loop through each playlist and process it
	for _, playlist := range playlists {
		// Check if the last processed time should be considered
		if checkLastProcessed {
			// Check if it has been more than 12 hours since the last update
			if time.Since(playlist.EPGLastProcessedAt).Hours() < 12 {
				log.Printf("Playlist %v was already processed less than 12 hours ago. Skipping...", playlist.ID)
				continue
			}
		}

		// Call the function that will update the playlist
		err := UpdatePlaylistEPG(playlist)
		if err != nil {
			log.Fatal(err)
		}
	}

	vaccum()
}

var mutexEPG = &sync.Mutex{}

func UpdatePlaylistEPG(playlist Playlist) error {
	mutexEPG.Lock()
	defer mutexEPG.Unlock()

	log.Printf("Processing playlist: %v", playlist.ID)

	playlist.EpgStatus = 1
	if err := DB.Save(&playlist).Error; err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to update playlist status: %w", err)
	}

	url := playlist.XmltvURL
	response, err := http.Get(url)
	if err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to get HTTP response: %w", err)
	}
	defer response.Body.Close()

	data, err := io.ReadAll(response.Body)
	if err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to read response body: %w", err)
	}

	epgFilePath := fmt.Sprintf("epg/%v.xml", playlist.ID)
	err = os.WriteFile(epgFilePath, data, 0644)
	if err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to write to EPG file: %w", err)
	}

	log.Printf("EPG for playlist %v downloaded successfully.", playlist.ID)

	// Read and modify XML
	tv := &Tv{}
	err = xml.Unmarshal(data, tv)
	if err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to unmarshal XML data: %w", err)
	}

	// Raw SQL to delete all Programme entries where the channel_id matches a EpgChannelID in Channels for a given playlist_id
	if err := DB.Exec("DELETE FROM programmes WHERE channel_id IN (SELECT id FROM channels WHERE category_id IN (SELECT id FROM categories WHERE playlist_id = ?))", playlist.ID).Error; err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to delete programmes from DB: %w", err)
	}

	// Loop through each channel in XML EPG
	for _, epgChannel := range tv.Channels {
		// Find corresponding channels in the database
		dbChannels, err := GetChannelsByEpgIdAndPlaylistId(epgChannel.ID, playlist.ID)
		if err != nil {
			log.Println("Could not find database channel for EPG ID", epgChannel.ID)
			continue
		}

		newProgrammes := []Programme{} // Slice to hold new programmes

		// For each database channel
		for _, dbChannel := range dbChannels {
			// Loop through each EPG programme
			for _, epgProgramme := range tv.Programmes {
				// If the Channel ID of the programme matches the ID of the epgChannel, create a new Programme
				if epgProgramme.Channel == epgChannel.ID {
					newProgramme := Programme{
						Start:          epgProgramme.Start,
						Stop:           epgProgramme.Stop,
						StartTimestamp: epgProgramme.StartTimestamp,
						StopTimestamp:  epgProgramme.StopTimestamp,
						Channel:        epgProgramme.Channel,
						ChannelID:      dbChannel.ID, // Reference the Channel ID.
						Title:          epgProgramme.Title,
						Desc:           epgProgramme.Desc,
					}

					// Add to the slice of newProgrammes
					newProgrammes = append(newProgrammes, newProgramme)
				}
			}
		}

		chunkSize := 500 // Adjust this number based on your data
		for i := 0; i < len(newProgrammes); i += chunkSize {
			end := i + chunkSize

			// Check if end is out of range
			if end > len(newProgrammes) {
				end = len(newProgrammes)
			}

			// Get a chunk of new programmes
			chunk := newProgrammes[i:end]

			// Prepare SQL statement and values
			sql := "INSERT INTO `programmes` (`created_at`,`updated_at`,`deleted_at`,`start`,`stop`,`start_timestamp`,`stop_timestamp`,`channel`,`channel_id`,`title`,`desc`) VALUES "
			values := []interface{}{}

			// Loop through each programme in chunk
			for _, programme := range chunk {
				// Append SQL and values
				sql += "(?,?,?,?,?,?,?,?,?,?,?),"
				values = append(values, time.Now(), time.Now(), nil, programme.Start, programme.Stop, programme.StartTimestamp, programme.StopTimestamp, programme.Channel, programme.ChannelID, programme.Title, programme.Desc)
			}

			// Trim trailing comma
			sql = strings.TrimSuffix(sql, ",")

			// Execute SQL statement
			err = DB.Exec(sql, values...).Error
			if err != nil {
				// In case of error, rollback the transaction and return from the function
				log.Printf("Failed to save Programmes: %v", err)

			}
		}
	}

	// update the EPGLastProcessedAt field and save the playlist
	playlist.EPGLastProcessedAt = time.Now()
	playlist.EpgStatus = 2
	if err := DB.Save(&playlist).Error; err != nil {
		playlist.EpgStatus = -1
		DB.Save(&playlist)
		return fmt.Errorf("failed to save playlist: %w", err)
	}

	log.Printf("Playlist %v processed successfully.", playlist.ID)

	return nil
}

func ExportDBEPGToXML() ([]byte, error) {
	var channels []Channel
	if err := DB.Joins("Category").Where("Category.active = ?", 1).Preload("Programmes").Find(&channels).Error; err != nil {
		log.Printf("Failed to fetch Channels: %v", err)
		return nil, err
	}

	xmlChannels := make([]struct {
		ID             string `xml:"id,attr"`
		EpgDisplayName string `xml:"display-name"`
		Icon           struct {
			Src string `xml:"src,attr"`
		} `xml:"icon"`
		Extra []XMLAny `xml:",any"`
	}, len(channels))

	var xmlProgrammes []EPGProgramme

	for i, ch := range channels {
		xmlChannels[i] = struct {
			ID             string `xml:"id,attr"`
			EpgDisplayName string `xml:"display-name"`
			Icon           struct {
				Src string `xml:"src,attr"`
			} `xml:"icon"`
			Extra []XMLAny `xml:",any"`
		}{
			ID:             strconv.Itoa(ch.HDHRChannelNum),
			EpgDisplayName: ch.Name,
			Icon: struct {
				Src string `xml:"src,attr"`
			}{Src: ch.StreamIcon},
		}

		for _, p := range ch.Programmes {
			xmlProgrammes = append(xmlProgrammes, EPGProgramme{
				Start:          p.Start,
				Stop:           p.Stop,
				StartTimestamp: p.StartTimestamp,
				StopTimestamp:  p.StopTimestamp,
				Channel:        strconv.Itoa(ch.HDHRChannelNum),
				Title:          p.Title,
				Desc:           p.Desc,
			})
		}
	}

	tv := &Tv{
		Channels:   xmlChannels,
		Programmes: xmlProgrammes,
	}

	data, err := xml.MarshalIndent(tv, "", "  ")
	if err != nil {
		log.Printf("Failed to marshal Tv to XML: %v", err)
		return nil, err
	}

	log.Println("EPG database exported successfully.")
	return data, nil
}
