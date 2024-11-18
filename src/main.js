import L from 'leaflet';
    import 'bootstrap';

    const map = L.map('map').setView([54.7877, -6.4923], 8); // Centered on Northern Ireland

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const toggleIce = document.getElementById('toggleIce');
    const loadingIndicator = document.getElementById('loading');

    async function fetchWeatherWarnings() {
      loadingIndicator.style.display = 'block';
      try {
        // Example API call (replace with actual API and key)
        const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=54.7877&lon=-6.4923&exclude=current,minutely,hourly,alerts&appid=YOUR_API_KEY');
        const data = await response.json();

        // Process daily weather data for snow and ice
        data.daily.forEach((day, index) => {
          const date = new Date(day.dt * 1000).toLocaleDateString();
          if (day.snow) {
            L.marker([54.597, -5.930]).addTo(map)
              .bindPopup(`Snow Warning: ${day.snow}mm expected on ${date}.`);
          }
          if (toggleIce.checked && day.weather.some(w => w.main === 'Ice')) {
            L.marker([54.607, -5.920]).addTo(map)
              .bindPopup(`Ice Warning: Expected on ${date}.`);
          }
        });
      } catch (error) {
        console.error('Error fetching weather data:', error);
      } finally {
        loadingIndicator.style.display = 'none';
      }
    }

    toggleIce.addEventListener('change', fetchWeatherWarnings);

    fetchWeatherWarnings();
