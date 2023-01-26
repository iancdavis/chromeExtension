document.addEventListener('DOMContentLoaded', () => {
    
    // default location to codesmith venice
    let userLat = 33.989060922556085;
    let userLong = -118.46904988298537;

    navigator.permissions.query({name:'geolocation'}).then(function(result) {
        if (result.state == 'granted') {
            obtainLocation(true);
        } else if (result.state == 'prompt') {
            navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
        } else if (result.state == 'denied') {
            obtainLocation(false);
        }
        result.onchange = function() {
            report(result.state);
        }
    });



    function obtainLocation(userGavePermission){
        if ('geolocation' in navigator && userGavePermission) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition((position) => {
            userLat = position.coords.latitude;
            userLong = position.coords.longitude;

            // runs the rest of the functions
            obtainGrid(userLat, userLong);
            });
        } else {
            /* geolocation IS NOT available */
            console.log('used default location')
            obtainGrid(userLat, userLong);
        }
    }


    // weather api call
    function obtainGrid (userLat, userLong) {
    fetch(`https://api.weather.gov/points/${userLat},${userLong}`)
        .then(data=>data.json())
        .then(data=>{
            console.log(data);

            const office = data.properties.gridId;
            const gridX = data.properties.gridX;
            const gridY = data.properties.gridY;

            console.log(office, gridX, gridY);

            getForecast(office, gridX, gridY);
        })
    }

    function getForecast(office, gridX, gridY){
        console.log(office, gridX, gridY)
        fetch(`https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}/forecast`)
            .then(data=>data.json())
            .then(data=>{
                console.log(data);

                const forecast = data.properties.periods[6].shortForecast;
                const isItDay = data.properties.periods[0].isDaytime;

                // parse forecast into most impactful word
                const forecastKeyWords = ['Sunny', 'Rain', 'Fog', 'Clear', 'Snow', 'Cloudy'];
                const forecastArray = forecast.split(' ');
                const matchedWeather = [];

                console.log(forecastArray);

                forecastArray.forEach(el=>{
                    if (forecastKeyWords.includes(el)){
                        matchedWeather.push(el)
                    }
                })
                console.log(matchedWeather)
                // console.log(forecast, isItDay);

                movieApiCall(matchedWeather, isItDay)
    
            })
    }

        // https://api.weather.gov/gridpoints/TOP/31,80/forecast
    
    
    // const movies = document.querySelector('#movie-list');
    function movieApiCall(weatherArray, isItDay){

        const rndPage = Math.floor(Math.random() * 3)
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=f03bf50d13acf4f802dfd5cbb3f2262e&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${rndPage}&with_watch_monetization_types=flatrate`)
        .then((response) => response.json())
        .then((data) => {
            // console.log(data[0].poster_path)
            console.log(data.results);
            // using data here
    
            
            const rnd = Math.floor(Math.random() * 20);
            
            // Movies array
            const moviesData = data.results;
            
            // div
            const movies = document.querySelector('#movie-list');
            
            // movie rating
            const movieRatingDisplay = document.createElement('h2');
            const movieRating = moviesData[rnd].vote_average;
            movieRatingDisplay.innerText = `${movieRating}/10`;
            
            // poster
            const poster = document.createElement('img')
            const posterLink = `https://image.tmdb.org/t/p/w500/${moviesData[rnd].poster_path}`
            poster.setAttribute('src', posterLink)
    
            // title
            const titleDisplay = document.createElement('h1');
            const title = moviesData[rnd].original_title;
            titleDisplay.innerText = title;
    
            // movie description
            const descriptionDisplay = document.createElement('p');
            const description = moviesData[rnd].overview;
            descriptionDisplay.innerText = description;

            const genreConverter = [
                {
                    "id": 28,
                    "name": "Action"
                },
                {
                    "id": 12,
                    "name": "Adventure"
                },
                {
                    "id": 16,
                    "name": "Animation"
                },
                {
                    "id": 35,
                    "name": "Comedy"
                },
                {
                    "id": 80,
                    "name": "Crime"
                },
                {
                    "id": 99,
                    "name": "Documentary"
                },
                {
                    "id": 18,
                    "name": "Drama"
                },
                {
                    "id": 10751,
                    "name": "Family"
                },
                {
                    "id": 14,
                    "name": "Fantasy"
                },
                {
                    "id": 36,
                    "name": "History"
                },
                {
                    "id": 27,
                    "name": "Horror"
                },
                {
                    "id": 10402,
                    "name": "Music"
                },
                {
                    "id": 9648,
                    "name": "Mystery"
                },
                {
                    "id": 10749,
                    "name": "Romance"
                },
                {
                    "id": 878,
                    "name": "Science Fiction"
                },
                {
                    "id": 10770,
                    "name": "TV Movie"
                },
                {
                    "id": 53,
                    "name": "Thriller"
                },
                {
                    "id": 10752,
                    "name": "War"
                },
                {
                    "id": 37,
                    "name": "Western"
                }
            ]

            // convert genre array
            const genreArrayNums = moviesData[rnd].genre_ids;
            genreArrayNums.map(el=>{
                for (let i = 0; i<genreConverter.length; i++){
                    if (genreConverter[i].id===el){
                        el = genreConverter[i].name;
                    }
                }
                return el;
            })
            
            console.log(genreArrayNums);
            
            // append all info
            movies.appendChild(poster);
            movies.appendChild(titleDisplay);
            movies.appendChild(movieRatingDisplay);
            movies.appendChild(descriptionDisplay);
            
            
        }).catch(err=>console.error(err));
    }



})

// api key for movies: f03bf50d13acf4f802dfd5cbb3f2262e

// image configuration
// https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg


//weather endpoint
//https://api.weather.gov/points/{latitude},{longitude}