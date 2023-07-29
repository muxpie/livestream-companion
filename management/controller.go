package management

import (
	"context"
	"livestream-companion/stream"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func GetPlaylistsHandler(c *gin.Context) {
	playlists, err := GetPlaylists()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, playlists)
}

func GetPlaylistByIDHandler(c *gin.Context) {
	idStr := c.Param("id")
	idInt, _ := strconv.Atoi(idStr)
	idUInt := uint(idInt)

	playlist, err := GetPlaylistByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, playlist)
}

func InsertPlaylistHandler(c *gin.Context) {
	// Create a new Playlist object
	var playlist Playlist

	// Bind JSON body to playlist
	if err := c.ShouldBindJSON(&playlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the new playlist
	if err := playlist.Save(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	go ImportXtream(c, playlist.ID)

	c.JSON(http.StatusOK, playlist)
}

func UpdatePlaylistByIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Check if playlist exists
	playlist, err := GetPlaylistByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Bind JSON body to playlist
	if err := c.ShouldBindJSON(&playlist); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated playlist
	if err := playlist.Update(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	go ImportXtream(c, playlist.ID)

	c.JSON(http.StatusOK, playlist)
}

func DeletePlaylistByIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Check if playlist exists
	playlist, err := GetPlaylistByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Delete the playlist
	if err := playlist.Delete(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func GetCategoriesHandler(c *gin.Context) {
	categories, err := GetCategories()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func GetCategoriesByPlaylistIDHandler(c *gin.Context) {
	// Parse playlist id from path parameters
	idStr := c.Param("playlist_id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Fetch categories from database
	categories, err := GetCategoriesByPlaylistID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func GetCategoriesActiveByPlaylistIDHandler(c *gin.Context) {
	// Parse playlist id from path parameters
	idStr := c.Param("playlist_id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Fetch categories from database
	categories, err := GetCategoriesActiveByPlaylistID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, categories)
}

func GetChannelsByPlaylistIDHandler(c *gin.Context) {
	// Parse playlist id from path parameters
	idStr := c.Param("playlist_id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Fetch categories from database
	channels, err := GetChannelsByPlaylistID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

func GetCategoryByIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Fetch category from database
	category, err := GetCategoryByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

func UpdateCategoryByIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Check if category exists
	category, err := GetCategoryByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Bind JSON body to category
	if err := c.ShouldBindJSON(&category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated category
	if err := category.Update(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, category)
}

func UpdateChannelByIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Check if channel exists
	channel, err := GetChannelByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Bind JSON body to channel
	if err := c.ShouldBindJSON(&channel); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Save the updated channel
	if err := channel.Update(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channel)
}

func UpdateActiveCategoriesByPlaylistIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("playlist_id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Bind JSON body to category
	type bodyData struct {
		Active bool `json:"Active"`
	}
	var data bodyData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the categories
	if err := UpdateActiveCategoriesByPlaylistID(idUInt, data.Active); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Updated successfully"})
}

func UpdateActiveChannelsByPlaylistIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("playlist_id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Bind JSON body to channel
	type bodyData struct {
		Active bool `json:"Active"`
	}
	var data bodyData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the channels
	if err := UpdateActiveChannelsByPlaylistID(idUInt, data.Active); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Updated successfully"})
}

func UpdateActiveChannelsByCategoryIDHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Bind JSON body to channel
	type bodyData struct {
		Active bool `json:"Active"`
	}
	var data bodyData

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Update the channels
	if err := UpdateActiveChannelsByCategoryID(idUInt, data.Active); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Updated successfully"})
}

func RestreamingHandler(c *gin.Context) {
	// Parse id from path parameters
	idStr := c.Param("id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	// Fetch the channel by ID
	channel, err := GetChannelByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Start restreaming the channel
	println("channel.StreamURL: ", channel.StreamURL)
	err = stream.StartRestreaming(context.Background(), channel.StreamURL, c.Writer)
	if err != nil {
		c.String(http.StatusInternalServerError, err.Error())
	}
}

func StreamHandler(c *gin.Context) {
	base := filepath.Base(c.Param("path"))             // Get the last element of the path
	id := strings.TrimSuffix(base, filepath.Ext(base)) // Remove the extension

	if strings.HasSuffix(c.Param("path"), ".ts") {
		idInt, err := strconv.Atoi(id)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}
		idUInt := uint(idInt)

		// Fetch the channel by ID
		channel, err := GetChannelByID(idUInt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		webbrowser, _ := strconv.ParseBool(c.DefaultQuery("webbrowser", "false"))
		stream.HandleTS(c, channel.StreamURL, id, webbrowser)
	}

}

func GetEPG(c *gin.Context) {
	xmlData, err := ExportDBEPGToXML()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to export EPG to XML",
		})
		return
	}

	c.Data(http.StatusOK, "application/xml", xmlData)
}

func GetChannelsHandler(c *gin.Context) {
	channels, err := GetChannels()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

func GetChannelByIDHandler(c *gin.Context) {
	idStr := c.Param("id")
	idInt, _ := strconv.Atoi(idStr)
	idUInt := uint(idInt)

	channel, err := GetChannelByID(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channel)
}

func GetChannelsByEpgIdHandler(c *gin.Context) {
	epgId := c.Param("epgId")

	channels, err := GetChannelsByEpgId(epgId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

func GetChannelsByEpgIdAndPlaylistIdHandler(c *gin.Context) {
	epgId := c.Param("epgId")
	playlistIdStr := c.Param("playlistId")
	playlistIdInt, _ := strconv.Atoi(playlistIdStr)
	playlistIdUInt := uint(playlistIdInt)

	channels, err := GetChannelsByEpgIdAndPlaylistId(epgId, playlistIdUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

func GetChannelsWithNoEpgHandler(c *gin.Context) {
	channels, err := GetChannelsWithNoEpg()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

func GetChannelsWithNoEpgByPlaylistIdHandler(c *gin.Context) {
	playlistIdStr := c.Param("playlistId")
	playlistIdInt, _ := strconv.Atoi(playlistIdStr)
	playlistIdUInt := uint(playlistIdInt)

	channels, err := GetChannelsWithNoEpgByPlaylistId(playlistIdUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

func UpdateHDHRChannelNumForAllChannelsHandler(c *gin.Context) {
	err := UpdateHDHRChannelNumForAllChannels()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "success"})
}

func GetChannelsByCategoryIdHandler(c *gin.Context) {
	idStr := c.Param("category_id")
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	channels, err := GetChannelsByCategoryId(idUInt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, channels)
}

// This is a new handler to get programmes by channel ID
func GetProgrammesByChannelIDHandler(c *gin.Context) {
	channelID := c.Param("id")
	idInt, err := strconv.Atoi(channelID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	idUInt := uint(idInt)

	var programmes []Programme
	programmes, err = GetProgrammesByChannelID(idUInt)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, programmes)
}
