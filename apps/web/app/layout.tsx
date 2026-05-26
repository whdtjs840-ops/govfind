import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "GovFind - 정부지원금 비교 검색",
    template: "%s - GovFind"
  },
  description: "공식 출처 기준으로 정부지원금, 복지, 청년, 창업, 소상공인 정책을 비교하고 공식 신청처로 이동합니다.",
  openGraph: {
    type: "website",
    siteName: "GovFind"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <a className="skip-link" href="#main">본문 바로가기</a>
        <header className="site-header">
          <div className="container header-inner">
            <a className="logo" href="/">GovFind</a>
            <nav className="nav" aria-label="주요 메뉴">
              <a href="/support">지원금 검색</a>
              <a href="/deadline">마감임박</a>
              <a href="/online">온라인신청</a>
              <a href="/region/전국">지역별</a>
              <a href="/compare">비교함</a>
            </nav>
          </div>
        </header>
        <div id="main">{children}</div>
        <footer className="footer">
          <div className="container">
            <strong>GovFind</strong>
            <p>최종 자격 및 신청은 공식 기관에서 확인하세요. GovFind는 신청 가능 여부를 단정하지 않습니다.</p>
            <p><a href="/privacy">개인정보처리방침</a> · <a href="/terms">이용약관</a> · <a href="/admin">관리자</a></p>
          </div>
        </footer>
      </body>
    </html>
  );
}
