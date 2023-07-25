package hdhr

import (
	"fmt"
	"net/http"
	"strconv"
	"tunerTV/management"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Stream struct {
	GuideName   string `json:"GuideName"`
	GuideNumber string `json:"GuideNumber"`
	URL         string `json:"URL"`
}

func DiscoverHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"FriendlyName":    "muxpie",
		"Manufacturer":    "Silicondust",
		"ModelNumber":     "HDHR4-2US",
		"FirmwareName":    "hdhomeruntc_atsc",
		"FirmwareVersion": "20150826",
		"DeviceID":        "12345678",
		"DeviceAuth":      "test1234",
		"BaseURL":         "http://localhost:5004",
		"LineupURL":       "http://localhost:5004/lineup.json",
	})
}

func LineupStatusHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"ScanInProgress": 0,
		"ScanPossible":   1,
		"Source":         "Cable",
		"SourceList":     []string{"Cable"},
	})
}

func LineupHandler(c *gin.Context) {
	var categories []management.Category
	management.DB.Preload("Playlist").Preload("Channels", func(db *gorm.DB) *gorm.DB {
		return db.Where("active = ?", 1).Order("hdhr_channel_num ASC")
	}).Where("active = ?", 1).Find(&categories)

	scheme := "http"
	if forwardedProto := c.GetHeader("X-Forwarded-Proto"); forwardedProto != "" {
		scheme = forwardedProto
	} else if c.Request.TLS != nil {
		scheme = "https"
	}

	lineup := []Stream{}
	channelCount := 0
	for _, category := range categories {
		channels := category.Channels
		for _, channel := range channels {
			var streamURL string
			if category.Playlist.Restream {
				streamURL = fmt.Sprintf("%s://%s/hls/%d.%s", scheme, c.Request.Host, channel.ID, "ts")
			} else {
				// Use StreamURL from the database when Restream is false
				streamURL = channel.StreamURL
			}

			channelCount += 1
			lineup = append(lineup, Stream{
				GuideName:   channel.Name,
				GuideNumber: strconv.Itoa(channel.HDHRChannelNum),
				URL:         streamURL,
			})
		}
	}

	c.JSON(http.StatusOK, lineup)
}
