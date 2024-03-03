const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherCardsDiv = document.querySelector(".weather-cards");
const currentWeatherDiv = document.querySelector(".current-weather");
const locationButton = document.querySelector(".location-btn");
const apiKey = "de8287709daca15d982a05b5163100af";

const createWeatherCard = (cityName, weatherItem, index) => {
  const cardHtml = `<li class="card">
    <h3>${cityName}(${weatherItem.dt_txt.split(" ")[0]})</h3>
    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png">
    <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} °C</h4>
    <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
    <h4>Humidity: ${weatherItem.main.humidity} %</h4>
    <h4>${weatherItem.weather[0].description}</h4>
  </li>`;

  if (index === 0) {
    currentWeatherDiv.innerHTML = cardHtml;
  } else {
    weatherCardsDiv.insertAdjacentHTML("beforeend", cardHtml);
  }
};

const getWeatherDetails = (lat, lon, cityName) => {
  const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast/?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(weatherUrl)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = [];
      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate();
        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate);
        }
      });

      cityInput.value = "";
      weatherCardsDiv.innerHTML = "";
      currentWeatherDiv.innerHTML = "";

      fiveDaysForecast.forEach((weatherItem, index) => {
        createWeatherCard(cityName, weatherItem, index);
      });

      const geoCodingUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

      // Call reverse geocoding API
      fetch(geoCodingUrl)
        .then((res) => res.json())
        .then((geoData) => {
          console.log("Reverse Geocoding Data:", geoData);
          // Process the reverse geocoding data as needed
        })
        .catch((geoError) => {
          console.error("Error during reverse geocoding:", geoError);
        });
    })
    // .catch(() => {
    //   alert("An error occurred while fetching the weather details");
    // });
};

const getCityCoordinates = () => {
  const cityName = cityInput.value.trim();
  if (!cityName) {
    alert("Please enter a city name");
    return;
  }

  const openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

  fetch(openWeatherUrl)
    .then((res) => res.json())
    .then((data) => {
      if (!data.coord) {
        alert(`No coordinates found for ${cityName}`);
        return;
      }

      const { lat, lon } = data.coord;
      getWeatherDetails(lat, lon, cityName);
    })
    .catch(() => {
      alert("An error occurred while fetching the city coordinates");
    });
};

const getUserCoordinates = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeatherDetails(latitude, longitude, name, "Current Location");
      },
      (error) => {
        console.error("Error getting user coordinates:", error);
        alert("Unable to get your current location. Please enter a city name manually.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};

searchButton.addEventListener("click", getCityCoordinates);
locationButton.addEventListener("click", getUserCoordinates);
             