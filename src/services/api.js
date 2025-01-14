import { YOUTUBE_BASE_URL } from "../constants/config.js";
let MOVIE_FETCH_API_KEY = "";

async function loadApiKey() {
  try {
    const res = await fetch("../config.json");
    const config = await res.json();
    MOVIE_FETCH_API_KEY = config.TMDB_API_KEY;
  } catch (error) {
    console.error("Failed to load API Key: ", error);
  }
}

async function fetchMovieList() {
  const url =
    "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: MOVIE_FETCH_API_KEY,
    },
  };
  try {
    const res = (await fetch(url, options)).json();
    return res;
  } catch (error) {
    console.error("Failed to Fetch Movie List: ", error);
  }
}

async function searchMovie(query) {
  let res = [];

  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: MOVIE_FETCH_API_KEY,
    },
  };

  try {
    res = await (await fetch(url, options)).json();
  } catch (error) {
    console.error("Failed to Search Movie Item: ", error);
  }

  return res;
}

async function detailMovie(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}}?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: MOVIE_FETCH_API_KEY,
    },
  };
  try {
    const res = await fetch(url, options);
    return res.json();
  } catch (error) {
    console.error("Failed to load Detail Movie: ", error);
  }
}

async function getMovieAbout(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: MOVIE_FETCH_API_KEY,
    },
  };
  try {
    const res = await (await fetch(url, options)).json();

    if (res) {
      const videoInfo = res.results.find(
        (video) =>
          (video.type =
            "Trailer" && video.official === true && video.site === "YouTube")
      );
      const officialUrl = videoInfo
        ? `${YOUTUBE_BASE_URL}${videoInfo.key}`
        : "";
      return officialUrl;
    }
  } catch (error) {
    console.error("Failed to Get Movie About Data: ", error);
  }
}

export { loadApiKey, fetchMovieList, searchMovie, detailMovie, getMovieAbout };
