// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const currentWeatherSection = document.getElementById('current-weather');
const forecastSection = document.getElementById('forecast-section');
const loading = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const themeToggle = document.getElementById('theme-toggle');
const suggestionsDiv = document.getElementById('suggestions');

// Weather data cache
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayFavorites();
    setupEventListeners();
    loadTheme();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', () => searchWeather());
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchWeather();
    });
    locationBtn.addEventListener('click', getLocation);
    themeToggle.addEventListener('click', toggleTheme);
    cityInput.addEventListener('input', handleSuggestions);
}

// Search Weather
async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }
    
    showLoading(true);
    hideError();
    
    try {
        const weather = await fetch(`/api/weather/${city}`).then(r => r.json());
        
        if (weather.error || !weather.main) {
            showError('City not found. Please try again.');
            showLoading(false);
            return;
        }
        
        displayWeather(weather);
        
        const forecast = await fetch(`/api/forecast/${city}`).then(r => r.json());
        if (forecast.list) {
            displayForecast(forecast);
        }
        
        cityInput.value = '';
        suggestionsDiv.classList.remove('show');
    } catch (error) {
        showError('Error fetching weather data: ' + error.message);
    } finally {
        showLoading(false);
    }
}

// Get Location
function getLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation not supported by your browser');
        return;
    }
    
    showLoading(true);
    navigator.geolocation.getCurrentPosition(
        async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                const weather = await fetch(
                    `/api/weather/coordinates/${latitude}/${longitude}`
                ).then(r => r.json());
                
                displayWeather(weather);
                
                const forecast = await fetch(
                    `/api/forecast/${weather.name}`
                ).then(r => r.json());
                if (forecast.list) {
                    displayForecast(forecast);
                }
            } catch (error) {
                showError('Error fetching location weather');
            } finally {
                showLoading(false);
            }
        },
        (error) => {
            showError('Unable to get your location');
            showLoading(false);
        }
    );
}

// Display Current Weather
function displayWeather(data) {
    if (!data || !data.main) return;
    
    const { main, weather, wind, clouds, visibility, sys } = data;
    const iconCode = weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    
    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('temp').textContent = Math.round(main.temp);
    document.getElementById('description').textContent = weather[0].main + ' - ' + weather[0].description;
    document.getElementById('feels-like').textContent = `Feels like ${Math.round(main.feels_like)}°C`;
    document.getElementById('humidity').textContent = main.humidity + '%';
    document.getElementById('wind-speed').textContent = wind.speed + ' m/s';
    document.getElementById('pressure').textContent = main.pressure + ' hPa';
    document.getElementById('visibility').textContent = (visibility / 1000).toFixed(1) + ' km';
    document.getElementById('weather-icon').src = iconUrl;
    
    currentWeatherSection.classList.remove('hidden');
}

// Display Forecast
function displayForecast(data) {
    const forecastGrid = document.getElementById('forecast');
    forecastGrid.innerHTML = '';
    
    const forecasts = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);
    
    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="forecast-date">${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            <p class="forecast-day">${date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="${iconUrl}" alt="Weather icon" class="forecast-icon">
            <p class="forecast-temp">${Math.round(forecast.main.temp)}°C</p>
            <p>${forecast.weather[0].main}</p>
        `;
        forecastGrid.appendChild(card);
    });
    
    forecastSection.classList.remove('hidden');
}

// Handle Suggestions
async function handleSuggestions() {
    const query = cityInput.value.trim();
    if (query.length < 2) {
        suggestionsDiv.classList.remove('show');
        return;
    }
    
    try {
        const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
        suggestionsDiv.innerHTML = '';
        
        results.slice(0, 5).forEach(result => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            item.textContent = `${result.name}, ${result.country}`;
            item.addEventListener('click', () => {
                cityInput.value = result.name;
                suggestionsDiv.classList.remove('show');
                searchWeather();
            });
            suggestionsDiv.appendChild(item);
        });
        
        if (results.length > 0) {
            suggestionsDiv.classList.add('show');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeIcon();
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Favorites Management
function addFavorite(city, country) {
    const favorite = { city, country };
    if (!favorites.find(f => f.city === city && f.country === country)) {
        favorites.push(favorite);
        localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

function removeFavorite(city, country) {
    favorites = favorites.filter(f => !(f.city === city && f.country === country));
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    displayFavorites();
}

function displayFavorites() {
    const favoritesGrid = document.getElementById('favorites');
    favoritesGrid.innerHTML = '';
    
    if (favorites.length === 0) {
        document.getElementById('favorites-section').classList.add('hidden');
        return;
    }
    
    document.getElementById('favorites-section').classList.remove('hidden');
    
    favorites.forEach(fav => {
        const card = document.createElement('div');
        card.className = 'favorite-card';
        card.innerHTML = `
            <p>${fav.city}</p>
            <p style="font-size: 0.9em; color: #7f8c8d;">${fav.country}</p>
            <button class="remove-btn">Remove</button>
        `;
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('remove-btn')) {
                cityInput.value = fav.city;
                searchWeather();
            }
        });
        card.querySelector('.remove-btn').addEventListener('click', () => {
            removeFavorite(fav.city, fav.country);
        });
        favoritesGrid.appendChild(card);
    });
}

// Utility Functions
function showLoading(show) {
    loading.classList.toggle('hidden', !show);
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    errorDiv.classList.remove('hidden');
}

function hideError() {
    errorDiv.classList.remove('show');
    errorDiv.classList.add('hidden');
}

// Auto-hide error after 5 seconds
setInterval(() => {
    if (errorDiv.classList.contains('show')) {
        hideError();
    }
}, 5000);
