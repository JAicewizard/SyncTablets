package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"math/rand"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"time"

	"gopkg.in/yaml.v2"
)

type config struct {
	Colours     []string `yaml:"colours"`
	ImagesCount uint64   `yaml:"imagesCount"`
	Settings    struct {
		IncludeColours bool   `yaml:"includeColours"`
		IncludeImages  bool   `yaml:"includeImages"`
		Mode           int64  `yaml:"mode"`
		ScreenCount    uint64 `yaml:"screens"`
		delay          uint   `yaml:"delay"`
	} `yaml:"settings`
}

var (
	options  []string
	closing  bool
	settings config
	values   map[string]interface{}
)

func main() {
	configFile, err := ioutil.ReadFile("config.yaml")
	if err != nil {
		log.Print("could not open config file")
	}
	fmt.Printf("File contents: %s", configFile)
	yaml.Unmarshal(configFile, &settings)
	fmt.Printf("%+v\n", settings)
	log.Println(options)

	if settings.Settings.IncludeImages {
		for i := uint64(1); i <= settings.ImagesCount; i++ {
			log.Println("added" + strconv.FormatUint(i, 10))
			options = append(options, strconv.FormatUint(i, 10))
		}
	}
	if settings.Settings.IncludeColours {
		log.Println("colours are included")
		log.Println(len(settings.Colours))
		for i := 0; i < len(settings.Colours); i++ {
			log.Println("added" + settings.Colours[i])
			options = append(options, settings.Colours[i])
		}
	}
	fmt.Println(options)
	fmt.Println(options)

	Time := time.Now()
	switch settings.Settings.Mode {
	case 0:
		calcColours(Time)
	case 1:
		giveOver(Time, 0)
	}

	var signalChannel chan os.Signal
	signalChannel = make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt)
	<-signalChannel
	closing = true

}

func giveOver(lastTime time.Time, step uint64) {
	var (
		diference   time.Duration
		newTime     time.Time
		array       []string
		array2      []string
		idValues    map[string]interface{}
		colorValues map[string]string
	)
	diference = time.Since(lastTime)
	if closing {
		log.Println("closing down")
		os.Exit(0)
	} else if diference > 0 {
		time.Sleep(time.Second*time.Duration(settings.Settings.delay) - diference)
	}
	array = make([]string, len(settings.Colours)*2)
	array2 = make([]string, len(settings.Colours)*2)

	for i, value := range settings.Colours {
		array[i*2] = value
		array[i*2+1] = value
		array2[int(math.Mod(float64(i*2+1), float64(len(array2))))] = value
		array2[int(math.Mod(float64(i*2+2), float64(len(array2))))] = value
	}

	log.Println(array)
	log.Println(array2)

	values = make(map[string]interface{}, settings.Settings.ScreenCount)

	arrayLength := len(array)
	for i := settings.Settings.ScreenCount; i > 0; i-- {
		println(int(math.Mod(math.Abs(float64((i-1)*2-step)), float64(arrayLength))))
		idValues = make(map[string]interface{})
		colorValues = make(map[string]string)
		currentStep := int(math.Mod(math.Abs(float64((i-1)*2+step)), float64(arrayLength)))
		colorValues["color_1"] = array[currentStep]
		colorValues["color_2"] = array2[currentStep]
		idValues["color"] = colorValues
		idValues["pictures"] = "0"
		values[strconv.FormatUint(settings.Settings.ScreenCount-i+1, 10)] = idValues
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

	newTime = time.Now()

	giveOver(newTime, step+1)
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
		time.Sleep(time.Second*time.Duration(settings.Settings.delay) - diference)
	}
	newTime = time.Now()
	values = make(map[string]interface{}, settings.Settings.ScreenCount)
	fmt.Println(len(options))
	random = options[rand.Intn(len(options))+1]
	for i := uint64(1); i < settings.Settings.ScreenCount; i++ {
		idValues = make(map[string]interface{})
		colorValues = make(map[string]string)
		random2 = options[rand.Intn(len(options))+1]
		colorValues["color_1"] = random
		colorValues["color_2"] = random2
		idValues["color"] = colorValues
		idValues["pictures"] = settings.ImagesCount
		values[strconv.FormatUint(i, 10)] = idValues
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
		//idCount   []byte
	)

	log.Println("im here now")

	resp, err := http.Get("https://synchronozedtablets.firebaseio.com/idCount.json?")
	if err != nil {
		log.Println("could not get the date required for the setup, could not find idCount")
		os.Exit(0)
	}
	log.Println(resp)
	defer resp.Body.Close()
	//idCount, err = ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Print(err)
	}

	//idCountTot1, _ := strconv.Atoi(string(idCount))
	//settings.Settings.ScreenCount = uint64(idCountTot1 + 10)

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
