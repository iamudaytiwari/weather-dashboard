"""Weather Dashboard - Flask Application"""

from flask import Flask, render_template, jsonify, request
import requests
from datetime import datetime
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
app.config['API_KEY'] = os.getenv('OPENWEATHER_API_KEY')
app.config['JSON_SORT_KEYS'] = False

# OpenWeatherMap API endpoints
WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_API_URL = "https://api.openweathermap.org/data/2.5/forecast"
GEO_API_URL = "https://api.openweathermap.org/geo/1.0/direct"


class WeatherService:
    """Service for fetching weather data"""
    
    def __init__(self, api_key):
        self.api_key = api_key
    
    def get_weather_by_city(self, city):
        """Fetch current weather by city name"""
        try:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(WEATHER_API_URL, params=params, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
    
    def get_weather_by_coordinates(self, lat, lon):
        """Fetch current weather by coordinates"""
        try:
            params = {
                'lat': lat,
                'lon': lon,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(WEATHER_API_URL, params=params, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
    
    def get_forecast(self, city):
        """Fetch 5-day weather forecast"""
        try:
            params = {
                'q': city,
                'appid': self.api_key,
                'units': 'metric'
            }
            response = requests.get(FORECAST_API_URL, params=params, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}
    
    def search_cities(self, query):
        """Search for cities"""
        try:
            params = {
                'q': query,
                'limit': 10,
                'appid': self.api_key
            }
            response = requests.get(GEO_API_URL, params=params, timeout=5)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'error': str(e)}


weather_service = WeatherService(app.config['API_KEY'])


@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')


@app.route('/api/weather/<city>')
def get_weather(city):
    """API endpoint to get weather for a city"""
    weather_data = weather_service.get_weather_by_city(city)
    if 'error' in weather_data:
        return jsonify({'error': 'City not found'}), 404
    return jsonify(weather_data)


@app.route('/api/weather/coordinates/<float:lat>/<float:lon>')
def get_weather_coords(lat, lon):
    """API endpoint to get weather by coordinates"""
    weather_data = weather_service.get_weather_by_coordinates(lat, lon)
    if 'error' in weather_data:
        return jsonify({'error': 'Unable to fetch weather'}), 500
    return jsonify(weather_data)


@app.route('/api/forecast/<city>')
def get_forecast(city):
    """API endpoint to get weather forecast"""
    forecast_data = weather_service.get_forecast(city)
    if 'error' in forecast_data:
        return jsonify({'error': 'Unable to fetch forecast'}), 500
    return jsonify(forecast_data)


@app.route('/api/search')
def search():
    """Search cities API endpoint"""
    query = request.args.get('q', '')
    if not query or len(query) < 2:
        return jsonify({'error': 'Query too short'}), 400
    
    results = weather_service.search_cities(query)
    if 'error' in results:
        return jsonify({'error': 'Search failed'}), 500
    return jsonify(results)


@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'False') == 'True'
    app.run(host='0.0.0.0', port=port, debug=debug)
