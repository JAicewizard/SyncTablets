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
	"math"
)

var (
	amountImages int
	colours   []string
	options      map[int]string
	closing      bool
	idCountTot   int
	values       map[string]interface{}
)

func main() {
	Time := time.Now()

	options = make(map[int]string, amountImages+len(colours)+1)
	imagesCount, _ := strconv.ParseInt(os.Args[2], 0, 46)
	amountImages = int(imagesCount)

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
	if len(os.Args) < 4{
		go calcColours(Time)
		go getCurrentIDs(Time)
	}else{
		mode,_ := strconv.ParseInt(os.Args[3], 0, 46)
		log.Println(mode)
		log.Println(len(os.Args))
		if(mode == 1 && len(os.Args) >= 5){
			idCount, _ := strconv.ParseInt(os.Args[4], 0, 46)
			idCountTot = int(idCount)
			giveOver(Time, 0)
			if(amountImages != 0){
				log.Println("images are not supported yet")
			}
		}else{
			log.Println("please enter the amount of tablets as the last argument")
		}
	}
	
	var signalChannel chan os.Signal
	signalChannel = make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt)
	<-signalChannel
	closing = true

}

func giveOver(lastTime time.Time, step int){
	var(
		diference   time.Duration
		newTime     time.Time
		array		[]string
		array2		[]string
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
	array = make([]string, len(colours)*2)
	array2 = make([]string, len(colours)*2)

	for i, value := range colours {
		array[i*2] =value
		array[i*2+1] =value
		array2[int(math.Mod(float64(i*2+1),float64(len(array2))))] = value
		array2[int(math.Mod(float64(i*2+2),float64(len(array2))))] = value
	}
	log.Println(array)
	log.Println(array2)
	values = make(map[string]interface{}, idCountTot)

	arrayLength := len(array)
	for i := idCountTot; i > 0; i-- {
		idValues = make(map[string]interface{})
		colorValues = make(map[string]string)
		colorValues["color_1"] = array[int(math.Mod(math.Abs(float64((i-1)*2-step)),float64(arrayLength)))]
		colorValues["color_2"] = array2[int(math.Mod(math.Abs(float64((i-1)*2-step)),float64(arrayLength)))]
		idValues["color"] = colorValues
		idValues["pictures"] = "0"
		values[strconv.Itoa(i)] = idValues
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
		idValues["pictures"] = amountImages
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
