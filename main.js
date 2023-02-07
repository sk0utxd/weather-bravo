const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

app.use(bodyParser.text({ extended: true }));
app.use(bodyParser.json({ extended: true }));

var weather = [];
var currentCity = "Select a city";
app.post('/api', (req, res) => {
    const ee = {
        "cities": [
            {
                "name": "eesti",
                "code": "ee"
            },
            {
                "name": "america",
                "code": "us"
            }
        ],
        "weather": weather,
        "currentCity": currentCity
    }

    if(req.query.value == "ee" || req.query.value == "us"){
        if(req.query.value == "ee"){
            currentCity= "Estonia"
            ee.currentCity = "Estonia"

            fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=58.59&lon=25.01", {
                headers: {
                    "User-Agent": "PostmanRuntime/7.26.8"
                }
            }).then(res => res.json()
            ).then(data => {
                var temp = [];
                for(var i = 0; i < 12; i++){
                    weather, ee.weather[i] = {
                        "temp": data.properties.timeseries[i].data.instant.details.air_temperature,
                        "wind": data.properties.timeseries[i].data.instant.details.wind_speed,
                        "time": new Date(data.properties.timeseries[i].time).toTimeString().substring(0, 8)
                    }
                }
            })
        } else {
            currentCity = "United States"
            ee.currentCity = "United States"
            fetch("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=37.09&lon=95.71", {
                headers: {
                    "User-Agent": "PostmanRuntime/7.26.8"
                }
            }).then(res => res.json()
            ).then(data => {
                for(var i = 0; i < 12; i++){
                    weather, ee.weather[i] = {
                        "temp": data.properties.timeseries[i].data.instant.details.air_temperature,
                        "wind": data.properties.timeseries[i].data.instant.details.wind_speed,
                        "time": new Date(data.properties.timeseries[i].time).toTimeString().substring(0, 8)
                    }
                }
            })
        }
        
    }
    res.json(ee);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
