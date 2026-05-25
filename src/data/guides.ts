export type Guide = {
  slug: string;
  title: string;
  category: string;
  description: string;
  readingTime: string;
  sections: { heading: string; body: string }[];
};

export const guides: Guide[] = [
  {
    slug: "how-to-find-government-subsidies",
    title: "정부지원금 찾는 방법: 공식 신청 전 확인할 7가지",
    category: "신청 가이드",
    description: "지원 대상, 소득 기준, 지역 조건, 신청 기간을 빠르게 확인하는 기본 절차입니다.",
    readingTime: "5분",
    sections: [
      { heading: "공식 출처부터 확인", body: "민간 사이트의 설명은 탐색을 돕는 역할입니다. 최종 자격과 신청은 정부24, 복지로, K-Startup, 고용24 등 공식 출처에서 반드시 확인해야 합니다." },
      { heading: "내 조건을 먼저 정리", body: "나이, 거주지역, 가구상황, 소득구간, 고용상태, 사업자 여부를 정리하면 검색 결과를 크게 줄일 수 있습니다." },
      { heading: "마감일을 우선순위로 보기", body: "지원금은 예산 소진이나 접수 종료로 놓치기 쉽습니다. 마감임박 정책과 상시 정책을 분리해서 보는 것이 좋습니다." }
    ]
  },
  {
    slug: "youth-support-checklist",
    title: "청년지원금 자격 체크리스트",
    category: "청년",
    description: "청년 월세, 취업, 창업, 생활비 지원을 볼 때 반복되는 조건을 정리했습니다.",
    readingTime: "4분",
    sections: [
      { heading: "연령 기준", body: "정책별 청년 기준은 만 19세부터 34세까지가 많지만, 지자체나 사업별로 39세까지 확장되는 경우도 있습니다." },
      { heading: "소득과 가구 기준", body: "본인 소득만 보는 정책도 있고 부모나 가구 소득을 함께 보는 정책도 있습니다. 공고의 산정 방식을 확인해야 합니다." },
      { heading: "거주지 기준", body: "청년 정책은 주민등록상 거주지를 요구하는 경우가 많아 전입일과 거주 기간을 함께 확인하는 것이 안전합니다." }
    ]
  },
  {
    slug: "small-business-fund-guide",
    title: "소상공인 정책자금 신청 전 준비서류",
    category: "소상공인",
    description: "사업자 대상 정책자금에서 자주 요구되는 서류와 확인 포인트입니다.",
    readingTime: "6분",
    sections: [
      { heading: "사업 기본 서류", body: "사업자등록증, 매출 증빙, 납세 증명, 임대차계약서 등 사업 상태를 확인하는 자료가 기본이 됩니다." },
      { heading: "자금 목적", body: "운영자금, 시설자금, 창업자금 등 목적에 따라 심사 기준과 제출 자료가 달라질 수 있습니다." },
      { heading: "공고별 접수 방식", body: "정책자금은 예산 소진과 접수 일정이 중요합니다. 공식 사이트의 신청 가능 상태를 먼저 확인하세요." }
    ]
  },
  {
    slug: "naver-google-seo-subsidy-content",
    title: "지원금 정보가 검색에 잘 노출되는 페이지 구조",
    category: "SEO",
    description: "사용자 질문 단위로 제목, 요약, 상세 조건, 공식 링크를 정리하는 방법입니다.",
    readingTime: "5분",
    sections: [
      { heading: "검색 의도별 제목", body: "청년 월세, 소상공인 자금, 출산 지원금처럼 검색 의도가 분명한 주제는 별도 상세 페이지로 운영하는 것이 좋습니다." },
      { heading: "상세 페이지 표준화", body: "지원대상, 지원내용, 신청기간, 필요서류, 문의처, 공식 신청 링크를 같은 순서로 제공하면 사용자와 검색엔진 모두 이해하기 쉽습니다." },
      { heading: "내부 링크", body: "상세 페이지에서 관련 지원금, 같은 카테고리, 신청 가이드로 이어지는 내부 링크를 제공하면 탐색 깊이가 좋아집니다." }
    ]
  }
];
