// DOM Elements
let currentDayEl = $("#currentDay");

let searchCityEl = $("#search-city").val().trim();
let cityEl = $(".city");
let cityWrapperEl = $(".city-wrapper");
let tempEl = $(".temp");
let humidityEl = $(".humidity");
let windEl = $(".wind");
let uviEl = $(".uvi");

// The Current Time
function currentTimeNow() {
    let currentDisplay = moment().format("MMMM Do YYYY, h:mm a");
    currentDayEl.html(currentDisplay);
}

setInterval(currentTimeNow, 1000);

let apiKey = "8ca6b94fd6054266d22feab6d7957de4";

// Calling the AJAX functions
let queryURL = `http://api.openweathermap.org/data/2.5/weather?q=Killeen&units=imperial&appid=${apiKey}`;

let lat = "";
let lon = "";

$.ajax({
    url: queryURL,
    method: "GET"
})
.then(function (response){
    console.log(queryURL);
    console.log(response);
    
    cityEl.text(response.name);
    
    tempEl.text("Temperature: " + response.main.temp + "°F");
    humidityEl.text("Humidity: " + response.main.humidity + "%");
    windEl.text("Wind Speed: " + response.wind.speed + " MPH");
    // Response to Weather, within the weather is an array, so index of 0 to call the icon number.
    cityWrapperEl.append(`<img src="http://openweathermap.org/img/wn/${response.weather[0].icon}.png">`);

    let uviQueryURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

    console.log(response.coord.lat);
    console.log(response.coord.lon);
    
    $.ajax({
    url: uviQueryURL,
    method: "GET"
    })
    .then(function (response){  
        uviEl.text("UV Index: " + response.value);
    });
    
});

