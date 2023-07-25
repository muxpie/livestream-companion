package management

import "sync"

func (c *Channel) Save() error {
	result := DB.Create(&c)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (c *Channel) Update() error {
	result := DB.Model(&Channel{}).Where("id = ?", c.ID).UpdateColumns(map[string]interface{}{
		"Active": c.Active,
		"Name":   c.Name,
	})

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (c *Channel) Delete() error {
	result := DB.Unscoped().Delete(&c)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetChannels() ([]Channel, error) {
	var channels []Channel
	result := DB.Find(&channels)
	if result.Error != nil {
		return nil, result.Error
	}

	return channels, nil
}

func GetChannelsByPlaylistID(playlistID uint) ([]Channel, error) {
	var channels []Channel

	result := DB.Joins("JOIN categories on channels.category_id = categories.id").
		Joins("JOIN playlists on categories.playlist_id = playlists.id").
		Where("playlists.id = ? and categories.active = 1", playlistID).
		Order("categories.num ASC, channels.hdhr_channel_num ASC").
		Find(&channels)

	if result.Error != nil {
		return nil, result.Error
	}

	return channels, nil
}

func GetChannelByID(id uint) (*Channel, error) {
	var channel Channel
	result := DB.First(&channel, id)
	if result.Error != nil {
		return nil, result.Error
	}

	return &channel, nil
}

func GetChannelsByEpgId(epgId string) ([]*Channel, error) {
	var channels []*Channel
	result := DB.Where("epg_channel_id = ?", epgId).Find(&channels)
	if result.Error != nil {
		return nil, result.Error
	}

	return channels, nil
}

func GetChannelsByEpgIdAndPlaylistId(epgId string, playlistId uint) ([]*Channel, error) {
	var channels []*Channel
	result := DB.Joins("JOIN categories on categories.id = channels.category_id").Where("channels.epg_channel_id = ? AND categories.playlist_id = ?", epgId, playlistId).Find(&channels)
	if result.Error != nil {
		return nil, result.Error
	}

	return channels, nil
}

func GetChannelsWithNoEpg() ([]*Channel, error) {
	var channels []*Channel
	result := DB.Where("epg_channel_id = ''").Find(&channels)

	if result.Error != nil {
		return nil, result.Error
	}

	return channels, nil
}

func GetChannelsWithNoEpgByPlaylistId(playlistId uint) ([]*Channel, error) {
	var channels []*Channel
	result := DB.Joins("JOIN categories on categories.id = channels.category_id").
		Where("channels.epg_channel_id = '' AND categories.playlist_id = ?", playlistId).
		Find(&channels)

	if result.Error != nil {
		return nil, result.Error
	}

	return channels, nil
}

func UpdateActiveChannelsByPlaylistID(playlistId uint, active bool) error {
	var playlist Playlist
	result := DB.Preload("Categories.Channels").First(&playlist, playlistId)
	if result.Error != nil {
		return result.Error
	}

	for _, category := range playlist.Categories {
		for _, channel := range category.Channels {
			channel.Active = active
			if err := DB.Save(&channel).Error; err != nil {
				return err
			}
		}
	}

	return nil
}

func UpdateActiveChannelsByCategoryID(categoryId uint, active bool) error {
	var category Category
	result := DB.Preload("Channels").First(&category, categoryId)
	if result.Error != nil {
		return result.Error
	}

	for _, channel := range category.Channels {
		channel.Active = active
		if err := DB.Save(&channel).Error; err != nil {
			return err
		}
	}

	return nil
}

var mutexChannelNum = &sync.Mutex{}

func UpdateHDHRChannelNumForAllChannels() error {
	mutexChannelNum.Lock() // Lock the mutex.
	defer mutexChannelNum.Unlock()

	// Get all playlists sorted by ID.
	playlists := []Playlist{}
	if err := DB.Order("id asc").Find(&playlists).Error; err != nil {
		return err
	}

	// The starting HDHRChannelNum.
	HDHRChannelNum := 1000

	// Iterate over each playlist.
	for _, playlist := range playlists {
		// Get all categories for the current playlist.
		categories := []Category{}
		if err := DB.Where("playlist_id = ?", playlist.ID).Find(&categories).Error; err != nil {
			return err
		}

		// Iterate over each category of the playlist.
		for _, category := range categories {
			// Get all channels for the current category sorted by ID.
			channels := []Channel{}
			if err := DB.Where("category_id = ?", category.ID).Order("hdhr_channel_num asc").Find(&channels).Error; err != nil {
				return err
			}

			// Iterate over each channel of the category.
			for _, channel := range channels {
				// Update the HDHRChannelNum for the channel.
				if err := DB.Model(&channel).Update("HDHRChannelNum", HDHRChannelNum).Error; err != nil {
					return err
				}
				// Increment the HDHRChannelNum.
				HDHRChannelNum++
			}
		}
	}

	return nil
}

func GetChannelsByCategoryId(categoryId uint) ([]Channel, error) {
	var channels []Channel

	//err := DB.Preload("Programmes").Where("category_id = ?", categoryId).Order("channels.hdhr_channel_num asc").Find(&channels).Error
	err := DB.Preload("Programmes").Where("category_id = ?", categoryId).Order("channels.hdhr_channel_num asc").Find(&channels).Error
	if err != nil {
		return nil, err
	}

	return channels, nil
}

func GetProgrammesByChannelID(channelID uint) ([]Programme, error) {
	var programmes []Programme

	err := DB.Where("channel_id = ?", channelID).Order("start asc").Find(&programmes).Error
	if err != nil {
		return nil, err
	}

	return programmes, nil
}
