const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");


const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]"); 
const loadingScreen  = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container")


// initially variables we need
const API_key = "c09a2f8659e2d7abdd24990d751e9be9";
let currentTab = userTab;
currentTab.classList.add("current-tab");

getFromSessionStorage();


function switchTab(clickedTab){
    if(currentTab != clickedTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");


        if(!searchForm.classList.contains("active")){
            // kya search form wala container is invisible to usko visible kar do
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            // main pahle search wale tab par tha , ab your weather wala tab visible karna hai

            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");

            getFromSessionStorage();

        }
    }
}



userTab.addEventListener('click',()=>{
    switchTab(userTab);
});


searchTab.addEventListener('click',() =>{
    switchTab(searchTab);
});


  

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        // agar local coordinates nhi mile
        // show grant access window

        grantAccessContainer.classList.add("active");

    }
    else{
        // if local coordinates are present in the broweser

        const coordinates = JSON.parse(localCoordinates);

        fetchWeatherUserInfo(coordinates);
    }
}


async function fetchWeatherUserInfo(coordinates){
    const {lat,lon} = coordinates;

    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    // make loader visivle
    loadingScreen.classList.add("active");



    // API call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);

        const data = await response.json();

        loadingScreen.classList.remove("active");

        userInfoContainer.classList.add("active");

        renderWeatherInfo(data);

    }
    catch(err){
        // home work
        loadingScreen.classList.remove("active");
    }

}


function renderWeatherInfo(weatherInfo){
    // firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");



    // fethc values from weatherInfo object to UI

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;

}




function geoLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        // hw :-> show an alert box for no geo location support available
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchWeatherUserInfo(userCoordinates);

}


const grantAceessButton = document.querySelector("[data-grantAccess]");

grantAceessButton.addEventListener("click",geoLocation);



let searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName == ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(searchInput.value);
    }

    
});



async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err){
        // hw :- 
    }
}


