var city_history = [];
var search_div = $('#search-div')
var main_display = $('#main-display')
var city_form = $('#city-search')
var city_input = $('#city-input')
var submit_btn = $('#submit-btn')
var history_cities = $('.history')
var city_display = $('#city-name')
var temp_display = $('#temp-display')
var humid_display = $('#humid-display')
var wind_display = $('#wind-display')
var uv_display = $('#uv-display')
var forecast_cards = $('.card')

function clear_display() {
    city_display.text("");
    temp_display.text("");
    humid_display.text("");
    wind_display.text("");
    uv_display.text("");
    forecast_cards.each(function(index){
        $(this).empty()
    })
}

// Function which will be called when a city is entered in the search bar and must be added to history
function addto_history(city) {
    if (!city_history.includes(city)) {
        city_history.push(city);
        localStorage.setItem("city_history", JSON.stringify(city_history))
    }
}

// Function which will update the city_history array with local storage data
function render_history() {
    city_history = JSON.parse(localStorage.getItem("city_history"))
}

function get_UV(latitude, longitude) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=abbbd9706c1899a15213e1cbfacf2ef6&lat=" + latitude + "&lon=" + longitude,
        method: "GET"
    }).then(function(response) {
        
    })
}


$('#city-search').submit(function(event) {
    event.preventDefault()
    city_input.val("")
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + $(this).val() + "&appid=abbbd9706c1899a15213e1cbfacf2ef6",
        method: "GET"
    }).then(function (response) {
        clear_display();
        var kelvin = response.main.temp
        var fahrenheit = Math.round((parseFloat((kelvin - 273)*(9/5)) + parseFloat(32))*10)/10
        var wind_speed_value = response.wind.speed
        var humidity_value = response.main.humidity
        var longitude = response.coord.lon
        var latitude = response.coord.lat
        
        console.log([fahrenheit, wind_speed_value, humidity_value, UV_index])
})
})



