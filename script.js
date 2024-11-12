const apiKey = '164b9172528f7c15e196893100087cac'; // Reemplaza con tu clave de API
let city = 'Valencia'; // Cambiado a una variable global
const units = 'metric'; // Para Celsius

async function fetchWeatherData() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`);
        if (!response.ok) throw new Error('Error en la obtención de datos');

        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para obtener la hora actual
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // Actualiza la hora
    document.querySelector('.current-time').innerHTML = `${hours}:${minutes}`;

    // Obtiene la fecha en formato DD/MM/AAAA
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = now.getFullYear();
    document.querySelector('.current-date-day').innerHTML = `${day}/${month}/${year} - ${new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(now)}`;
}

function updateWeatherDisplay(data) {
    const temperature = Math.round(data.main.temp);
    const humidity = data.main.humidity;
    const pressure = Math.round(data.main.pressure * 0.750061683); // Convertir de hPa a mmHg

    document.querySelector('.temperature-number').innerHTML = temperature;
    document.querySelector('.humidity-number').innerHTML = humidity;
    document.querySelector('.pressure-number').innerHTML = `${pressure.toFixed(2)}`;

// Obtener la hora de salida y puesta del sol
    const sunriseTime = new Date(data.sys.sunrise * 1000);
    const sunsetTime = new Date(data.sys.sunset * 1000);
    const sunriseHours = sunriseTime.getHours().toString().padStart(2, '0');
    const sunriseMinutes = sunriseTime.getMinutes().toString().padStart(2, '0');
    const sunsetHours = sunsetTime.getHours().toString().padStart(2, '0');
    const sunsetMinutes = sunsetTime.getMinutes().toString().padStart(2, '0');

    document.querySelector('.sunrise-time').innerHTML = `${sunriseHours}:${sunriseMinutes}`;
    document.querySelector('.sunset-time').innerHTML = `${sunsetHours}:${sunsetMinutes}`;

// Actualizar icono del tiempo basado en la previsión
    const weatherMain = data.weather[0].main.toLowerCase();
    const iconMap = {
        clear: 'sunny.png',
        clouds: 'cloudy.png',
        rain: 'rainy.png',
        thunderstorm: 'storm.png',
        snow: 'snow.png',
        mist: 'mist.png'
    };
    
    const forecastIcon = iconMap[weatherMain] || 'default.png'; // Default si no encuentra la descripción
    document.querySelector('.forecast-icon img').src = forecastIcon;
    
// Obtener la fase lunar actual y actualizar la imagen
    const moonPhaseIndex = getMoonPhaseIndex();
    const moonPhaseImage = getMoonPhaseImage(moonPhaseIndex);
    document.getElementById('moon-phase-image').src = moonPhaseImage; // Actualiza la imagen
}

// Función para obtener la hora actual
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // Actualiza la hora
    document.querySelector('.current-time').innerHTML = `${hours}:${minutes}`;

    // Obtiene la fecha en formato DD/MM/AAAA
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
    const year = now.getFullYear();
    document.querySelector('.current-date-day').innerHTML = `${day}/${month}/${year} - ${new Intl.DateTimeFormat('es-ES', { weekday: 'long' }).format(now)}`;
}

// Función para obtener la fase lunar actual
function getMoonPhaseIndex() {
    const now = new Date();
    const lp = 29.53; // Duración del ciclo lunar en días
    const newMoon = new Date(1970, 0, 7, 20, 35, 0); // Fecha de nueva luna base
    const phase = ((now.getTime() - newMoon.getTime()) / 1000) % (lp * 24 * 3600);
    const age = Math.floor(phase / (24 * 3600));
    
    return Math.floor((age / 29.53) * 8); // Retorna un índice de 0 a 7
}

// Función para obtener la imagen correspondiente a la fase lunar
function getMoonPhaseImage(index) {
    const phases = [
        'new_moon.png',   // 0
        'waxing_crescent.png', // 1
        'first_quarter.png',   // 2
        'waxing_gibbous.png',   // 3
        'full_moon.png',       // 4
        'waning_gibbous.png',  // 5
        'last_quarter.png',    // 6
        'waning_crescent.png'   // 7
    ];
    return phases[index % phases.length]; // Asegúrate de tener las imágenes en el directorio
}

function changeCity(newCity) {
    city = newCity; // Actualiza la ciudad seleccionada
    fetchWeatherData(); // Vuelve a obtener los datos del clima para la nueva ciudad
}

// Ejecutar funciones al cargar la página
fetchWeatherData();
updateClock();
setInterval(updateClock, 60000); // Actualiza el reloj cada minuto
