import Loading from "./components/loading.js";
import { Modal, MovieDetail } from "./components/Modal.js";
import { MovieList } from "./components/MovieList.js";
import { searchMovie, detailMovie, getMovieAbout } from "./services/api.js";
import { getMovieListStore } from "./utils/storage.js";
import { throttle } from "./utils/throttle.js";

const $movieList = document.querySelector(".movie-list");
const $movieSearch = document.querySelector("#movie-search");
const $btnBookmark = document.querySelector("#btn-bookmark");
const $header = document.querySelector("header");
const $mainSubTit = document.querySelector(".main-sub-tit");
let timeout;

// input 포커스 시 헤더 축소
$movieSearch.addEventListener("focus", () => {
  $header.classList.add("collapsed");
});

// 검색어 입력 시 헤더 상태 유지
$movieSearch.addEventListener("input", () => {
  if (timeout) clearTimeout(timeout);

  if ($movieSearch.value.trim() !== "") {
    $header.classList.add("collapsed");
  }
});

// input 블러 시 조건부로 헤더 확장
$movieSearch.addEventListener("blur", () => {
  if ($movieSearch.value.trim() === "") {
    timeout = setTimeout(() => {
      $header.classList.remove("collapsed");
    }, 200);
  }
});

// 로딩 클래스 추가
const loading = new Loading("#loading");

// 영화 리스트 클래스 추가
const movieList = new MovieList(".movie-list");

// 모달 생성 및 영화 상세 정보 클래스 추가
const modal = new Modal(".modal");
const movieDetail = new MovieDetail();
modal.initEventListeners();

// 북마크 리스트 이벤트
let isBookmarkChecked = false;
$btnBookmark.addEventListener("click", () => {
  isBookmarkChecked = !isBookmarkChecked;
  if (isBookmarkChecked) {
    $btnBookmark.classList.add("active");
    $header.classList.add("collapsed");
    $header.style.display = "none";
    $mainSubTit.style.display = "block";

    // 북마크 모드 설정
    movieList.setBookmarkMode(true);
    const data = getMovieListStore;
    if (data) {
      movieList.setMovies(data, "replace");
    }
  } else {
    $btnBookmark.classList.remove("active");
    $header.classList.remove("collapsed");
    $header.style.display = "flex";
    $mainSubTit.style.display = "none";

    // 일반 모드로 전환
    movieList.setBookmarkMode(false);
    movieList.setMovies([], "replace");
    movieList.init();
  }
});

(() => movieList.init())();

// 영화 검색 쓰로틀링
$movieSearch.addEventListener(
  "input",
  throttle(async (event) => {
    loading.toggle(true);
    const res = await searchMovie(event.target.value);
    loading.toggle(false);
    if (event.target.value === "") {
      movieList.setSearchMode(false);
      return movieList.init();
    }
    movieList.setSearchMode(true);
    const data = res.results;
    movieList.setMovies(data, "replace");
  }, 300)
);

// modal 창 띄우기
async function openModal(e) {
  const item = e.target.closest("li");
  if (item) {
    const id = item.getAttribute("data-id");
    const res = await detailMovie(id);

    // 외부 영화 소개 비디오 링크 가져오기
    const movieUrl = await getMovieAbout(res.id);

    // 모달 콘텐츠 추가
    const detailHTML = movieDetail.createDetailHTML(res, movieUrl);
    modal.setContent(detailHTML);
    modal.open();

    // 북마크 핸들러
    movieDetail.setupBookmarkHandlers(res, movieUrl);
  }
}
$movieList.addEventListener("click", openModal);
