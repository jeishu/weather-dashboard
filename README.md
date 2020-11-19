# Weather Dashboard

## Description

This application is intended to show the weather forecast of the cities the user has input into the search bar.

## Table of Contents

* [Features](#Features)
* [Links](#Links)
* [Demo](#Demo)
* [Language](#Language)
* [Code-Example](#Code-Example)
* [Reference](#Reference)
* [Developer-Notes](#Developer-Notes)
* [Contribute/Credits](#Contribute/Credits)
* [License](#License)

## Features

- [x] User can search for the city's weather they desire.
- [x] User can see current and future conditions for that city.
- [x] User can see the city's name, the date, an icon that shows the wether condition, the temperature, the humidity, the wind speed and the UV index.
- [x] User can see color indication of the UV Index if conditions are favorable, moderate, or severe.
- [x] User can see future weather conditions, a 5 day forcast of the city
- [x] User search history is saved and can be access again.
- [x] User can refresh the page and see the last city they search for.

Bonus
- [x] Added a clear button for the history


## Links

* Project Repo: [Repository](https://github.com/jeishu/weather-dashboard)
* GitHub Page: [Website](https://jeishu.github.io/weather-dashboard/)

## Demo

![Nothing Here](./assets/images/giffy.gif)


## Language

* JavaScript
* HTML
* CSS
* [jQuery](https://jquery.com/)
* [Moment.js](https://momentjs.com/)
* [Bootstrap](https://getbootstrap.com/)


## Code-Example

* Since I started using template literals from the last application, I decided to continue using it in this application
    * I used template literals to append most of my content into the DOM. 
```
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
```

## Reference

These are websites I used to aid me in learning different syntax and different methods, functions, etc for Javascript.

> - [Developer Mozilla](https://developer.mozilla.org/en-US/) || Learn a good amount of methods and functions here.
> - [W3School](https://www.w3schools.com/) || jQuery Methods and uses were referenced here.
> - [StackOverflow](https://www.stackoverflow.com/) || Most issues I had were resolved from looking at other people's problems.
> - [HackerThemes](https://hackerthemes.com/bootstrap-cheatsheet/) || Used this as a guide for the styling on the template literal with Bootstrap Classes.
> - [Momentjscom](https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/) || Used this as a guide for how moment format works
> - [CSS-Tricks](https://css-tricks.com/template-literals/) || CSSTRicks has an article on Template Literals, I used this as a guide to create my own.

These websites aid me in creating this README.

> - [GitHub Docs](https://docs.github.com/en/free-pro-team@latest/github/writing-on-github/basic-writing-and-formatting-syntax) || Learn most of my README syntax here.
> - [Akash Nimare](https://medium.com/@meakaakka/a-beginners-guide-to-writing-a-kickass-readme-7ac01da88ab3) || Based my README from his person.
> - [Mark Down Guide](https://www.markdownguide.org/cheat-sheet/) || README Syntax

## Developer-Notes
> AJAX was a tough one since I had to do an AJAX inside an AJAX to get information from the AJAX for the AJAX.
* I had to do a weather AJAX to get the longitude and latitude for the UV Index since queryURL for that doesn't ask for the city name.
    * I had to grab the coordinates from the weather AJAX then plug those coordinates into the queryURL used for UV Index AJAX.

> I had problems with the local storage when trying to append the list in the Search History.
* Initially, when appending the list-items, I would get --> ["Austin 
    * So my TA help me fix that problem since my text was originally a string.
    * So he told me to utilized the split() and replace() since when I append the template literal it would append literally everything.
    * The first code was my first attempt on getting the history to append with some janky way to work around strings. 

```
// variable for the local storage
let history = JSON.parse(localStorage.getItem("historyArray"));
// replacing the [" at the beginning of the array
let remove1 = history.replace('["', '');
// replacing the "] at the end of the array
let remove2 = remove1.replace('"]', '');
// splits the array into value by ","
let splitString = remove2.split('","');

// loops through the array to create the history buttons
for (let i = 0; i < splitString.length; i++) {
    $(".list-group").append(`<li data-city="${splitString[i]}" class="list-group-item list-group-item-action" style="cursor:pointer;">${splitString[i]}</li>`);
}
```
* The second code was my second attempt, but made it more polished and shortened.
    * I thought to myself since the information is grab is coming in as a string, shouldn't I convert it with JSON.parse rather than the first attempt?
    * So I did.
```
// variable for the local storage
let history = JSON.parse(localStorage.getItem("historyArray"));
function createList() {
    
    for (let i = 0; i < history.length; i++) {
        $(".list-group").append(`<li data-city="${history[i]}" class="list-group-item list-group-item-action" style="cursor:pointer;">${history[i]}</li>`);
    }
}
createList();
```

## Contribute/Credits

* Jared
    * He suggest that using to local storage keys. One for the array of history searches and one for the most recent history.
* My TA, Sean
    * Help me understand more about local storage. I was definitely struggling on this one for that.

## License

MIT © [Jeremy Zhu](https://github.com/jeishu)
