const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationEl = document.getElementById('location');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const rainEl = document.getElementById('rain');
const feelsLike = document.getElementById('feelsLike');
const high = document.getElementById('high');
const low = document.getElementById('low');

// Search for city using Open-Meteo Geocoding API
async function searchCity() {
    const city = searchInput.value.trim();

    if (city === '') {
        alert('Please enter a city.');
        return;
    }

    try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;

        const response = await fetch(url);
        const data = await response.json();

        console.log('API response:', data);

        if (!data.results || data.results.length === 0) {
            alert('City not found. Please check the spelling.');
            return;
        }

        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;

        locationEl.textContent = data.results[0].name;
        dateEl.textContent = new Date().toLocaleDateString();

        getWeatherData(latitude, longitude);

    } catch (error) {
        console.error('Search error:', error);
        alert('Something went wrong. Please try again.');
    }
}
searchBtn.addEventListener('click', searchCity);

// Fetch weather data from Open-Meteo API
async function getWeatherData(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,temperature_2m_min&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability,rain`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    console.log(weatherData);
    tempEl.textContent = weatherData.current.temperature_2m;
    humidityEl.textContent = weatherData.current.relative_humidity_2m;
    windEl.textContent = weatherData.current.wind_speed_10m;
    rainEl.textContent = weatherData.current.precipitation_probability;
    feelsLike.textContent = weatherData.current.apparent_temperature;
    high.textContent = weatherData.daily.temperature_2m_max[0];
    low.textContent = weatherData.daily.temperature_2m_min[0];
}

// Get location name from coordinates
async function getLocationName(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    const response = await fetch(url);
    const data = await response.json();

    console.log(data);

    const address = data.address;

    locationEl.textContent =
        address.city ||
        address.town ||
        address.village ||
        address.municipality ||
        'Unknown location';
        dateEl.textContent = new Date().toLocaleDateString();
}

// Get user's location and fetch weather data
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                await getLocationName(latitude, longitude);
                getWeatherData(latitude, longitude);
            },
            (error) => {
                console.error("Unable to get your location:", error);
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

getUserLocation();