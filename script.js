var city_history = [];
var search_div = $('#search-div')
var main_display = $('#main-display')
var city_form = $('#city-search')
var city_input = $('#city-input')
var submit_btn = $('#submit-btn')
var history_div = $('#city-history')
var history_cities = $('.history')
var city_display = $('#city-name')
var temp_display = $('#temp-display')
var humid_display = $('#humid-display')
var wind_display = $('#wind-display')
var uv_display = $('#uv-display')
let forecast_cards = $('.card')

render_history();

function clear_display() {
    city_display.text("");
    temp_display.text("");
    humid_display.text("");
    wind_display.text("");
    uv_display.text("");
    forecast_cards.each(function(index){
        $(this).empty()
    })
};

// Function which will be called when a city is entered in the search bar and must be added to history
function addto_history(city) {
    city = proper_case(city)
    if (!city_history.includes(city)) {
        city_history.push(city);
        localStorage.setItem("city_history", JSON.stringify(city_history))
    };
    render_history();
};

function make_history_div(city_name) {
    var new_div = $('<div>');
    new_div.attr("class", "history");
    new_div.attr("id", city_name);
    new_div.text(city_name);
    history_div.prepend(new_div)
};

// Function which will update the city_history array with local storage data
function render_history() {
    history_div.empty()
    city_history = JSON.parse(localStorage.getItem("city_history"))
    if (city_history === null) {
        city_history = [];
    }
    else {
        for (const element of city_history) {
            make_history_div(element);
        }
    }
};

function get_UV(latitude, longitude) {
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/uvi?appid=abbbd9706c1899a15213e1cbfacf2ef6&lat=" + latitude + "&lon=" + longitude,
        method: "GET"
    }).then(function(response) {
        
    })
};

$('#city-search').submit(function(event) {
    event.preventDefault()
    var city_name = proper_case(city_input.val())
    addto_history(city_name)
    city_input.val("")
    var current_queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city_name + "&appid=abbbd9706c1899a15213e1cbfacf2ef6"
    $.ajax({
        url: current_queryURL,
        method: "GET"
    }).then(function (response) {
        clear_display();
        city_input.val("");
        var kelvin = response.main.temp
        var fahrenheit = Math.round((parseFloat((kelvin - 273)*(9/5)) + parseFloat(32))*10)/10
        var wind_speed_value = response.wind.speed
        var humidity_value = response.main.humidity
        let longitude = response.coord.lon
        let latitude = response.coord.lat

        city_display.text(city_name);
        temp_display.text(fahrenheit + " F");
        humid_display.text(humidity_value + " %");
        wind_display.text(wind_speed_value + " mph");

        uv_queryURL = "https://api.openweathermap.org/data/2.5/uvi?appid=abbbd9706c1899a15213e1cbfacf2ef6&lat=" + latitude + "&lon=" + longitude
            $.ajax({
                url: uv_queryURL,
                method: 'GET'
            }).then(function(response) {
                var index = response.value;
                uv_display.text(index)
            })
        })
    var fiveday_queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city_name + "&appid=abbbd9706c1899a15213e1cbfacf2ef6";
    $.ajax({
        url: fiveday_queryURL,
        method: 'GET'
    }).then(function(response) {
        console.log(response)
        var day1 = {temp: response.list[4].main.temp, humidity: response.list[4].main.humidity, cond :response.list[4].weather[0].main, date: response.list[4].dt_txt.slice(0, 10)}
        var day2 = {temp: response.list[12].main.temp, humidity: response.list[12].main.humidity, cond: response.list[12].weather[0].main, date: response.list[12].dt_txt.slice(0, 10)}
        var day3 = {temp: response.list[20].main.temp, humidity: response.list[20].main.humidity, cond: response.list[20].weather[0].main, date: response.list[20].dt_txt.slice(0, 10)}
        var day4 = {temp: response.list[28].main.temp, humidity: response.list[28].main.humidity, cond: response.list[28].weather[0].main, date: response.list[28].dt_txt.slice(0, 10)}
        var day5 = {temp: response.list[36].main.temp, humidity: response.list[36].main.humidity, cond: response.list[36].weather[0].main, date: response.list[36].dt_txt.slice(0, 10)}
        var forecast_array = [day1, day2, day3, day4, day5]


        $('.card').each(function(index) {
            $(this).empty();
            var info = forecast_array[index]
            var date = $('<p>');
            date.text(date_reformatter(info.date));
            date.attr("class", "forecast-date")
            var condition = $('<img>');
            condition.attr("class", "forecast-img mb-2")
            condition.attr('alt', info.cond);
            // Function to set src
            var temp = $('<p>');
            temp.text('Temperature: ' + info.temp + ' F')
            temp.attr('class', 'forecast-info')
            var humidity = $('<p>')
            humidity.text('Humidity: ' + info.humidity + ' %');
            humidity.attr('class', 'forecast-info');
            $(this).append(date);
            $(this).append(condition);
            $(this).append(temp);
            $(this).append(humidity)


        })
            
            
            

        })

        })

function proper_case(string) {
    var string_first = string[0].toUpperCase();
    var string_rest = string.slice(1).toLowerCase();
    var formatted = string_first + string_rest;
    return formatted

}

// Displays forecast information on the appropriate card. 'info' is a dictionary response created from the API response. Div is the card element on the HTML.
function forecast_displayer (info, El) {
    console.log($('.card-deck').find('div'))
    var temperature = info.temp;
    var date = date_reformatter(info.date);
    var condition = info.cond
    El.find('p').text(date);
    El.find('img').attr("data-condition", condition);
    El.find('div').text(temperature + ' F')
}

// Takes in a date of form YYYY-MM-DD and returns it in form MM/DD
function date_reformatter(date) {
    var month = date.slice(5, 7);
    var day = date.slice(8);
    return month + '/' + day
}

