const apiKey = process.env.MY_API_KEY;

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

async function useLocation(lat, lng){
    const endpoint = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=cafe&key=${apiKey}' ;
    const url = useProxy ? proxy + endpoint : endpoint;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(data.results)
            displayCards(data.results);
        else
            alert("No cafes found nearby");
    }
    catch(e){
        console.error("Error fetching API:", e);
        alert("Failed to find cafes")
    }
}

function displayCards(cafes) {
    const container = document.querySelector('.cards');
    container.innerHTML = '';

    cafes.forEach((cafe, i) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'swipe-wrapper';
        wrapper.style.zIndex = 200 - i;
        var newCard = document.querySelectorAll('.location-card:not(.removed)');
        var allCards = document.querySelectorAll('.location-card');
    });

    const card = document.createElement('div');
    card.className = 'location-card';

    const imgUrl = cafe.photos?.[0]?.photo_reference
    ? `https://maps.googleapis.com/maps/apiplace/photo?maxwidth=400&photoreference=${cafe.photos[0].photo_reference}&key=${apiKey}`
    :  "https://via.placeholder.com/250x150?text=No+Image";

    const cafeData = {
        name: cafe.name,
        place_id: cafe.place_id,
        photo: imgUrl,
        rating: cafe.rating || "N/A",
    };

    card.innerHTML = `
        <img src="${imgUrl}" alt="${cafeData.name}">
        <h3>${cafeData.name}</h3>
        <p>* Rating: ${cafeData.rating}</p>
        <p><small> Swipe right to save! </small></p>
    `;

    wrapper.appendChild(card);
    container.appendChild(wrapper);

    const hammer = new Hammer(wrapper);

    hammer.on("swipeleft", () => {
        wrapper.style.transform = "translateX(-150%) rotate(-25deg)";
        wrapper.style.opacity = 0;
        setTimeout(() => wrapper.remove(), 100);
    });
    hammer.on("swiperight", () => {
        saveCafe(JSON.stringify(cafeData)); //Save cafe data
        wrapper.style.transform = "translateX(150%) rotate(25deg)";
        wrapper.style.opacity = 0;
        setTimeout(() => wrapper.remove(), 100);
    });
}

function saveCafe(cafeJSON) {
    const cafe = JSON.parse(cafeJSON);
    let saved = JSON.parse(localStorage.getItem('savedCafes') || '[]');

    if (!saved.find((c=> c.place_id === cafe.place_id))) {
        saved.push(cafe);
        localStorage.setItem('savedCafes', JSON.stringify(saved));
        alert(`Saved ${cafe.name} !`);
    }
    else
        alert(`${cafe.name} is already saved`);
}

function showSaved(){
    const container = document.querySelector('.cards');
    container.innerHTML = '';
    const savedCafes = JSON.parse(localStorage.getItem('savedCafes') || '[]');

    if (savedCafes.length === 0) {
        continer.innerHTML = '<p>No saved cafes yet.</p>';
    }

    savedCafes.forEach((cafe) => {
        const card = document.createElement('div');
        card.className = 'location-card';
        card.innerHTML = `
            <img src="${cafe.photo}" alt="${cafe.name}">
            <h3>${cafe.name}</h3>
            <p>* Rating: ${cafe.rating}</p>
        `;
        container.appendChild(card);
    });
}