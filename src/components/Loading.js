/**
 * Loading 클래스
 * @class
 */
export default class Loading {
  /**
   * @constructor
   * @param {string} seletor - 로딩 요소의 CSS 선택자
   */
  constructor(seletor) {
    this.$selector = document.querySelector(seletor);
  }
  toggle(show) {
    this.$selector.style.display = show ? "block" : "none";
  }
}
