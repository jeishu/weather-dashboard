// DOM Elements
let currentDayEl = $("#currentDay");

let formEl = $("form");

let customSec2El = $(".custom-sec2");

// this is irrevelant now.. :(
let cityEl = $(".city");
let cityWrapperEl = $(".city-wrapper");
let tempEl = $(".temp");
let humidityEl = $(".humidity");
let windEl = $(".wind");
let uviEl = $(".uvi");

let fiveDayEl = $("five-day-container");

let listGroupEl = $(".list-group");

// Global Variables
let apiKey = "8ca6b94fd6054266d22feab6d7957de4";
let date = moment().format("L");


// Calling the AJAX functions
formEl.on("submit", function(event) {
    event.preventDefault();

    // Gets the value from the input text
    let searchCityEl = $("#search-city").val().trim();

    // Checks for a value
    if(!searchCityEl){
        return;
    }
    else{
        console.log(searchCityEl);
        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityEl}&units=imperial&appid=${apiKey}`;
        // empties anything inside and gets everything ready to append new searches
        customSec2El.empty();

        // gets information for the current weather
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response){

            // checking for values
            console.log(queryURL);
            console.log(response);
            
            // Moved from .text to .append because it easier to empty() and .append then to change text, also template literals are cool
            // city name and date
            customSec2El.append(`<h3 style="font-size: 3rem">${response.name} ${date}</h3>`)
            // Response to Weather, within the weather is an array, so index of 0 to call the icon number.
            customSec2El.append(`<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}.png">`);
            // temperature
            customSec2El.append(`<div class="temp weather-val">Temperature: ${response.main.temp}°F</div>`);
            // humidity
            customSec2El.append(`<div class="wind weather-val">Humidity: ${response.main.humidity}%</div>`);
            // wind speed
            customSec2El.append(`<div class="uvi weather-val">Wind Speed: ${response.wind.speed} MPH</div>`);
            
            // used to grab the longitude and latitude for the city for the UV Index
            let uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // Checking for coordinates
            console.log(response.coord.lat);
            console.log(response.coord.lon);
            
            // Getting UV INDEX
            $.ajax({
            url: uviQueryURL,
            method: "GET"
            })
            .then(function (response){  
                
                // if the UV index is under 2, it will be green
                if (response.value < 2) {
                    customSec2El.append(`<div class="uvi weather-val low">UV Index: ${response.value}</div>`);
                }
                // if the UV index is between 2 and 5, it will be yellow
                else if (response.value > 2 && response.value < 5){
                    customSec2El.append(`<div class="uvi weather-val low-mid">UV Index: ${response.value}</div>`);
                }
                // if the UV index is between 5 and 8, it will be orange
                else if (response.value > 5 && response.value < 8) {
                    customSec2El.append(`<div class="uvi weather-val mid-high">UV Index: ${response.value}</div>`);
                }
                // if the UV index is over 8, it will be red
                else {
                    customSec2El.append(`<div class="uvi weather-val high">UV Index: ${response.value}</div>`);
                }
            });
            
            // grabbing the 5 day forecast from the searched city
            let forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${searchCityEl}&appid=${apiKey}&units=imperial`;

            // grabing info with AJAX
            $.ajax({
                url: forecastQueryURL,
                method: "GET"
            })
            .then(function (response){  
               for (let i = 0; i < 5; i++) {
                    // getting the date    
                   let displayDate = moment().add(i,"d").format("L");
                   
                   // Creating the forecast card
                   let forecastCard = $("<div>")
                }     



            });
                
    });
    }
});
