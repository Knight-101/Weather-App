const express = require("express");
const https = require("https");
const app = express();
const bodyParser= require("body-parser");

app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('Public'));

app.get("/", function(req,res){

  res.sendFile(__dirname+"/index.html")


})

app.post("/", function(req,res){
  var city = req.body.cityName
  city= city[0].toUpperCase() + city.slice(1);
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid=d747d68200784526113602ac1eba5c29"
  https.get(url,function(resp){
    resp.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const feels= weatherData.main.feels_like
      const humid = weatherData.main.humidity
      const pres = weatherData.main.pressure
      const visi = weatherData.visibility
      const windSpeed = weatherData.wind.speed
      const countryCode = weatherData.sys.country;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png" ;
      var today = new Date()
      var options = {weekday:"long", day :"numeric",month:"long" }
      var dayName = today.toLocaleString("en-us",options);
      var currentTime = today.toLocaleTimeString();
      res.render("index", {day:dayName,time:currentTime,img:imageURL,temp:temp,
        city:city,country:countryCode,description:description,feels:feels,
        humid:humid,pres:pres,visi:visi,windSpeed:windSpeed
      })
    })

  });
})


app.listen(process.env.PORT || 3000 ,function(){
  console.log("server started");
})
