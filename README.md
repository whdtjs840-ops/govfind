# GovFind

`govfind.kr`용 정부지원금 정보 사이트입니다.

## 목적

- 애드센스 승인에 유리한 신뢰형 정보 구조
- 승인 후 광고 수익화를 위한 검색, 카테고리, 상세, 가이드 페이지
- 구글/네이버 SEO를 고려한 정적 HTML, sitemap, robots 구성
- 별도 어드민 없는 Cloudflare Pages 배포 구조

## 실행

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

Cloudflare Pages 설정:

- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: 22 이상 권장

## 주요 페이지

- `/` 홈
- `/support/` 지원금 검색
- `/support/[slug]/` 지원금 상세
- `/guide/` 가이드 허브
- `/deadline/` 마감임박
- `/compare/` 비교
- `/privacy/`, `/terms/`, `/about/`, `/contact/`
