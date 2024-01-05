// TMDB API KEY: f6c495e780e710485a2ba600a095a7eb
// YouTube V3 API key=AIzaSyB2PqxIj9o2ICkmTS-M5wDEoy7noA6V2wE







// Initalising
const TMDB_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const _URL = 'https://api.themoviedb.org/3';
// API extension for popular movies
const POP_API = _URL + '/discover/movie?sort_by=popularity.desc&' + TMDB_KEY;


// //API search for images width 500 and the original image
const IMG_URL = 'https://image.tmdb.org/t/p/w500'; // used for movie posters
const photos_URL = 'https://image.tmdb.org/t/p/original/';


//URL to search for movies
const SearchURL = _URL + '/search/movie?' + TMDB_KEY;


//Initalise array for main actors from movie search
let actorDetails = [];






// So elements from API can be shown on app
const main = document.getElementById('main');
const header = document.getElementById('header');
const rating = document.getElementById('movie-rating');
const search = document.getElementById('search-form-one');
const search1 = document.getElementById('search-form-two');
const button = document.getElementById('button-container');
const header1 = document.getElementById('header1');
const header2 = document.getElementById('header2');



hideHeader()
// Get popular movies from API
getMovies(POP_API)
get_watchlist_count()

window.onload = function() {
    header1.style.display = 'block';
    header2.style.display = 'none';
};




function getMovies(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data.results)
            showMovies(data.results);




        })




}

function getMovieActors(id) {
    // URL movie title search getting actors
    return fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=f6c495e780e710485a2ba600a095a7eb`)
        // fetch returns a promise that resolves with a response object. the following line converts this response into JSON format
        //     response: This is the response from your fetch request.
        // response.json(): This is a method on the Response object that reads the response stream to completion and parses it as JSON.
        .then(res => res.json())
        .then(data => {
            if (data.cast && data.cast.length > 0) {
                return data.cast.slice(0, 3).map(actor => ({
                    name: actor.original_name,
                    profilePath: actor.profile_path
                }));
            }
            else {
                return [];
            }
        })
}




// Get actors
function getActors(url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            showActors(data.results);


        })
}




async function getActorSummary(person_id) {
    // URL actors summary search:biography
    return await fetch(`https://api.themoviedb.org/3/person/${person_id}?api_key=f6c495e780e710485a2ba600a095a7eb`)
        .then(res => res.json())




}


// Get movie info by id
async function getMovieByID(movie_id) {
    // URL actors summary search:biography
    const resp = await fetch(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=f6c495e780e710485a2ba600a095a7eb`)
    const respData = await resp.json()
    return respData






}








// This function shows the results for when the movie title search bar is used
function showMovies(data) {

    //set inner HTML as an empty string- gives blank state
    main.innerHTML = '';
    data.forEach(movie => {
        const { title, poster_path, vote_average, overview, id } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        //Getting main actors from movie
        getMovieActors(id).then(actors => {
            // call
            movieEl.innerHTML = `

                <h3 movie-title="${title}">${title}</h3>
                <img class='imageclick' movie-id="${id}" src="${photos_URL + poster_path}" alt="${title}">
                <div class="movie-info" movie-id="${id}">
                <span>${displayRating(vote_average)}</span>
                </div>

 
                <div class="watchlist">
                    <span> Add to watchlist: </span>
                    <!-- unicode for eye icon -->
                    <span class="eye-icon">&#128065;</span>
                </div>

                
                
                


               



               <div class = 'overview d-none' movie-id="${id}">
                <div class="movie-overview" >
                         "${overview}"
                </div>
                <div class = "actor-info" id = "actor-info">
                <h3>Main Actors<h3>
                <img src="${photos_URL + actors[0].profilePath}"
                alt="${actors[0].name}">
                <img src="${IMG_URL + actors[1].profilePath}"
                alt="${actors[1].name}">
                <img src="${photos_URL + actors[2].profilePath}"
                alt="${actors[2].name}">
                <h5>${actors[0].name}</h5>
                <h5>${actors[1] ? actors[1].name : 'N/A'}</h5>
                <h5>${actors[2].name}</h5>
                <div class="trailer">
                <h3 class="trailorheading">Watch trailer</h3>
                <iframe width="400" height="300" data-movie-id="${id}" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
                </div>
                </div>
                

            </div>
   
               


                `
            //       ${actors.map(function(actor){
            //   return ` <img src="${photos_URL} ${actor.profilePath}"
            //   alt="${actor.name}">`
            //  })}



            const eye_icon = movieEl.querySelector('.eye-icon')
            // Keeps eye icon selected colour when page is refreshed
            const movie_ids = get_local_storage()
            for (let i = 0; i <= movie_ids.length; i++) {
                if (movie_ids[i] == id) eye_icon.classList.add('change-color')
            }
            eye_icon.addEventListener('click', () => {
                if (eye_icon.classList.contains('change-color')) {
                    remove_local_storage(id)
                    get_watchlist_count()
                    eye_icon.classList.remove('change-color')
                } else {
                    add_to_local_storage(id)
                    get_watchlist_count()
                    eye_icon.classList.add('change-color')
                }
            })
            main.appendChild(movieEl);
            get_video(title, id)









        });





    });
}

function get_video(searchTerm, id) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${searchTerm}&key=AIzaSyAmb4kZMuWaIrJ7-YAkDxC8PPvk3wA_LT8`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            $(` iframe[data-movie-id="${id}"]`).attr('src', `https://www.youtube.com/embed/${data.items[0].id.videoId}`);
            // document.querySelector(".youtubeVideo").src = `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
        });
    $(` iframe[data-movie-id="${id}"]`).attr('src', `https://www.youtube.com/embed/$/x9TQ6culXIA`);

}


// local storage
function get_local_storage() {
    const movie_ids = JSON.parse(localStorage.getItem('movie-id'))
    // if there are no ids in the ls, create an empty array and push the current id into it
    return movie_ids === null ? [] : movie_ids


}
function add_to_local_storage(id) {
    const movie_ids = get_local_storage()
    // if there are no ids in the ls, create an empty array and push the current id into it
    localStorage.setItem('movie-id', JSON.stringify([...movie_ids, id]))


}


function remove_local_storage(id) {
    const movie_ids = get_local_storage()
    localStorage.setItem('movie-id', JSON.stringify(movie_ids.filter(e => e !== id)))
}


//fetch ls
async function fetch_watchList() {
    main.innerHTML = '';
    const movies_Local_storage = await get_local_storage()
    const movies = []
    for (let i = 0; i <= movies_Local_storage.length - 1; i++) {
        const movie_name = movies_Local_storage[i]
        let movie = await getMovieByID(movie_name)
        add_watchlist_to_DOM_from_local_storage(movie)
        movies.push(movie)
    }
}




function add_watchlist_to_DOM_from_local_storage(movie) {
    // const movieEl = document.createElement('div');
    // movieEl.classList.add('movie');
    main.innerHTML += `
    
   
    <div class="movie-watchlist">
   
                 <img src="${photos_URL + movie.poster_path}" alt="${movie.title}">
                <div class="movie-info-watchlist" movie-id="${movie.id}">
                    <div class="title-watchlist"><h3 movie-title="${movie.title}">${movie.title}</h3></div>
                    <div class="watchlist-star"><span class="star" id="movie-rating">${displayRating(movie.vote_average)}</span>
                </div>
                <div class="movie-overview-watchlist">
                         "${movie.overview}"
                </div>
            </div>
        
   
    `
    // main.appendChild(movieEl);


}




function get_watchlist_count() {
    const movie_ids = get_local_storage()
    length = movie_ids.length
    show_watchlist_count(length)


}


function show_watchlist_count(length) {
    // Find the element that displays the watchlist count
    const watchlistBadge = document.querySelector('.badge');


    // Update just the watchlist count
    if (watchlistBadge) {
        watchlistBadge.textContent = length;
    }


}


function get_color(vote) {
    if (Math.round(vote / 2) >= 4) {
        return "green";
    } else if (Math.round(vote / 2) >= 2) {
        return "orange";
    } else {
        return "red";
    }
}


function displayRating(movieRating) {
    const starContainer = rating;
    if (!starContainer) {
        console.warn(`Element with ID not found.`);
        return; // Exit the function if element not found
    }
    const normalizedRating = Math.round(movieRating / 2); // Convert 0-10 scale to 0-5
    let stars = '';
    const color = get_color(movieRating);
    for (let i = 0; i < 5; i++) {
        stars += i < normalizedRating ? `<span class="star" style="color: ${color};">&#10031</span>` : `<span class="star">&#10032</span>`; // Filled star for ratings, empty for the rest
    }


    starContainer.innerHTML = stars;
    return stars


}




// This function shows the results for when the actors search bar is used
function showActors(data) {
    main.innerHTML = '';
    data.forEach(actor => {
        const { original_name, profile_path, id, known_for } = actor;
        const movieEl = document.createElement('div');
        movieEl.classList.add('actor');
        //console.log(known_for)


        //Getting actors info
        // getActorMovies(id).then(actors => {
        getActorSummary(id).then(bib => {
            movieEl.innerHTML = `
            <div class="actor">
            <h3>${original_name}</h3>
            <img src="${photos_URL + profile_path}"
                alt="${original_name}">


            <div class="actor-overview">
                <p>${bib.biography}</p>
                <h2>known for<h2>
                <div class="actor-info-one" id="actor-info">
                    <img src="${photos_URL + actor.known_for[0].poster_path}"
                        alt="${actor.known_for[0].original_title}">
                    <img src="${photos_URL + actor.known_for[1].poster_path}"
                        alt="${actor.known_for[1].original_title}">
                    <img src="${photos_URL + actor.known_for[2].poster_path}"
                        alt="${actor.known_for[2].original_title}">
                    <h5>${actor.known_for[0].original_title}</h5>
                    <h5>${actor.known_for[1].original_title}</h5>
                    <h5>${actor.known_for[2].original_title}</h5>
                </div>
            </div>
        </div>
               


                `


            main.appendChild(movieEl);
        });


    });
}


// https://api.themoviedb.org/3/search/person?query=Tom+Cruise&api_key=1cf50e6248dc270629e802686245c2c8






// Listen to the event when the Movie is searched for
document.getElementById('search-form-one').form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideHeader()
    const searchTerm = search.value;
    // If search has been executed by user
    if (searchTerm) {
        //Call get movies with search parameter, search based on querey parameters
        getMovies(SearchURL + '&query=' + searchTerm)
    }
    //else return to homepage
    else {
        getMovies(POP_API)


    }
})






// Listen to the event when the Actor form is submitted
document.getElementById('search-form-two').form.addEventListener('submit', (event) => {
    event.preventDefault();
    hideHeader()
    const searchTerm = search1.value;
    // If actor search has been executed by user
    if (searchTerm) {
        //Call get actors with search parameter, search based on querey parameters
        getActors(`https://api.themoviedb.org/3/search/person?query=${search1.value}&api_key=f6c495e780e710485a2ba600a095a7eb`)


    }
    //else return to homepage
    else {
        getMovies(POP_API)


    }
})


// fetch_watchList()
document.getElementById('button-container').addEventListener('click', (e) => {
    header2.style.display = 'block';
    header1.style.display = 'none';
  

    e.preventDefault();
    //fetch ls
    if (e) {
        fetch_watchList();
        
    }
    else {
        getMovies(POP_API)

    }
});





// go back to homepage




document.getElementById('logo-container').addEventListener('click', (e) => {
    e.preventDefault();
    if (e) {
        getMovies(POP_API)
        header2.style.display = 'none';
        header1.style.display = 'block';
    }
});

$(document).on('click', '.imageclick', function (e) {
    e.preventDefault();
    if (e) {
        const movieID = $(this).attr('movie-id')
        //console.log(movieID)
        $('.modal-body').empty();
        $('.overview[movie-id="' + movieID + '"]').clone().appendTo('.modal-body');
        $('.modal-body .overview').removeClass('d-none')
        $('#myModal').modal();

    }
});

document.querySelector('.btn-close').addEventListener('click', function () {
    $('#myModal').modal('hide');


});

function hideHeader() {
    header2.style.display = 'none';
    header1.style.display = 'none';
    

}
