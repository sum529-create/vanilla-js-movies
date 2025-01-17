# 🎬 vanilla-js-movies

![프로젝트 메인 화면](./src/images/screenshot-main.png)

TMDB API를 활용한 영화 검색 및 북마크 기능을 제공하는 바닐라 자바스크립트 프로젝트입니다.

## 주요 기능

| 💫 무한 스크롤 기능의 영화 목록                     |
| --------------------------------------------------- |
| ![영화 목록 화면](./src/images/screenshot-list.png) |

| 🔍 실시간 영화 검색 (쓰로틀링 적용)                   |
| ----------------------------------------------------- |
| ![영화 검색 화면](./src/images/screenshot-search.png) |

| ⭐ 영화 북마크 기능                                  |
| ---------------------------------------------------- |
| ![북마크 화면](./src/images/screenshot-bookmark.png) |

| 🎯 영화 상세 정보 모달                                |
| ----------------------------------------------------- |
| ![상세 정보 화면](./src/images/screenshot-detail.png) |

## 기술 스택

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![TMDB](https://img.shields.io/badge/TMDB-01B4E4?style=flat&logo=themoviedatabase&logoColor=white)

## 프로젝트 구조

```
/src
├── /components      # 컴포넌트 파일들
├── /constants      # 설정 파일
├── /css           # 스타일 파일
├── /services      # API 통신
├── /utils         # 유틸리티 함수
└── app.js         # 메인 로직
```

## 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/your-username/vanilla-js-movies.git
```

2. TMDB API 키 설정

```json
// config.json
{
  "apiKey": "your-tmdb-api-key"
}
```

3. 실행

```bash
# VS Code Live Server 등으로 실행
```

## 스크린샷

| 데스크탑 메인 화면                        | 데스크탑 상세 정보                          |
| ----------------------------------------- | ------------------------------------------- |
| ![메인](./src/images/screenshot-main.png) | ![상세](./src/images/screenshot-detail.png) |

| 모바일 메인 화면                             | 모바일 상세 정보                               |
| -------------------------------------------- | ---------------------------------------------- |
| ![메인](./src/images/screenshot-main-mo.png) | ![상세](./src/images/screenshot-detail-mo.png) |

## 향후 계획

- [ ] 라이트/다크 모드
- [ ] 태그별 필터링
- [ ] 페이지네이션 추가
- [ ] sub nav 추가

---

Made with ❤️ by [sum529-create]
