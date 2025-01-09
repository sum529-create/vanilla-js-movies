import { loadApiKey, fetchMovieList, searchMovie } from "./api.js";

const $movieCard = document.querySelector(".movie-list");
const $movieSearch = document.querySelector("#movie-search");
(() => getMovieList())();
async function getMovieList() {
  await loadApiKey();
  const res = await fetchMovieList();

  const data = res.results;
  const movieList = data
    .map((e) => {
      let title = e.title;
      let grade = Math.round(e.vote_average * 100) / 100;
      let imgUrl = `https://image.tmdb.org/t/p/w500${e.poster_path}` || "";

      return `
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
    })
    .join("");

  $movieCard.innerHTML = movieList;
}

const throttle = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

$movieSearch.addEventListener(
  "input",
  throttle(async (event) => {
    const res = await searchMovie(event.target.value);

    if (event.target.value === "") {
      return await getMovieList();
    }
    const data = res.results;
    $movieCard.innerHTML = "";
    const movieList = data
      .map((e) => {
        let title = e.title;
        let grade = Math.round(e.vote_average * 100) / 100;
        let imgUrl = `https://image.tmdb.org/t/p/w500${e.poster_path}` || "";

        return `
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
      })
      .join("");
    $movieCard.innerHTML = movieList;
  }, 300)
);
