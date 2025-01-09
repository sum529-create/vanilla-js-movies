import { fetchMovieList } from "./api.js";

(async () => {
  const movieCard = document.querySelector(".movie-list");
  const res = await fetchMovieList();
  console.log(res);

  const data = res.results;
  data.forEach((e) => {
    let title = e.title;
    let grade = Math.round(e.vote_average * 100) / 100;
    let imgUrl = `https://image.tmdb.org/t/p/w500${e.poster_path}` || "";

    let movie_item = `
    <li>
      <div class="img-area">
        <img
          src="${imgUrl}"
          alt="${title}"
        />
        <div class="img-area-info">
          <h2 class="card-title">${title}</h2>
          <p class="card-grade">
            <i class="material-symbols-outlined">
              star_rate
            </i> 
            <span>${grade}</span>
          </p>
        </div>
      </div>
    </li>
  `;
    movieCard.innerHTML += movie_item;
  });
})();
