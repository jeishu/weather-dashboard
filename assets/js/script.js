// DOM Elements
let searchCityEl = $("#search-city");
    let searchVal = searchCityEl.val();

let apiKey = "8ca6b94fd6054266d22feab6d7957de4";


// Calling the AJAX functions

$.ajax({
    url: queryUrl,
    method: "GET"
  })
  .then(function (response){

  });