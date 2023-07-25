package stream

import (
	"context"
	"net/http"

	"github.com/shaunschembri/restreamer/pkg/restream"
)

func StartRestreaming(ctx context.Context, url string, w http.ResponseWriter) error {
	restreamer := restream.Restream{
		ReadBufferSize: 4096,
		Writer:         w,
	}

	if err := restreamer.Start(ctx, url); err != nil {
		return err
	}

	return nil
}
