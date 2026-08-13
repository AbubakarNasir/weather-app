const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const locationEl = document.getElementById('location');
const dateEl = document.getElementById('date');
const tempEl = document.getElementById('temp');
const conditionLabelEl = document.getElementById('conditionLabel');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const rainEl = document.getElementById('rain');
const feelsLike = document.getElementById('feelsLike');
const high = document.getElementById('high');
const low = document.getElementById('low');
const hourlyForecastEl = document.getElementById('hourlyForecast');
let loader = document.getElementById('loader');
let errorEl = document.getElementById('error');

const hourTimeEls = [
    document.getElementById('hour-time0'),
    document.getElementById('hour-time1'),
    document.getElementById('hour-time2'),
    document.getElementById('hour-time3'),
    document.getElementById('hour-time4'),
    document.getElementById('hour-time5'),
];
const hourTempEls = [
    document.getElementById('hour-temp0'),
    document.getElementById('hour-temp1'),
    document.getElementById('hour-temp2'),
    document.getElementById('hour-temp3'),
    document.getElementById('hour-temp4'),
    document.getElementById('hour-temp5'),
];
const hourConditionEls = [
    document.getElementById('hour-condition0'),
    document.getElementById('hour-condition1'),
    document.getElementById('hour-condition2'),
    document.getElementById('hour-condition3'),
    document.getElementById('hour-condition4'),
    document.getElementById('hour-condition5')
];
const hourIconEls = [
    document.getElementById('hour-icon0'),
    document.getElementById('hour-icon1'),
    document.getElementById('hour-icon2'),
    document.getElementById('hour-icon3'),
    document.getElementById('hour-icon4'),
    document.getElementById('hour-icon5')
];
const dayNameEls = [
    document.getElementById('dayName0'),
    document.getElementById('dayName1'),
    document.getElementById('dayName2'),
    document.getElementById('dayName3'),
    document.getElementById('dayName4'),
    document.getElementById('dayName5'),
    document.getElementById('dayName6')
];
const dayLowEls = [
    document.getElementById('dayLow0'),
    document.getElementById('dayLow1'),
    document.getElementById('dayLow2'),
    document.getElementById('dayLow3'),
    document.getElementById('dayLow4'),
    document.getElementById('dayLow5'),
    document.getElementById('dayLow6')
];
const dayHighEls = [
    document.getElementById('dayHigh0'),
    document.getElementById('dayHigh1'),
    document.getElementById('dayHigh2'),
    document.getElementById('dayHigh3'),
    document.getElementById('dayHigh4'),
    document.getElementById('dayHigh5'),
    document.getElementById('dayHigh6')
];
const dayIconEls = [
    document.getElementById('dayIcon0'),
    document.getElementById('dayIcon1'),
    document.getElementById('dayIcon2'),
    document.getElementById('dayIcon3'),
    document.getElementById('dayIcon4'),
    document.getElementById('dayIcon5'),
    document.getElementById('dayIcon6')
];

// Function to get weather condition based on code
function getWeatherCondition(code) {
    switch (code) {
        case 0:
            return "Clear sky";

        case 1:
            return "Mainly clear";

        case 2:
            return "Partly cloudy";

        case 3:
            return "Overcast";

        case 45:
        case 48:
            return "Fog";

        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            return "Drizzle";

        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            return "Rain";

        case 71:
        case 73:
        case 75:
        case 77:
            return "Snow";

        case 80:
        case 81:
        case 82:
            return "Rain showers";

        case 85:
        case 86:
            return "Snow showers";

        case 95:
        case 96:
        case 99:
            return "Thunderstorm";

        default:
            return "Unknown";
    }
}

function getWeatherIcon(code) {
    switch (code) {
        case 0:
            return "☀️";

        case 1:
            return "🌤️";

        case 2:
            return "🌥️";

        case 3:
            return "☁️";

        case 45:
        case 48:
            return "🌫️";

        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
            return "🌦️";

        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
            return "🌧️";

        case 71:
        case 73:
        case 75:
        case 77:
            return "🌨️";

        case 80:
        case 81:
        case 82:
            return "🌧️";

        case 85:
        case 86:
            return "🌨️";

        case 95:
        case 96:
        case 99:
            return "⛈️";

        default:
            return "❓";
    }
}

// Search for city using Open-Meteo Geocoding API
async function searchCity() {
    const city = searchInput.value.trim();
    loader.style.display = 'block';
    if (city === '') {
        alert('Please enter a city.');
        loader.style.display = 'none';
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

        loader.style.display = 'none';
        getWeatherData(latitude, longitude);


    } catch (error) {
        console.error('Search error:', error);
        errorEl.textContent = 'Error fetching weather data' + error.message;
    }
}
searchBtn.addEventListener('click', searchCity);

// Fetch weather data from Open-Meteo API
async function getWeatherData(latitude, longitude) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,precipitation_probability,rain&hourly=temperature_2m,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,weather_code&forecast_days=7`;

    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();
    loader.style.display = 'none';
    console.log(weatherData.daily);
    console.log(weatherData.daily.weather_code);
    console.log(weatherData.daily.temperature_2m_max);
    console.log(weatherData.daily.temperature_2m_min);

    // Current weather
    tempEl.textContent = Math.round(weatherData.current.temperature_2m);
    humidityEl.textContent = weatherData.current.relative_humidity_2m;
    windEl.textContent = weatherData.current.wind_speed_10m;
    rainEl.textContent = weatherData.current.precipitation_probability;
    high.textContent = Math.round(weatherData.daily.temperature_2m_max[0]);
    low.textContent = Math.round(weatherData.daily.temperature_2m_min[0]);
    feelsLike.textContent = Math.round(weatherData.current.apparent_temperature);

    // Hourly forecast
    const currentHourIndex = weatherData.hourly.time.findIndex(time => {
        return new Date(time).getHours() === new Date().getHours();
    });

    for (let i = 0; i < 6; i++) {
        const apiIndex = currentHourIndex + i;

        const time = weatherData.hourly.time[apiIndex];
        const temperature = weatherData.hourly.temperature_2m[apiIndex];
        const weatherCode = weatherData.hourly.weather_code[apiIndex];

        const condition = getWeatherCondition(weatherCode);
        const icon = getWeatherIcon(weatherCode);
        hourIconEls[i].textContent = icon;
        conditionLabelEl.textContent = condition;

        console.log(condition);

        hourTimeEls[i].textContent =
            i === 0
                ? 'Now'
                : new Date(time).toLocaleTimeString([], {
                    hour: 'numeric'
                });

        hourTempEls[i].textContent = Math.round(temperature);
    }
    for (let i = 0; i < 7; i++) {
        const date = weatherData.daily.time[i];
        const high = weatherData.daily.temperature_2m_max[i];
        const low = weatherData.daily.temperature_2m_min[i];
        const weatherCode = weatherData.daily.weather_code[i];
        const icon = getWeatherIcon(weatherCode);

        dayNameEls[i].textContent = new Date(date).toLocaleDateString([], {
            weekday: 'short'
        });

        dayHighEls[i].textContent = Math.round(high) + '°';
        dayLowEls[i].textContent = Math.round(low) + '°';
        dayIconEls[i].textContent = icon;
    }
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