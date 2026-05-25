export type PolicyStatus = "모집중" | "상시" | "예정" | "마감임박";

export type Policy = {
  slug: string;
  title: string;
  category: string;
  source: string;
  agency: string;
  region: string;
  amount: string;
  deadline: string;
  dday: string;
  status: PolicyStatus;
  lifeStage: string;
  targetGroup: string;
  income: string;
  applyOnline: boolean;
  tags: string[];
  summary: string;
  audience: string;
  benefits: string[];
  documents: string[];
  apply: string;
  officialUrl: string;
  officialSourceUrl: string;
  contact: string;
  views: number;
  updatedAt: string;
  matchReasons: string[];
  faq: { q: string; a: string }[];
};

export const policies: Policy[] = [
  {
    slug: "youth-rent-support",
    title: "청년 월세 한시 특별지원",
    category: "청년·주거",
    source: "복지로",
    agency: "국토교통부·지자체",
    region: "전국",
    amount: "월 최대 20만원",
    deadline: "지자체별 접수",
    dday: "D-24",
    status: "모집중",
    lifeStage: "청년",
    targetGroup: "무주택 청년, 1인가구, 저소득 청년",
    income: "중위소득 등 공고 기준 확인",
    applyOnline: true,
    tags: ["청년", "월세", "주거", "1인가구", "온라인신청"],
    summary: "월세 부담이 큰 청년에게 일정 기간 월세 일부를 지원하는 대표 주거 지원 정책입니다.",
    audience: "나이, 주거 형태, 소득·재산 기준, 임대차 계약 여부를 공식 공고에서 함께 확인해야 합니다.",
    benefits: ["월세 일부 지원", "온라인 신청 가능 여부 확인", "주소지 기준 지자체 안내", "유사 주거정책 비교"],
    documents: ["임대차계약서", "월세 이체 증빙", "가족관계 관련 서류", "소득·재산 확인 자료"],
    apply: "복지로 또는 주소지 관할 주민센터에서 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.bokjiro.go.kr",
    contact: "주소지 관할 주민센터 또는 복지로 상담센터",
    views: 3217,
    updatedAt: "2026.05.25",
    matchReasons: ["청년·주거 키워드와 직접 일치", "온라인 신청 가능성이 높음", "월 단위 현금성 지원이라 전환 의도가 높음"],
    faq: [
      { q: "월세 계약자가 본인이어야 하나요?", a: "대부분 본인 명의 계약과 실제 거주 여부를 확인합니다. 예외는 공식 공고에서 확인해야 합니다." },
      { q: "이미 다른 주거 지원을 받으면 신청할 수 있나요?", a: "중복 지원 제한이 있을 수 있으므로 기존 수급 내역을 확인해야 합니다." }
    ]
  },
  {
    slug: "small-business-policy-fund",
    title: "소상공인 정책자금",
    category: "소상공인·창업",
    source: "소상공인 정책자금",
    agency: "소상공인시장진흥공단",
    region: "전국",
    amount: "자금 유형별 상이",
    deadline: "예산 소진 시까지",
    dday: "상시",
    status: "모집중",
    lifeStage: "사업자",
    targetGroup: "소상공인, 예비창업자, 영세사업자",
    income: "매출·업종·신용 조건별 상이",
    applyOnline: true,
    tags: ["소상공인", "대출", "운영자금", "창업", "사업자"],
    summary: "사업 운영, 창업 초기, 재도전 등 상황별로 정책자금 신청 가능성을 확인하는 정책 금융 정보입니다.",
    audience: "사업자등록 여부, 업종, 신용도, 자금 목적에 따라 대상과 절차가 달라집니다.",
    benefits: ["유형별 정책자금 안내", "신청 가능 시기 확인", "공식 접수처 연결", "필요 서류 체크"],
    documents: ["사업자등록증", "매출 증빙", "납세 관련 서류", "자금 사용 계획"],
    apply: "소상공인 정책자금 공식 사이트에서 공고와 접수 상태를 확인합니다.",
    officialUrl: "https://ols.semas.or.kr",
    officialSourceUrl: "https://www.semas.or.kr",
    contact: "소상공인시장진흥공단 또는 지역 센터",
    views: 2874,
    updatedAt: "2026.05.24",
    matchReasons: ["사업자 여부만으로 1차 분류 가능", "마감·예산 소진 정보가 중요", "서류 준비 가이드와 연결성이 높음"],
    faq: [
      { q: "사업자등록 전에도 볼 수 있나요?", a: "예비창업자 대상 사업도 있으므로 창업 단계 필터로 확인하는 것이 좋습니다." },
      { q: "신청은 GovFind에서 하나요?", a: "아니요. GovFind는 조건 정리와 공식 접수처 연결만 제공합니다." }
    ]
  },
  {
    slug: "job-seeker-allowance",
    title: "국민취업지원제도",
    category: "고용·취업",
    source: "고용24",
    agency: "고용노동부",
    region: "전국",
    amount: "유형별 수당·서비스",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "청년·중장년",
    targetGroup: "구직자, 취업 취약계층",
    income: "가구소득·재산 기준 확인",
    applyOnline: true,
    tags: ["취업", "구직", "청년", "중장년", "상담"],
    summary: "취업 취약계층과 구직자에게 취업지원서비스와 수당을 제공하는 제도입니다.",
    audience: "나이, 소득, 취업 경험, 가구 상황 기준을 함께 확인해야 합니다.",
    benefits: ["취업 상담", "구직촉진수당", "직업훈련 연계", "사후관리"],
    documents: ["신분 확인 서류", "가구원·소득 관련 자료", "구직활동 증빙"],
    apply: "고용24 또는 고용센터에서 신청 유형과 대상 여부를 확인합니다.",
    officialUrl: "https://www.work24.go.kr",
    officialSourceUrl: "https://www.kua.go.kr",
    contact: "고용노동부 고객상담센터 또는 관할 고용센터",
    views: 39176,
    updatedAt: "2026.05.23",
    matchReasons: ["상시 유입 가능한 대표 고용정책", "연령·소득·상태 매칭에 적합", "공식 신청처 handoff 필요성이 높음"],
    faq: [
      { q: "실업급여와 같은 제도인가요?", a: "다릅니다. 취업지원서비스와 구직촉진수당 중심의 별도 제도입니다." },
      { q: "재직 중이어도 가능한가요?", a: "유형별 요건이 다르므로 고용 상태와 소득 조건을 공식 페이지에서 확인해야 합니다." }
    ]
  },
  {
    slug: "energy-voucher",
    title: "에너지바우처",
    category: "복지·생활",
    source: "복지로",
    agency: "산업통상자원부",
    region: "전국",
    amount: "가구원·계절별 차등",
    deadline: "매년 공고 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "취약계층",
    targetGroup: "에너지 취약계층, 저소득 가구",
    income: "수급 자격 및 세대원 특성 기준",
    applyOnline: true,
    tags: ["저소득", "생활비", "바우처", "취약계층"],
    summary: "에너지 취약계층의 냉난방 비용 부담을 낮추기 위한 생활 바우처형 지원입니다.",
    audience: "소득 기준과 세대원 특성 기준을 동시에 확인해야 합니다.",
    benefits: ["전기·가스·난방 비용 지원", "계절별 사용 안내", "온라인·방문 신청 안내"],
    documents: ["신분증", "대리 신청 위임장", "요금 고지서", "수급 자격 확인 자료"],
    apply: "복지로 또는 행정복지센터에서 신청 기간과 대상 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.energyv.or.kr",
    contact: "행정복지센터 또는 에너지바우처 상담센터",
    views: 11820,
    updatedAt: "2026.05.22",
    matchReasons: ["생활비 절감 의도가 명확", "계절성 SEO 수요가 큼", "마감 알림 전환에 적합"],
    faq: [
      { q: "매년 자동으로 받을 수 있나요?", a: "대상·신청 방식은 연도별 공고에 따라 달라질 수 있습니다." },
      { q: "온라인 신청이 항상 가능한가요?", a: "대상과 시기에 따라 다르므로 복지로 공지에서 확인해야 합니다." }
    ]
  },
  {
    slug: "startup-package",
    title: "창업지원 패키지",
    category: "창업·사업화",
    source: "K-Startup",
    agency: "중소벤처기업부",
    region: "전국·권역별",
    amount: "사업별 상이",
    deadline: "공고별 상이",
    dday: "D-12",
    status: "마감임박",
    lifeStage: "예비창업·초기창업",
    targetGroup: "예비창업자, 초기기업, 청년창업자",
    income: "소득보다 창업 단계·업력 중심",
    applyOnline: true,
    tags: ["창업", "사업화", "예비창업", "초기창업", "멘토링"],
    summary: "예비창업자와 초기기업을 위한 사업화 자금, 멘토링, 교육 연계 지원입니다.",
    audience: "창업 단계, 업력, 대표자 조건, 사업 분야를 기준으로 확인해야 합니다.",
    benefits: ["사업화 자금", "창업교육", "멘토링", "투자·판로 연계"],
    documents: ["사업계획서", "대표자 신분 서류", "법인·사업자 관련 서류", "가점 증빙"],
    apply: "K-Startup 공고를 통해 최신 모집 상태와 세부 조건을 확인합니다.",
    officialUrl: "https://www.k-startup.go.kr",
    officialSourceUrl: "https://www.k-startup.go.kr",
    contact: "K-Startup 공고별 담당 기관",
    views: 18240,
    updatedAt: "2026.05.25",
    matchReasons: ["고의도 검색어와 잘 맞음", "마감 D-day 노출 효과가 큼", "사업계획서 가이드 콘텐츠로 확장 가능"],
    faq: [
      { q: "법인이 없어도 신청할 수 있나요?", a: "예비창업자 대상 사업은 가능할 수 있습니다. 공고별 요건을 확인해야 합니다." },
      { q: "지원금은 현금으로 바로 지급되나요?", a: "사업별로 사용 계획, 정산, 협약 조건이 다릅니다." }
    ]
  },
  {
    slug: "local-parenting-benefit",
    title: "지자체 출산·육아 지원금",
    category: "육아·가족",
    source: "정부24·지자체",
    agency: "각 지방자치단체",
    region: "지역별",
    amount: "지자체별 상이",
    deadline: "출생 후 기한 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "임신·출산·육아",
    targetGroup: "출산가구, 영유아 가구, 보호자",
    income: "지역별 상이",
    applyOnline: true,
    tags: ["출산", "육아", "가족", "지역", "정부24"],
    summary: "거주 지역별로 달라지는 출산축하금, 육아수당, 돌봄 지원 정보를 비교합니다.",
    audience: "주민등록상 거주지, 출생일, 신청 기한, 보호자 요건을 확인해야 합니다.",
    benefits: ["지역별 지원금 비교", "신청 기한 확인", "방문·온라인 신청처 안내"],
    documents: ["출생증명 관련 서류", "주민등록등본", "통장 사본", "보호자 신분증"],
    apply: "정부24 또는 주소지 지자체 공식 안내에서 신청합니다.",
    officialUrl: "https://www.gov.kr",
    officialSourceUrl: "https://www.gov.kr",
    contact: "주소지 관할 지자체 또는 정부24",
    views: 9770,
    updatedAt: "2026.05.21",
    matchReasons: ["지역 필터와 강하게 결합", "생애주기 기반 추천에 적합", "재방문·알림 수요가 높음"],
    faq: [
      { q: "이사하면 어느 지역 기준인가요?", a: "지원금마다 거주 기간과 주민등록 기준일이 다릅니다." },
      { q: "정부24에서 바로 신청 가능한가요?", a: "일부는 정부24, 일부는 지자체 자체 접수로 운영됩니다." }
    ]
  }
];

export const categories = ["청년·주거", "소상공인·창업", "고용·취업", "복지·생활", "창업·사업화", "육아·가족"];
export const regions = ["전국", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "지역별"];
export const lifeStages = ["청년", "사업자", "청년·중장년", "취약계층", "예비창업·초기창업", "임신·출산·육아"];
export const sources = ["복지로", "정부24·지자체", "고용24", "K-Startup", "소상공인 정책자금"];
export const popularKeywords = ["근로장려금", "청년월세", "국민취업지원제도", "소상공인 정책자금", "출산지원금", "에너지바우처", "창업지원"];
