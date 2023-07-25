package management

import "log"

func (p *Playlist) Save() error {
	result := DB.Create(p)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (p *Playlist) Update() error {
	result := DB.Model(&Playlist{}).Where("id = ?", p.ID).UpdateColumns(map[string]interface{}{
		"Description":  p.Description,
		"Server":       p.Server,
		"Username":     p.Username,
		"Password":     p.Password,
		"Type":         p.Type,
		"XmltvURL":     p.XmltvURL,
		"M3uURL":       p.M3uURL,
		"ImportStatus": p.ImportStatus,
		"Restream":     p.Restream,
	})
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (p *Playlist) Delete() error {
	// Manually delete the associated Channels, Categories and Programmes using raw SQL
	DB.Exec("DELETE FROM programmes WHERE channel_id IN (SELECT id FROM channels WHERE category_id IN (SELECT id FROM categories WHERE playlist_id = ?))", p.ID)
	DB.Exec("DELETE FROM channels WHERE category_id IN (SELECT id FROM categories WHERE playlist_id = ?)", p.ID)
	DB.Exec("DELETE FROM categories WHERE playlist_id = ?", p.ID)

	// Finally, delete the Playlist
	result := DB.Unscoped().Delete(&p)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func vaccum() {
	err := DB.Exec("VACUUM").Error
	if err != nil {
		log.Fatal(err)
	}
}

func GetPlaylists() ([]Playlist, error) {
	var playlists []Playlist
	result := DB.Find(&playlists)
	if result.Error != nil {
		return nil, result.Error
	}

	return playlists, nil
}

func GetPlaylistByID(id uint) (*Playlist, error) {
	var playlist Playlist
	result := DB.First(&playlist, id)
	if result.Error != nil {
		return nil, result.Error
	}

	return &playlist, nil
}

func NewPlaylist(server string, username string, password string, playlistType string, xmltvURL string, m3uURL string) (*Playlist, error) {
	playlist := &Playlist{
		Server:   server,
		Username: username,
		Password: password,
		Type:     playlistType,
		XmltvURL: xmltvURL,
		M3uURL:   m3uURL,
	}

	err := playlist.Save()
	if err != nil {
		return nil, err
	}

	return playlist, nil
}
