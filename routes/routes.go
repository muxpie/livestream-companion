package routes

import (
	"livestream-companion/hdhr"
	"livestream-companion/management"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"
)

type Stream struct {
	GuideName   string `json:"GuideName"`
	GuideNumber string `json:"GuideNumber"`
	URL         string `json:"URL"`
}

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Serve hdhomerun resources
	r.GET("/discover.json", hdhr.DiscoverHandler)
	r.GET("/lineup_status.json", hdhr.LineupStatusHandler)
	r.GET("/lineup.json", hdhr.LineupHandler)

	// Serve frontend static files
	r.GET("/", func(c *gin.Context) {
		c.Redirect(302, "/ui")
	})

	// Serve static files for /mui
	r.Static("/ui", "./ui")

	// Handle any other routes by checking if they start with /mui
	r.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/ui") {
			if filepath.Ext(c.Request.URL.Path) == "" {
				c.File("./ui/index.html")
			} else {
				c.Status(http.StatusNotFound)
			}
		} else {
			// Handle other unknown routes as you see fit
			c.Status(http.StatusNotFound)
		}
	})
	r.Static("/player", "./player")

	// API endpoints for playlist
	r.GET("/api/playlists", management.GetPlaylistsHandler)
	r.GET("/api/playlist/:id", management.GetPlaylistByIDHandler)
	r.POST("/api/playlist", management.InsertPlaylistHandler)
	r.PUT("/api/playlist/:id", management.UpdatePlaylistByIDHandler)
	r.DELETE("/api/playlist/:id", management.DeletePlaylistByIDHandler)

	// API endpoint for categories
	r.GET("/api/categories", management.GetCategoriesHandler)
	r.GET("/api/playlists/:playlist_id/categories", management.GetCategoriesByPlaylistIDHandler)
	r.GET("/api/playlists/:playlist_id/categories/active", management.GetCategoriesActiveByPlaylistIDHandler)
	r.GET("/api/playlists/:playlist_id/channels", management.GetChannelsByPlaylistIDHandler)
	r.PUT("/api/playlists/:playlist_id/channels/activateAll", management.UpdateActiveChannelsByPlaylistIDHandler)
	r.PUT("/api/category/:id/channels/activateAll", management.UpdateActiveChannelsByCategoryIDHandler)
	r.GET("/api/category/:id", management.GetCategoryByIDHandler)
	r.PUT("/api/category/:id", management.UpdateCategoryByIDHandler)
	r.PUT("/api/category/active/:playlist_id", management.UpdateActiveCategoriesByPlaylistIDHandler)

	// API endpoints for channels
	r.GET("/api/channels", management.GetChannelsHandler)
	r.GET("/api/channel/:id", management.GetChannelByIDHandler)
	r.PUT("/api/channel/:id", management.UpdateChannelByIDHandler)
	r.GET("/api/channels/epg/:epgId", management.GetChannelsByEpgIdHandler)
	r.GET("/api/channels/epg/:epgId/playlist/:playlistId", management.GetChannelsByEpgIdAndPlaylistIdHandler)
	r.GET("/api/channels/noEpg", management.GetChannelsWithNoEpgHandler)
	r.GET("/api/channels/noEpg/:playlistId", management.GetChannelsWithNoEpgByPlaylistIdHandler)
	r.PUT("/api/channels/hdhr", management.UpdateHDHRChannelNumForAllChannelsHandler)
	r.GET("/api/categories/:category_id/channels", management.GetChannelsByCategoryIdHandler)
	r.GET("/api/channel/:id/programmes", management.GetProgrammesByChannelIDHandler)

	r.GET("/api/m3u/categories/:playlistID", management.M3uCategoryHandler)
	r.GET("/api/m3u/channels/:playlistID", management.M3uChannelHandler)

	r.GET("/hls/*path", management.StreamHandler)
	r.GET("/xmltv", management.GetEPG)

	return r
}
