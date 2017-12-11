package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"time"
)

var (
	amountImages int
	colourList   []string
	options      map[int]string
	closing      bool
)

func calcColours(lastTime time.Time) {
	var (
		diference time.Duration
		newTime   time.Time
		random    int
		random2   int
	)
	diference = time.Since(lastTime)
	if closing {
		log.Println("closing down")
		os.Exit(0)
	} else if diference > 0 {
		time.Sleep(time.Second - diference)
	}
	random = rand.Intn(len(options)) + 1
	random2 = rand.Intn(len(options)) + 1
	log.Println(options[random])
	log.Println(random)
	log.Println(options[random2])
	log.Println(random2)
	log.Println("----------------------------------------------------")

	body := strings.NewReader(
		`{
		"color_1":"` + options[random] + `",
		"color_2":"` + options[random2] + `"
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
	newTime = time.Now()
	calcColours(newTime)
}

func main() {
	var (
		colours []string
	)
	options = make(map[int]string, amountImages+len(colours)+1)

	totImages, _ := strconv.ParseInt(os.Args[2], 0, 46)
	amountImages = int(totImages)

	input := os.Args[1]
	log.Println(input)
	_ = json.Unmarshal([]byte(input), &colours)
	log.Printf("Unmarshaled: %v", colours)
	i := 1

	for ; i <= amountImages; i++ {
		options[i] = strconv.Itoa(i)
		println(options[i])
	}
	a := i - 1
	for i := 0; i < len(colours); i++ {
		options[a+i] = colours[i]
	}
	log.Println(options)

	Time := time.Now()
	go calcColours(Time)
	var signal_channel chan os.Signal
	signal_channel = make(chan os.Signal, 1)
	signal.Notify(signal_channel, os.Interrupt)
	<-signal_channel
	closing = true

}
