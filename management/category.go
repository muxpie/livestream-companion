package management

import "gorm.io/gorm"

func (c *Category) Save() error {
	result := DB.Create(&c)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (c *Category) Update() error {
	result := DB.Model(&Category{}).Where("id = ?", c.ID).UpdateColumns(map[string]interface{}{
		"Active":       c.Active,
		"CategoryName": c.CategoryName,
	})

	if result.Error != nil {
		return result.Error
	}

	return nil
}

func UpdateActiveCategoriesByPlaylistID(playlistId uint, active bool) error {
	result := DB.Model(&Category{}).Where("playlist_id = ?", playlistId).Update("Active", active)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (c *Category) Delete() error {
	result := DB.Unscoped().Delete(&c)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func GetCategories() ([]Category, error) {
	var categories []Category
	result := DB.Find(&categories)
	if result.Error != nil {
		return nil, result.Error
	}

	return categories, nil
}

func GetCategoriesByPlaylistID(playlistID uint) ([]Category, error) {
	var playlist Playlist
	result := DB.Preload("Categories", func(db *gorm.DB) *gorm.DB {
		return db.Order("categories.num ASC")
	}).First(&playlist, "id = ? AND import_status = ?", playlistID, 2)

	if result.Error != nil {
		return nil, result.Error
	}

	return playlist.Categories, nil
}

func GetCategoriesActiveByPlaylistID(playlistID uint) ([]Category, error) {
	var playlist Playlist
	result := DB.Preload("Categories", func(db *gorm.DB) *gorm.DB {
		return db.Where("categories.Active = 1").Order("categories.num ASC")
	}).First(&playlist, "id = ? AND import_status = ?", playlistID, 2)

	if result.Error != nil {
		return nil, result.Error
	}

	return playlist.Categories, nil
}

func GetCategoryByID(id uint) (*Category, error) {
	var category Category
	result := DB.First(&category, id)
	if result.Error != nil {
		return nil, result.Error
	}

	return &category, nil
}

func NewCategory(id string, categoryName string, playlistID uint) (*Category, error) {
	category := &Category{
		CategoryName: categoryName,
		PlaylistID:   playlistID,
	}

	err := category.Save()
	if err != nil {
		return nil, err
	}

	return category, nil
}
