import { BASE_IMAGE_URL } from "../constants/config.js";
import { getMovieListStore, setMovieListStore } from "../utils/storage.js";

/**
 * Modal 클래스
 * 모달 창 표시 / 숨김, 내용 관리 컴포넌트
 *
 * @class
 * @description 모달창 캡슐화
 *
 */
class Modal {
  /**
   *
   * @constructor
   * @param {string} selector - 모달 요소의 CSS 선택자
   * @description
   * - 모달 창 표시 : close() || open()
   * - 모달 관련 이벤트 : initEventListeners()
   * - 모달 내용 관리 : setContent()
   */
  constructor(selector) {
    this.$modal = document.querySelector(selector);
    this.$dim = document.querySelector(".dim");
    this.$closeBtn = document.querySelector(".closeBtn");
    this.$modalContent = document.querySelector(".modal-content");
  }

  close() {
    this.$modal.style.display = "none";
  }
  open() {
    this.$modal.style.display = "block";
  }
  initEventListeners() {
    this.$dim.addEventListener("click", () => {
      this.close();
    });
    this.$closeBtn.addEventListener("click", () => {
      this.close();
    });
  }
  setContent(contentHtml) {
    this.$modalContent.innerHTML = contentHtml;
  }
}

/**
 * MovieDetail 클래스
 * 영화 상세 정보의 렌더링을 제공하는 컴포넌트
 *
 * @class
 * @description
 * - 북마크 기능
 * - 영화 상세 정보의 HTML 생성
 * - 예고편 및 추가 정보 버튼 처리
 */
class MovieDetail {
  constructor() {}
  /**
   * @method
   * @param {Object} data - 영화 상세 정보 데이터
   * @returns 생성된 HTML 문자열
   * @description
   * - 전달받은 영화 데이터를 기반으로 HTML 생성
   * - 영화 기본 정보, 포스터 이미지, 줄거리 등등
   */
  createDetailHTML(data) {
    if (!data) return "";
    let imgUrlMo = `${BASE_IMAGE_URL}${data.backdrop_path}` || "";
    let imgUrl = `${BASE_IMAGE_URL}${data.poster_path}` || "";
    let grade = data.vote_average.toFixed(2);

    return `
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
  }
  // 북마크 기능
  setupBookmarkHandlers(data, url) {
    const $bookmarkArea = document.querySelector("#bookmark");
    const $bookmarkIcon = $bookmarkArea.querySelector("i");
    let isCheckedBookmark = false;

    // 북마크 여부 및 상태 확인 후 아이콘 지정
    if (getMovieListStore) {
      isCheckedBookmark = getMovieListStore.some((e) => e.id === data.id);
      if (isCheckedBookmark) {
        $bookmarkIcon.innerText = "bookmark_added";
        $bookmarkIcon.classList.remove("bookmark-icon");
        $bookmarkIcon.classList.add("bookmark-checked-icon");
      }
    }

    // 북마크 아이콘 호버 이벤트
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

    // 예고편, 더보기 버튼
    const $moreBtn = document.querySelector("#moreBtn");
    const $trailerBtn = document.querySelector("#trailerBtn");

    // 외부 영화 소개 유튜브 사이트로 이동
    $trailerBtn.addEventListener("click", () => {
      window.open(url, "_blank");
    });
    $moreBtn.addEventListener("click", () => {
      window.open(data.homepage, "_blank");
    });
  }
}

export { Modal, MovieDetail };
