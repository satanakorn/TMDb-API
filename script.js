const apikey = "0680cb2d98cf3298b1ab08cefb4bd645";
let years = "2024";
let genres = "";
let page = 1;
const urlBase = `https://api.themoviedb.org/3/discover/movie?api_key=${apikey}&language=en-US&sort_by=popularity.desc`;

const content = document.getElementById("content");
const urlPoster = `https://image.tmdb.org/t/p/w500/`;

const dropdownYear = document.getElementById('years');
const dropdownGenre = document.getElementById('genres');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const modal = document.getElementById('movieDetailsModal');
const modalContent = document.getElementById('movieDetailsContent');
const closeBtn = document.querySelector('.close');

async function getGenres() {
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apikey}&language=en-US`;
    const res = await fetch(genreUrl);
    const genreData = await res.json();

    genreData.genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        dropdownGenre.appendChild(option);
    });
}

async function displayMovie(url) {
    try {
        const res = await fetch(url);
        const movie = await res.json();

        if (page === 1) {
            content.innerHTML = ''; 
        }

        if (movie.results.length === 0) {
            content.innerHTML = '<h2>No movies found for this selection.</h2>';
            return;
        }

        movie.results.forEach(data => {
            const movieEl = document.createElement("div");
            movieEl.classList.add('movie');

            const title = document.createElement("h2");
            const poster = document.createElement("img");
            const detailsButton = document.createElement("button");

            title.innerHTML = `${data.title.substring(0, 24)}`;
            poster.src = `${urlPoster}${data.poster_path}`;
            detailsButton.textContent = "Details";
            detailsButton.classList.add('details-btn');

            detailsButton.addEventListener('click', () => {
                fetchMovieDetails(data.id);
            });

            movieEl.appendChild(poster);
            movieEl.appendChild(title);
            movieEl.appendChild(detailsButton);
            content.appendChild(movieEl);
        });

        console.log(movie);
    } catch (error) {
        content.innerHTML = '<h2>Failed to fetch movies. Please try again later.</h2>';
        console.error("Error fetching data:", error);
    }
}

function updateUrl() {
    return `${urlBase}&year=${years}&with_genres=${genres}&page=${page}`;
}

async function fetchMovieDetails(movieId) {
    try {
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apikey}&language=en-US`;
        const accountStatesUrl = `https://api.themoviedb.org/3/movie/${movieId}/account_states?api_key=${apikey}`;
        const alternativeTitlesUrl = `https://api.themoviedb.org/3/movie/${movieId}/alternative_titles?api_key=${apikey}`;
        const creditsUrl = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apikey}`;
        const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apikey}`;
        const keywordsUrl = `https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${apikey}`;
        const releaseDatesUrl = `https://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=${apikey}`;
        const reviewsUrl = `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${apikey}`;
        const similarUrl = `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${apikey}`;
        const videosUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apikey}`;
        const recommendationsUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apikey}`;

        const [
            details,
            accountStates,
            alternativeTitles,
            credits,
            images,
            keywords,
            releaseDates,
            reviews,
            similar,
            videos,
            recommendations
        ] = await Promise.all([
            fetch(detailsUrl).then(res => res.json()),
            fetch(accountStatesUrl).then(res => res.json()),
            fetch(alternativeTitlesUrl).then(res => res.json()),
            fetch(creditsUrl).then(res => res.json()),
            fetch(imagesUrl).then(res => res.json()),
            fetch(keywordsUrl).then(res => res.json()),
            fetch(releaseDatesUrl).then(res => res.json()),
            fetch(reviewsUrl).then(res => res.json()),
            fetch(similarUrl).then(res => res.json()),
            fetch(videosUrl).then(res => res.json()),
            fetch(recommendationsUrl).then(res => res.json()),
        ]);

        displayMovieDetails({
            details,
            accountStates,
            alternativeTitles,
            credits,
            images,
            keywords,
            releaseDates,
            reviews,
            similar,
            videos,
            recommendations,
        });

    } catch (error) {
        console.error("Error fetching movie details:", error);
        modalContent.innerHTML = '<h2>Failed to load movie details. Please try again later.</h2>';
    }
}

function displayMovieDetails(data) {
    modalContent.innerHTML = `
        <h2>${data.details.title}</h2>
        <p>${data.details.overview}</p>
        <p><strong>Release Date:</strong> ${data.details.release_date}</p>
        <p><strong>Genres:</strong> ${data.details.genres.map(genre => genre.name).join(', ')}</p>
        <p><strong>Rating:</strong> ${data.details.vote_average}/10</p>
        <p><strong>Keywords:</strong> ${data.keywords.keywords.map(keyword => keyword.name).join(', ')}</p>
        <p><strong>Alternative Titles        <p><strong>Alternative Titles:</strong> ${data.alternativeTitles.titles.map(title => title.title).join(', ')}</p>
        <p><strong>Cast:</strong> ${data.credits.cast.slice(0, 5).map(cast => `${cast.name} as ${cast.character}`).join(', ')}</p>
        <p><strong>Crew:</strong> ${data.credits.crew.slice(0, 5).map(crew => `${crew.name} (${crew.job})`).join(', ')}</p>
        <p><strong>Images:</strong></p>
        <div class="image-gallery">
            ${data.images.backdrops.slice(0, 5).map(image => `<img src="https://image.tmdb.org/t/p/w500${image.file_path}" alt="Image" />`).join('')}
        </div>
        <p><strong>Videos:</strong></p>
        <div class="video-gallery">
            ${data.videos.results.slice(0, 3).map(video => `
                <iframe width="560" height="315" src="https://www.youtube.com/embed/${video.key}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `).join('')}
        </div>
        <p><strong>Similar Movies:</strong> ${data.similar.results.slice(0, 3).map(similar => similar.title).join(', ')}</p>
        <p><strong>Recommendations:</strong> ${data.recommendations.results.slice(0, 3).map(recommendation => recommendation.title).join(', ')}</p>
        <p><strong>Release Dates:</strong></p>
        <ul>
            ${data.releaseDates.results.map(country => `<li>${country.release_dates.map(date => `${country.iso_3166_1}: ${date.release_date}`).join(', ')}</li>`).join('')}
        </ul>
        <p><strong>Reviews:</strong></p>
        <ul>
            ${data.reviews.results.slice(0, 3).map(review => `<li>${review.author}: ${review.content}</li>`).join('')}
        </ul>
    `;

    modal.style.display = "block";
}


closeBtn.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


getGenres();
displayMovie(updateUrl());


loadMoreBtn.addEventListener('click', () => {
    page++;
    displayMovie(updateUrl());
});


dropdownYear.addEventListener('change', (e) => {
    years = e.target.value;
    page = 1;
    displayMovie(updateUrl());
});

dropdownGenre.addEventListener('change', (e) => {
    genres = e.target.value;
    page = 1;
    displayMovie(updateUrl());
});

