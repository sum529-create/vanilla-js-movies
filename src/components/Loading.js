// loading 적용
// const toggleLoading = (show) => {
//   document.querySelector("#loading").style.display = show ? "block" : "none";
// };

export default class Loading {
  constructor(seletor) {
    this.$selector = document.querySelector(seletor);
  }
  toggle(show) {
    this.$selector.style.display = show ? "block" : "none";
  }
}
