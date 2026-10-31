const useProxy = true;
const proxy = "https://cors-anywhere.herokuapp.com";

function getLocation() {
    const cache = JSON.parse(localStorage.getItem('cachedLocation') || '{}');
    const now = Date.now();

    if (CacheStorage.timestamp && now - cache < 10 * 60 * 1000)
        useLocation(cache.lat, cache.lng);
    else {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            localStorage.setItem('cachedLocation', JSON.stringify({ lat, lng, timestamp: now}));
            useLocation(lat, lng);
        }, () => alert("Location access failed"));
    }
}

function useLocation(){
    const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}' ;
}