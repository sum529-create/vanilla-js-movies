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
  if (!MOVIE_FETCH_API_KEY) await loadApiKey();

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

export { fetchMovieList };
