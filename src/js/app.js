import { loadApiKey, fetchMovieList, searchMovie, detailMovie } from "./api.js";

const $movieList = document.querySelector(".movie-list");
const $movieSearch = document.querySelector("#movie-search");
const $modal = document.querySelector(".modal");
const $dim = document.querySelector(".dim");
const $closeBtn = document.querySelector(".closeBtn");
const $modalContent = document.querySelector(".modal-content");

const setMovieItem = (data) => {
  if (data) {
    $movieList.innerHTML = "";
    $modal.style.display = "block"; // 임시값
    const movieList = data
      .map((e, i) => {
        let title = e.title;
        let grade = Math.round(e.vote_average * 100) / 100;
        let imgUrl = `https://image.tmdb.org/t/p/w500${e.poster_path}` || "";
        let classIdx = (i + 1).toString().padStart(2, "0");

        return `
        <li class="movie-item${classIdx}" data-id="${e.id}">
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

    $movieList.innerHTML = movieList;
  }
};
const setMovieAboutItem = (data) => {
  if (data) {
    $modalContent.innerHTML = "";
  }
};

const toggleLoading = (show) => {
  document.querySelector("#loading").style.display = show ? "block" : "none";
};

async function getMovieList() {
  toggleLoading(true);
  await loadApiKey();
  const res = await fetchMovieList();
  toggleLoading(false);
  const data = res.results;
  setMovieItem(data);
}

(() => getMovieList())();

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
    toggleLoading(true);
    const res = await searchMovie(event.target.value);
    toggleLoading(false);
    if (event.target.value === "") {
      return await getMovieList();
    }
    const data = res.results;

    setMovieItem(data);
  }, 300)
);
$dim.addEventListener("click", () => {
  $modal.style.display = "none";
});
$closeBtn.addEventListener("click", () => {
  $modal.style.display = "none";
});
async function openModal(e) {
  const item = e.target.closest("li");
  if (item) {
    const id = item.getAttribute("data-id");
    const res = await detailMovie(id);
    console.log(res);

    $modal.style.display = "block";
  }
}
$movieList.addEventListener("click", openModal);
