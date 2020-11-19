// DOM Elements
let currentDayEl = $("#currentDay");

let formEl = $("form");

let customSec2El = $(".custom-sec2");
let customSec3El = $(".custom-sec3");

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
let historyArr = [];

// Function for AJAX Calling, and Generating HTML
function renderInfo() {

    // Gets the value from the input text
    let searchCityEl = $("#search-city").val().trim().toUpperCase();

    // Checks for a value
    if(searchCityEl === ""){
        return;
    }
    else{
        console.log(searchCityEl);

        // Pushes the value into the historyArr
        historyArr.push(searchCityEl);

        // Saving the user searches into an array
        // localStorage.setItem("historyArray", JSON.stringify(historyArr));

        // Saving the user searches, just one search
        localStorage.setItem("historySearch", JSON.stringify(searchCityEl));
        
        // console.log(localStorage.getItem("historySearch", searchCityEl));

        let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${searchCityEl}&units=imperial&appid=${apiKey}`;
        // empties anything inside and gets everything ready to append new searches
        customSec2El.empty();
        customSec3El.empty();

        // gets information for the current weather
        $.ajax({
            url: queryURL,
            method: "GET"
        })
        .then(function (response){

            // checking for values
            // console.log(queryURL);
            // console.log(response);
            
            // Moved from .text to .append because it easier to empty() and .append then to change text, also template literals are cool
            customSec2El.append(`
                <h3 style="font-size: 3rem">${response.name} (${date})</h3>
                <img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">
                <div class="temp weather-val">Temperature: ${response.main.temp}°F</div>
                <div class="wind weather-val">Humidity: ${response.main.humidity}%</div>
                <div class="uvi weather-val">Wind Speed: ${response.wind.speed} MPH</div>
            `);
            
            // used to grab the longitude and latitude for the city for the UV Index
            let uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

            // Checking for coordinates
            // console.log(response.coord.lat);
            // console.log(response.coord.lon);
            
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
            // console.log(forecastQueryURL);
            
            // grabing info with AJAX
            $.ajax({
                url: forecastQueryURL,
                method: "GET"
            })
            .then(function (response){  
               for (let i = 0; i < 5; i++) {
                    // getting the date    
                   let displayDate = moment().add(i + 1,"d").format("L");
                   
                   // Creating the forecast card
                   // Multiplying i by 8 to get the next day rather than 3 hours
                   customSec3El.append(`
                        <div class="card card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center" style="width: 18rem;">
                            <div class="card-body d-flex flex-column justify-content-center align-items-center">
                                <h5 class="card-title">${displayDate}</h5>
                                <img style="width: 70%; height: auto" src="https://openweathermap.org/img/wn/${response.list[i*8].weather[0].icon}@2x.png">
                                <p class="card-text">Temp: ${response.list[i*8].main.temp}°F</p>
                                <p class="card-text">Humidity: ${response.list[i*8].main.humidity}%</p>
                            </div>
                        </div>
                    `)
                }     
            });       
    });
    historyStored();
    historyAdd();
    }
}

// Calling the functions when the form is submitted
formEl.on("submit", function(event) {
    event.preventDefault();
    renderInfo();
    location.reload();
});

// Stores and creates the history list that can only go up to 5
function historyStored() {
    let historyCities = JSON.parse(localStorage.getItem("historyArray"));
    historyArr = [];
    $(".list-group").empty();
    if(historyCities) {
        if(historyCities.length < 5){
            var value = historyCities.length;
        }
        else {
            var value = 5
        }
        for (let i = 0; i < value; i++) {
            historyArr.push(historyCities[i]);
            $(".list-group").append(`<li data-city="${historyCities[i]}" class="list-group-item list-group-item-action align-self-stretch" style="cursor:pointer; width:100%;">${historyCities[i]}</li>`);
        }
    }
}

// calling this function to ensure everything is rendered on the list
historyStored();

// when a new value is added, it removes the last value search and adds a new value to the list
function historyAdd() {
    historyStored();

    let newSearch = $("#search-city").val().trim().toUpperCase();

    // unshift() adds value to the top of the array
    historyArr.unshift(newSearch);
    localStorage.setItem("historyArray", JSON.stringify(historyArr));
}



// when something the list item is clicked on, the listed item will render the AJAX functions and append the info
$("li").on("click", function(event) {
    event.preventDefault();
    
    // Gets the value from the data attribute rather than value because the value didn't work for me lol
    let listGroup = $(this).attr("data-city");
    
    // checks to see what is being grabbed
    console.log(listGroup);

    // checks the value from the data attribute then pushes that value as a city when the button is clicked
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${listGroup}&units=imperial&appid=${apiKey}`;
    
    // empties anything inside and gets everything ready to append new searches
    customSec2El.empty();
    customSec3El.empty();

    // gets information for the current weather
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function (response){
        
        // Moved from .text to .append because it easier to empty() and .append then to change text, also template literals are cool
        // city name and date
        customSec2El.append(`
            <h3 style="font-size: 3rem">${response.name} (${date})</h3>
            <img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">
            <div class="temp weather-val">Temperature: ${response.main.temp}°F</div>
            <div class="wind weather-val">Humidity: ${response.main.humidity}%</div>
            <div class="uvi weather-val">Wind Speed: ${response.wind.speed} MPH</div>
        `);
        
        // used to grab the longitude and latitude for the city for the UV Index
        let uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;

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
        let forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${listGroup}&appid=${apiKey}&units=imperial`;
        
        // grabing info with AJAX
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        })
        .then(function (response){  

            for (let i = 0; i < 5; i++) {
                // getting the date    
                let displayDate = moment().add(i + 1,"d").format("L");
                
                // Creating the forecast card
                // Multiplying i by 8 to get the next day rather than 3 hours
                customSec3El.append(`
                    <div class="card card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center" style="width: 18rem;">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 class="card-title">${displayDate}</h5>
                            <img style="width: 70%; height: auto" src="https://openweathermap.org/img/wn/${response.list[i*8].weather[0].icon}@2x.png">
                            <p class="card-text">Temp: ${response.list[i*8].main.temp}°F</p>
                            <p class="card-text">Humidity: ${response.list[i*8].main.humidity}%</p>
                        </div>
                    </div>
                `)
            }     
        });       
     });
})

var recentStored = JSON.parse(localStorage.getItem("historySearch"));

function recentHistory() {
    
    let queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${recentStored}&units=imperial&appid=${apiKey}`;
    
    // empties anything inside and gets everything ready to append new searches
    customSec2El.empty();
    customSec3El.empty();

    // gets information for the current weather
    $.ajax({
        url: queryURL,
        method: "GET"
    })
    .then(function (response){

        // Moved from .text to .append because it easier to empty() and .append then to change text, also template literals are cool
        customSec2El.append(`
            <h3 style="font-size: 3rem">${response.name} (${date})</h3>
            <img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">
            <div class="temp weather-val">Temperature: ${response.main.temp}°F</div>
            <div class="wind weather-val">Humidity: ${response.main.humidity}%</div>
            <div class="uvi weather-val">Wind Speed: ${response.wind.speed} MPH</div>
        `);
        
        // used to grab the longitude and latitude for the city for the UV Index
        let uviQueryURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${response.coord.lat}&lon=${response.coord.lon}`;
        
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
        let forecastQueryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${recentStored}&appid=${apiKey}&units=imperial`;

        // grabing info with AJAX
        $.ajax({
            url: forecastQueryURL,
            method: "GET"
        })
        .then(function (response){  
            for (let i = 0; i < 5; i++) {
                // getting the date    
                let displayDate = moment().add(i + 1,"d").format("L");
                
                // Creating the forecast card
                // Multiplying i by 8 to get the next day rather than 3 hours
                customSec3El.append(`
                    <div class="card card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center" style="width: 18rem;">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <h5 class="card-title">${displayDate}</h5>
                            <img style="width: 70%; height: auto" src="https://openweathermap.org/img/wn/${response.list[i*8].weather[0].icon}@2x.png">
                            <p class="card-text">Temp: ${response.list[i*8].main.temp}°F</p>
                            <p class="card-text">Humidity: ${response.list[i*8].main.humidity}%</p>
                        </div>
                    </div>
                `);
            }     
        });
    })
}

recentHistory();

// clears the local storage and empties the list history
$(".clearBtn").on("click", function(){
    localStorage.clear("historyArray");
    localStorage.clear("historySearch");
    $(".list-group").empty();
    location.reload();
})