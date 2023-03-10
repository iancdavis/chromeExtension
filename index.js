const startButton = document.querySelector('button');

startButton.addEventListener('click', () => {


    
    // default location to codesmith venice
    let userLat = 33.989060922556085;
    let userLong = -118.46904988298537;

    // navigator.permissions.query({name:'geolocation'}).then(function(result) {
    //     if (result.state == 'granted') {
    //         obtainLocation(true);
    //     // } else if (result.state == 'prompt') {
    //     //     navigator.geolocation.getCurrentPosition(revealPosition,positionDenied,geoSettings);
    //     } else if (result.state == 'denied') {
    //         obtainLocation(false);
    //     }
    // });

    // function obtainLocation(userGavePermission){
    //     if ('geolocation' in navigator && userGavePermission) {
    //         /* geolocation is available */
    //         navigator.geolocation.getCurrentPosition((position) => {
    //         userLat = position.coords.latitude;
    //         userLong = position.coords.longitude;

    //         // runs the rest of the functions
    //         obtainGrid(userLat, userLong);
    //         });
    //     } else {
    //         /* geolocation IS NOT available */
    //         console.log('used default location')
    //         obtainGrid(userLat, userLong);
    //     }
    // }

    obtainGrid(userLat, userLong);

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

                const forecast = data.properties.periods[0].shortForecast;
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

                movieApiCall(matchedWeather, forecast, isItDay)
    
            })
    }

        // https://api.weather.gov/gridpoints/TOP/31,80/forecast
    
    
    // const movies = document.querySelector('#movie-list');
    function movieApiCall(weatherArray, forecast, isItDay){

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
            function paintCanvasWithSelectedMovie (finalMovieIndex){
                const movieRatingDisplay = document.createElement('h2');
                const movieRating = moviesData[finalMovieIndex].vote_average;
                movieRatingDisplay.innerText = `${movieRating}/10`;
                
                // poster
                const poster = document.createElement('img')
                const posterLink = `https://image.tmdb.org/t/p/w500/${moviesData[finalMovieIndex].poster_path}`
                poster.setAttribute('src', posterLink)
        
                // title
                const titleDisplay = document.createElement('h1');
                const title = moviesData[finalMovieIndex].original_title;
                titleDisplay.innerText = `We recommend: "${title}"`;
        
                // movie description
                const descriptionDisplay = document.createElement('p');
                const description = moviesData[finalMovieIndex].overview;
                descriptionDisplay.innerText = description;

                // weather icon
                // const forecastKeyWords = ['Sunny', 'Rain', 'Fog', 'Clear', 'Snow', 'Cloudy'];
                let weatherIcon;
                if (forecast==='Sunny'){
                    weatherIcon = 'https://www.freeiconspng.com/thumbs/sunny-icon/sunny-icon-2.png';
                }else if(forecast === 'Rain'){
                    weatherIcon = "https://www.freeiconspng.com/img/11039";
                }else if (forecast === 'Fog'){
                    weatherIcon = "https://www.freeiconspng.com/img/515";
                }else if (forecast === 'Clear'){
                    weatherIcon = "https://www.freeiconspng.com/img/23630";
                }else if (forecast === 'Snow'){
                    weatherIcon = "https://www.freeiconspng.com/img/31374";
                } else if (forecast==='Cloudy'){
                    weatherIcon = "https://www.freeiconspng.com/img/13385";
                }else {
                    weatherIcon = "https://www.freeiconspng.com/img/1150";
                }

                //short weather forecast
                const shortForecast = document.createElement('h1');
                const sfContent = forecast;
                shortForecast.innerHTML = `
                <span id="weather-span"><p>Based on today's weather:</p><img src=${weatherIcon} class="weather-icon"></img></span>
                `;
                // shortForecast.innerText = `Based on today's weather: ${sfContent}`;

                
                // append all info
                movies.append(shortForecast);
                shortForecast.style.borderTop = '1px solid #9499b7';
                shortForecast.style.paddingTop = "20px";
                movies.appendChild(poster);
                movies.appendChild(titleDisplay);
                titleDisplay.style.textAlign = "center";
                movies.appendChild(movieRatingDisplay);
                movies.appendChild(descriptionDisplay);
            }

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

            // which weather === which genre?
            const matchMovie = {
                "Rain" : "Comedy",
                "Sunny" : "Action",
                "Fog" : "Drama",
                "Clear" : "Adventure",
                "Snow" : "Science Fiction",
                "Cloudy" : "Mystery"
            }

            // reroll "dice" until movie genre matches weather genre
            function movieMatcher (matchMovie, movie = moviesData[rnd], weatherArray) {
                let rnd1 = rnd
                console.log(matchMovie);
                console.log(movie);
                // convert genre array
                let genreArrayNums = movie.genre_ids;
                genreArrayNums = genreArrayNums.map(el=>{
                    for (let i = 0; i<genreConverter.length; i++){
                        if (genreConverter[i].id===el){
                            el = genreConverter[i].name;
                        }
                    }
                    return el;
                })
                console.log(genreArrayNums);
                console.log(weatherArray);
                for (let i = 0; i < weatherArray.length; i++){

                    //base case
                    if (genreArrayNums.includes(matchMovie[weatherArray[i]])){
                        return rnd1;
                    } else {
                        rnd1 = Math.floor(Math.random()*20)
                        return movieMatcher(matchMovie, moviesData[rnd1], weatherArray);
                    }
                }
            }

            const newValue = movieMatcher(matchMovie, moviesData[rnd], weatherArray);
            paintCanvasWithSelectedMovie(newValue);
            
            
        }).catch(err=>console.error(err));
    }
})

// api key for movies: f03bf50d13acf4f802dfd5cbb3f2262e

// image configuration
// https://image.tmdb.org/t/p/w500/8uO0gUM8aNqYLs1OsTBQiXu0fEv.jpg


//weather endpoint
//https://api.weather.gov/points/{latitude},{longitude}