let long;
let lat;
let temperatureDescription = document.querySelector(".temperature-description");
let temperatureDegree = document.querySelector(".temperature-degree");
let locationTimezone = document.querySelector(".location-timezone");
let setIcon = document.querySelector(".icon");
let maxTemperature = document.querySelector(".maxTemp");
let minTemperature = document.querySelector(".minTemp");
let windSpeed = document.querySelector(".windSpeed")
let weather = document.querySelector("#weather");


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {
        long = position.coords.longitude;
        lat = position.coords.latitude;
        const data = await getWeatherdata(lat, long);

    
        // To Draw a India map using leaflet
        // Map related Code 
        var map = L.map('map').setView([20.9716, 80.5946], 5);

        L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=OdpemAaV0raJvYO6cUSS', {
            attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
        }).addTo(map);


        // To show a marker on the india map with the name of the place
        var marker = L.marker([lat, long]).addTo(map);
        marker.bindPopup(data.name).openPopup();
        

        // to add a click handler on map
        map.on('click', async function(e) {
            console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)

            // Calling the weather api with new lat long
           const data = await getWeatherdata(e.latlng.lat, e.latlng.lng);

           // Showing the marker at the clicked position with the city name(position name)
            marker.setLatLng([e.latlng.lat, e.latlng.lng]);
            marker.bindPopup(data.name).openPopup();
        });
        

    })
}

    
async function getWeatherdata(lat,long) {
        const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&units=metric&appid=ddfaba4398b491fa4ef3e29a5e934c6e`;

        let response = await fetch(api);
        let data = await response.json();

        weatherDataHandler(data);
        return data;
}

function weatherDataHandler(data) {
    const { temp } = data.main;
    const { description } = data.weather[0];
    const { icon } = data.weather[0];
    const { temp_max } = data.main;
    const { temp_min } = data.main;
    const { speed } = data.wind;

    temperatureDegree.textContent = temp + '\xB0' + ' C';
    temperatureDescription.textContent = description;
    locationTimezone.textContent = data.name;
    maxTemperature.textContent = 'Max: ' + temp_max + '\xB0' + ' C';
    minTemperature.textContent = 'Min: ' + temp_min + '\xB0' + ' C';
    windSpeed.textContent = 'Wind Speed: ' + speed + ' m/s';
    setIcon.style["background-image"] = `url(${setIconFunction(icon)})`;
}

function setIconFunction(icon) {

    const icons = {
        "01d": "./animated/day.svg",
        "02d": "./animated/cloudy-day-1.svg",
        "03d": "./animated/cloudy-day-2.svg",
        "04d": "./animated/cloudy-day-3.svg",
        "09d": "./animated/rainy-1.svg",
        "10d": "./animated/rainy-2.svg",
        "11d": "./animated/rainy-3.svg",
        "13d": "./animated/snowy-6.svg",
        "50d": "./animated/mist.svg",
        "01n": "./animated/night.svg",
        "02n": "./animated/cloudy-night-1.svg",
        "03n": "./animated/cloudy-night-2.svg",
        "04n": "./animated/cloudy-night-3.svg",
        "09n": "./animated/rainy-1.svg",
        "10n": "./animated/rainy-2.svg",
        "11n": "./animated/rainy-3.svg",
        "13n": "./animated/snowy-6.svg",
        "50n": "./animated/mist.svg"
    };

    return icons[icon];
}