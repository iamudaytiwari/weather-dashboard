# Weather Dashboard

A beautiful, responsive weather dashboard that displays real-time weather data from multiple cities using the OpenWeatherMap API.

## 🌟 Features

- **Real-time Weather Data**: Get current weather conditions for any city
- **5-Day Forecast**: View weather forecast for the next 5 days
- **Geolocation**: Get weather for your current location
- **Search Suggestions**: Auto-complete city names as you type
- **Favorite Cities**: Save your favorite cities for quick access
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Detailed Metrics**: Temperature, humidity, wind speed, pressure, visibility
- **Beautiful UI**: Modern, clean design with smooth animations

## 📋 Requirements

- Python 3.8+
- OpenWeatherMap API Key (free)
- pip/conda

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/iamudaytiwari/weather-dashboard.git
cd weather-dashboard
```

### 2. Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Get OpenWeatherMap API Key
- Visit: https://openweathermap.org/api
- Sign up for a free account
- Go to API keys section
- Copy your API key

### 5. Setup Environment Variables
```bash
cp .env.example .env
```

Edit `.env` file and add your API key:
```
OPENWEATHER_API_KEY=your_api_key_here
FLASK_ENV=development
PORT=5000
```

## 🏃 Running the Application

### Option 1: Direct Python
```bash
python app.py
```

### Option 2: Using Gunicorn (Production)
```bash
gunicorn app:app --bind 0.0.0.0:5000
```

### Option 3: Using Docker
```bash
docker-compose up --build
```

Then open your browser and visit: **http://localhost:5000**

## 📁 Project Structure

```
weather-dashboard/
├── app.py                    # Main Flask application
├── config.py                 # Configuration file
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── Dockerfile               # Docker configuration
├── docker-compose.yml       # Docker Compose setup
├── static/
│   ├── css/
│   │   └── style.css       # Styling
│   └── js/
│       └── script.js       # Frontend logic
├── templates/
│   └── index.html          # Main HTML template
└── README.md               # This file
```

## 🔌 API Endpoints

### Get Current Weather
```
GET /api/weather/<city>
```

### Get Weather by Coordinates
```
GET /api/weather/coordinates/<lat>/<lon>
```

### Get Weather Forecast
```
GET /api/forecast/<city>
```

### Search Cities
```
GET /api/search?q=<query>
```

### Health Check
```
GET /api/health
```

## 🎨 Customization

### Change Color Theme
Edit `static/css/style.css` and modify the CSS variables in `:root`:

```css
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    /* ... more colors ... */
}
```

### Add More Weather Details
Edit `templates/index.html` to add more weather information cards.

## 🧪 Testing

```bash
pytest tests/
```

## 🐛 Troubleshooting

### Issue: "API Key not found"
- Check `.env` file has your API key
- Ensure OPENWEATHER_API_KEY is set correctly

### Issue: "Port 5000 already in use"
```bash
# Use different port
python -c "from app import app; app.run(port=8000)"
```

### Issue: Module not found errors
```bash
pip install --upgrade -r requirements.txt
```

## 📱 Features in Detail

### Search
- Type city name to get suggestions
- Press Enter or click Search button
- Results appear in real-time

### Geolocation
- Click location button to use your current coordinates
- Requires browser permission
- Auto-fetches weather for your area

### Favorites
- Click any city card to save as favorite
- Saved in browser's local storage
- Quick access from favorites section

### Theme
- Click moon/sun icon to toggle theme
- Preference saved to local storage
- Applies to entire interface

## 📊 Data Displayed

- **Temperature**: Current and "feels like"
- **Weather**: Condition and description
- **Humidity**: Percentage of moisture
- **Wind Speed**: In meters per second
- **Pressure**: Atmospheric pressure in hPa
- **Visibility**: Visible distance in km
- **Forecast**: Next 5 days with temps and conditions

## 🔒 Security

- API key never exposed to frontend
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- Error handling for failed requests

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set OPENWEATHER_API_KEY=your_key
git push heroku main
```

### AWS/GCP/Azure
Use Docker image with environment variables set.

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

For issues and questions:
- Open GitHub issue
- Check existing discussions
- Review documentation

## 🙏 Acknowledgments

- OpenWeatherMap API
- Font Awesome icons
- Flask framework

---

**Enjoy the weather! 🌤️**
