package management

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

type Playlist struct {
	ID                 uint `gorm:"primaryKey"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
	EPGLastProcessedAt time.Time
	Description        string
	Server             string
	Username           string
	Password           string
	Type               string
	XmltvURL           string
	M3uURL             string
	ImportStatus       int `gorm:"default:0"`
	EpgStatus          int `gorm:"default:0"`
	Restream           bool
	Categories         []Category `gorm:"foreignKey:PlaylistID;references:ID"`
}

type Category struct {
	ID           uint `gorm:"primaryKey"`
	CreatedAt    time.Time
	UpdatedAt    time.Time
	Num          int
	ExternalID   string `gorm:"index" json:"category_id"`
	CategoryName string `json:"category_name"`
	PlaylistID   uint
	Playlist     Playlist `gorm:"foreignKey:PlaylistID"`
	Active       bool
	Channels     []Channel `gorm:"foreignKey:CategoryID;references:ID"`
}

type Channel struct {
	ID                 int `gorm:"primaryKey"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
	Num                int    `json:"num"`
	Name               string `json:"name"`
	CategoryID         uint
	Category           Category `gorm:"foreignKey:CategoryID"`
	ExternalCategoryID string   `gorm:"index" json:"category_id"`
	StreamID           int      `json:"stream_id"`
	StreamURL          string   `gorm:"streamurl"`
	EpgChannelID       string   `json:"epg_channel_id"`
	HDHRChannelNum     int
	StreamIcon         string `json:"stream_icon"`
	Active             bool
	Programmes         []Programme `gorm:"foreignKey:ChannelID"`
}

type Programme struct {
	gorm.Model
	Start          string `gorm:"type:varchar(255)" xml:"start,attr"`
	Stop           string `gorm:"type:varchar(255)" xml:"stop,attr"`
	StartTimestamp string `gorm:"type:varchar(255)" xml:"start_timestamp,attr"`
	StopTimestamp  string `gorm:"type:varchar(255)" xml:"stop_timestamp,attr"`
	Channel        string `gorm:"type:varchar(255);index" xml:"channel,attr"`
	ChannelID      int    // ForeignKey referencing EpgChannel
	Title          string `gorm:"type:varchar(255)" xml:"title"`
	Desc           string `gorm:"type:text" xml:"desc"`
}

func InitializeDatabase() {
	fmt.Println("Initialize and Migrate database")

	// Define the path for your database file
	dbPath := "./data"
	dbFile := "iptv.db"

	// Check if the directory exists, if not, create it
	if _, err := os.Stat(dbPath); os.IsNotExist(err) {
		errDir := os.MkdirAll(dbPath, 0755)
		if errDir != nil {
			log.Fatalf("Failed to create directory: %v", errDir)
		}
	}

	var err error
	DB, err = gorm.Open(sqlite.Open(filepath.Join(dbPath, dbFile)), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	DB.Exec(`PRAGMA wal_checkpoint(RESTART);`)
	DB.Exec(`PRAGMA cache_size=10000; PRAGMA journal_mode=WAL; PRAGMA temp_store=MEMORY; PRAGMA synchronous=OFF;`)

	// Running the migrations for each model
	err = DB.AutoMigrate(&Playlist{}, &Category{}, &Channel{}, &Programme{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}
}
