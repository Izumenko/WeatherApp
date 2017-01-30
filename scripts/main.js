var weatherApp = {

	init: function () {
		this.temperature;
		this.country          = document.getElementById('country');
		this.region           = document.getElementById('region');
		this.city             = document.getElementById('city');
		this.temperatureElem  = document.getElementById('temperature');
		this.temperatureElem1 = document.getElementById('temp');
		this.iconContainer    = document.getElementById('icon-container');
		this.celsiusBtn       = document.getElementById('celsius-btn');
		this.fahrenheitBtn    = document.getElementById('fahrenheit-btn');
		this.days = {
			day1: document.getElementById('day-1'),
			day2: document.getElementById('day-2'),
			day3: document.getElementById('day-3'),
			day4: document.getElementById('day-4'),
			day5: document.getElementById('day-5')
		}

		this.initEvents();
		this.getCurrentLocation();
	},

	initEvents: function () {
		document.getElementById('celsius-btn').addEventListener('click', this.changeTemperatureToCelsius.bind(this));
		document.getElementById('fahrenheit-btn').addEventListener('click', this.changeTemperatureToFahrenheit.bind(this));
	},

	getCurrentLocation: function () {
		var _that = this;
		
		$.getJSON('https://ipapi.co/json/', function(data) {
			console.log(data);
			_that.country.innerHTML = data.country;
			_that.region.innerHTML  = data.region;
			_that.city.innerHTML    = data.city;
	
			_that.getWeatherForLocation(data.city, data.country);
			_that.getWeatherForFiveDays(data.city, data.country);
		});
	},

	// getCurrentLocation: function () {
	// 	var _that = this;
		
	// 	$.getJSON('http://ip-api.com/json', function(data) {
	// 		_that.country.innerHTML = data.country;
	// 		_that.region.innerHTML  = data.regionName;
	// 		_that.city.innerHTML    = data.city;
	
	// 		_that.getWeatherForLocation(data.city, data.country);
	// 		_that.getWeatherForFiveDays(data.city, data.country);
	// 	});
	// },

	getWeatherForLocation: function (city, country) {
		var _that = this;

		var api      = "http://api.openweathermap.org/data/2.5/weather?q=",
			units    = "&units=metric",
			appidKey = "&APPID=8b4b5da3128ffe30288c82ffab1a6d55";

		var userLink = api + city + ',' + country + units + appidKey;

		$.getJSON(userLink, function(data) {

			_that.temperatureElem.innerHTML = Math.round(data.main.temp) + " " + "&#176;";
			_that.temperature = data.main.temp;
			_that.iconGenerator(data.weather[0].icon)

		});
	},

	iconGenerator: function(iconCode) {
		var icon = 'https://openweathermap.org/img/w/' + iconCode + '.png'

		this.iconContainer.innerHTML = '<img width="100px" height="100px" src=' + icon + '>';
	},

	getWeatherForFiveDays: function (city, country) {
		var _that = this;

		var api      = "http://api.openweathermap.org/data/2.5/forecast?q=",
			units    = "&units=metric",
			appidKey = "&APPID=8b4b5da3128ffe30288c82ffab1a6d55";

		var userLink = api + city + ',' + country + units + appidKey;

		$.getJSON(userLink, function(data) {
			
			var i = 1;
			var date = data.list[0].dt_txt.slice(0, 10);

			data.list.map(function(item, index, array){
				var icon = 'http://openweathermap.org/img/w/' + item.weather[0].icon + '.png'
				// console.log(item.dt_txt.slice(0, 10)); // Get Date in format (yy-mm-dd)
				// console.log(item.dt_txt.slice(10, 16)); // Get Time in format (hh:mm)
				// console.log(item.dt_txt); // Get Time in format (hh:mm)

				if (date != item.dt_txt.slice(0, 10) || index == 0) {
					_that.days['day' + i].innerHTML += '<p>'+ item.dt_txt.slice(0, 10) +'</p>';
					_that.days['day' + i].innerHTML += '<div>' +  
															'<span>' + item.dt_txt.slice(10, 16) + '</span>' + 
															'<img src=' + icon + '>' +
															'<span id="temp" class="tempC">' + Math.round(item.main.temp) + " " + "&#176;" + '</span>' + 
															'<span id="temp" class="tempF">' + Math.round((item.main.temp * (9 / 5)) + 32) + " " + "&#176;" + '</span>' + 
													   '</div>';
					date = item.dt_txt.slice(0, 10);
					i++;
				} else {
					_that.days['day' + (i-1)].innerHTML += '<div>' +  
																'<span>' + item.dt_txt.slice(10, 16) + '</span>' + 
																'<img src=' + icon + '>' +
																'<span class="tempC">' + Math.round(item.main.temp) + " " + "&#176;" + '</span>' +
																'<span class="tempF">' + Math.round((item.main.temp * (9 / 5)) + 32) + " " + "&#176;" + '</span>' +
															'</div>';
				};			
			})
		});
	},

	changeTemperatureToCelsius: function (event) {
		event.preventDefault();

		this.celsiusBtn.style.color = 'white';
		this.fahrenheitBtn.style.color = 'grey';
		this.temperatureElem.innerHTML = Math.round(this.temperature) + " " + "&#176;";
		$(".tempC").css('display', 'inline-block');
		$(".tempF").css('display', 'none');
	},

	changeTemperatureToFahrenheit: function (event) {
		event.preventDefault();

		this.fahrenheitBtn.style.color = 'white';
		this.celsiusBtn.style.color = 'grey';
		this.temperatureElem.innerHTML = Math.round((this.temperature * (9 / 5)) + 32) + " " + "&#176;";
		$(".tempC").css('display', 'none');
		$(".tempF").css('display', 'inline-block');
	},
};

window.onload = weatherApp.init();
