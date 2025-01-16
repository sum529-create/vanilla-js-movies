import { BASE_IMAGE_URL } from "../constants/config.js";
import { fetchMovieList, loadApiKey } from "../services/api.js";
import Loading from "./loading.js";

export class MovieList {
  constructor(selector) {
    this.$movieList = document.querySelector(selector);
    this.data = [];
    this.loading = new Loading("#loading");
  }
  // api를 호출해주는 초기설정
  async initialize() {
    try {
      this.loading.toggle(true);
      await loadApiKey();
      const res = await fetchMovieList();
      this.loading.toggle(false);
      this.setMovies(res.results);
    } catch (error) {
      console.error("Failed to initialize movie list: ", error);
    }
  }

  // DOM 렌더링 로직
  render() {
    this.$movieList.innerHTML = "";

    if (this.data.length === 0) {
      return (this.$movieList.innerHTML =
        "<li class='no-data'>검색 결과가 없습니다.</li>");
    }
    const movieList = this.data
      .map((e, i) => {
        let title = e.title;
        let grade = e.vote_average.toFixed(2);
        let imgUrl = `${BASE_IMAGE_URL}${e.poster_path}` || "";
        let classIdx = (i + 1).toString().padStart(2, "0");

        return `
        <li class="movie-item${classIdx}" data-id="${e.id}">
          <div class="img-area">
            ${
              e.poster_path
                ? `
              <img
                src="${imgUrl}"
                alt="${title}"
              />
              `
                : ""
            }
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

    this.$movieList.innerHTML = movieList;
  }

  // 데이터 설정 set -> data
  setMovies(movies) {
    this.data = movies;
    this.render();
  }
}
