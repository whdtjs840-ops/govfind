export const normalizedPolicyFields = [
  { key: "source", label: "출처", description: "복지로, 정부24, K-Startup 등 원천 데이터 제공처" },
  { key: "policy_type", label: "정책 유형", description: "현금지원, 바우처, 정책자금, 교육·상담 등" },
  { key: "life_stage", label: "생애주기", description: "청년, 임신·출산, 취약계층, 사업자 등" },
  { key: "target_group", label: "대상", description: "구직자, 소상공인, 무주택 청년처럼 매칭에 쓰는 대상군" },
  { key: "region", label: "지역", description: "전국, 시도, 시군구 기준 필터" },
  { key: "income_band", label: "소득 기준", description: "중위소득, 매출, 재산 등 공식 공고 기준" },
  { key: "apply_online", label: "온라인 신청", description: "온라인 신청 가능 여부와 공식 신청처 연결" },
  { key: "apply_window", label: "신청 기간", description: "상시, 예정, 마감임박, 접수기간" },
  { key: "official_url", label: "공식 URL", description: "최종 신청과 자격 판정을 확인할 공식 기관 링크" },
  { key: "link_status", label: "링크 검증", description: "공식 신청처 연결 여부와 마지막 확인일을 함께 표시" },
  { key: "required_docs", label: "필요 서류", description: "신청 전 준비해야 할 문서 체크리스트" },
  { key: "status_badge", label: "상태 배지", description: "모집중, 마감임박, 예정, 상시" }
];

export const publicApiSources = [
  {
    name: "대한민국 공공서비스 혜택 정보",
    provider: "공공데이터포털·정부24 계열",
    purpose: "공식 혜택 카탈로그를 확인하고 주요 정책 정보를 정리",
    fields: "서비스명, 기관명, 분류, 상세, 기관 코드, 공식 링크",
    endpoint: "gov24/v3/serviceList, serviceDetail 기준"
  },
  {
    name: "중앙부처 복지서비스",
    provider: "한국사회보장정보원·복지로",
    purpose: "전국 단위 복지 서비스 목록과 상세 정보를 확인",
    fields: "생애주기, 대상, 관심주제, 나이, 온라인 신청, 정렬",
    endpoint: "NationalWelfarelistV001, NationalWelfaredetailedV001 기준"
  },
  {
    name: "지자체 복지서비스",
    provider: "한국사회보장정보원",
    purpose: "지역별 지원금과 복지서비스 확인 기준으로 활용 예정",
    fields: "시도, 시군구, 대상, 관심주제, 검색어, 정렬",
    endpoint: "지역 복지서비스 API 기준"
  },
  {
    name: "K-Startup 지원사업",
    provider: "창업진흥원",
    purpose: "예비창업자와 초기기업 대상 공고 확인",
    fields: "사업명, 사업유형, 모집기간, 신청방법, 문의처",
    endpoint: "K-Startup 공공데이터 기준"
  }
];

export const infrastructureIntegrations = [
  { name: "공식 링크 확인 기준", role: "신청 링크와 원문 링크를 공식 기관 기준으로 확인", provider: "정적 데이터 관리 + 수동 검수" },
  { name: "주기 수집 구조", role: "사용자 요청마다 API를 직접 호출하지 않고, 수집 후 내부 표준 스키마로 정리하는 방식", provider: "공공 API 캐시형 운영" },
  { name: "데이터 최신성 표시", role: "정책별 마지막 확인일과 출처를 화면에 표시", provider: "공공 원문 확인" },
  { name: "검색 행동 분석", role: "향후 인기 키워드와 공식 신청 클릭 흐름을 익명 집계 예정", provider: "GA4 또는 Cloudflare Web Analytics" },
  { name: "주소 검색", role: "비로그인 지역 정밀 검색이 필요할 때만 선택", provider: "도로명주소 API" }
];
