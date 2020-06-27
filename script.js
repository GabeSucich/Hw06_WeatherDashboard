var city_history = [];


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

function current_weather(city) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=abbbd9706c1899a15213e1cbfacf2ef6",
        method: "GET"
    }).then(function (response) {
        var kelvin = response.main.temp
        var fahrenheit = Math.round((parseFloat((kelvin - 273)*(9/5)) + parseFloat(32))*10)/10
        var wind_speed_value = response.wind.speed
        var humidity_value = response.main.humidity
        var longitude = response.coord.lon
        var latitude = response.coord.lat
        var UV_index = get_UV(latitude, longitude);
        console.log(UV_index)
        console.log([fahrenheit, wind_speed_value, humidity_value, UV_index])

    })
}

function get_UV(latitude, longitude) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=abbbd9706c1899a15213e1cbfacf2ef6&lat=" + latitude + "&lon=" + longitude,
        method: "GET"
    }).then(function(response) {
    
    })
}

console.log(get_UV(41.85, -87.65))





