document.addEventListener('DOMContentLoaded', function () {
    console.log('Page loaded successfully');

    // Show loading spinner
    document.getElementById('loading').style.display = 'block';

    // Fetch IP data from ipapi
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            console.log('IP Data:', data);

            const ip = data.ip || 'No IP found';
            const country = data.country_name || 'Unknown Country';
            const timezone = data.timezone || 'Unknown Timezone';
            const lat = data.latitude;
            const lon = data.longitude;

            // Update the IP and country info
            document.getElementById('ip').textContent = `IP: ${ip}`;
            document.getElementById('country-name').textContent = `Country: ${country}`;
            document.getElementById('browser-time').textContent = `Browser Time: ${new Date().toLocaleString()}`;

            // Set the flag
            const countryCode = data.country_code.toLowerCase();
            const flagUrl = `https://flagcdn.com/w320/${countryCode}.png`;
            document.getElementById('country-flag').src = flagUrl;

            // Set the IP time based on the timezone
            const ipTime = new Date().toLocaleString('en-US', { timeZone: timezone });
            document.getElementById('ip-time').textContent = `IP Time: ${ipTime}`;

            // Hide loading spinner
            document.getElementById('loading').style.display = 'none';

            // Initialize the map and set view based on the IP location
            const map = L.map('map').setView([lat, lon], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
            L.marker([lat, lon]).addTo(map).bindPopup('hi lil boy').openPopup();
            console.log('Map initialized');
        })
        .catch(error => {
            console.error('Error fetching IP data:', error);
            document.getElementById('loading').textContent = 'Error loading IP data';
        });

    // Mouse-tilt effect with increased sensitivity
    const container = document.querySelector('.container');
    const sensitivity = 30; // Increased sensitivity

    container.addEventListener('mousemove', (event) => {
        const { width, height, top, left } = container.getBoundingClientRect();
        const x = event.clientX - left;
        const y = event.clientY - top;

        // Reverse the tilt for top-down movement to get the top pushed back and bottom pulled forward
        const rotateX = ((y / height) - 0.5) * -sensitivity;  // Moving down (y increases) will push top back
        const rotateY = ((x / width) - 0.5) * sensitivity;   // Moving right (x increases) will tilt right

        // Apply the transform
        container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        // Add a dynamic shadow effect
        container.style.boxShadow = `${-rotateY / 2}px ${rotateX / 2}px 30px rgba(0, 0, 0, 0.2)`;
    });

    // Reset tilt on mouse leave
    container.addEventListener('mouseleave', () => {
        container.style.transform = 'rotateX(0deg) rotateY(0deg)';
        container.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
    });
});
