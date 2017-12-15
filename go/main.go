package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"
)

var (
	amountImages int
	colourList   []string
	options      map[int]string
	closing      bool
	idCountTot   int
	values       map[string]interface{}
)

func main() {
	var (
		colours []string
	)
	Time := time.Now()
	go getCurrentIDs(Time)

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
	}
	a := i - 1
	for i := 0; i < len(colours); i++ {
		options[a+i] = colours[i]
	}
	log.Println(options)

	go calcColours(Time)
	go getCurrentIDs(Time)
	var signal_channel chan os.Signal
	signal_channel = make(chan os.Signal, 1)
	signal.Notify(signal_channel, os.Interrupt)
	<-signal_channel
	closing = true

}

func calcColours(lastTime time.Time) {
	var (
		diference   time.Duration
		newTime     time.Time
		random      string
		random2     string
		idValues    map[string]interface{}
		colorValues map[string]string
	)

	diference = time.Since(lastTime)
	if closing {
		log.Println("closing down")
		os.Exit(0)
	} else if diference > 0 {
		time.Sleep(time.Second*3 - diference)
	}
	newTime = time.Now()
	values = make(map[string]interface{}, idCountTot)
	random = options[rand.Intn(len(options))+1]
	for i := 1; i < idCountTot; i++ {
		idValues = make(map[string]interface{})
		colorValues = make(map[string]string)
		random2 = options[rand.Intn(len(options))+1]
		colorValues["color_1"] = random
		colorValues["color_2"] = random2
		idValues["color"] = colorValues
		idValues["pictures"] = "4"
		values[strconv.Itoa(i)] = idValues
		random = random2
	}
	bits, _ := json.Marshal(values)
	body := bytes.NewReader(bits)
	//log.Println(string(bits))
	req, err := http.NewRequest("PUT", "https://synchronozedtablets.firebaseio.com/id.json", body)
	if err != nil {
		// handle err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		// handle err
	}
	resp.Body.Close()
	println("---------------------------------------------------------------------")
	calcColours(newTime)
}

func getCurrentIDs(lastTime time.Time) {

	var (
		diference time.Duration
		newTime   time.Time
		idCount   []byte
	)

	log.Println("im here now")

	resp, err := http.Get("https://synchronozedtablets.firebaseio.com/idCount.json?")
	if err != nil {
		log.Println("could not get the date required for the setup, could not find idCount")
		os.Exit(0)
	}
	log.Println(resp)
	defer resp.Body.Close()
	idCount, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	idCountTot1, _ := strconv.Atoi(string(idCount))
	idCountTot = idCountTot1 + 10
	println(idCountTot)

	newTime = time.Now()
	diference = time.Since(lastTime)
	if closing {
		log.Println("closing down")
		os.Exit(0)
	} else if diference > 0 {
		time.Sleep(time.Minute - diference)
	}
	getCurrentIDs(newTime)
}
