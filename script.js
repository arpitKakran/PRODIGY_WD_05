const apiKey = API_KEY;

const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const searchInput = document.getElementById("searchInput");


searchBtn.addEventListener("click", () => {
  const city = searchInput.value.trim();
  if (city !== "") getWeatherByCity(city);
});

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        getWeatherByCoords(latitude, longitude);
      },
      () => {
        alert("Location access denied. Try searching manually.");
      }
    );
  } else {
    alert("Geolocation is not supported.");
  }
});

window.addEventListener("load", () => {
  locationBtn.click();
});

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    updateUI(data);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch weather data.");
  }
}

async function getWeatherByCity(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await res.json();
    if (data.cod === "404") return alert("City not found");
    updateUI(data);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch weather data.");
  }
}

function updateUI(data) {
  document.getElementById("city").textContent = data.name;
  document.getElementById("temperature").textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById("humidity").textContent = `${data.main.humidity}%`;
  document.getElementById("windSpeed").textContent = `${data.wind.speed} km/h`;

  const iconCode = data.weather[0].icon;
  const iconMap = {
    "01d": "☀️", "01n": "🌙", "02d": "🌤️", "02n": "☁️", "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️", "09d": "🌧️", "09n": "🌧️", "10d": "🌦️", "10n": "🌧️",
    "11d": "🌩️", "11n": "🌩️", "13d": "❄️", "13n": "❄️", "50d": "🌫️", "50n": "🌫️"
  };

  document.getElementById("weatherIcon").textContent = iconMap[iconCode] || "🌈";
}
