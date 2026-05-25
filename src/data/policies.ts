export type Policy = {
  slug: string;
  title: string;
  category: string;
  agency: string;
  region: string;
  amount: string;
  deadline: string;
  status: "모집중" | "상시" | "예정";
  tags: string[];
  summary: string;
  audience: string;
  benefits: string[];
  documents: string[];
  apply: string;
  officialUrl: string;
  matchReasons: string[];
};

export const policies: Policy[] = [
  {
    slug: "youth-rent-support",
    title: "청년 월세 한시 특별지원",
    category: "청년·주거",
    agency: "국토교통부·지자체",
    region: "전국",
    amount: "월 최대 20만원",
    deadline: "지자체별 접수",
    status: "모집중",
    tags: ["청년", "주거", "월세", "온라인 신청"],
    summary: "독립 거주 청년의 월세 부담을 줄이기 위한 대표 주거 지원 정책입니다.",
    audience: "연령, 소득, 거주 형태, 임차료 조건을 함께 확인해야 합니다.",
    benefits: ["월세 일부 지원", "온라인 신청 가능 여부 확인", "지자체별 세부 기준 안내"],
    documents: ["임대차계약서", "월세 이체 증빙", "가족관계 관련 서류", "소득·재산 확인 자료"],
    apply: "복지로 또는 주소지 관할 주민센터에서 신청 가능 여부를 확인하세요.",
    officialUrl: "https://www.bokjiro.go.kr",
    matchReasons: ["청년층 검색 의도가 높음", "주거 카테고리 대표 정책", "상세 조건 비교 수요가 큼"]
  },
  {
    slug: "small-business-policy-fund",
    title: "소상공인 정책자금",
    category: "소상공인·창업",
    agency: "소상공인시장진흥공단",
    region: "전국",
    amount: "자금 유형별 상이",
    deadline: "예산 소진 시까지",
    status: "모집중",
    tags: ["소상공인", "대출", "창업", "운영자금"],
    summary: "사업 운영, 창업 초기, 재도전 등 상황별 자금 수요를 확인하는 정책자금입니다.",
    audience: "사업자 등록 여부, 업종, 신용도, 자금 목적에 따라 대상이 달라질 수 있습니다.",
    benefits: ["유형별 정책자금 안내", "신청 가능 시기 확인", "공식 접수처 연결"],
    documents: ["사업자등록증", "매출 증빙", "납세 관련 서류", "자금 사용 계획"],
    apply: "소상공인 정책자금 공식 사이트에서 공고와 접수 상태를 확인하세요.",
    officialUrl: "https://ols.semas.or.kr",
    matchReasons: ["수익형 키워드 확장성 높음", "마감·예산 소진 UX가 중요", "비교형 콘텐츠에 적합"]
  },
  {
    slug: "job-seeker-allowance",
    title: "국민취업지원제도",
    category: "고용·취업",
    agency: "고용노동부",
    region: "전국",
    amount: "유형별 수당·서비스",
    deadline: "상시",
    status: "상시",
    tags: ["취업", "구직", "청년", "중장년"],
    summary: "취업 취약계층과 구직자에게 취업지원서비스와 수당을 제공하는 제도입니다.",
    audience: "연령, 소득, 취업 경험, 가구 상황 기준을 함께 확인해야 합니다.",
    benefits: ["취업 상담", "구직촉진수당", "직업훈련 연계", "사후관리"],
    documents: ["신분 확인 서류", "가구원·소득 관련 자료", "구직활동 증빙"],
    apply: "국민취업지원제도 공식 홈페이지 또는 고용센터에서 확인하세요.",
    officialUrl: "https://www.kua.go.kr",
    matchReasons: ["상시 유입 가능한 핵심 정책", "연령대별 랜딩 확장 가능", "공식 handoff 필요성 높음"]
  },
  {
    slug: "energy-voucher",
    title: "에너지바우처",
    category: "복지·생활",
    agency: "산업통상자원부",
    region: "전국",
    amount: "세대원 수·계절별 차등",
    deadline: "매년 공고 확인",
    status: "예정",
    tags: ["저소득", "생활비", "바우처", "취약계층"],
    summary: "에너지 취약계층의 냉난방 비용 부담을 낮추는 생활 밀착형 지원입니다.",
    audience: "소득 기준과 세대원 특성 기준을 동시에 확인해야 합니다.",
    benefits: ["전기·도시가스 등 비용 지원", "계절별 사용 안내", "오프라인 신청 안내"],
    documents: ["신분증", "대리 신청 위임장", "요금 고지서", "수급 자격 확인 자료"],
    apply: "복지로 또는 행정복지센터에서 신청 기간과 대상 여부를 확인하세요.",
    officialUrl: "https://www.bokjiro.go.kr",
    matchReasons: ["계절성 SEO에 강함", "마감 알림 전환에 적합", "생활비 키워드 수요가 큼"]
  },
  {
    slug: "startup-package",
    title: "창업지원 패키지",
    category: "창업·사업화",
    agency: "중소벤처기업부",
    region: "전국·권역별",
    amount: "사업별 상이",
    deadline: "공고별 상이",
    status: "모집중",
    tags: ["창업", "사업화", "청년창업", "예비창업"],
    summary: "예비창업자와 초기기업을 위한 사업화 자금, 멘토링, 교육 연계 지원입니다.",
    audience: "창업 단계, 업력, 대표자 조건, 사업 분야를 기준으로 확인해야 합니다.",
    benefits: ["사업화 자금", "창업교육", "멘토링", "투자·판로 연계"],
    documents: ["사업계획서", "대표자 신분 서류", "법인·사업자 관련 서류", "가점 증빙"],
    apply: "K-Startup 공고를 통해 최신 모집 상태와 세부 조건을 확인하세요.",
    officialUrl: "https://www.k-startup.go.kr",
    matchReasons: ["고의도 검색어 확보 가능", "서류 가이드 콘텐츠와 연결 쉬움", "사업자 대상 광고 단가 기대"]
  },
  {
    slug: "local-parenting-benefit",
    title: "지자체 출산·육아 지원금",
    category: "육아·가족",
    agency: "각 지방자치단체",
    region: "지역별",
    amount: "지자체별 상이",
    deadline: "상시 또는 출생 후 기한",
    status: "상시",
    tags: ["출산", "육아", "가족", "지역"],
    summary: "거주 지역별로 달라지는 출산축하금, 육아수당, 돌봄 지원 정보를 비교합니다.",
    audience: "주민등록상 거주지, 출생일, 신청 기한, 보호자 요건을 확인해야 합니다.",
    benefits: ["지역별 지원금 비교", "신청 기한 확인", "방문·온라인 신청처 안내"],
    documents: ["출생증명 관련 서류", "주민등록등본", "통장 사본", "보호자 신분증"],
    apply: "주소지 관할 지자체 또는 정부24에서 공식 안내를 확인하세요.",
    officialUrl: "https://www.gov.kr",
    matchReasons: ["지역 SEO 확장성 높음", "가족 생애주기 콘텐츠에 적합", "반복 방문 수요가 있음"]
  }
];

export const categories = ["청년·주거", "소상공인·창업", "고용·취업", "복지·생활", "창업·사업화", "육아·가족"];
