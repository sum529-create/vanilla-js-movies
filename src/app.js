import Loading from "./components/loading.js";
import { Modal, MovieDetail } from "./components/Modal.js";
import { MovieList } from "./components/MovieList.js";
import { searchMovie, detailMovie, getMovieAbout } from "./services/api.js";
import { getMovieListStore } from "./utils/storage.js";
import { throttle } from "./utils/throttle.js";

const $movieList = document.querySelector(".movie-list");
const $movieSearch = document.querySelector("#movie-search");
const $btnBookmark = document.querySelector("#btn-bookmark");

// 로딩 클래스 추가
const loading = new Loading("#loading");

// 영화 리스트 클래스 추가
const movieList = new MovieList(".movie-list");

// 모달 생성 및 영화 상세 정보 클래스 추가
const modal = new Modal(".modal");
const movieDetail = new MovieDetail();
modal.initEventListeners();

$btnBookmark.addEventListener("click", () => {
  const data = getMovieListStore;
  movieList.setMovies(data);
});

(() => movieList.initialize())();

// 영화 검색 쓰로틀링
$movieSearch.addEventListener(
  "input",
  throttle(async (event) => {
    loading.toggle(true);
    const res = await searchMovie(event.target.value);
    loading.toggle(false);
    if (event.target.value === "") {
      return movieList.initialize();
    }
    const data = res.results;
    movieList.setMovies(data);
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
    const detailHTML = movieDetail.createDetailHTML(res);
    modal.setContent(detailHTML);
    modal.open();

    // 북마크 핸들러
    movieDetail.setupBookmarkHandlers(res, movieUrl);
  }
}
$movieList.addEventListener("click", openModal);
