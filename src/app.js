import Loading from "./components/loading.js";
import { BASE_IMAGE_URL } from "./constants/config.js";
import {
  loadApiKey,
  fetchMovieList,
  searchMovie,
  detailMovie,
  getMovieAbout,
} from "./services/api.js";
import { getMovieListStore, setMovieListStore } from "./utils/storage.js";
import { throttle } from "./utils/throttle.js";

const $movieList = document.querySelector(".movie-list");
const $movieSearch = document.querySelector("#movie-search");
const $modal = document.querySelector(".modal");
const $dim = document.querySelector(".dim");
const $closeBtn = document.querySelector(".closeBtn");
const $modalContent = document.querySelector(".modal-content");
const $btnBookmark = document.querySelector("#btn-bookmark");

// 로딩 클래스 추가
const loading = new Loading("#loading");

// 영화 리스트 아이템 설정
const setMovieItem = (data) => {
  if (data) {
    $movieList.innerHTML = "";
    const movieList = data
      .map((e, i) => {
        let title = e.title;
        let grade = e.vote_average.toFixed(2);
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

// 영화 상세 보기
const setMovieAboutItem = (data, url) => {
  if (data) {
    $modalContent.innerHTML = "";
    let imgUrlMo = `${BASE_IMAGE_URL}${data.backdrop_path}` || "";
    let imgUrl = `${BASE_IMAGE_URL}${data.poster_path}` || "";
    let grade = data.vote_average.toFixed(2);
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
            <span class="bookmark" id="bookmark">
              <i class="material-symbols-outlined bookmark-icon">bookmark</i>
            </span>
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
    const $bookmarkArea = document.querySelector("#bookmark");
    const $bookmarkIcon = $bookmarkArea.querySelector("i");
    let isCheckedBookmark = false;

    // 외부 영화 소개 유튜브 사이트로 이동
    $trailerBtn.addEventListener("click", () => {
      window.open(url, "_blank");
    });
    $moreBtn.addEventListener("click", () => {
      window.open(data.homepage, "_blank");
    });

    // 북마크 여부
    if (getMovieListStore) {
      isCheckedBookmark = getMovieListStore.some((e) => e.id === data.id);
      if (isCheckedBookmark) {
        $bookmarkIcon.innerText = "bookmark_added";
        $bookmarkIcon.classList.remove("bookmark-icon");
        $bookmarkIcon.classList.add("bookmark-checked-icon");
      }
    }

    // 북마크 아이콘 변경
    if (!isCheckedBookmark) {
      $bookmarkArea.addEventListener("mouseenter", () => {
        $bookmarkIcon.textContent = "bookmark_add";
        $bookmarkIcon.classList.add("bookmark-add-icon");
        $bookmarkIcon.classList.remove("bookmark-icon");
      });
      $bookmarkArea.addEventListener("mouseleave", () => {
        $bookmarkIcon.textContent = "bookmark";
        $bookmarkIcon.classList.add("bookmark-icon");
        $bookmarkIcon.classList.remove("bookmark-add-icon");
      });
    }

    // 북마크 추가 / 삭제
    $bookmarkArea.addEventListener("click", () => {
      let id = data.id;
      let title = data.title;
      let voteAverage = data.vote_average;
      let posterPath = data.poster_path || "";

      let movieInfo = {
        id,
        title,
        vote_average: voteAverage,
        poster_path: posterPath,
      };

      let movieArr = getMovieListStore || [];

      if (getMovieListStore) {
        if (movieArr.some((e) => e.id === id)) {
          if (
            confirm(
              "이미 북마크에 등록된 영화입니다.\n북마크를 해제하시겠습니까?"
            )
          ) {
            movieArr = movieArr.filter((e) => e.id !== id);
            setMovieListStore(movieArr);
            window.location.reload();
            alert("북마크가 해제되었습니다.");
            return;
          }
          return;
        }
      }
      movieArr.push(movieInfo);
      setMovieListStore(movieArr);
      window.location.reload();
      alert("북마크에 추가되었습니다.");
    });
  }
};

$btnBookmark.addEventListener("click", () => {
  const data = getMovieListStore;
  setMovieItem(data);
});

// 영화 목록 조회
async function getMovieList() {
  loading.toggle(true);
  await loadApiKey();
  const res = await fetchMovieList();
  loading.toggle(false);
  const data = res.results;
  setMovieItem(data);
}

(() => getMovieList())();

// 영화 검색 쓰로틀링

$movieSearch.addEventListener(
  "input",
  throttle(async (event) => {
    loading.toggle(true);
    const res = await searchMovie(event.target.value);
    loading.toggle(false);
    if (event.target.value === "") {
      return await getMovieList();
    }
    const data = res.results;

    setMovieItem(data);
  }, 300)
);

// modal 창 띄우기
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
