// ====== 🔑 API Keys (replace with your real keys) ======
const UNSPLASH_KEY = "0sbsbNmaayptaQFBokZftIOLkjuaoOlsk5dEFkQbV6s";
const OPENWEATHER_KEY = "0da875c4f73d9e272cbc3d23995dde7c";

// ====== DOM Elements ======
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#searchBtn");
const photoContainer = document.querySelector("#photos");
const weatherContainer = document.querySelector("#weather");

const explorePage = document.querySelector('div');

searchBtn.addEventListener('click', () => {
  // Remove background class
  explorePage.classList.remove('explore-page');
});

// ====== Fetch Unsplash Photos ======
async function fetchPhotos(query) {
  photoContainer.innerHTML = "<p>Loading photos...</p>";
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}&per_page=30`
    );

    if (!response.ok) throw new Error("Unsplash request failed");

    const data = await response.json();
    displayPhotos(data.results);
  } catch (error) {
    console.error(error);
    photoContainer.innerHTML = "<p>Failed to load photos.</p>";
  }
}

// ====== Display Photos ======
function displayPhotos(photos) {
  if (!photos || photos.length === 0) {
    photoContainer.innerHTML = "<p>No photos found.</p>";
    return;
  }
  photoContainer.innerHTML = photos
    .map(
      (photo) =>
        `<img src="${photo.urls.small}" alt="${
          photo.alt_description || "Photo"
        }">`
    )
    .join("");
}

// ====== Fetch Weather Data ======
async function fetchWeather(city) {
  weatherContainer.innerHTML = "<p>Loading weather...</p>";
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_KEY}&units=metric`
    );

    if (!response.ok) throw new Error("Weather request failed");

    const data = await response.json();

    if (data.cod !== 200) {
      weatherContainer.innerHTML = "<p>City not found.</p>";
      return;
    }

    displayWeather(data);
  } catch (error) {
    console.error(error);
    weatherContainer.innerHTML = "<p>Failed to load weather.</p>";
  }
}

// ====== Display Weather ======
function displayWeather(data) {
  weatherContainer.innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <p>🌡 Temperature: ${data.main.temp}°C</p>
    <p>☁ Condition: ${data.weather[0].description}</p>
    <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
  `;
}

// ====== Search Button Event ======
searchBtn.addEventListener("click", () => {
  let query = searchInput.value.trim();

  if (!query) return;

  // Fallback: If user enters "India" → default to "Delhi"
  if (query.toLowerCase() === "india") {
    query = "Delhi";
  }

  fetchPhotos(query);
  fetchWeather(query);
  
});
