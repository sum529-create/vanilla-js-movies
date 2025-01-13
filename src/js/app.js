import {
  loadApiKey,
  fetchMovieList,
  searchMovie,
  detailMovie,
  getMovieAbout,
} from "./api.js";

const $movieList = document.querySelector(".movie-list");
const $movieSearch = document.querySelector("#movie-search");
const $modal = document.querySelector(".modal");
const $dim = document.querySelector(".dim");
const $closeBtn = document.querySelector(".closeBtn");
const $modalContent = document.querySelector(".modal-content");

const BASE_IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const setMovieItem = (data) => {
  if (data) {
    $movieList.innerHTML = "";
    const movieList = data
      .map((e, i) => {
        let title = e.title;
        let grade = Math.round(e.vote_average * 100) / 100;
        let imgUrl = `${BASE_IMAGE_URL}${e.poster_path}` || "";
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
const setMovieAboutItem = (data, url) => {
  console.log(data);

  if (data) {
    $modalContent.innerHTML = "";
    let imgUrlMo = `${BASE_IMAGE_URL}${data.backdrop_path}` || "";
    let imgUrl = `${BASE_IMAGE_URL}${data.poster_path}` || "";
    let grade = Math.round(data.vote_average * 100) / 100;
    const movieAbout = `
        <div class="modal-detail">
          <h1>${data.title}</h1>
          <div class="meta-info">
            <ul>
              <li>${data.adult ? "청불" : "전체"}</li>
              <li>${data.runtime}분</li>
              <li>${data.release_date.slice(0, 4)}</li>
            </ul>
          </div>
          <div class="movie-rating">
            <i class="material-symbols-outlined star-icon"> star_rate </i>
            <span class="rating">${grade}</span>
            <span class="nation">${data.origin_country[0]}</span>
          </div>
          <div class="genre-area">
            ${data.genres.map((genre) => `<span>${genre.name}</span>`).join("")}
          </div>
          <div class="movie-plot">
            <p class="sub-tit">줄거리</p>
            <p class="plot-txt">${data.overview}</p>
          </div>
        </div>
        <div class="modal-img">
          <img
            src="${imgUrl}"
            alt="${data.title}"
            class="poster"
          />
          <img
            src="${imgUrlMo}"
            alt="${data.title}"
            class="poster-mo"
          />
          </div>
          <div class="action-area">
            <button id="trailerBtn" class="btn btn-primary">예고편 보기</button>
            <button id="moreBtn" class="btn">더보기</button>
          </div>
      `;
    $modalContent.innerHTML = movieAbout;
    const $moreBtn = document.querySelector("#moreBtn");
    const $trailerBtn = document.querySelector("#trailerBtn");
    $trailerBtn.addEventListener("click", () => {
      window.open(url, "_blank");
    });
    $moreBtn.addEventListener("click", () => {
      window.open(data.homepage, "_blank");
    });
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

    // 외부 영화 소개 비디오 링크 가져오기
    const movieUrl = await getMovieAbout(res.id);

    $modal.style.display = "block";
    setMovieAboutItem(res, movieUrl);
  }
}
$movieList.addEventListener("click", openModal);
