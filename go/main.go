package main

import (
	"net/http"
	"strings"
	"time"
)

func calcColours(lastTime time.Time) {
	newTime := time.Now()
	diference := time.Since(lastTime)
	if diference < time.Second {

	}
	calcColours(newTime)
}

func main() {
	Time := time.Now()

	go calcColours(Time)

	body := strings.NewReader(
		`{
		"color_1":"1",
		"color_2":"blue"
		}`)
	req, err := http.NewRequest("PUT", "https://synchronozedtablets.firebaseio.com/id/1/color.json", body)
	if err != nil {
		// handle err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// handle err
	}
	resp.Body.Close()

}
