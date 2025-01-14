const getMovieListStore = JSON.parse(localStorage.getItem("movieList"));
const setMovieListStore = (movieArr) => {
  localStorage.setItem("movieList", JSON.stringify(movieArr));
};

export { getMovieListStore, setMovieListStore };
