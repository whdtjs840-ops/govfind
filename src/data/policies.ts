import { publicServiceApiPolicies } from "./public-service-api.generated";
import { kstartupApiPolicies } from "./kstartup-api.generated";
import { welfareApiPolicies } from "./welfare-api.generated";
import { localWelfareApiPolicies } from "./local-welfare-api.generated";
import { youthApiPolicies } from "./youth-api.generated";

export type PolicyStatus = "모집중" | "상시" | "예정" | "마감임박" | "마감" | "확인필요";

export type PolicyConfidence = "known" | "unknown";

export type PolicyPublishPolicy = {
  canPublish: boolean;
  includeInSearch: boolean;
  includeInAllList: boolean;
  includeInCategoryPage: boolean;
  includeInRegionPage: boolean;
  includeInStatusFilters: boolean;
  includeInDeadlineSort: boolean;
  showDday: boolean;
  requiresOfficialConfirmation: boolean;
};

export type Policy = {
  slug: string;
  title: string;
  category: string;
  source: string;
  agency: string;
  region: string | null;
  amount: string;
  deadline: string;
  dday: string;
  status: PolicyStatus;
  startDate?: string | null;
  endDate?: string | null;
  statusLabel?: string;
  statusConfidence?: PolicyConfidence;
  dateConfidence?: PolicyConfidence;
  applicationPeriodLabel?: string;
  regionLabel?: string;
  requiresOfficialConfirmation?: boolean;
  warnings?: string[];
  publishPolicy?: PolicyPublishPolicy;
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
  apiDetails?: {
    target?: string;
    criteria?: string;
    benefit?: string;
    application?: string;
    documents?: string;
    contact?: string;
  };
};

export const policies: Policy[] = [
  {
    slug: "youth-rent-support",
    title: "청년 월세 한시 특별지원",
    category: "주거",
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
    category: "소상공인",
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
    category: "고용",
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
    category: "복지",
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
    category: "창업",
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
    category: "복지",
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
    matchReasons: ["지역 필터와 강하게 결합", "생애주기 기반 추천에 적합", "공식 신청처 확인 수요가 높음"],
    faq: [
      { q: "이사하면 어느 지역 기준인가요?", a: "지원금마다 거주 기간과 주민등록 기준일이 다릅니다." },
      { q: "정부24에서 바로 신청 가능한가요?", a: "일부는 정부24, 일부는 지자체 자체 접수로 운영됩니다." }
    ]
  },
  {
    slug: "earned-income-tax-credit",
    title: "근로장려금",
    category: "복지",
    source: "국세청",
    agency: "국세청",
    region: "전국",
    amount: "가구 유형별 차등",
    deadline: "정기·반기 신청 기간 확인",
    dday: "D-6",
    status: "마감임박",
    lifeStage: "근로자·사업자",
    targetGroup: "소득과 재산 기준을 충족하는 근로·사업·종교인 가구",
    income: "가구 유형별 총소득·재산 기준 확인",
    applyOnline: true,
    tags: ["근로장려금", "국세청", "환급", "저소득", "정기신청"],
    summary: "일은 하지만 소득이 낮은 가구의 근로를 장려하기 위해 지급되는 대표적인 세제 지원 제도입니다.",
    audience: "단독, 홑벌이, 맞벌이 가구 유형에 따라 소득 기준과 지급 가능 금액이 달라집니다.",
    benefits: ["가구 유형별 장려금 지급", "홈택스 온라인 신청", "정기·반기 신청 제도", "자녀장려금과 함께 확인 가능"],
    documents: ["소득 자료", "가구원 정보", "재산 관련 자료", "계좌 정보"],
    apply: "국세청 홈택스 또는 손택스에서 신청 대상 여부와 신청 기간을 확인합니다.",
    officialUrl: "https://www.hometax.go.kr",
    officialSourceUrl: "https://www.nts.go.kr",
    contact: "국세상담센터 126",
    views: 46210,
    updatedAt: "2026.05.25",
    matchReasons: ["검색 수요가 매우 높은 대표 현금성 지원", "신청 기간과 지급일 정보 수요가 큼", "공식 홈택스 신청으로 연결 필요"],
    faq: [
      { q: "근로장려금은 매년 자동 지급되나요?", a: "자동 지급이 아니라 신청 대상 안내와 신청 기간을 확인해야 합니다." },
      { q: "자녀장려금과 같이 신청할 수 있나요?", a: "요건을 충족하면 함께 확인할 수 있으나 세부 기준은 국세청 안내를 기준으로 봐야 합니다." }
    ]
  },
  {
    slug: "child-tax-credit",
    title: "자녀장려금",
    category: "복지",
    source: "국세청",
    agency: "국세청",
    region: "전국",
    amount: "자녀 수와 소득 기준별 차등",
    deadline: "정기 신청 기간 확인",
    dday: "D-6",
    status: "마감임박",
    lifeStage: "육아·가족",
    targetGroup: "부양 자녀가 있고 소득·재산 기준을 충족하는 가구",
    income: "가구 소득과 재산 기준 확인",
    applyOnline: true,
    tags: ["자녀장려금", "육아", "국세청", "저소득", "가족"],
    summary: "자녀 양육 부담을 줄이기 위해 일정 요건을 충족하는 가구에 지급되는 세제 지원입니다.",
    audience: "부양 자녀 요건, 가구 소득, 재산 기준을 함께 확인해야 합니다.",
    benefits: ["자녀 수 기준 지원", "홈택스 온라인 신청", "근로장려금과 동시 확인", "가구 부담 완화"],
    documents: ["가구원 정보", "소득 자료", "재산 자료", "계좌 정보"],
    apply: "국세청 홈택스에서 신청 안내와 대상 여부를 확인합니다.",
    officialUrl: "https://www.hometax.go.kr",
    officialSourceUrl: "https://www.nts.go.kr",
    contact: "국세상담센터 126",
    views: 21480,
    updatedAt: "2026.05.25",
    matchReasons: ["가족·육아 검색 의도와 직접 연결", "근로장려금과 함께 비교 수요가 큼", "신청 기간 확인이 중요"],
    faq: [
      { q: "자녀 나이 기준이 있나요?", a: "부양 자녀 요건은 연도별 기준을 국세청 안내에서 확인해야 합니다." },
      { q: "소득이 있으면 무조건 제외되나요?", a: "아니요. 일정 소득 기준 안에서 지급 여부가 결정됩니다." }
    ]
  },
  {
    slug: "national-tomorrow-learning-card",
    title: "국민내일배움카드",
    category: "교육",
    source: "고용24",
    agency: "고용노동부",
    region: "전국",
    amount: "훈련비 일부 지원",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "청년·중장년",
    targetGroup: "직업훈련이 필요한 구직자, 재직자, 자영업자 등",
    income: "대상 유형별 제한 확인",
    applyOnline: true,
    tags: ["내일배움카드", "직업훈련", "교육", "취업", "고용24"],
    summary: "직업능력 개발을 위해 훈련비 일부를 지원받을 수 있는 대표 직업훈련 지원 제도입니다.",
    audience: "직업상태와 훈련 과정에 따라 지원 가능 여부와 자기부담률이 달라집니다.",
    benefits: ["훈련비 지원", "온라인 카드 신청", "직업훈련 과정 검색", "취업 역량 강화"],
    documents: ["신분 확인 자료", "대상 유형 확인 자료", "훈련 과정 정보"],
    apply: "고용24에서 카드 발급과 훈련 과정 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.work24.go.kr",
    officialSourceUrl: "https://www.hrd.go.kr",
    contact: "고용노동부 고객상담센터",
    views: 25560,
    updatedAt: "2026.05.24",
    matchReasons: ["교육·취업 수요가 모두 큼", "상시 검색 유입에 적합", "훈련 과정과 공식 신청 연결 필요"],
    faq: [
      { q: "재직자도 신청할 수 있나요?", a: "가능한 경우가 많지만 대상 유형별 제한을 확인해야 합니다." },
      { q: "모든 교육이 무료인가요?", a: "과정별 자기부담률이 다르므로 과정 상세를 확인해야 합니다." }
    ]
  },
  {
    slug: "housing-benefit",
    title: "주거급여",
    category: "주거",
    source: "복지로",
    agency: "국토교통부",
    region: "전국",
    amount: "임차·수선 유형별 차등",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "취약계층",
    targetGroup: "소득인정액 기준을 충족하는 주거 취약 가구",
    income: "기준 중위소득 등 공식 기준 확인",
    applyOnline: true,
    tags: ["주거급여", "임차급여", "수선유지급여", "저소득", "복지로"],
    summary: "저소득 가구의 임차료나 주택 수선을 지원하는 기초생활보장 주거 지원 제도입니다.",
    audience: "소득인정액, 임차 여부, 주택 상태, 가구원 수에 따라 지원 방식이 달라집니다.",
    benefits: ["임차료 지원", "자가 가구 수선 지원", "온라인·방문 신청", "주거 안정"],
    documents: ["임대차계약서", "소득·재산 자료", "가구원 정보", "통장 사본"],
    apply: "복지로 또는 주민센터에서 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.bokjiro.go.kr",
    contact: "주소지 행정복지센터",
    views: 16840,
    updatedAt: "2026.05.23",
    matchReasons: ["주거 카테고리 대표 정책", "상시 신청 정보 수요가 큼", "필요 서류 확인이 중요"],
    faq: [
      { q: "월세 지원과 주거급여는 같은 제도인가요?", a: "다른 제도입니다. 주거급여는 기초생활보장 제도 안의 주거 지원입니다." },
      { q: "자가 주택도 가능한가요?", a: "자가 가구는 수선유지급여 형태로 지원될 수 있습니다." }
    ]
  },
  {
    slug: "emergency-welfare-support",
    title: "긴급복지지원",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "생계·의료·주거 등 항목별 차등",
    deadline: "위기 상황 발생 시",
    dday: "상시",
    status: "상시",
    lifeStage: "취약계층",
    targetGroup: "갑작스러운 위기 사유로 생계 유지가 곤란한 가구",
    income: "소득·재산·금융재산 기준 확인",
    applyOnline: false,
    tags: ["긴급복지", "생계지원", "의료지원", "주거지원", "위기"],
    summary: "실직, 질병, 사고 등 갑작스러운 위기 상황에서 생계·의료·주거 등을 지원하는 제도입니다.",
    audience: "위기 사유, 소득, 재산 기준을 함께 확인해야 하며 현장 상담이 중요합니다.",
    benefits: ["생계비 지원", "의료비 지원", "주거 지원", "사회복지 상담 연계"],
    documents: ["위기 사유 증빙", "소득·재산 자료", "진단서 또는 관련 증빙", "신분증"],
    apply: "주소지 관할 시군구청, 읍면동 주민센터, 보건복지상담센터를 통해 상담합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "보건복지상담센터 129",
    views: 13730,
    updatedAt: "2026.05.22",
    matchReasons: ["위기 상황 검색 수요가 뚜렷함", "상담·공식 기관 연결이 중요", "복지 카테고리 핵심 정책"],
    faq: [
      { q: "온라인 신청만으로 끝나나요?", a: "위기 상황 확인과 상담이 필요할 수 있어 관할 기관 확인이 중요합니다." },
      { q: "실직하면 무조건 받을 수 있나요?", a: "위기 사유와 소득·재산 기준을 함께 충족해야 합니다." }
    ]
  },
  {
    slug: "education-benefit",
    title: "교육급여",
    category: "교육",
    source: "복지로",
    agency: "교육부",
    region: "전국",
    amount: "학생 급별 차등",
    deadline: "연중 신청 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "아동·청소년",
    targetGroup: "소득 기준을 충족하는 초·중·고 학생 가구",
    income: "기준 중위소득 등 공식 기준 확인",
    applyOnline: true,
    tags: ["교육급여", "초등학생", "중학생", "고등학생", "복지로"],
    summary: "저소득 가구 학생의 교육활동을 지원하기 위한 교육비 성격의 복지 제도입니다.",
    audience: "학생의 학교급, 가구 소득 기준, 다른 교육비 지원과의 관계를 확인해야 합니다.",
    benefits: ["교육활동지원비", "온라인 신청", "저소득 학생 지원", "교육비 부담 완화"],
    documents: ["가구원 정보", "소득·재산 자료", "학생 정보", "통장 사본"],
    apply: "복지로 또는 주민센터에서 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.moe.go.kr",
    contact: "교육비 원클릭 신청 시스템 또는 주민센터",
    views: 9340,
    updatedAt: "2026.05.22",
    matchReasons: ["교육 카테고리 대표 제도", "가구 소득 기준 확인 필요", "학생 가구 검색 수요가 큼"],
    faq: [
      { q: "교육급여와 교육비 지원은 같은가요?", a: "비슷해 보이지만 세부 지원 항목과 기준이 다를 수 있습니다." },
      { q: "학기 중에도 신청할 수 있나요?", a: "상시 신청 가능 여부와 적용 시점은 공식 안내를 확인해야 합니다." }
    ]
  },
  {
    slug: "youth-leap-account",
    title: "청년도약계좌",
    category: "청년",
    source: "서민금융진흥원",
    agency: "금융위원회·서민금융진흥원",
    region: "전국",
    amount: "정부기여금 및 비과세 혜택",
    deadline: "월별 신청 기간 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "청년",
    targetGroup: "나이와 개인·가구 소득 기준을 충족하는 청년",
    income: "개인소득과 가구소득 기준 확인",
    applyOnline: true,
    tags: ["청년도약계좌", "청년", "자산형성", "금융", "비과세"],
    summary: "청년의 중장기 자산 형성을 돕기 위해 정부기여금과 비과세 혜택을 제공하는 금융 지원 제도입니다.",
    audience: "가입 연령, 개인소득, 가구소득, 금융상품 조건을 함께 확인해야 합니다.",
    benefits: ["정부기여금", "비과세 혜택", "청년 자산형성", "은행 앱 신청"],
    documents: ["본인 인증", "소득 확인 자료", "가구소득 확인 자료"],
    apply: "취급 은행 앱과 서민금융진흥원 안내를 통해 신청 기간과 대상 여부를 확인합니다.",
    officialUrl: "https://ylaccount.kinfa.or.kr",
    officialSourceUrl: "https://www.kinfa.or.kr",
    contact: "서민금융콜센터 1397",
    views: 30250,
    updatedAt: "2026.05.24",
    matchReasons: ["청년 자산형성 검색 수요가 큼", "월별 신청 기간 확인 필요", "공식 안내와 은행 신청 연결이 중요"],
    faq: [
      { q: "소득이 없으면 가입할 수 있나요?", a: "소득 요건은 공식 안내에서 확인해야 하며 연도별 기준이 달라질 수 있습니다." },
      { q: "모든 은행에서 가능한가요?", a: "취급 은행과 신청 기간은 공식 안내를 확인해야 합니다." }
    ]
  },
  {
    slug: "pregnancy-birth-voucher",
    title: "임신·출산 진료비 지원",
    category: "보건의료",
    source: "국민건강보험",
    agency: "국민건강보험공단",
    region: "전국",
    amount: "임신·출산 관련 진료비 지원",
    deadline: "대상 확인 후 신청",
    dday: "상시",
    status: "상시",
    lifeStage: "임신·출산·육아",
    targetGroup: "임신·출산이 확인된 건강보험 가입자 또는 피부양자",
    income: "소득 기준보다 임신·출산 확인 중심",
    applyOnline: true,
    tags: ["임신", "출산", "진료비", "국민행복카드", "보건의료"],
    summary: "임신과 출산 과정에서 발생하는 진료비 부담을 줄이기 위한 바우처형 의료 지원입니다.",
    audience: "임신 확인, 카드 발급, 사용 기간, 사용처를 함께 확인해야 합니다.",
    benefits: ["진료비 바우처", "국민행복카드 사용", "산전 진료 부담 완화", "온라인 신청 가능"],
    documents: ["임신확인서", "신분 확인 자료", "카드 신청 정보"],
    apply: "국민건강보험공단 또는 카드사를 통해 신청 방법과 사용 기간을 확인합니다.",
    officialUrl: "https://www.nhis.or.kr",
    officialSourceUrl: "https://www.nhis.or.kr",
    contact: "국민건강보험공단 고객센터 1577-1000",
    views: 12490,
    updatedAt: "2026.05.23",
    matchReasons: ["보건의료 카테고리 핵심 정책", "임신·출산 검색 유입에 적합", "사용 기간과 카드 발급 안내가 중요"],
    faq: [
      { q: "국민행복카드가 꼭 필요한가요?", a: "지원금 사용 방식은 카드 기반인 경우가 많아 공식 안내를 확인해야 합니다." },
      { q: "출산 후에도 사용할 수 있나요?", a: "사용 기간과 범위는 공식 안내 기준을 확인해야 합니다." }
    ]
  },
  {
    slug: "health-insurance-refund",
    title: "건강보험 환급금 조회",
    category: "복지",
    source: "국민건강보험",
    agency: "국민건강보험공단",
    region: "전국",
    amount: "환급 대상과 납부 내역별 상이",
    deadline: "조회 후 신청 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "전 국민",
    targetGroup: "건강보험료 과오납 또는 본인부담금 환급 대상자",
    income: "소득 기준보다 납부·진료 내역 기준",
    applyOnline: true,
    tags: ["건강보험", "환급금", "조회", "국민건강보험", "본인부담금"],
    summary: "건강보험료 과오납이나 본인부담금 환급 가능 여부를 국민건강보험공단에서 확인하는 조회형 정보입니다.",
    audience: "환급 대상 여부는 납부 내역, 진료비 정산, 공단 안내 기준에 따라 달라집니다.",
    benefits: ["환급 가능 여부 조회", "본인부담금 환급 확인", "공식 공단 신청", "온라인 조회 가능"],
    documents: ["본인 인증 수단", "계좌 정보", "공단 안내에 따른 추가 서류"],
    apply: "국민건강보험공단 공식 사이트 또는 앱에서 환급금 조회와 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.nhis.or.kr",
    officialSourceUrl: "https://www.nhis.or.kr",
    contact: "국민건강보험공단 고객센터 1577-1000",
    views: 23840,
    updatedAt: "2026.05.25",
    matchReasons: ["환급금 조회 검색 의도와 직접 연결", "공식 공단 조회가 필요", "본인 인증 후 확인하는 정보"],
    faq: [
      { q: "GovFind에서 환급액을 알 수 있나요?", a: "아니요. 실제 환급 여부와 금액은 국민건강보험공단 공식 조회 화면에서 확인해야 합니다." },
      { q: "대리 신청이 가능한가요?", a: "대리 신청 가능 여부와 제출 서류는 공단 안내를 기준으로 확인해야 합니다." }
    ]
  },
  {
    slug: "young-farmer-support",
    title: "청년후계농 영농정착지원",
    category: "농림어업",
    source: "농림축산식품부",
    agency: "농림축산식품부",
    region: "전국·지자체",
    amount: "월별 정착지원금 등",
    deadline: "연도별 공고 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "청년·농업인",
    targetGroup: "영농 창업을 준비하거나 초기 영농 중인 청년 농업인",
    income: "영농 경력, 나이, 사업계획 등 공고 기준 확인",
    applyOnline: true,
    tags: ["청년농", "농업", "영농정착", "농림어업", "창업"],
    summary: "청년 농업인의 영농 초기 정착을 돕기 위한 농림어업 분야 대표 지원사업입니다.",
    audience: "나이, 영농 경력, 독립경영 예정 여부, 사업계획 기준을 확인해야 합니다.",
    benefits: ["영농정착지원금", "창업 자금 연계", "교육·컨설팅", "청년 농업인 육성"],
    documents: ["사업계획서", "농업 경영 관련 자료", "신분 확인 자료", "가점 증빙"],
    apply: "농림사업정보시스템 또는 지자체 공고를 통해 신청 기간과 세부 기준을 확인합니다.",
    officialUrl: "https://www.mafra.go.kr",
    officialSourceUrl: "https://www.mafra.go.kr",
    contact: "농림축산식품부 또는 관할 지자체",
    views: 7860,
    updatedAt: "2026.05.21",
    matchReasons: ["농림어업 카테고리 대표 청년 정책", "공고 시기 확인이 중요", "사업계획서 준비 수요가 큼"],
    faq: [
      { q: "농업 경험이 없어도 가능한가요?", a: "사업별로 독립경영 예정자 요건이 있을 수 있어 공고를 확인해야 합니다." },
      { q: "지자체마다 조건이 다른가요?", a: "전국 공통 기준과 지역별 절차가 함께 운영될 수 있습니다." }
    ]
  }
];

policies.push(
  {
    slug: "basic-pension",
    title: "기초연금",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "소득인정액 기준별 차등",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "어르신",
    targetGroup: "만 65세 이상 어르신 중 소득인정액 기준을 충족하는 가구",
    income: "선정기준액 및 소득인정액 확인",
    applyOnline: true,
    tags: ["기초연금", "어르신", "노인복지", "복지로", "연금"],
    summary: "노후 생활 안정을 위해 일정 기준을 충족하는 어르신에게 매월 지급되는 대표 복지 제도입니다.",
    audience: "나이, 소득인정액, 부부가구 여부, 국민연금 수급 여부 등을 함께 확인해야 합니다.",
    benefits: ["월 단위 연금 지급", "온라인·방문 신청", "노후 생활비 보완", "주민센터 상담 연계"],
    documents: ["신분증", "통장 사본", "소득·재산 확인 자료", "대리 신청 위임장"],
    apply: "복지로 또는 주소지 행정복지센터에서 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "보건복지상담센터 129 또는 국민연금공단",
    views: 22430,
    updatedAt: "2026.05.25",
    matchReasons: ["어르신 복지 대표 검색어", "상시 신청 정보 수요가 큼", "가구별 기준 확인이 중요"],
    faq: [
      { q: "만 65세가 되면 자동으로 지급되나요?", a: "자동 지급이 아니라 신청과 소득인정액 확인이 필요합니다." },
      { q: "국민연금을 받으면 제외되나요?", a: "수급 여부와 금액에 따라 달라질 수 있으므로 공식 기준을 확인해야 합니다." }
    ]
  },
  {
    slug: "basic-livelihood-benefit",
    title: "기초생활보장 생계급여",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "가구 소득인정액 기준별 차등",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "취약계층",
    targetGroup: "소득인정액이 생계급여 선정 기준 이하인 가구",
    income: "기준 중위소득 및 부양의무자 기준 확인",
    applyOnline: true,
    tags: ["생계급여", "기초생활보장", "저소득", "복지로", "주민센터"],
    summary: "최저생활 보장을 위해 소득이 낮은 가구에 생계비를 지원하는 기초 복지 제도입니다.",
    audience: "가구원 수, 소득인정액, 재산, 부양의무자 기준을 공식 안내로 확인해야 합니다.",
    benefits: ["생계비 지원", "주민센터 상담", "다른 급여 연계", "위기 가구 보호"],
    documents: ["사회보장급여 신청서", "소득·재산 자료", "가구원 정보", "금융정보 제공 동의서"],
    apply: "복지로 또는 주소지 행정복지센터에서 상담 후 신청합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "주소지 행정복지센터 또는 보건복지상담센터 129",
    views: 18370,
    updatedAt: "2026.05.25",
    matchReasons: ["복지 핵심 제도", "소득 기준 확인 수요가 큼", "주거·의료·교육급여와 내부 연결 가능"],
    faq: [
      { q: "신청하면 바로 받을 수 있나요?", a: "조사와 결정 절차가 필요하며 지급 시점은 지자체 기준을 확인해야 합니다." },
      { q: "재산이 있으면 무조건 제외되나요?", a: "재산은 소득인정액으로 환산되므로 구체 기준을 확인해야 합니다." }
    ]
  },
  {
    slug: "medical-benefit",
    title: "의료급여",
    category: "보건의료",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "의료비 본인부담 경감",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "취약계층",
    targetGroup: "의료급여 수급 자격을 충족하는 저소득 가구",
    income: "소득인정액 및 수급 자격 확인",
    applyOnline: true,
    tags: ["의료급여", "의료비", "저소득", "복지로", "보건의료"],
    summary: "의료비 부담을 낮추기 위해 수급 자격을 충족하는 가구에 의료 서비스를 지원하는 제도입니다.",
    audience: "수급 유형, 의료 이용 절차, 본인부담 기준을 함께 확인해야 합니다.",
    benefits: ["진료비 부담 경감", "의료 이용 지원", "복지 상담 연계", "수급 유형별 안내"],
    documents: ["신분증", "소득·재산 자료", "가구원 정보", "의료 관련 증빙"],
    apply: "복지로 또는 주소지 행정복지센터에서 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "보건복지상담센터 129",
    views: 11980,
    updatedAt: "2026.05.24",
    matchReasons: ["의료비 검색 의도가 명확", "복지·보건 카테고리 연결성 높음", "공식 기준 확인이 필수"],
    faq: [
      { q: "건강보험과 같은 제도인가요?", a: "다른 제도이며 수급 자격과 이용 절차가 별도로 운영됩니다." },
      { q: "모든 병원비가 무료인가요?", a: "급여 범위와 본인부담 기준이 있으므로 공식 안내를 확인해야 합니다." }
    ]
  },
  {
    slug: "parent-benefit",
    title: "부모급여",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "아동 연령별 월 지원",
    deadline: "출생 후 신청 권장",
    dday: "상시",
    status: "상시",
    lifeStage: "임신·출산·육아",
    targetGroup: "영아를 양육하는 보호자",
    income: "소득 기준보다 아동 연령과 보호자 요건 중심",
    applyOnline: true,
    tags: ["부모급여", "육아", "영아", "출산", "복지로"],
    summary: "영아기 돌봄 부담을 줄이기 위해 보호자에게 월 단위로 지급되는 육아 지원 제도입니다.",
    audience: "아동 연령, 보육서비스 이용 여부, 신청 시점에 따라 지급 방식이 달라질 수 있습니다.",
    benefits: ["월 단위 현금성 지원", "영아 돌봄 부담 완화", "온라인 신청", "출산 지원금과 함께 확인"],
    documents: ["보호자 신분증", "아동 정보", "계좌 정보", "가족관계 확인 자료"],
    apply: "복지로 또는 정부24에서 신청 가능 여부와 지급 기준을 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "보건복지상담센터 129",
    views: 20140,
    updatedAt: "2026.05.24",
    matchReasons: ["육아 검색 수요가 높음", "출산·보육 관련 내부 링크에 적합", "신청 시점 안내가 중요"],
    faq: [
      { q: "어린이집을 이용해도 받을 수 있나요?", a: "보육서비스 이용 여부에 따라 지급 방식이 달라질 수 있습니다." },
      { q: "출생신고와 같이 신청할 수 있나요?", a: "원스톱 출산서비스와 연계될 수 있으나 공식 신청 화면을 확인해야 합니다." }
    ]
  },
  {
    slug: "childcare-subsidy",
    title: "보육료 지원",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "연령·보육 유형별 차등",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "임신·출산·육아",
    targetGroup: "어린이집을 이용하는 영유아 가구",
    income: "보육 유형 및 아동 연령 기준 확인",
    applyOnline: true,
    tags: ["보육료", "어린이집", "육아", "복지로", "아이행복카드"],
    summary: "어린이집 이용 가구의 보육비 부담을 줄이기 위한 영유아 보육 지원입니다.",
    audience: "아동 연령, 기관 이용 여부, 카드 발급, 보육 자격 전환 시점을 확인해야 합니다.",
    benefits: ["보육료 지원", "어린이집 이용 부담 완화", "온라인 신청", "보육 자격 관리"],
    documents: ["아동 정보", "보호자 신분증", "카드 신청 정보", "가구 정보"],
    apply: "복지로에서 보육료 자격 신청과 변경 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "보건복지상담센터 129 또는 관할 주민센터",
    views: 15420,
    updatedAt: "2026.05.23",
    matchReasons: ["육아 가구 반복 검색 주제", "부모급여와 비교 수요 존재", "신청 전환 시점 안내가 필요"],
    faq: [
      { q: "가정양육수당과 동시에 받을 수 있나요?", a: "보육 유형에 따라 중복 여부가 달라질 수 있습니다." },
      { q: "어린이집 입소 전 신청해야 하나요?", a: "자격 전환 시점이 중요하므로 공식 안내와 기관 안내를 함께 확인해야 합니다." }
    ]
  },
  {
    slug: "culture-nuri-card",
    title: "문화누리카드",
    category: "복지",
    source: "문화누리",
    agency: "문화체육관광부",
    region: "전국",
    amount: "연간 지원금 공고 확인",
    deadline: "발급·사용 기간 확인",
    dday: "모집중",
    status: "모집중",
    lifeStage: "취약계층",
    targetGroup: "기초생활수급자와 차상위계층 등 문화 향유 지원 대상",
    income: "수급 자격 및 차상위 기준 확인",
    applyOnline: true,
    tags: ["문화누리카드", "문화", "여행", "체육", "바우처"],
    summary: "문화·여행·체육 활동 비용을 지원하는 카드형 바우처 제도입니다.",
    audience: "발급 대상, 카드 사용처, 사용 기간, 잔액 소멸 시점을 확인해야 합니다.",
    benefits: ["문화생활 비용 지원", "카드형 바우처", "온라인 발급 가능", "사용처 검색"],
    documents: ["신분증", "수급 자격 확인 자료", "대리 신청 위임장"],
    apply: "문화누리 공식 사이트 또는 주민센터에서 발급 가능 여부를 확인합니다.",
    officialUrl: "https://www.mnuri.kr",
    officialSourceUrl: "https://www.mnuri.kr",
    contact: "문화누리카드 고객지원센터",
    views: 17650,
    updatedAt: "2026.05.23",
    matchReasons: ["바우처형 지원 검색 수요", "사용처 콘텐츠 확장 가능", "발급·사용 마감 정보가 중요"],
    faq: [
      { q: "잔액은 다음 해로 이월되나요?", a: "사용 기간과 잔액 처리 기준은 연도별 안내를 확인해야 합니다." },
      { q: "온라인에서도 사용할 수 있나요?", a: "등록된 사용처와 결제 방식에 따라 다르므로 공식 사용처 검색이 필요합니다." }
    ]
  },
  {
    slug: "sports-voucher",
    title: "스포츠강좌이용권",
    category: "복지",
    source: "스포츠강좌이용권",
    agency: "문화체육관광부·국민체육진흥공단",
    region: "전국·지자체",
    amount: "월 지원 한도 공고 확인",
    deadline: "연도별 모집 기간 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "아동·청소년",
    targetGroup: "저소득층 유·청소년 등 스포츠 활동 지원 대상",
    income: "수급 자격 및 가구 기준 확인",
    applyOnline: true,
    tags: ["스포츠강좌이용권", "아동", "청소년", "체육", "바우처"],
    summary: "아동·청소년의 스포츠 강좌 수강료를 지원하는 체육 바우처 사업입니다.",
    audience: "나이, 수급 자격, 지역별 모집 기간, 이용 가능한 시설을 함께 확인해야 합니다.",
    benefits: ["스포츠 강좌 수강료 지원", "온라인 신청", "시설 검색", "아동·청소년 활동 지원"],
    documents: ["보호자 신분증", "수급 자격 확인 자료", "아동 정보", "가구 정보"],
    apply: "스포츠강좌이용권 공식 사이트에서 모집 기간과 신청 가능 여부를 확인합니다.",
    officialUrl: "https://svoucher.kspo.or.kr",
    officialSourceUrl: "https://svoucher.kspo.or.kr",
    contact: "국민체육진흥공단 또는 관할 지자체",
    views: 8420,
    updatedAt: "2026.05.22",
    matchReasons: ["아동·청소년 지원 콘텐츠 보강", "사용처·시설 검색 수요 존재", "지자체별 모집 기간 확인 필요"],
    faq: [
      { q: "모든 체육시설에서 사용할 수 있나요?", a: "등록된 시설과 강좌에서 사용 가능하므로 공식 사이트에서 확인해야 합니다." },
      { q: "매년 다시 신청해야 하나요?", a: "연도별 모집 기준에 따라 재신청이 필요할 수 있습니다." }
    ]
  },
  {
    slug: "disability-pension",
    title: "장애인연금",
    category: "복지",
    source: "복지로",
    agency: "보건복지부",
    region: "전국",
    amount: "급여 유형별 차등",
    deadline: "상시",
    dday: "상시",
    status: "상시",
    lifeStage: "취약계층",
    targetGroup: "중증장애인 중 소득인정액 기준을 충족하는 대상자",
    income: "소득인정액 및 장애 정도 기준 확인",
    applyOnline: true,
    tags: ["장애인연금", "장애인", "복지", "소득지원", "복지로"],
    summary: "중증장애인의 생활 안정과 복지 증진을 위해 월 단위로 지원되는 제도입니다.",
    audience: "장애 정도, 나이, 소득인정액, 기존 수급 여부를 함께 확인해야 합니다.",
    benefits: ["월 단위 급여", "생활 안정 지원", "온라인·방문 신청", "복지 상담 연계"],
    documents: ["신분증", "장애 관련 정보", "소득·재산 자료", "통장 사본"],
    apply: "복지로 또는 주소지 행정복지센터에서 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.mohw.go.kr",
    contact: "보건복지상담센터 129",
    views: 10570,
    updatedAt: "2026.05.22",
    matchReasons: ["복지 필수 정책", "대상 조건 확인 수요가 명확", "공식 상담 연결이 중요"],
    faq: [
      { q: "장애수당과 같은 제도인가요?", a: "지원 대상과 급여 체계가 다르므로 공식 안내에서 구분해 확인해야 합니다." },
      { q: "소득이 있으면 신청할 수 없나요?", a: "소득인정액 기준을 충족하는지 확인해야 합니다." }
    ]
  },
  {
    slug: "elderly-job-program",
    title: "노인일자리 및 사회활동 지원",
    category: "고용",
    source: "노인일자리여기",
    agency: "보건복지부·한국노인인력개발원",
    region: "전국·지역별",
    amount: "사업 유형별 활동비 상이",
    deadline: "지역별 모집 기간 확인",
    dday: "모집중",
    status: "모집중",
    lifeStage: "어르신",
    targetGroup: "일자리와 사회활동 참여를 원하는 어르신",
    income: "사업 유형 및 연령 기준 확인",
    applyOnline: true,
    tags: ["노인일자리", "어르신", "사회활동", "일자리", "지역"],
    summary: "어르신의 소득 보완과 사회참여를 돕기 위해 지역별 일자리와 활동을 제공하는 사업입니다.",
    audience: "나이, 활동 가능 지역, 사업 유형, 모집 기간을 확인해야 합니다.",
    benefits: ["공익활동", "사회서비스형 일자리", "지역별 모집", "활동비 지급"],
    documents: ["신분증", "주민등록 관련 자료", "참여 신청서", "자격 확인 자료"],
    apply: "노인일자리여기 또는 수행기관에서 지역별 모집 정보를 확인합니다.",
    officialUrl: "https://www.seniorro.or.kr",
    officialSourceUrl: "https://www.seniorro.or.kr",
    contact: "한국노인인력개발원 또는 지역 수행기관",
    views: 13620,
    updatedAt: "2026.05.24",
    matchReasons: ["고령층 일자리 검색 수요", "지역 기반 콘텐츠와 적합", "모집 기간 확인이 중요"],
    faq: [
      { q: "온라인으로만 신청하나요?", a: "지역 수행기관 방문 접수도 운영될 수 있어 모집 공고를 확인해야 합니다." },
      { q: "기초연금 수급자만 가능한가요?", a: "사업 유형별 기준이 다르므로 세부 공고를 확인해야 합니다." }
    ]
  },
  {
    slug: "youth-lease-loan",
    title: "청년전용 버팀목전세자금",
    category: "주거",
    source: "주택도시기금",
    agency: "국토교통부·주택도시보증공사",
    region: "전국",
    amount: "대출 한도와 금리 기준 확인",
    deadline: "상시 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "청년",
    targetGroup: "무주택 청년 세대주 등 전세자금 지원 대상",
    income: "소득·자산·주택 기준 확인",
    applyOnline: true,
    tags: ["전세자금", "청년", "주거", "무주택", "주택도시기금"],
    summary: "청년층의 전세 보증금 부담을 낮추기 위한 주택도시기금 전세자금 대출 상품입니다.",
    audience: "무주택 여부, 세대주 요건, 소득·자산 기준, 임차보증금 기준을 확인해야 합니다.",
    benefits: ["전세자금 대출", "청년 주거비 부담 완화", "기금e든든 신청", "은행 심사 연계"],
    documents: ["임대차계약서", "소득 확인 자료", "주민등록등본", "무주택 확인 자료"],
    apply: "주택도시기금 또는 기금e든든에서 상품 조건과 신청 절차를 확인합니다.",
    officialUrl: "https://nhuf.molit.go.kr",
    officialSourceUrl: "https://nhuf.molit.go.kr",
    contact: "주택도시기금 수탁은행 또는 HUG",
    views: 19850,
    updatedAt: "2026.05.25",
    matchReasons: ["청년 주거 고의도 검색어", "조건 비교 수요가 큼", "공식 상품 안내 연결 필요"],
    faq: [
      { q: "월세 지원과 같이 받을 수 있나요?", a: "중복 여부는 각 제도의 제한 기준을 확인해야 합니다." },
      { q: "은행 심사가 따로 있나요?", a: "기금 조건 확인 후 수탁은행 심사가 진행될 수 있습니다." }
    ]
  },
  {
    slug: "newlywed-lease-loan",
    title: "신혼부부 전세자금대출",
    category: "주거",
    source: "주택도시기금",
    agency: "국토교통부·주택도시보증공사",
    region: "전국",
    amount: "대출 한도와 금리 기준 확인",
    deadline: "상시 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "신혼부부",
    targetGroup: "무주택 신혼부부 또는 예비 신혼부부",
    income: "부부 합산 소득·자산 기준 확인",
    applyOnline: true,
    tags: ["신혼부부", "전세자금", "주거", "무주택", "주택도시기금"],
    summary: "신혼부부의 전세 보증금 부담을 줄이기 위한 주택도시기금 대출 지원입니다.",
    audience: "혼인 기간, 예비 신혼 여부, 무주택 요건, 소득·자산 기준을 확인해야 합니다.",
    benefits: ["전세자금 대출", "신혼부부 주거 안정", "기금e든든 신청", "은행 상담 연계"],
    documents: ["혼인관계 증빙", "임대차계약서", "소득 확인 자료", "주민등록등본"],
    apply: "주택도시기금 공식 상품 안내와 기금e든든 신청 절차를 확인합니다.",
    officialUrl: "https://nhuf.molit.go.kr",
    officialSourceUrl: "https://nhuf.molit.go.kr",
    contact: "주택도시기금 수탁은행 또는 HUG",
    views: 16730,
    updatedAt: "2026.05.25",
    matchReasons: ["신혼부부 주거 검색 수요", "청년 전세자금과 비교 가능", "서류 준비 콘텐츠 확장 가능"],
    faq: [
      { q: "예비 신혼부부도 가능한가요?", a: "예비 신혼 요건과 제출 서류는 공식 상품 안내를 확인해야 합니다." },
      { q: "소득 기준은 매년 같나요?", a: "정책 기준은 변경될 수 있어 최신 안내를 기준으로 확인해야 합니다." }
    ]
  },
  {
    slug: "durunuri-social-insurance",
    title: "두루누리 사회보험료 지원",
    category: "소상공인",
    source: "근로복지공단",
    agency: "고용노동부·근로복지공단",
    region: "전국",
    amount: "사회보험료 일부 지원",
    deadline: "상시 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "사업자",
    targetGroup: "소규모 사업장 사업주와 근로자",
    income: "근로자 보수와 사업장 규모 기준 확인",
    applyOnline: true,
    tags: ["두루누리", "사회보험료", "소상공인", "근로자", "사업주"],
    summary: "소규모 사업장의 사회보험 가입 부담을 낮추기 위해 보험료 일부를 지원하는 제도입니다.",
    audience: "근로자 수, 월평균 보수, 신규 가입 여부, 사업장 요건을 확인해야 합니다.",
    benefits: ["국민연금·고용보험료 지원", "사업주 부담 완화", "근로자 사회보험 가입 지원", "온라인 신청"],
    documents: ["사업장 정보", "근로자 보수 자료", "사회보험 가입 정보", "사업자등록증"],
    apply: "근로복지공단 또는 4대사회보험 정보연계센터에서 신청 기준을 확인합니다.",
    officialUrl: "https://www.comwel.or.kr",
    officialSourceUrl: "https://www.comwel.or.kr",
    contact: "근로복지공단 고객센터",
    views: 9640,
    updatedAt: "2026.05.23",
    matchReasons: ["소상공인 유지비 절감 검색어", "사업주와 근로자 모두 대상", "공식 조건 확인 필요"],
    faq: [
      { q: "1인 사업자도 가능한가요?", a: "근로자 고용 여부와 사업장 기준에 따라 달라질 수 있습니다." },
      { q: "이미 가입한 근로자도 지원되나요?", a: "신규 가입 여부 등 세부 기준을 확인해야 합니다." }
    ]
  },
  {
    slug: "youth-startup-academy",
    title: "청년창업사관학교",
    category: "창업",
    source: "K-Startup",
    agency: "중소벤처기업부·중소벤처기업진흥공단",
    region: "전국·권역별",
    amount: "사업화 지원 및 프로그램",
    deadline: "연도별 모집 공고 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "청년·창업",
    targetGroup: "혁신 창업 아이템을 보유한 청년 창업자",
    income: "업력·대표자·사업계획 기준 중심",
    applyOnline: true,
    tags: ["청년창업사관학교", "창업", "청년", "사업화", "K-Startup"],
    summary: "청년 창업자를 대상으로 사업화 자금, 교육, 코칭, 공간 등을 연계하는 대표 창업 지원사업입니다.",
    audience: "대표자 나이, 업력, 창업 아이템, 사업계획서 평가 기준을 확인해야 합니다.",
    benefits: ["사업화 지원", "창업 교육", "멘토링", "공간·네트워크 연계"],
    documents: ["사업계획서", "사업자 관련 서류", "대표자 신분 서류", "가점 증빙"],
    apply: "K-Startup과 중소벤처기업진흥공단 공고에서 모집 시기와 신청 양식을 확인합니다.",
    officialUrl: "https://www.k-startup.go.kr",
    officialSourceUrl: "https://www.kosmes.or.kr",
    contact: "중소벤처기업진흥공단 또는 공고별 담당 기관",
    views: 12110,
    updatedAt: "2026.05.22",
    matchReasons: ["창업지원 고의도 키워드", "사업계획서 가이드와 연결 가능", "모집 시즌 유입 효과 큼"],
    faq: [
      { q: "예비창업자도 신청할 수 있나요?", a: "모집 유형에 따라 예비창업자 또는 초기창업자 요건이 다를 수 있습니다." },
      { q: "선정되면 현금이 바로 지급되나요?", a: "협약과 정산 절차가 있는 사업비 형태일 수 있어 공고문을 확인해야 합니다." }
    ]
  },
  {
    slug: "public-interest-direct-payment",
    title: "공익직불금",
    category: "농림어업",
    source: "농림축산식품부",
    agency: "농림축산식품부",
    region: "전국·지역별",
    amount: "농지·요건별 차등",
    deadline: "연도별 신청 기간 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "농업인",
    targetGroup: "농업경영체 등록 등 요건을 충족하는 농업인",
    income: "농지, 경작, 농업경영체 기준 확인",
    applyOnline: true,
    tags: ["공익직불금", "농업", "농업인", "직불금", "농림어업"],
    summary: "농업·농촌의 공익 기능을 높이기 위해 일정 요건을 충족하는 농업인에게 지급되는 직불 제도입니다.",
    audience: "농업경영체 등록, 실제 경작, 농지 요건, 준수사항을 확인해야 합니다.",
    benefits: ["직불금 지급", "농업인 소득 안정", "온라인·방문 신청", "준수사항 안내"],
    documents: ["농업경영체 등록 정보", "농지 관련 자료", "신분증", "신청서"],
    apply: "농림사업정보시스템 또는 읍면동 행정기관 공고를 확인합니다.",
    officialUrl: "https://www.mafra.go.kr",
    officialSourceUrl: "https://www.mafra.go.kr",
    contact: "관할 읍면동 또는 농림축산식품부",
    views: 11230,
    updatedAt: "2026.05.21",
    matchReasons: ["농업인 대표 지원금", "연도별 신청 기간 검색 수요", "준수사항 콘텐츠 확장 가능"],
    faq: [
      { q: "농지만 있으면 받을 수 있나요?", a: "실제 경작과 등록 요건 등 세부 기준을 충족해야 합니다." },
      { q: "온라인 신청이 가능한가요?", a: "연도별 접수 방식과 대상에 따라 달라질 수 있습니다." }
    ]
  },
  {
    slug: "fisheries-public-payment",
    title: "수산공익직불금",
    category: "농림어업",
    source: "해양수산부",
    agency: "해양수산부",
    region: "전국·지역별",
    amount: "직불 유형별 차등",
    deadline: "연도별 신청 기간 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "어업인",
    targetGroup: "조건을 충족하는 어업인과 어촌 지역 대상자",
    income: "어업 경영, 지역, 직불 유형 기준 확인",
    applyOnline: false,
    tags: ["수산공익직불금", "어업", "어촌", "직불금", "해양수산부"],
    summary: "어업과 어촌의 공익적 기능을 유지하기 위해 유형별로 지원되는 수산 분야 직불 제도입니다.",
    audience: "어업 경영 여부, 거주 지역, 직불 유형, 준수사항을 공식 공고로 확인해야 합니다.",
    benefits: ["직불금 지급", "어업인 소득 안정", "어촌 공익 기능 지원", "지역 접수 안내"],
    documents: ["어업 경영 관련 자료", "신분증", "거주 확인 자료", "신청서"],
    apply: "해양수산부 또는 관할 지자체 공고에서 신청 기간과 접수처를 확인합니다.",
    officialUrl: "https://www.mof.go.kr",
    officialSourceUrl: "https://www.mof.go.kr",
    contact: "관할 지자체 또는 해양수산부",
    views: 6930,
    updatedAt: "2026.05.21",
    matchReasons: ["어업 카테고리 보강", "지역·직불 유형 필터에 적합", "공식 공고 확인 필요"],
    faq: [
      { q: "농업 직불금과 같은가요?", a: "대상과 소관 기관, 직불 유형이 다릅니다." },
      { q: "어촌 거주만으로 가능한가요?", a: "직불 유형별 요건과 준수사항을 확인해야 합니다." }
    ]
  },
  {
    slug: "unemployment-benefit",
    title: "구직급여",
    category: "고용",
    source: "고용24",
    agency: "고용노동부",
    region: "전국",
    amount: "이직 전 임금과 가입 기간 기준",
    deadline: "퇴직 후 신청 기한 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "구직자",
    targetGroup: "고용보험 가입 이력이 있고 수급 요건을 충족하는 이직자",
    income: "고용보험 가입 기간 및 이직 사유 기준 확인",
    applyOnline: true,
    tags: ["구직급여", "실업급여", "고용보험", "구직자", "고용24"],
    summary: "비자발적 이직 등 요건을 충족한 구직자의 재취업 활동을 지원하는 고용보험 급여입니다.",
    audience: "이직 사유, 고용보험 가입 기간, 구직활동 의무, 수급자격 신청 절차를 확인해야 합니다.",
    benefits: ["구직급여 지급", "재취업 활동 지원", "온라인 교육·신청", "고용센터 상담"],
    documents: ["이직확인서", "신분증", "구직신청 정보", "고용보험 관련 자료"],
    apply: "고용24와 관할 고용센터에서 수급자격 신청 절차를 확인합니다.",
    officialUrl: "https://www.work24.go.kr",
    officialSourceUrl: "https://www.ei.go.kr",
    contact: "고용노동부 고객상담센터 1350",
    views: 28960,
    updatedAt: "2026.05.25",
    matchReasons: ["실업급여 검색 수요가 매우 큼", "상세 절차 콘텐츠 확장 가능", "공식 고용센터 연결이 중요"],
    faq: [
      { q: "자발적으로 퇴사하면 무조건 안 되나요?", a: "원칙과 예외가 있으므로 이직 사유와 고용센터 판단 기준을 확인해야 합니다." },
      { q: "신청 전에 무엇을 해야 하나요?", a: "구직신청, 온라인 교육, 수급자격 신청 절차를 공식 안내에 따라 확인해야 합니다." }
    ]
  },
  {
    slug: "youth-income-tax-reduction",
    title: "중소기업 취업자 소득세 감면",
    category: "고용",
    source: "국세청",
    agency: "국세청",
    region: "전국",
    amount: "대상 유형별 소득세 감면",
    deadline: "회사 제출 및 연말정산 기준 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "청년·근로자",
    targetGroup: "중소기업에 취업한 청년, 고령자, 장애인, 경력단절여성 등",
    income: "취업일, 기업 요건, 대상 유형 기준 확인",
    applyOnline: false,
    tags: ["소득세감면", "청년", "중소기업", "연말정산", "국세청"],
    summary: "중소기업 취업자의 소득세 부담을 줄여주는 세제 지원 제도입니다.",
    audience: "취업일, 나이, 회사의 중소기업 해당 여부, 감면 신청서 제출 여부를 확인해야 합니다.",
    benefits: ["소득세 감면", "청년 근로자 세금 부담 완화", "연말정산 반영", "회사 제출 방식"],
    documents: ["감면 신청서", "주민등록등본", "병역 관련 자료", "재직 정보"],
    apply: "국세청 안내를 확인한 뒤 회사에 감면 신청서를 제출하는 방식으로 진행합니다.",
    officialUrl: "https://www.nts.go.kr",
    officialSourceUrl: "https://www.nts.go.kr",
    contact: "국세상담센터 126 또는 회사 담당자",
    views: 14360,
    updatedAt: "2026.05.24",
    matchReasons: ["청년 직장인 검색 수요", "연말정산 시즌 콘텐츠와 연결", "서류 체크리스트가 중요"],
    faq: [
      { q: "회사가 신청해주는 건가요?", a: "근로자가 신청서를 회사에 제출하고 회사가 원천징수에 반영하는 흐름을 확인해야 합니다." },
      { q: "중소기업이면 모두 가능한가요?", a: "업종과 기업 요건에 제한이 있을 수 있습니다." }
    ]
  }
);

policies.push(
  {
    slug: "earned-income-tax-credit-application",
    title: "근로장려금 신청방법",
    category: "복지",
    source: "국세청",
    agency: "국세청",
    region: "전국",
    amount: "가구 유형별 차등",
    deadline: "정기·반기 신청 기간 확인",
    dday: "D-6",
    status: "마감임박",
    lifeStage: "근로자·사업자",
    targetGroup: "근로장려금 신청 안내를 확인하려는 근로·사업·종교인 가구",
    income: "가구 유형별 총소득·재산 기준 확인",
    applyOnline: true,
    tags: ["근로장려금", "신청방법", "홈택스", "국세청", "환급"],
    summary: "근로장려금 신청 기간, 신청 경로, 홈택스 확인 절차를 먼저 확인할 수 있는 안내입니다.",
    audience: "가구 유형, 소득, 재산 기준에 따라 신청 가능 여부가 달라집니다.",
    benefits: ["홈택스 신청 경로 확인", "정기·반기 신청 구분", "신청 전 서류 확인"],
    documents: ["소득 자료", "가구원 정보", "재산 관련 자료", "계좌 정보"],
    apply: "국세청 홈택스 또는 손택스에서 신청 안내와 대상 여부를 확인합니다.",
    officialUrl: "https://www.hometax.go.kr",
    officialSourceUrl: "https://www.nts.go.kr",
    contact: "국세상담센터 126",
    views: 42120,
    updatedAt: "2026.05.25",
    matchReasons: ["근로장려금 신청방법 검색 의도와 직접 연결", "공식 홈택스 신청 확인 필요", "마감 기간 확인이 중요"],
    faq: [
      { q: "신청은 어디서 하나요?", a: "국세청 홈택스 또는 손택스에서 신청 대상 여부와 신청 화면을 확인해야 합니다." },
      { q: "GovFind에서 대상 판정을 하나요?", a: "아니요. GovFind는 조건 확인과 공식 신청처 이동을 돕습니다." }
    ]
  },
  {
    slug: "youth-rent-eligibility-check",
    title: "청년월세 지원 대상 확인",
    category: "주거",
    source: "복지로",
    agency: "국토교통부·지자체",
    region: "전국",
    amount: "월세 일부 지원",
    deadline: "지자체별 접수",
    dday: "D-24",
    status: "모집중",
    lifeStage: "청년",
    targetGroup: "청년월세 지원 대상 여부를 확인하려는 무주택 청년",
    income: "청년가구와 원가구 소득 기준 확인",
    applyOnline: true,
    tags: ["청년월세", "지원대상", "월세", "주거", "복지로"],
    summary: "청년월세 지원을 신청하기 전 나이, 무주택, 소득, 임대차계약 기준을 확인하는 정보입니다.",
    audience: "주민등록 주소, 임대차계약, 월세 이체 증빙, 소득 기준을 함께 확인해야 합니다.",
    benefits: ["대상 조건 확인", "월세 지원 가능성 확인", "복지로 신청 경로 확인"],
    documents: ["임대차계약서", "월세 이체 증빙", "가족관계 관련 서류", "소득·재산 확인 자료"],
    apply: "복지로 또는 주소지 관할 주민센터에서 대상 여부와 접수 기간을 확인합니다.",
    officialUrl: "https://www.bokjiro.go.kr",
    officialSourceUrl: "https://www.bokjiro.go.kr",
    contact: "주소지 관할 주민센터 또는 복지로 상담센터",
    views: 27640,
    updatedAt: "2026.05.25",
    matchReasons: ["청년월세 지원 대상 검색과 직접 연결", "서류 준비 전 확인 필요", "복지로 공식 신청처 연결"],
    faq: [
      { q: "부모 소득도 보나요?", a: "사업별로 원가구 기준을 함께 볼 수 있어 공식 공고를 확인해야 합니다." },
      { q: "월세 이체 내역이 필요한가요?", a: "대부분 월세 납부 증빙을 요구하므로 공고의 서류 목록을 확인하세요." }
    ]
  },
  {
    slug: "local-youth-rent-support",
    title: "지자체 청년월세 지원",
    category: "주거",
    source: "정부24·지자체",
    agency: "각 지방자치단체",
    region: "지역별",
    amount: "지역별 월세 지원",
    deadline: "지역별 모집 기간 확인",
    dday: "모집중",
    status: "모집중",
    lifeStage: "청년",
    targetGroup: "거주 지역의 청년월세 지원을 확인하려는 청년",
    income: "지자체별 소득·거주 기준 확인",
    applyOnline: true,
    tags: ["청년월세", "지원대상", "지자체", "월세", "지역"],
    summary: "전국 공통 제도 외에 지자체별로 운영되는 청년월세 지원 공고를 확인하는 정보입니다.",
    audience: "주민등록상 거주지, 전입일, 거주 기간, 임대차계약 조건을 확인해야 합니다.",
    benefits: ["지역별 월세 지원 확인", "지자체 신청처 확인", "중복 제한 확인"],
    documents: ["주민등록등본", "임대차계약서", "월세 납부 증빙", "소득 확인 자료"],
    apply: "정부24 또는 지자체 공식 공고에서 모집 기간과 신청 방법을 확인합니다.",
    officialUrl: "https://www.gov.kr",
    officialSourceUrl: "https://www.gov.kr",
    contact: "주소지 관할 지자체",
    views: 20480,
    updatedAt: "2026.05.25",
    matchReasons: ["청년월세 지역 검색 보강", "거주지 기준 확인 필요", "공식 지자체 공고 연결"],
    faq: [
      { q: "전국 청년월세와 중복되나요?", a: "중복 제한이 있을 수 있어 기존 수급 여부를 공식 공고에서 확인해야 합니다." },
      { q: "지역마다 금액이 같나요?", a: "지원 금액과 기간은 지자체별로 달라질 수 있습니다." }
    ]
  },
  {
    slug: "health-insurance-out-of-pocket-refund",
    title: "건강보험 본인부담금 환급금",
    category: "복지",
    source: "국민건강보험",
    agency: "국민건강보험공단",
    region: "전국",
    amount: "환급 대상별 상이",
    deadline: "조회 후 신청 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "전 국민",
    targetGroup: "본인부담금 환급 대상 여부를 확인하려는 건강보험 가입자",
    income: "진료비 정산과 공단 기준 확인",
    applyOnline: true,
    tags: ["건강보험", "환급금", "본인부담금", "조회", "국민건강보험"],
    summary: "진료비 정산 뒤 발생할 수 있는 본인부담금 환급 여부를 국민건강보험공단에서 확인하는 정보입니다.",
    audience: "실제 환급 여부와 금액은 공단 조회 화면에서 본인 인증 후 확인해야 합니다.",
    benefits: ["본인부담금 환급 조회", "온라인 확인", "공식 공단 신청"],
    documents: ["본인 인증 수단", "계좌 정보", "공단 안내에 따른 추가 서류"],
    apply: "국민건강보험공단 공식 사이트에서 환급금 조회와 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.nhis.or.kr",
    officialSourceUrl: "https://www.nhis.or.kr",
    contact: "국민건강보험공단 고객센터 1577-1000",
    views: 22110,
    updatedAt: "2026.05.25",
    matchReasons: ["건강보험 환급금 조회와 직접 연결", "공식 공단 조회 필요", "본인 인증 기반 정보"],
    faq: [
      { q: "환급액을 바로 알 수 있나요?", a: "GovFind에서는 알 수 없고 국민건강보험공단 공식 조회에서 확인해야 합니다." },
      { q: "문자로 온 링크를 눌러도 되나요?", a: "공식 사이트에서 직접 조회하는 방식이 안전합니다." }
    ]
  },
  {
    slug: "health-insurance-overpayment-refund",
    title: "건강보험료 과오납 환급금",
    category: "복지",
    source: "국민건강보험",
    agency: "국민건강보험공단",
    region: "전국",
    amount: "과오납 내역별 상이",
    deadline: "조회 후 신청 가능 여부 확인",
    dday: "상시",
    status: "상시",
    lifeStage: "전 국민",
    targetGroup: "건강보험료 과오납 환급 대상 여부를 확인하려는 가입자",
    income: "보험료 납부·정산 내역 기준",
    applyOnline: true,
    tags: ["건강보험", "환급금", "과오납", "조회", "보험료"],
    summary: "건강보험료가 과오납된 경우 환급 가능 여부를 공단에서 조회하는 정보입니다.",
    audience: "납부 이력과 정산 상태에 따라 환급 여부가 달라집니다.",
    benefits: ["보험료 과오납 조회", "온라인 환급 신청 확인", "공식 공단 안내"],
    documents: ["본인 인증 수단", "계좌 정보", "공단 안내에 따른 추가 서류"],
    apply: "국민건강보험공단 공식 사이트에서 과오납 환급금 조회와 신청 가능 여부를 확인합니다.",
    officialUrl: "https://www.nhis.or.kr",
    officialSourceUrl: "https://www.nhis.or.kr",
    contact: "국민건강보험공단 고객센터 1577-1000",
    views: 19870,
    updatedAt: "2026.05.25",
    matchReasons: ["건강보험 환급금 조회 검색 보강", "과오납 환급 의도와 일치", "공식 공단 확인 필요"],
    faq: [
      { q: "누구나 환급되나요?", a: "아니요. 실제 환급 대상은 납부와 정산 내역을 기준으로 공단에서 확인해야 합니다." },
      { q: "계좌 입력이 필요한가요?", a: "환급 신청 시 계좌 확인이 필요할 수 있으므로 공식 화면 안내를 따르세요." }
    ]
  },
  {
    slug: "small-business-direct-loan",
    title: "소상공인 정책자금 직접대출",
    category: "소상공인",
    source: "소상공인 정책자금",
    agency: "소상공인시장진흥공단",
    region: "전국",
    amount: "자금 유형별 상이",
    deadline: "예산 소진 시까지",
    dday: "상시",
    status: "상시",
    lifeStage: "사업자",
    targetGroup: "정책자금 직접대출 신청을 검토하는 소상공인",
    income: "매출·업종·신용 조건별 상이",
    applyOnline: true,
    tags: ["소상공인", "정책자금", "직접대출", "신청서류", "사업자"],
    summary: "소상공인 정책자금 직접대출의 신청 가능 상태와 준비 서류를 확인하는 정보입니다.",
    audience: "업종, 사업 기간, 매출, 신용 조건에 따라 신청 가능 여부가 달라집니다.",
    benefits: ["직접대출 공고 확인", "신청서류 준비", "공식 접수처 연결"],
    documents: ["사업자등록증", "매출 증빙", "납세 관련 서류", "자금 사용 계획"],
    apply: "소상공인 정책자금 공식 사이트에서 접수 상태와 제출 서류를 확인합니다.",
    officialUrl: "https://ols.semas.or.kr",
    officialSourceUrl: "https://www.semas.or.kr",
    contact: "소상공인시장진흥공단 또는 지역 센터",
    views: 25540,
    updatedAt: "2026.05.25",
    matchReasons: ["소상공인 정책자금 신청서류 검색과 직접 연결", "공식 접수 상태 확인 필요", "서류 준비 의도 명확"],
    faq: [
      { q: "직접대출과 대리대출은 다른가요?", a: "접수와 심사 흐름이 다를 수 있어 공고별 안내를 확인해야 합니다." },
      { q: "서류는 고정인가요?", a: "자금 유형과 사업자 상태에 따라 추가 서류가 필요할 수 있습니다." }
    ]
  },
  {
    slug: "small-business-emergency-fund",
    title: "소상공인 긴급경영안정자금",
    category: "소상공인",
    source: "소상공인 정책자금",
    agency: "소상공인시장진흥공단",
    region: "전국·지역별",
    amount: "피해·경영 상황별 상이",
    deadline: "공고별 접수 기간 확인",
    dday: "예정",
    status: "예정",
    lifeStage: "사업자",
    targetGroup: "경영 애로를 겪는 소상공인과 영세 사업자",
    income: "매출 감소, 피해 사실, 업종 기준 확인",
    applyOnline: true,
    tags: ["소상공인", "정책자금", "긴급경영안정자금", "신청서류", "대출"],
    summary: "경영 애로 상황에서 확인할 수 있는 소상공인 정책자금 유형과 신청 서류 안내입니다.",
    audience: "피해 요건, 매출 감소, 업종 제한, 접수 지역을 공식 공고에서 확인해야 합니다.",
    benefits: ["긴급 자금 공고 확인", "피해 증빙 서류 확인", "공식 접수처 연결"],
    documents: ["사업자등록증", "피해 증빙", "매출 자료", "납세 관련 서류"],
    apply: "소상공인 정책자금 공식 사이트에서 모집 공고와 신청서류를 확인합니다.",
    officialUrl: "https://ols.semas.or.kr",
    officialSourceUrl: "https://www.semas.or.kr",
    contact: "소상공인시장진흥공단 또는 지역 센터",
    views: 21260,
    updatedAt: "2026.05.25",
    matchReasons: ["소상공인 정책자금 검색 보강", "신청서류 확인 필요", "공식 접수처 연결"],
    faq: [
      { q: "항상 신청 가능한가요?", a: "공고별 접수 기간과 예산이 다르므로 공식 접수 상태를 확인해야 합니다." },
      { q: "피해 증빙이 필요한가요?", a: "자금 유형에 따라 피해 또는 매출 감소 증빙이 요구될 수 있습니다." }
    ]
  }
);

const gov24PromotionPolicies: Policy[] = [
  {
    "slug": "gov24-이상기상대응-과수결실안정-지원",
    "title": "이상기상대응 과수결실안정 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "이상기상으로 인한 서리·고온·결실불량 등 기상피해 예방 종합기술 투입",
    "deadline": "2023-01-16 ~ 2023-02-10",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2023-01-16",
    "endDate": "2023-02-10",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "이상기상대응 과수결실안정 지원",
      "농림어업",
      "경북",
      "경상북도 청송군",
      "마감",
      "농어업인",
      "전체",
      "이상기상으로",
      "인한",
      "서리·고온·결실불량",
      "등",
      "기상피해"
    ],
    "summary": "이상기상으로 인한 서리·고온·결실불량 등 기상피해 예방 종합기술 투입",
    "audience": "- 개화기·생육기 이상기상 등 불량 기상환경에 대응한 종합 기술보급\n - 햇빛차단망·개량형 방상팬·ICT적용 자동제어시스템 등 농작업 생력화 생산체계 구축",
    "benefits": [
      "이상기상으로 인한 서리·고온·결실불량 등 기상피해 예방 종합기술 투입"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000120",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000120",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 개화기·생육기 이상기상 등 불량 기상환경에 대응한 종합 기술보급\n - 햇빛차단망·개량형 방상팬·ICT적용 자동제어시스템 등 농작업 생력화 생산체계 구축",
      "benefit": "이상기상으로 인한 서리·고온·결실불량 등 기상피해 예방 종합기술 투입",
      "application": "방문신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-고추육묘지원사업-참여육묘장-지원",
    "title": "고추육묘지원사업 참여육묘장 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "해당년도 고추육묘지원사업을 추진하는 육묘장에 농약 및 기타 농자재, 방역물품 등 지원",
    "deadline": "2021-10-25 ~ 2021-10-29",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2021-10-25",
    "endDate": "2021-10-29",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "고추육묘지원사업 참여육묘장 지원",
      "주거",
      "경북",
      "경상북도 청송군",
      "마감",
      "농어업인",
      "전체",
      "해당년도",
      "고추육묘지원사업을",
      "추진하는",
      "육묘장에",
      "농약"
    ],
    "summary": "해당년도 고추육묘지원사업을 추진하는 육묘장에 농약 및 기타 농자재, 방역물품 등 지원",
    "audience": "○ 청송 맞춤형 방제력 기반 육묘 중 농약 및 기타 농자재 지원\n\n○ 고추 바이러스병 예방을 위한 바이러스 진단키트 지원\n\n○ 모종분양 중 코로나19 확산예방을 위한 방역물품 지원",
    "benefits": [
      "해당년도 고추육묘지원사업을 추진하는 육묘장에 농약 및 기타 농자재, 방역물품 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000121",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000121",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 청송 맞춤형 방제력 기반 육묘 중 농약 및 기타 농자재 지원\n\n○ 고추 바이러스병 예방을 위한 바이러스 진단키트 지원\n\n○ 모종분양 중 코로나19 확산예방을 위한 방역물품 지원",
      "benefit": "해당년도 고추육묘지원사업을 추진하는 육묘장에 농약 및 기타 농자재, 방역물품 등 지원",
      "application": "방문신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-아동청소년-동행카드-지원",
    "title": "아동청소년 동행카드 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "13세 및 중학교 1학년에게 문화·예술·진로체험을 할 수 있는 10만 포인트 지원",
    "deadline": "2026-01-15 ~ 2026-01-15",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2026-01-15",
    "endDate": "2026-01-15",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "아동청소년 동행카드 지원",
      "청년",
      "서울",
      "서울특별시 성북구",
      "마감",
      "부모/육아",
      "아동",
      "청소년",
      "임신·출산·육아",
      "13세",
      "및",
      "중학교"
    ],
    "summary": "13세 및 중학교 1학년에게 문화·예술·진로체험을 할 수 있는 10만 포인트 지원",
    "audience": "○ 지원대상 : 성북구에 주민등록 되어있는 해당연도에 13세 청소년 또는 중학교1학년(2026년 기준 2013년생)\n\n○ 지원내용 : 문화·예술·진로 등 다양한 분야의 체험을 할 수 있도록 지원\n\n○ 지원금액 : 연간 10만원\n\n○ 지원방법 : 포인트 카드 충전",
    "benefits": [
      "13세 및 중학교 1학년에게 문화·예술·진로체험을 할 수 있는 10만 포인트 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||기타 온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000105",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상 : 성북구에 주민등록 되어있는 해당연도에 13세 청소년 또는 중학교1학년(2026년 기준 2013년생)\n\n○ 지원내용 : 문화·예술·진로 등 다양한 분야의 체험을 할 수 있도록 지원\n\n○ 지원금액 : 연간 10만원\n\n○ 지원방법 : 포인트 카드 충전",
      "benefit": "13세 및 중학교 1학년에게 문화·예술·진로체험을 할 수 있는 10만 포인트 지원",
      "application": "정부24온라인신청||기타 온라인신청||방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-무더위-안전숙소-운영",
    "title": "무더위 안전숙소 운영",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "7월~8월 중 폭염 특보 발효 시 65세이상 폭염 취약계층을 위한 무더위 야간숙소 운영",
    "deadline": "2026-07-01 ~ 2026-08-31",
    "dday": "D-97",
    "status": "모집중",
    "startDate": "2026-07-01",
    "endDate": "2026-08-31",
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "주거·복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "무더위 안전숙소 운영",
      "주거",
      "서울",
      "서울특별시 성북구",
      "모집중",
      "어르신",
      "아동",
      "복지",
      "7월~8월",
      "중",
      "폭염",
      "특보"
    ],
    "summary": "7월~8월 중 폭염 특보 발효 시 65세이상 폭염 취약계층을 위한 무더위 야간숙소 운영",
    "audience": "○ 무더위 안전숙소 운영\n - 운영기간 : 매년 7월 ~ 8월 중 폭염 특보 발효시\n - 운영장소 : 성북구 관내 지정된 호텔 등 숙소\n - 이용대상 : 만65세이상 저소득 어르신 등\n - 이용방법 : 거주동 주민센터신청후 확인증을 지참하여 숙소 이용",
    "benefits": [
      "7월~8월 중 폭염 특보 발효 시 65세이상 폭염 취약계층을 위한 무더위 야간숙소 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000127",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000127",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 무더위 안전숙소 운영\n - 운영기간 : 매년 7월 ~ 8월 중 폭염 특보 발효시\n - 운영장소 : 성북구 관내 지정된 호텔 등 숙소\n - 이용대상 : 만65세이상 저소득 어르신 등\n - 이용방법 : 거주동 주민센터신청후 확인증을 지참하여 숙소 이용",
      "benefit": "7월~8월 중 폭염 특보 발효 시 65세이상 폭염 취약계층을 위한 무더위 야간숙소 운영",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-북한이탈주민-자녀-학습비-지원",
    "title": "북한이탈주민 자녀 학습비 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 - 학습지, 학원, 독서실 등",
    "deadline": "2026-02-01 ~ 2026-12-18",
    "dday": "D-206",
    "status": "모집중",
    "startDate": "2026-02-01",
    "endDate": "2026-12-18",
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "북한이탈주민 자녀 학습비 지원",
      "청년",
      "경기",
      "경기도 김포시",
      "모집중",
      "부모/육아",
      "아동",
      "청소년",
      "임신·출산·육아",
      "❍",
      "지원내용",
      ":"
    ],
    "summary": "❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 - 학습지, 학원, 독서실 등",
    "audience": "❍ 지원대상 : 자녀 학습비 지원 희망자 30명\n - 공고일 현재 김포시에 주소를 두고 있으며,\n - 만4세(2022.1.1.일 이전 출생자) ~ 고등학교 재학 중인 북한이탈주민 가정의 자녀 또는 탈북 아동·청소년\n - 1가구 1회 지원을 원칙으로 함.\n ❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 내 지원\n - 학습지, 학원비\n - 독서실 이용료\n ❍ 지급방법 : 본인 또는 직계가족 계좌에 한해 지급",
    "benefits": [
      "❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 - 학습지, 학원, 독서실 등"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "❍ 신청방법\n - 방문(김포시청 자치행정과)\n - 팩스(031-980-2750)\n - 이메일(hynjl15@korea.kr)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000157",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000157",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "❍ 지원대상 : 자녀 학습비 지원 희망자 30명\n - 공고일 현재 김포시에 주소를 두고 있으며,\n - 만4세(2022.1.1.일 이전 출생자) ~ 고등학교 재학 중인 북한이탈주민 가정의 자녀 또는 탈북 아동·청소년\n - 1가구 1회 지원을 원칙으로 함.\n ❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 내 지원\n - 학습지, 학원비\n - 독서실 이용료\n ❍ 지급방법 : 본인 또는 직계가족 계좌에 한해 지급",
      "benefit": "❍ 지원내용 : 2026년 시행한 자녀 학습비 25만원 - 학습지, 학원, 독서실 등",
      "application": "❍ 신청방법\n - 방문(김포시청 자치행정과)\n - 팩스(031-980-2750)\n - 이메일(hynjl15@korea.kr)",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-고품질-자두-생산기반-조성-자두gap",
    "title": "고품질 자두 생산기반 조성(자두GAP)",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "자두GAP 사업 농가 대상으로 기술 및 친환경 병해충 방제 자재 지원",
    "deadline": "2023-01-16 ~ 2023-02-10",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2023-01-16",
    "endDate": "2023-02-10",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "고품질 자두 생산기반 조성(자두GAP)",
      "교육",
      "경북",
      "경상북도 청송군",
      "마감",
      "농어업인",
      "전체",
      "자두GAP",
      "사업",
      "농가",
      "대상으로",
      "기술"
    ],
    "summary": "자두GAP 사업 농가 대상으로 기술 및 친환경 병해충 방제 자재 지원",
    "audience": "○ 청송자두 경쟁력 향상을 위한 기술 및 친환경 병해충 방제 자재 지원\n○ GAP인증 취득 및 교육지도",
    "benefits": [
      "자두GAP 사업 농가 대상으로 기술 및 친환경 병해충 방제 자재 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 청송군 농업기술센터\n\n○ 기타 \n - 팩스, 메일",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000102",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000102",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 청송자두 경쟁력 향상을 위한 기술 및 친환경 병해충 방제 자재 지원\n○ GAP인증 취득 및 교육지도",
      "benefit": "자두GAP 사업 농가 대상으로 기술 및 친환경 병해충 방제 자재 지원",
      "application": "○ 방문 신청\n - 기타 : 청송군 농업기술센터\n\n○ 기타 \n - 팩스, 메일",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-사과원-고효율-방제-부착기-설치-지원-시범",
    "title": "사과원 고효율 방제 부착기 설치 지원(시범)",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "과수재배 농업인에게 고지방제기, 안전캡 등 부착 지원",
    "deadline": "2023-01-16 ~ 2023-02-10",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2023-01-16",
    "endDate": "2023-02-10",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "사과원 고효율 방제 부착기 설치 지원(시범)",
      "교육",
      "경북",
      "경상북도 청송군",
      "마감",
      "농어업인",
      "전체",
      "과수재배",
      "농업인에게",
      "고지방제기,",
      "안전캡",
      "등"
    ],
    "summary": "과수재배 농업인에게 고지방제기, 안전캡 등 부착 지원",
    "audience": "- 수고가 높은 나무의 방제 효과를 극대화하기 위한 SS기 고지방제기 부착 \n - 농약중독방지를 위한 SS기 안전캡 부착\n - 설치 후 사용 요령 교육 및 사전 테스트 실시\n - 안전캡, 고지방제기 중 1개 기종만 신청 가능",
    "benefits": [
      "과수재배 농업인에게 고지방제기, 안전캡 등 부착 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 청송군 농업기술센터\n\n○ 기타 \n - 팩스, 메일",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000110",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 수고가 높은 나무의 방제 효과를 극대화하기 위한 SS기 고지방제기 부착 \n - 농약중독방지를 위한 SS기 안전캡 부착\n - 설치 후 사용 요령 교육 및 사전 테스트 실시\n - 안전캡, 고지방제기 중 1개 기종만 신청 가능",
      "benefit": "과수재배 농업인에게 고지방제기, 안전캡 등 부착 지원",
      "application": "○ 방문 신청\n - 기타 : 청송군 농업기술센터\n\n○ 기타 \n - 팩스, 메일",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-농가-소득배가-육성-지원-내재해형-비닐하우스-지원-농산물-건조기-지원-농산물-저온저장고-지원",
    "title": "농가 소득배가 육성 지원(내재해형 비닐하우스 지원, 농산물 건조기 지원, 농산물 저온저장고 지원)",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "농업인에게 소득증대사업, 농업시설, 저온저장고 등 지원",
    "deadline": "2025-01-15 ~ 2025-02-14",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-01-15",
    "endDate": "2025-02-14",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농가 소득배가 육성 지원(내재해형 비닐하우스 지원, 농산물 건조기 지원, 농산물 저온저장고 지원)",
      "농림어업",
      "경기",
      "경기도 가평군",
      "마감",
      "농어업인",
      "전체",
      "농업인에게",
      "소득증대사업,",
      "농업시설,",
      "저온저장고",
      "등"
    ],
    "summary": "농업인에게 소득증대사업, 농업시설, 저온저장고 등 지원",
    "audience": "○ 기후변화대응 내재해형 비닐하우스 농업시설지원\n - 가평군 관내에 거주하는 농업경영체를 등록한 농업인에게 330㎡ 크기의 내재해형 비닐하우스 1동 50% 지원\n\n○농산물 저온저장고 지원\n - 가평군 관내에 거주하는 농업경영체를 등록한 원예·과채류·화훼 등을 재배하는 농업인에게 16.5㎡, 9.9㎡ 크기의 저온저장고 1동 50% 지원\n\n○농산물 건조기 지원\n - 가평군 관내에 거주하는 농업경영체를 등록한 원예·과채류·화훼 등을 재배하는 농업인에게 1~3칸 규모의 농산물 건조기 1동 50% 지원",
    "benefits": [
      "농업인에게 소득증대사업, 농업시설, 저온저장고 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에서 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000107",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000107",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 기후변화대응 내재해형 비닐하우스 농업시설지원\n - 가평군 관내에 거주하는 농업경영체를 등록한 농업인에게 330㎡ 크기의 내재해형 비닐하우스 1동 50% 지원\n\n○농산물 저온저장고 지원\n - 가평군 관내에 거주하는 농업경영체를 등록한 원예·과채류·화훼 등을 재배하는 농업인에게 16.5㎡, 9.9㎡ 크기의 저온저장고 1동 50% 지원\n\n○농산물 건조기 지원\n - 가평군 관내에 거주하는 농업경영체를 등록한 원예·과채류·화훼 등을 재배하는 농업인에게 1~3칸 규모의 농산물 건조기 1동 50% 지원",
      "benefit": "농업인에게 소득증대사업, 농업시설, 저온저장고 등 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에서 방문 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-과수계약재배-출하비-지원",
    "title": "과수계약재배 출하비 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "농업인 등에게 과수계약재배 출하비용 지원",
    "deadline": "2025-01-01 ~ 2025-08-31",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-01-01",
    "endDate": "2025-08-31",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "과수계약재배 출하비 지원",
      "농림어업",
      "경기",
      "경기도 가평군",
      "마감",
      "농어업인",
      "전체",
      "농업인",
      "등에게",
      "과수계약재배",
      "출하비용",
      "지원"
    ],
    "summary": "농업인 등에게 과수계약재배 출하비용 지원",
    "audience": "○ 생산자단체(APC등)와 계약물량의 50% 이상 출하약정을 통해 공동선별⸱포장⸱규격출하⸱판매 등을 실시하는 도내 과수생산 농업인\n\n○ 공동으로 선별⸱포장⸱저온저장⸱규격출하⸱마케팅⸱판매 등에 소요되는 출하비용(과수농가 지급비용) 지원\n - 지원품목 : 배, 사과, 포도, 복숭아, 체리, 블루베리, 수박, 방울토마토(신규)\n\n - (기존품목) 배, 사과, 포도, 복숭아, 체리, 블루베리 500천원/톤\n - (신규진입품목) 수박, 방울토마토 300천원/톤",
    "benefits": [
      "농업인 등에게 과수계약재배 출하비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000110",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 생산자단체(APC등)와 계약물량의 50% 이상 출하약정을 통해 공동선별⸱포장⸱규격출하⸱판매 등을 실시하는 도내 과수생산 농업인\n\n○ 공동으로 선별⸱포장⸱저온저장⸱규격출하⸱마케팅⸱판매 등에 소요되는 출하비용(과수농가 지급비용) 지원\n - 지원품목 : 배, 사과, 포도, 복숭아, 체리, 블루베리, 수박, 방울토마토(신규)\n\n - (기존품목) 배, 사과, 포도, 복숭아, 체리, 블루베리 500천원/톤\n - (신규진입품목) 수박, 방울토마토 300천원/톤",
      "benefit": "농업인 등에게 과수계약재배 출하비용 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-친환경-유기질-비료-지원",
    "title": "친환경 유기질 비료 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "농업경영체를 등록한 농가에 친환경 유기질비료 지원",
    "deadline": "2025-11-01 ~ 2025-12-31",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-11-01",
    "endDate": "2025-12-31",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "친환경 유기질 비료 지원",
      "농림어업",
      "경기",
      "경기도 가평군",
      "마감",
      "농어업인",
      "전체",
      "농업경영체를",
      "등록한",
      "농가에",
      "친환경",
      "유기질비료"
    ],
    "summary": "농업경영체를 등록한 농가에 친환경 유기질비료 지원",
    "audience": "○ 가평군 관내에 주소를 두고 농업경영체를 등록한 농업인에게 농업경영체 등록정보에 등록된 농지를 대상으로 유기질비료 지원",
    "benefits": [
      "농업경영체를 등록한 농가에 친환경 유기질비료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000112",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000112",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가평군 관내에 주소를 두고 농업경영체를 등록한 농업인에게 농업경영체 등록정보에 등록된 농지를 대상으로 유기질비료 지원",
      "benefit": "농업경영체를 등록한 농가에 친환경 유기질비료 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-가축재해보험료지원",
    "title": "가축재해보험료지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "가축재해보험료 지원",
    "deadline": "2026-01-01 ~ 2026-11-30",
    "dday": "D-188",
    "status": "모집중",
    "startDate": "2026-01-01",
    "endDate": "2026-11-30",
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "가축재해보험료지원",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "모집중",
      "농어업인",
      "전체",
      "가축재해보험료",
      "지원"
    ],
    "summary": "가축재해보험료 지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 11월(11개월)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 가축재해보험료 지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. ~ 11. : 보험사에 가축재해보험 가입 신청\n - 취급기관: NH농협손해보험, KB손해보험, DB손해보험, 한화손해보험\n◦ 2026 12. : 보험사별 지자체 부담분 정산 및 지급",
    "benefits": [
      "가축재해보험료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 가축재해보험 취급기관에 직접 연락하여 가입신청\n- 취급기관: NH농협손해보험, KB손해보험, DB손해보험, 한화손해보험",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000141",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000141",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 11월(11개월)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 가축재해보험료 지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. ~ 11. : 보험사에 가축재해보험 가입 신청\n - 취급기관: NH농협손해보험, KB손해보험, DB손해보험, 한화손해보험\n◦ 2026 12. : 보험사별 지자체 부담분 정산 및 지급",
      "benefit": "가축재해보험료 지원",
      "application": "○ 가축재해보험 취급기관에 직접 연락하여 가입신청\n- 취급기관: NH농협손해보험, KB손해보험, DB손해보험, 한화손해보험",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-gap-명품사과-재배단지-조성-지원",
    "title": "GAP 명품사과 재배단지 조성 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "GAP인증 및 신규 희망농가 대상으로 명품사과 재배단지 조성 지원",
    "deadline": "2023-01-16 ~ 2023-02-10",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2023-01-16",
    "endDate": "2023-02-10",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "GAP 명품사과 재배단지 조성 지원",
      "교육",
      "경북",
      "경상북도 청송군",
      "마감",
      "농어업인",
      "전체",
      "GAP인증",
      "및",
      "신규",
      "희망농가",
      "대상으로"
    ],
    "summary": "GAP인증 및 신규 희망농가 대상으로 명품사과 재배단지 조성 지원",
    "audience": "- 시기별 병해충 관리 요령 및 GAP 단지 교육실시(정기교육 및 GAP 인증 교육)\n - 우수농산물관리제도(GAP) 인증\n - 홍보행사를 통한 청송사과 이미지 제고\n - 사과원 농자재 투입으로 친환경 농업 실천",
    "benefits": [
      "GAP인증 및 신규 희망농가 대상으로 명품사과 재배단지 조성 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 청송군 농업기술센터\n\n○ 기타 \n - 팩스, 메일",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000105",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 시기별 병해충 관리 요령 및 GAP 단지 교육실시(정기교육 및 GAP 인증 교육)\n - 우수농산물관리제도(GAP) 인증\n - 홍보행사를 통한 청송사과 이미지 제고\n - 사과원 농자재 투입으로 친환경 농업 실천",
      "benefit": "GAP인증 및 신규 희망농가 대상으로 명품사과 재배단지 조성 지원",
      "application": "○ 방문 신청\n - 기타 : 청송군 농업기술센터\n\n○ 기타 \n - 팩스, 메일",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-불량-모돈-갱신-지원",
    "title": "불량 모돈 갱신 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "양돈사육농가에 등록된 종돈장에서 구입한 모돈 구입비 지원",
    "deadline": "2026-01-12 ~ 2026-01-12",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2026-01-12",
    "endDate": "2026-01-12",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "불량 모돈 갱신 지원",
      "농림어업",
      "경북",
      "경상북도 경산시",
      "마감",
      "농어업인",
      "전체",
      "양돈사육농가에",
      "등록된",
      "종돈장에서",
      "구입한",
      "모돈"
    ],
    "summary": "양돈사육농가에 등록된 종돈장에서 구입한 모돈 구입비 지원",
    "audience": "○ 지원대상 : 경산시 양돈농가\n\n○ 지원내용 : 모돈 구입비 지원\n\n○ 지원금액 : 60만원/두\n\n○ 지원방법 : 사업완료 확인 후 보조금청구에 의한 계좌지급",
    "benefits": [
      "양돈사육농가에 등록된 종돈장에서 구입한 모돈 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : (사)대한한돈협회경산지부 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000107",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000107",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상 : 경산시 양돈농가\n\n○ 지원내용 : 모돈 구입비 지원\n\n○ 지원금액 : 60만원/두\n\n○ 지원방법 : 사업완료 확인 후 보조금청구에 의한 계좌지급",
      "benefit": "양돈사육농가에 등록된 종돈장에서 구입한 모돈 구입비 지원",
      "application": "○ 방문 신청\n - 기타 : (사)대한한돈협회경산지부 방문",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-과실생산비절감-및-품질제고-지원",
    "title": "과실생산비절감 및 품질제고 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "과수 재배농가 등에 신선도유지기, 비파괴당도측정기, 농업용수처리기 등 지원",
    "deadline": "2025-01-13 ~ 2025-01-31",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-01-13",
    "endDate": "2025-01-31",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "과실생산비절감 및 품질제고 지원",
      "농림어업",
      "경북",
      "경상북도 경산시",
      "마감",
      "농어업인",
      "전체",
      "과수",
      "재배농가",
      "등에",
      "신선도유지기,",
      "비파괴당도측정기,"
    ],
    "summary": "과수 재배농가 등에 신선도유지기, 비파괴당도측정기, 농업용수처리기 등 지원",
    "audience": "○ 신선도유지기, 비파괴당도측정기, 농업용수처리기 등 지원",
    "benefits": [
      "과수 재배농가 등에 신선도유지기, 비파괴당도측정기, 농업용수처리기 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청\n\n○ 기타\n - 팩스,우편,이메일",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000108",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000108",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 신선도유지기, 비파괴당도측정기, 농업용수처리기 등 지원",
      "benefit": "과수 재배농가 등에 신선도유지기, 비파괴당도측정기, 농업용수처리기 등 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청\n\n○ 기타\n - 팩스,우편,이메일",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-청년-1-1-맞춤형-취업-멘토링-지원",
    "title": "청년 1:1 맞춤형 취업 멘토링 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "개인별 맞춤형 서비스 제공(총 5회)",
    "deadline": "2026-01-28 ~ 2026-11-30",
    "dday": "D-188",
    "status": "모집중",
    "startDate": "2026-01-28",
    "endDate": "2026-11-30",
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "청년·취업·사업",
    "targetGroup": "청년, 구직자",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "청년 1:1 맞춤형 취업 멘토링 지원",
      "청년",
      "경기",
      "경기도 김포시",
      "모집중",
      "구직자",
      "취업",
      "사업",
      "개인별",
      "맞춤형",
      "서비스",
      "제공(총"
    ],
    "summary": "개인별 맞춤형 서비스 제공(총 5회)",
    "audience": "개인별 맞춤형 서비스 제공(총 5회) \n - 취업진로 설계, 자기소개서 작성, 면접준비 등 취업과정 전반에 대하여 개인별 맞춤형 서비스 제공",
    "benefits": [
      "개인별 맞춤형 서비스 제공(총 5회)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 또는 온라인\n - 방문 신청 : 김포시청년지원센터(경기도 김포시 사우동 924번지, 제우스프라자 5층)\n - 온라인 신청 : 잡아바어플라이(https://apply.jobaba.net)\n\n온라인: https://apply.jobaba.net/",
    "officialUrl": "https://apply.jobaba.net/",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000145",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "개인별 맞춤형 서비스 제공(총 5회) \n - 취업진로 설계, 자기소개서 작성, 면접준비 등 취업과정 전반에 대하여 개인별 맞춤형 서비스 제공",
      "benefit": "개인별 맞춤형 서비스 제공(총 5회)",
      "application": "방문 또는 온라인\n - 방문 신청 : 김포시청년지원센터(경기도 김포시 사우동 924번지, 제우스프라자 5층)\n - 온라인 신청 : 잡아바어플라이(https://apply.jobaba.net)\n\n온라인: https://apply.jobaba.net/",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-동대문구-전세피해임차인-지원-소송비용",
    "title": "동대문구 전세피해임차인 지원(소송비용)",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "보증금 회수 소송비용 지원으로 전세피해 임차인의 금전적 피해 경감 목적",
    "deadline": "2025-01-23 ~ 2025-01-23",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-01-23",
    "endDate": "2025-01-23",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "주거",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 전세피해임차인 지원(소송비용)",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "마감",
      "일반",
      "전체",
      "보증금",
      "회수",
      "소송비용",
      "지원으로",
      "전세피해"
    ],
    "summary": "보증금 회수 소송비용 지원으로 전세피해 임차인의 금전적 피해 경감 목적",
    "audience": "전세보증금 회수 소송비용 지원\n - 지원내용: 보증금 회수를 위한 법적절차(보증금지급명령, 보증금반환청구소송)를 진행한 전세사기피해자\n - 지원금액: 1가구당 100만원(정액), 1회\n ㆍ변호사 선임비용, 형사소송 등 제외",
    "benefits": [
      "보증금 회수 소송비용 지원으로 전세피해 임차인의 금전적 피해 경감 목적"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "❍ 신 청 인: 피해자 본인 또는 대리인(위임장, 신분증 사본 필요)\n❍ 신청방법\n - 방문신청: 동대문구청 부동산정보과(전세피해 지원센터) 방문신청(09:00~18:00)\n - 온라인신청: 정부24(혜택알리미)(www.gov.kr) → 본인인증(로그인) → \"동대문구 전세피해임차인 지원\" 검색",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000275",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000275",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "전세보증금 회수 소송비용 지원\n - 지원내용: 보증금 회수를 위한 법적절차(보증금지급명령, 보증금반환청구소송)를 진행한 전세사기피해자\n - 지원금액: 1가구당 100만원(정액), 1회\n ㆍ변호사 선임비용, 형사소송 등 제외",
      "benefit": "보증금 회수 소송비용 지원으로 전세피해 임차인의 금전적 피해 경감 목적",
      "application": "❍ 신 청 인: 피해자 본인 또는 대리인(위임장, 신분증 사본 필요)\n❍ 신청방법\n - 방문신청: 동대문구청 부동산정보과(전세피해 지원센터) 방문신청(09:00~18:00)\n - 온라인신청: 정부24(혜택알리미)(www.gov.kr) → 본인인증(로그인) → \"동대문구 전세피해임차인 지원\" 검색",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-전세피해임차인-지원-주거안정자금",
    "title": "동대문구 전세피해임차인 지원(주거안정자금)",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "전세사기피해자가 거주 중인 주택의 안전위험 요소 제거로 주거불안 해소",
    "deadline": "2025-01-23 ~ 2025-01-23",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-01-23",
    "endDate": "2025-01-23",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "주거",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 전세피해임차인 지원(주거안정자금)",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "마감",
      "일반",
      "전체",
      "전세사기피해자가",
      "거주",
      "중인",
      "주택의",
      "안전위험"
    ],
    "summary": "전세사기피해자가 거주 중인 주택의 안전위험 요소 제거로 주거불안 해소",
    "audience": "주거안정자금 지원\n - 지원내용: 전세사기피해주택의 안전위험 조치를 위한 주거안정자금 지원\n - 지원금액: 1가구당 100만원(정액), 1회\n\n※ 중복신청 및 지원 불가\n다른 법령이나 조례에 따라 유사한 사유로 지원을 받은 경우 지원하지 않을 수 있음",
    "benefits": [
      "전세사기피해자가 거주 중인 주택의 안전위험 요소 제거로 주거불안 해소"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "❍ 신 청 인: 피해자 본인 또는 대리인(위임장, 신분증 사본 필요)\n❍ 신청방법\n - 방문신청: 동대문구청 부동산정보과(전세피해지원센터) 방문신청(09:00~18:00)\n - 온라인신청: 정부24(혜택알리미)(www.gov.kr) → 본인인증(로그인) → \"동대문구 전세피해임차인 지원\" 검색",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000276",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000276",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "주거안정자금 지원\n - 지원내용: 전세사기피해주택의 안전위험 조치를 위한 주거안정자금 지원\n - 지원금액: 1가구당 100만원(정액), 1회\n\n※ 중복신청 및 지원 불가\n다른 법령이나 조례에 따라 유사한 사유로 지원을 받은 경우 지원하지 않을 수 있음",
      "benefit": "전세사기피해자가 거주 중인 주택의 안전위험 요소 제거로 주거불안 해소",
      "application": "❍ 신 청 인: 피해자 본인 또는 대리인(위임장, 신분증 사본 필요)\n❍ 신청방법\n - 방문신청: 동대문구청 부동산정보과(전세피해지원센터) 방문신청(09:00~18:00)\n - 온라인신청: 정부24(혜택알리미)(www.gov.kr) → 본인인증(로그인) → \"동대문구 전세피해임차인 지원\" 검색",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-유기질비료-지원",
    "title": "유기질비료 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "유기질비료 지원사업 - 유기질비료(3종), 부숙유기질비료(2종) 구입비 일부 보조",
    "deadline": "2025-11-10 ~ 2025-12-10",
    "dday": "확인필요",
    "status": "마감",
    "startDate": "2025-11-10",
    "endDate": "2025-12-10",
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "known",
    "requiresOfficialConfirmation": false,
    "warnings": [],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": true,
      "showDday": true,
      "requiresOfficialConfirmation": false
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "유기질비료 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "마감",
      "농어업인",
      "전체",
      "유기질비료",
      "지원사업",
      "-",
      "유기질비료(3종),",
      "부숙유기질비료(2종)"
    ],
    "summary": "유기질비료 지원사업 - 유기질비료(3종), 부숙유기질비료(2종) 구입비 일부 보조",
    "audience": "유기질비료 지원사업\n- 유기질비료(3종), 부숙유기질비료(2종) 구입비 일부 보조",
    "benefits": [
      "유기질비료 지원사업 - 유기질비료(3종), 부숙유기질비료(2종) 구입비 일부 보조"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "※ 지원(공급)대상 비료의 종류, 품질등급, 신청물량(포) 및 공급시기(월) 등을 작성하여 신청기간내에 해당 읍·면·동에 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514100000010",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514100000010",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "유기질비료 지원사업\n- 유기질비료(3종), 부숙유기질비료(2종) 구입비 일부 보조",
      "benefit": "유기질비료 지원사업 - 유기질비료(3종), 부숙유기질비료(2종) 구입비 일부 보조",
      "application": "※ 지원(공급)대상 비료의 종류, 품질등급, 신청물량(포) 및 공급시기(월) 등을 작성하여 신청기간내에 해당 읍·면·동에 신청",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-장위석관-보건지소-만성질환관리사업",
    "title": "장위석관 보건지소 만성질환관리사업",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "관내 거주 20세 이상 성인 대상 만성질환예방 검사 및 프로그램 운영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장위석관 보건지소 만성질환관리사업",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "일반",
      "아동",
      "전체",
      "관내",
      "거주",
      "20세",
      "이상"
    ],
    "summary": "관내 거주 20세 이상 성인 대상 만성질환예방 검사 및 프로그램 운영",
    "audience": "O 만성질환(대사증후군) 예방관리\n -대 상 : 성북구민 20세 이상 성인 \n -신청방법 : 사전 예약제 (전화 및 방문) \n -검사항목 : 대사증후군 검진\n (혈압, 혈당, 중성지방, 콜레스테롤, 허리둘레, 체성분 측정)\n -검사 후 건강/영양/운동 맞춤형 상담\n -준비사항 : 사전예약 후 검사 전날 10시간 이상 금식 유지\n\n*단독으로 체성분 측정만은 불가능",
    "benefits": [
      "관내 거주 20세 이상 성인 대상 만성질환예방 검사 및 프로그램 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000130",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000130",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "O 만성질환(대사증후군) 예방관리\n -대 상 : 성북구민 20세 이상 성인 \n -신청방법 : 사전 예약제 (전화 및 방문) \n -검사항목 : 대사증후군 검진\n (혈압, 혈당, 중성지방, 콜레스테롤, 허리둘레, 체성분 측정)\n -검사 후 건강/영양/운동 맞춤형 상담\n -준비사항 : 사전예약 후 검사 전날 10시간 이상 금식 유지\n\n*단독으로 체성분 측정만은 불가능",
      "benefit": "관내 거주 20세 이상 성인 대상 만성질환예방 검사 및 프로그램 운영",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-성북구민-자전거보험",
    "title": "성북구민 자전거보험",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "성북구민이 자전거 운전중, 자전거 탑승중, 보행중 자전거로부터 입은 사고에 대하여 보장",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "성북구민 자전거보험",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "모집중",
      "일반",
      "아동",
      "전체",
      "성북구민이",
      "자전거",
      "운전중,",
      "탑승중,"
    ],
    "summary": "성북구민이 자전거 운전중, 자전거 탑승중, 보행중 자전거로부터 입은 사고에 대하여 보장",
    "audience": "성북구민 자전거보험 \n- 시행시기: 2022년 2월 15일부터\n- 성북구민이 국내 어디서든 자전거 운전중, 자전거 탑승중, 보행중 자전거로부터 입은 사고에 대하여 보장\n\n보장내용\n - 사 망 / 자전거 교통사고로 사망한경우(만15세 미만 제외)/ 1,000만원 \n - 후유장해 /자전거 교통사고로 3% ~100% 후유장해시 / 1,000만원 한도\n - 진단위로금/ 교통사고로 4주이상 치료를 요하는 진단을 받은 경우 진단일에 따라 1회지급(최초진단기준)/20~60만원 \n - 입원위로금/ 자전거 교통사고로 7일 이상 입원 시 / 20만원\n - 자전거사고 벌금/ 자전거 운전중 타인을 사상케 하여 확정판결로 벌금 부담시(만 14세미만 제외)/ 2,000만원 한도\n - 변호사 선임비용/자전거 운전 중 타인을 사상케 하여 구속영장에 의해 구속되거나 검찰에 공소제기 된 경우\n (만14세 미만자 제외, 약식기소 제외)/ 200만원 한도\n - 교통사고 처리지원금/자전거 운전 중 타인을 사망하게 하거나, 중대법규위반 교통사고로 피해자가 42일이상 진단을 받은 경우, \n 일반교통사고로 중상해를 입히는 등에 의하여 검찰에 의해 공소제기되어 형사합의 시(만14세 미만자 제외)/ 3,000만원 한도",
    "benefits": [
      "성북구민이 자전거 운전중, 자전거 탑승중, 보행중 자전거로부터 입은 사고에 대하여 보장"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000124",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000124",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "성북구민 자전거보험 \n- 시행시기: 2022년 2월 15일부터\n- 성북구민이 국내 어디서든 자전거 운전중, 자전거 탑승중, 보행중 자전거로부터 입은 사고에 대하여 보장\n\n보장내용\n - 사 망 / 자전거 교통사고로 사망한경우(만15세 미만 제외)/ 1,000만원 \n - 후유장해 /자전거 교통사고로 3% ~100% 후유장해시 / 1,000만원 한도\n - 진단위로금/ 교통사고로 4주이상 치료를 요하는 진단을 받은 경우 진단일에 따라 1회지급(최초진단기준)/20~60만원 \n - 입원위로금/ 자전거 교통사고로 7일 이상 입원 시 / 20만원\n - 자전거사고 벌금/ 자전거 운전중 타인을 사상케 하여 확정판결로 벌금 부담시(만 14세미만 제외)/ 2,000만원 한도\n - 변호사 선임비용/자전거 운전 중 타인을 사상케 하여 구속영장에 의해 구속되거나 검찰에 공소제기 된 경우\n (만14세 미만자 제외, 약식기소 제외)/ 200만원 한도\n - 교통사고 처리지원금/자전거 운전 중 타인을 사망하게 하거나, 중대법규위반 교통사고로 피해자가 42일이상 진단을 받은 경우, \n 일반교통사고로 중상해를 입히는 등에 의하여 검찰에 의해 공소제기되어 형사합의 시(만14세 미만자 제외)/ 3,000만원 한도",
      "benefit": "성북구민이 자전거 운전중, 자전거 탑승중, 보행중 자전거로부터 입은 사고에 대하여 보장",
      "application": "신청불필요",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-건강한-치아만들기",
    "title": "건강한 치아만들기",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "성북구민을 대상으로 구강진료 및 검진, 교육 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "건강한 치아만들기",
      "청년",
      "서울",
      "서울특별시 성북구",
      "상시",
      "부모/육아",
      "아동",
      "청소년",
      "중장년",
      "임신·출산·육아",
      "성북구민을",
      "대상으로"
    ],
    "summary": "성북구민을 대상으로 구강진료 및 검진, 교육 등 지원",
    "audience": "○ 만 55세 이상 중장년층 불소도포\n\n○ 6~16세 청소년 불소도포\n\n○ 미취학아동 및 세자녀 1~2학년 실런트\n\n○ 임산부 및 영유아 구강검진 및 교육/유치발치 등",
    "benefits": [
      "성북구민을 대상으로 구강진료 및 검진, 교육 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000111",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000111",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 만 55세 이상 중장년층 불소도포\n\n○ 6~16세 청소년 불소도포\n\n○ 미취학아동 및 세자녀 1~2학년 실런트\n\n○ 임산부 및 영유아 구강검진 및 교육/유치발치 등",
      "benefit": "성북구민을 대상으로 구강진료 및 검진, 교육 등 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-학생-결핵-이동검진서비스",
    "title": "학생 결핵 이동검진서비스",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "중학교 2, 3학년 및 고등학교 2학년 학생에게 결핵 검진 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "학생 결핵 이동검진서비스",
      "교육",
      "서울",
      "서울특별시 성북구",
      "상시",
      "일반",
      "전체",
      "중학교",
      "2,",
      "3학년",
      "및",
      "고등학교"
    ],
    "summary": "중학교 2, 3학년 및 고등학교 2학년 학생에게 결핵 검진 지원",
    "audience": "○ 중학교 2, 3학년 및 고등학교 2학년 학생 결핵 이동검진",
    "benefits": [
      "중학교 2, 3학년 및 고등학교 2학년 학생에게 결핵 검진 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000104",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000104",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 중학교 2, 3학년 및 고등학교 2학년 학생 결핵 이동검진",
      "benefit": "중학교 2, 3학년 및 고등학교 2학년 학생에게 결핵 검진 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-저소득-장애인-무료급식-지원",
    "title": "저소득 장애인 무료급식 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "○ 저소득 장애인에게 중식 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득 장애인 무료급식 지원",
      "복지",
      "서울",
      "서울특별시 성북구",
      "상시",
      "장애인",
      "전체",
      "○",
      "저소득",
      "장애인에게",
      "중식",
      "지원"
    ],
    "summary": "○ 저소득 장애인에게 중식 지원",
    "audience": "○ 저소득 또는 결식우려가 있는 장애인에게 중식 지원",
    "benefits": [
      "○ 저소득 장애인에게 중식 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000108",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000108",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 저소득 또는 결식우려가 있는 장애인에게 중식 지원",
      "benefit": "○ 저소득 장애인에게 중식 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-장애인등록-진단서발급비-및-검사비-지급",
    "title": "장애인등록 진단서발급비 및 검사비 지급",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "장애등록 또는 재판정에 소요되는 비용을 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인등록 진단서발급비 및 검사비 지급",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "장애인",
      "전체",
      "복지",
      "장애등록",
      "또는",
      "재판정에",
      "소요되는"
    ],
    "summary": "장애등록 또는 재판정에 소요되는 비용을 지원",
    "audience": "○ 장애정도 심사용 진단서 발급비용 및 검사비 지원사업\n - 일반장애인 : 직권재판정 한정 지원가능\n - 차상위계층 : 모든 재판정에서 지원가능\n - 기초생활수급자 : 장애인 신규등록 시에도 지원가능\n\n○ 1회 지원 한도액\n - 진단서발급비(지적장애, 자폐성장애, 정신장애) : 4만원\n - 진단서발급비(그 외 장애) : 1만5천원\n - 검사비 : 10만원",
    "benefits": [
      "장애등록 또는 재판정에 소요되는 비용을 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000118",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000118",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장애정도 심사용 진단서 발급비용 및 검사비 지원사업\n - 일반장애인 : 직권재판정 한정 지원가능\n - 차상위계층 : 모든 재판정에서 지원가능\n - 기초생활수급자 : 장애인 신규등록 시에도 지원가능\n\n○ 1회 지원 한도액\n - 진단서발급비(지적장애, 자폐성장애, 정신장애) : 4만원\n - 진단서발급비(그 외 장애) : 1만5천원\n - 검사비 : 10만원",
      "benefit": "장애등록 또는 재판정에 소요되는 비용을 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-저소득층-국민건강보험료-지원",
    "title": "저소득층 국민건강보험료 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "저소득층 취약계층 건강보험료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득층 국민건강보험료 지원",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "저소득층",
      "취약계층",
      "건강보험료"
    ],
    "summary": "저소득층 취약계층 건강보험료 지원",
    "audience": "국민건강보험공단 서울특별시 성북구 지역가입자로서 보험료 부과금액이 최저보험료(「월별 건강보험료액의 상한과 하한에 관한 고시」에 따른 월별 보험료의 하한액과 이에 따른 노인장기요양보험료를 합한 보험료) 이하를 납부하는 65세 이상 노인가구, 등록장애인 가구, 기타 한부모 또는 조손가구, 만성질환자 가구 등에 국민건강보험료 및 노인장기요양보험료를 지원",
    "benefits": [
      "저소득층 취약계층 건강보험료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000101",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "국민건강보험공단 서울특별시 성북구 지역가입자로서 보험료 부과금액이 최저보험료(「월별 건강보험료액의 상한과 하한에 관한 고시」에 따른 월별 보험료의 하한액과 이에 따른 노인장기요양보험료를 합한 보험료) 이하를 납부하는 65세 이상 노인가구, 등록장애인 가구, 기타 한부모 또는 조손가구, 만성질환자 가구 등에 국민건강보험료 및 노인장기요양보험료를 지원",
      "benefit": "저소득층 취약계층 건강보험료 지원",
      "application": "신청불필요",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-자활기업-지원",
    "title": "자활기업 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "자활기업에 한시적 인건비지원 (수급 참여자,전문인력), 임대보증금 융자지원, 교육비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·사업·복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "자활기업 지원",
      "주거",
      "서울",
      "서울특별시 성북구",
      "상시",
      "일반",
      "전체",
      "사업",
      "복지",
      "자활기업에",
      "한시적",
      "인건비지원"
    ],
    "summary": "자활기업에 한시적 인건비지원 (수급 참여자,전문인력), 임대보증금 융자지원, 교육비 지원",
    "audience": "○ 자활기업 한시적 인건비 지원\n - (수급참여자) 1년단위로 (최대5년) 시장진입형 자활급여 기타수당(주차,월차,실비) 등 지원\n\n ○ 자활기업 전문인력 한시적 인건비 지원\n - 기업당 1회에 한하여 1년단위(최대 5년) 지원\n\n ○ 전세점포 임대보증금 융자지원\n - 성북구 자활사업단 및 자활기업 전세점포 임대보증금 융자지원 \n 2년단위(3회연장 최대 6년 /최초기간 포함)",
    "benefits": [
      "자활기업에 한시적 인건비지원 (수급 참여자,전문인력), 임대보증금 융자지원, 교육비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000113",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000113",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 자활기업 한시적 인건비 지원\n - (수급참여자) 1년단위로 (최대5년) 시장진입형 자활급여 기타수당(주차,월차,실비) 등 지원\n\n ○ 자활기업 전문인력 한시적 인건비 지원\n - 기업당 1회에 한하여 1년단위(최대 5년) 지원\n\n ○ 전세점포 임대보증금 융자지원\n - 성북구 자활사업단 및 자활기업 전세점포 임대보증금 융자지원 \n 2년단위(3회연장 최대 6년 /최초기간 포함)",
      "benefit": "자활기업에 한시적 인건비지원 (수급 참여자,전문인력), 임대보증금 융자지원, 교육비 지원",
      "application": "정부24온라인신청||방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-장애인환자-약제비-지원",
    "title": "장애인환자 약제비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "장애인환자에게 약제비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인환자 약제비 지원",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "장애인",
      "전체",
      "복지",
      "장애인환자에게",
      "약제비",
      "지원"
    ],
    "summary": "장애인환자에게 약제비 지원",
    "audience": "○ 성북구에 거주하는 등록 장애인이 보건소에서 처방 받을시에 장애 등급과 관계없이 약제비 총액에서 3,000원 지원",
    "benefits": [
      "장애인환자에게 약제비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000112",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000112",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 성북구에 거주하는 등록 장애인이 보건소에서 처방 받을시에 장애 등급과 관계없이 약제비 총액에서 3,000원 지원",
      "benefit": "장애인환자에게 약제비 지원",
      "application": "신청불필요",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-장애인가정-출산지원금-지원",
    "title": "장애인가정 출산지원금 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "성북구에서 출산한 장애인가정에 출산지원금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인가정 출산지원금 지원",
      "복지",
      "서울",
      "서울특별시 성북구",
      "상시",
      "부모/육아",
      "장애인",
      "전체",
      "임신·출산·육아",
      "성북구에서",
      "출산한",
      "장애인가정에"
    ],
    "summary": "성북구에서 출산한 장애인가정에 출산지원금 지급",
    "audience": "- 지원금액 : 출산한 자녀 1인 기준 50만원 지급\n- 지급방법 : 신청시 제출한 장애인 명의 계좌 입금\n- 신청장소 : 주소지 읍·면·동 주민센터",
    "benefits": [
      "성북구에서 출산한 장애인가정에 출산지원금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000109",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000109",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 지원금액 : 출산한 자녀 1인 기준 50만원 지급\n- 지급방법 : 신청시 제출한 장애인 명의 계좌 입금\n- 신청장소 : 주소지 읍·면·동 주민센터",
      "benefit": "성북구에서 출산한 장애인가정에 출산지원금 지급",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-성북구-체성분-검사-인바디-검사-및-상담",
    "title": "성북구 체성분 검사(인바디) 검사 및 상담",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "체성분검사 및 상담 / 구민만 가능",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "성북구 체성분 검사(인바디) 검사 및 상담",
      "교육",
      "서울",
      "서울특별시 성북구",
      "모집중",
      "일반",
      "전체",
      "체성분검사",
      "및",
      "상담",
      "/",
      "구민만"
    ],
    "summary": "체성분검사 및 상담 / 구민만 가능",
    "audience": "[성북구]\n\n- 체성분검사 및 상담 가능시간 : 9시 30분 부터 17시까지 (1인당 30분 간격, 동시에 여러명 불가)\n\n- 사전 전화 예약 필요 (12-13시 점심시간 불가)\n\n- 성북구민 및 성북구 내 직장인, 학생만 가능 (타구 불가)\n\n- 토요일 측정 불가",
    "benefits": [
      "체성분검사 및 상담 / 구민만 가능"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000142",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000142",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "[성북구]\n\n- 체성분검사 및 상담 가능시간 : 9시 30분 부터 17시까지 (1인당 30분 간격, 동시에 여러명 불가)\n\n- 사전 전화 예약 필요 (12-13시 점심시간 불가)\n\n- 성북구민 및 성북구 내 직장인, 학생만 가능 (타구 불가)\n\n- 토요일 측정 불가",
      "benefit": "체성분검사 및 상담 / 구민만 가능",
      "application": "직접입력",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-미혼-한부모-자녀-의료비-지원",
    "title": "미혼 한부모 자녀 의료비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "관내 5세이하의 자녀를 둔 미혼 한부모 및 그자녀의 의료비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "미혼 한부모 자녀 의료비 지원",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "일반",
      "아동",
      "전체",
      "관내",
      "5세이하의",
      "자녀를",
      "둔"
    ],
    "summary": "관내 5세이하의 자녀를 둔 미혼 한부모 및 그자녀의 의료비 지원",
    "audience": "○ 5세이하의 자녀를 둔 미혼 한부모 및 그자녀의 의료비 지원\n - 한 가정당 100만원 한도",
    "benefits": [
      "관내 5세이하의 자녀를 둔 미혼 한부모 및 그자녀의 의료비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청||직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000102",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000102",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 5세이하의 자녀를 둔 미혼 한부모 및 그자녀의 의료비 지원\n - 한 가정당 100만원 한도",
      "benefit": "관내 5세이하의 자녀를 둔 미혼 한부모 및 그자녀의 의료비 지원",
      "application": "정부24온라인신청||방문신청||직접입력",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-성북구푸드마켓센터-이용-지원",
    "title": "성북구푸드마켓센터 이용 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "식품 및 생활용품 등을 기부 받아 저소득 저소득 복지소외계층을 대상으로 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·주거·복지",
    "targetGroup": "부모/육아, 어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "성북구푸드마켓센터 이용 지원",
      "주거",
      "서울",
      "서울특별시 성북구",
      "상시",
      "부모/육아",
      "어르신",
      "장애인",
      "아동",
      "임신·출산·육아",
      "복지",
      "식품"
    ],
    "summary": "식품 및 생활용품 등을 기부 받아 저소득 저소득 복지소외계층을 대상으로 지원",
    "audience": "○ 성북구푸드마켓 이용 지원\n - 제조·유통기업 및 개인으로부터 식품 및 생활용품 등을 기부 받아 결식아동, 독거 어르신, 재가 장애인, 저소득 복지소외계층을 대상으로 지원\n○ 신청방법 : 거주지 동 주민센터 방문하여 신청서 제출(신분증 지참)\n○ 이용대상 및 이용기간 : 생활실태에 따라 1회 연장 가능. 이용 종료 후 1년 간 이용 불가.\n 식용품, 밑반찬, 도시락 등 타 식품지원사업 지원대상자는 중복지원 불가\n - 1순위 : 긴급지원대상자 - 1년\n - 2순위 : 차상위계층, 생계의료급여를 받지 아니하는 주거교육급여 수급자 - 9개월\n - 3순위 : 생계의료급여 수급신청 탈락자, 중지자 등 긴급한 필요성이 인정되는 저소득 재가대상자 - 6개월\n - 4순위 : 생계의료급여 수급자 - 6개월\n○ 이용방법 : 이용자가 푸드마켓센터에 월1회 직접 방문하여 5개 이내 품목 수령",
    "benefits": [
      "식품 및 생활용품 등을 기부 받아 저소득 저소득 복지소외계층을 대상으로 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000150",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000150",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 성북구푸드마켓 이용 지원\n - 제조·유통기업 및 개인으로부터 식품 및 생활용품 등을 기부 받아 결식아동, 독거 어르신, 재가 장애인, 저소득 복지소외계층을 대상으로 지원\n○ 신청방법 : 거주지 동 주민센터 방문하여 신청서 제출(신분증 지참)\n○ 이용대상 및 이용기간 : 생활실태에 따라 1회 연장 가능. 이용 종료 후 1년 간 이용 불가.\n 식용품, 밑반찬, 도시락 등 타 식품지원사업 지원대상자는 중복지원 불가\n - 1순위 : 긴급지원대상자 - 1년\n - 2순위 : 차상위계층, 생계의료급여를 받지 아니하는 주거교육급여 수급자 - 9개월\n - 3순위 : 생계의료급여 수급신청 탈락자, 중지자 등 긴급한 필요성이 인정되는 저소득 재가대상자 - 6개월\n - 4순위 : 생계의료급여 수급자 - 6개월\n○ 이용방법 : 이용자가 푸드마켓센터에 월1회 직접 방문하여 5개 이내 품목 수령",
      "benefit": "식품 및 생활용품 등을 기부 받아 저소득 저소득 복지소외계층을 대상으로 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-성북구-어르신-건강주치의-사업",
    "title": "성북구 어르신 건강주치의 사업",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "동네의원 건강주치의를 통한 만성질환 및 건강관리, 전담간호사의 가정방문을 통한 건강관리",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "성북구 어르신 건강주치의 사업",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "어르신",
      "아동",
      "복지",
      "동네의원",
      "건강주치의를",
      "통한",
      "만성질환"
    ],
    "summary": "동네의원 건강주치의를 통한 만성질환 및 건강관리, 전담간호사의 가정방문을 통한 건강관리",
    "audience": "○ 어르신 건강주치의 사업\n - 지역사회 중심의 보건‧의료‧복지 포괄케어 서비스를 제공하여 노년의 건강수준 및 삶의 질 만족도 향상을 위한 사업\n - 사업대상: 성북구민 중 65세 이상 건강 취약계층 어르신\n - 제공내용: 노인건강종합평가에 따른 맞춤형 건강관리 및 보건‧의료‧복지 통합서비스 제공\n ㆍ 보건소 전담간호사, 동네의원 건강주치의, 동주민센터 사회복지전담공무원이 함께 어르신에게 필요한 서비스 제공\n ㆍ서비스 비용 무료, 1년 단위로 재평가를 통해 서비스 지속 제공\n ㆍ신청/문의: 보건소(02-2241-5922~8) 혹은 관할 동주민센터",
    "benefits": [
      "동네의원 건강주치의를 통한 만성질환 및 건강관리, 전담간호사의 가정방문을 통한 건강관리"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000139",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000139",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 어르신 건강주치의 사업\n - 지역사회 중심의 보건‧의료‧복지 포괄케어 서비스를 제공하여 노년의 건강수준 및 삶의 질 만족도 향상을 위한 사업\n - 사업대상: 성북구민 중 65세 이상 건강 취약계층 어르신\n - 제공내용: 노인건강종합평가에 따른 맞춤형 건강관리 및 보건‧의료‧복지 통합서비스 제공\n ㆍ 보건소 전담간호사, 동네의원 건강주치의, 동주민센터 사회복지전담공무원이 함께 어르신에게 필요한 서비스 제공\n ㆍ서비스 비용 무료, 1년 단위로 재평가를 통해 서비스 지속 제공\n ㆍ신청/문의: 보건소(02-2241-5922~8) 혹은 관할 동주민센터",
      "benefit": "동네의원 건강주치의를 통한 만성질환 및 건강관리, 전담간호사의 가정방문을 통한 건강관리",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-취약계층-인플루엔자-예방접종-지원",
    "title": "취약계층 인플루엔자 예방접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "취약계층을 대상으로 인플루엔자 예방접종 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "취약계층 인플루엔자 예방접종 지원",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "상시",
      "장애인",
      "아동",
      "중장년",
      "복지",
      "취약계층을",
      "대상으로",
      "인플루엔자"
    ],
    "summary": "취약계층을 대상으로 인플루엔자 예방접종 지원",
    "audience": "○ 장애정도가 심한 장애인, 기초생활수급자, 국가유공자 인플루엔자 1회 무료 접종\n - 국가예방접종 사업 대상자 제외, 기초생활수급자의 경우 만 50세 이상",
    "benefits": [
      "취약계층을 대상으로 인플루엔자 예방접종 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000115",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장애정도가 심한 장애인, 기초생활수급자, 국가유공자 인플루엔자 1회 무료 접종\n - 국가예방접종 사업 대상자 제외, 기초생활수급자의 경우 만 50세 이상",
      "benefit": "취약계층을 대상으로 인플루엔자 예방접종 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-임산부영유아-건강지원",
    "title": "임산부·영유아 건강지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "임산부등록자에게 철분제, 엽산제, 영양제 및 영유아 영양제 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임산부·영유아 건강지원",
      "보건의료",
      "경북",
      "경상북도 청송군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "임산부등록자에게",
      "철분제,",
      "엽산제,",
      "영양제"
    ],
    "summary": "임산부등록자에게 철분제, 엽산제, 영양제 및 영유아 영양제 지원",
    "audience": "○ 임산부등록자에게 철분제, 엽산제, 영양제 및 영유아 영양제(정장제)지원",
    "benefits": [
      "임산부등록자에게 철분제, 엽산제, 영양제 및 영유아 영양제 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000122",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000122",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 임산부등록자에게 철분제, 엽산제, 영양제 및 영유아 영양제(정장제)지원",
      "benefit": "임산부등록자에게 철분제, 엽산제, 영양제 및 영유아 영양제 지원",
      "application": "정부24온라인신청||방문신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-출산육아용품대여방-이용서비스",
    "title": "출산육아용품대여방 이용서비스",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "임산부 및 영유아를 위해 출산육아용품 대여 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "출산육아용품대여방 이용서비스",
      "복지",
      "경북",
      "경상북도 청송군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "임산부",
      "및",
      "영유아를",
      "위해"
    ],
    "summary": "임산부 및 영유아를 위해 출산육아용품 대여 지원",
    "audience": "○ 관내 거주 임산부 및 영유아(36개월 이하)로 회원 등록자에게 1인당 장난감 2점과 도서 3권을 14일간 무료 대여",
    "benefits": [
      "임산부 및 영유아를 위해 출산육아용품 대여 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000119",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000119",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내 거주 임산부 및 영유아(36개월 이하)로 회원 등록자에게 1인당 장난감 2점과 도서 3권을 14일간 무료 대여",
      "benefit": "임산부 및 영유아를 위해 출산육아용품 대여 지원",
      "application": "방문신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-출산장려금-지원",
    "title": "출산장려금 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "출산가정에 출산장려금 및 건강보험료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "출산장려금 지원",
      "보건의료",
      "경북",
      "경상북도 청송군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "출산가정에",
      "출산장려금",
      "및",
      "건강보험료"
    ],
    "summary": "출산가정에 출산장려금 및 건강보험료 지원",
    "audience": "○ 출산장려금 : 첫째아 580만원, 둘째아 700만원, 셋째아 1,600만원, 넷째아 이상 1,900만원 지원\n\n○ 건강보험료(5년납, 10년보장) 지원",
    "benefits": [
      "출산가정에 출산장려금 및 건강보험료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000118",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000118",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 출산장려금 : 첫째아 580만원, 둘째아 700만원, 셋째아 1,600만원, 넷째아 이상 1,900만원 지원\n\n○ 건강보험료(5년납, 10년보장) 지원",
      "benefit": "출산가정에 출산장려금 및 건강보험료 지원",
      "application": "방문신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-저소득구민-명절-위문금-지급-차상위-아동청소년-가구",
    "title": "저소득구민 명절 위문금 지급 (차상위 아동·청소년 가구)",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "동주민센터 추천을 받은 차상위 아동·청소년 250가구에 100,000원 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득구민 명절 위문금 지급 (차상위 아동·청소년 가구)",
      "청년",
      "서울",
      "서울특별시 성북구",
      "모집중",
      "부모/육아",
      "아동",
      "청소년",
      "임신·출산·육아",
      "복지",
      "동주민센터",
      "추천을"
    ],
    "summary": "동주민센터 추천을 받은 차상위 아동·청소년 250가구에 100,000원 지급",
    "audience": "지원대상\n- 차상위 아동·청소년 250가구\n\n지원내용\n- 초·중·고 자녀 학용품비 가구당 100,000원 지원\n\n지원시기\n설, 추석 명절\n\n지원방법\n- 동주민센터 추천 명단 수합 후 수급자의 계좌에 입금",
    "benefits": [
      "동주민센터 추천을 받은 차상위 아동·청소년 250가구에 100,000원 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000110",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "지원대상\n- 차상위 아동·청소년 250가구\n\n지원내용\n- 초·중·고 자녀 학용품비 가구당 100,000원 지원\n\n지원시기\n설, 추석 명절\n\n지원방법\n- 동주민센터 추천 명단 수합 후 수급자의 계좌에 입금",
      "benefit": "동주민센터 추천을 받은 차상위 아동·청소년 250가구에 100,000원 지급",
      "application": "신청불필요",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-저소득구민-명절-위문금-지급-기초-생계의료급여-수급자",
    "title": "저소득구민 명절 위문금 지급 (기초 생계·의료급여 수급자)",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "기초 생계·의료급여 수급자 가구에 50,000원 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득구민 명절 위문금 지급 (기초 생계·의료급여 수급자)",
      "보건의료",
      "서울",
      "서울특별시 성북구",
      "모집중",
      "일반",
      "전체",
      "복지",
      "기초",
      "생계·의료급여",
      "수급자",
      "가구에"
    ],
    "summary": "기초 생계·의료급여 수급자 가구에 50,000원 지급",
    "audience": "지원 대상\n- 기초 생계·의료급여 수급자(시설수급자 제외) \n지원내용\n- 명절위문금 가구당 50,000원(시비 30,000원 + 구비 20,000원)\n지원기준일 \n- 설, 추석 명절\n지원방법\n- 동별 명단 수합 후 수급자의 계좌에 현금 입금",
    "benefits": [
      "기초 생계·의료급여 수급자 가구에 50,000원 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000117",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000117",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "지원 대상\n- 기초 생계·의료급여 수급자(시설수급자 제외) \n지원내용\n- 명절위문금 가구당 50,000원(시비 30,000원 + 구비 20,000원)\n지원기준일 \n- 설, 추석 명절\n지원방법\n- 동별 명단 수합 후 수급자의 계좌에 현금 입금",
      "benefit": "기초 생계·의료급여 수급자 가구에 50,000원 지급",
      "application": "신청불필요",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-사랑의-pc-지원",
    "title": "사랑의 PC 지원",
    "category": "문화생활",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "사용연한이 경과한 중고PC를 정비하여 기초생활수급자, 장애인, 사회복지단체 등에 무상 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "사랑의 PC 지원",
      "문화생활",
      "서울",
      "서울특별시 성북구",
      "상시",
      "부모/육아",
      "장애인",
      "아동",
      "임신·출산·육아",
      "복지",
      "사용연한이",
      "경과한"
    ],
    "summary": "사용연한이 경과한 중고PC를 정비하여 기초생활수급자, 장애인, 사회복지단체 등에 무상 제공",
    "audience": "업무용 PC 중 사용연한(5년)이 경과한 장비(중고PC)를 수집하여 정비한 후 무상 제공\n - 보급품목 : PC본체 및 모니터, 키보드, 마우스 등\n - 보급방법 : 방문설치\n - 사후관리 : 보급 후 2년간",
    "benefits": [
      "사용연한이 경과한 중고PC를 정비하여 기초생활수급자, 장애인, 사회복지단체 등에 무상 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000134",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000134",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "업무용 PC 중 사용연한(5년)이 경과한 장비(중고PC)를 수집하여 정비한 후 무상 제공\n - 보급품목 : PC본체 및 모니터, 키보드, 마우스 등\n - 보급방법 : 방문설치\n - 사후관리 : 보급 후 2년간",
      "benefit": "사용연한이 경과한 중고PC를 정비하여 기초생활수급자, 장애인, 사회복지단체 등에 무상 제공",
      "application": "정부24온라인신청||방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-연천군-모범음식점-지정",
    "title": "연천군 모범음식점 지정",
    "category": "문화생활",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "모범음식점 지정서 및 표지판 배부 및 연천군청 홈페이지 개재",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "연천군 모범음식점 지정",
      "문화생활",
      "경기",
      "경기도 연천군",
      "모집중",
      "일반",
      "전체",
      "모범음식점",
      "지정서",
      "및",
      "표지판",
      "배부"
    ],
    "summary": "모범음식점 지정서 및 표지판 배부 및 연천군청 홈페이지 개재",
    "audience": "- 모범음식점 지정서 및 표지판 배부 및 연천군청 홈페이지 개재\n - 경기도 식품진흥기금 음식점 운영 자금 우선 융자 지원\n - 출입검사면제(2년간) ※ 민원, 식중독 발생한 경우 제외",
    "benefits": [
      "모범음식점 지정서 및 표지판 배부 및 연천군청 홈페이지 개재"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000453",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000453",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 모범음식점 지정서 및 표지판 배부 및 연천군청 홈페이지 개재\n - 경기도 식품진흥기금 음식점 운영 자금 우선 융자 지원\n - 출입검사면제(2년간) ※ 민원, 식중독 발생한 경우 제외",
      "benefit": "모범음식점 지정서 및 표지판 배부 및 연천군청 홈페이지 개재",
      "application": "정부24온라인신청||방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-연천군-일반음식점-환경개선-입식테이블-지원",
    "title": "연천군 일반음식점 환경개선 입식테이블 지원",
    "category": "문화생활",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "일반음식점 환경개선 및 입식테이블 설치 사업비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "연천군 일반음식점 환경개선 입식테이블 지원",
      "문화생활",
      "경기",
      "경기도 연천군",
      "모집중",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "일반음식점",
      "환경개선",
      "및",
      "입식테이블"
    ],
    "summary": "일반음식점 환경개선 및 입식테이블 설치 사업비 지원",
    "audience": "❍ 노약자 등이 일반음식점을 편리하게 이용할 수 있도록 일반음식점 환경개선 및 입식테이블 설치 사업비 지원\n - 출입문턱 낮추기 및 경사 진입로설치\n - 영유아 보조의자 구입\n - 좌식테이블을 입식테이블로 교체 설치\n - 그 밖에 군수가 필요하다고 인정하는 사업\n○ 서비스금액\n- 지원상한액(자부담제외) : 업소별 300만원\n- 보조율 : 보조금 50%, 자부담 50%",
    "benefits": [
      "일반음식점 환경개선 및 입식테이블 설치 사업비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000452",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000452",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "❍ 노약자 등이 일반음식점을 편리하게 이용할 수 있도록 일반음식점 환경개선 및 입식테이블 설치 사업비 지원\n - 출입문턱 낮추기 및 경사 진입로설치\n - 영유아 보조의자 구입\n - 좌식테이블을 입식테이블로 교체 설치\n - 그 밖에 군수가 필요하다고 인정하는 사업\n○ 서비스금액\n- 지원상한액(자부담제외) : 업소별 300만원\n- 보조율 : 보조금 50%, 자부담 50%",
      "benefit": "일반음식점 환경개선 및 입식테이블 설치 사업비 지원",
      "application": "정부24온라인신청||방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-보훈대상자-지원",
    "title": "보훈대상자 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "국가유공자 또는 유족에게 사망위로금, 명절위문금, 예우수당 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보훈대상자 지원",
      "복지",
      "서울",
      "서울특별시 성북구",
      "상시",
      "일반",
      "전체",
      "국가유공자",
      "또는",
      "유족에게",
      "사망위로금,",
      "명절위문금,"
    ],
    "summary": "국가유공자 또는 유족에게 사망위로금, 명절위문금, 예우수당 등 지원",
    "audience": "○ 성북구 거주 국가유공자 본인 사망시 사망위로금 20만원 지급(1년이내에 신청)\n\n○ 명절위문금 : 성북구 3개월이상 거주 국가유공자 중 성북구 보훈예우수당 받지 않은 자 지원(설, 추석 2만원)\n\n○ 성북구 보훈예우수당 : 성북구 3개월이상 거주한 국가유공자 또는 선순위유족 1인 5만원 지원(서울시보훈수당자 제외)\n\n○ 호국보훈의달 위문금 : 성북구 3개월이상 거주 국가유공자 또는 선순위유족 1인 2만원 지급",
    "benefits": [
      "국가유공자 또는 유족에게 사망위로금, 명절위문금, 예우수당 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000114",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000114",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 성북구 거주 국가유공자 본인 사망시 사망위로금 20만원 지급(1년이내에 신청)\n\n○ 명절위문금 : 성북구 3개월이상 거주 국가유공자 중 성북구 보훈예우수당 받지 않은 자 지원(설, 추석 2만원)\n\n○ 성북구 보훈예우수당 : 성북구 3개월이상 거주한 국가유공자 또는 선순위유족 1인 5만원 지원(서울시보훈수당자 제외)\n\n○ 호국보훈의달 위문금 : 성북구 3개월이상 거주 국가유공자 또는 선순위유족 1인 2만원 지급",
      "benefit": "국가유공자 또는 유족에게 사망위로금, 명절위문금, 예우수당 등 지원",
      "application": "방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-성북여성교실",
    "title": "성북여성교실",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "성북구 거주 만 18세 이상 여성을 대상으로 자격증반 및 취미교양반 운영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "성북여성교실",
      "교육",
      "서울",
      "서울특별시 성북구",
      "확인필요",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "성북구",
      "거주",
      "만",
      "18세"
    ],
    "summary": "성북구 거주 만 18세 이상 여성을 대상으로 자격증반 및 취미교양반 운영",
    "audience": "○ 소재지 : 장위로 61 (장위동 255-100) 장위1동주민센터 내 지하1층 (면적 249㎡)\n○ 사업대상 : 성북구 거주 18세 이상 여성 \n○ 교육기간 : 연간 4회 운영(과정별 10주)\n○ 수강료 : 10,000원 (재료비 별도)\n○ 개설과목 : 세부강좌 구성 및 모집인원 과정별 상이\n - 자격증반 : 한식조리사자격증반, 헤어디자인자격증반, 초등수학지도사자격증반, 중등수학지도사자격증반, 공간정리큐레이터반 등\n - 취미교양반 : 캘리그라피반, 플로리스트반, 이태리&홈파티반, 한복만들기반 등\n○ 운영방법\n- 주1~2회 (2~5시간 운영)",
    "benefits": [
      "성북구 거주 만 18세 이상 여성을 대상으로 자격증반 및 취미교양반 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000155",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000155",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 소재지 : 장위로 61 (장위동 255-100) 장위1동주민센터 내 지하1층 (면적 249㎡)\n○ 사업대상 : 성북구 거주 18세 이상 여성 \n○ 교육기간 : 연간 4회 운영(과정별 10주)\n○ 수강료 : 10,000원 (재료비 별도)\n○ 개설과목 : 세부강좌 구성 및 모집인원 과정별 상이\n - 자격증반 : 한식조리사자격증반, 헤어디자인자격증반, 초등수학지도사자격증반, 중등수학지도사자격증반, 공간정리큐레이터반 등\n - 취미교양반 : 캘리그라피반, 플로리스트반, 이태리&홈파티반, 한복만들기반 등\n○ 운영방법\n- 주1~2회 (2~5시간 운영)",
      "benefit": "성북구 거주 만 18세 이상 여성을 대상으로 자격증반 및 취미교양반 운영",
      "application": "기타 온라인신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-성북구-사회투자기금-융자-사업-안내",
    "title": "성북구 사회투자기금 융자 사업 안내",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 성북구",
    "region": "서울",
    "amount": "서울특별시 성북구 관내 사회적경제 조직을 대상으로 하는 융자 사업",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "취업·사업",
    "targetGroup": "구직자",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "성북구 사회투자기금 융자 사업 안내",
      "주거",
      "서울",
      "서울특별시 성북구",
      "확인필요",
      "구직자",
      "전체",
      "취업",
      "사업",
      "서울특별시",
      "성북구",
      "관내"
    ],
    "summary": "서울특별시 성북구 관내 사회적경제 조직을 대상으로 하는 융자 사업",
    "audience": "- 모집기간 : 상하반기 공고\n- 대출한도 : 1개 기업당 4,000만원 까지\n- 대출금리 : 연리0.75%\n- 상환조건 : 거치기간 없이 5년 이내 원리금 균등분활상환\n- 지원조건 : 무담보, 대표자 연대보증",
    "benefits": [
      "서울특별시 성북구 관내 사회적경제 조직을 대상으로 하는 융자 사업"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000133",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/307000000133",
    "contact": "서울특별시 성북구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 모집기간 : 상하반기 공고\n- 대출한도 : 1개 기업당 4,000만원 까지\n- 대출금리 : 연리0.75%\n- 상환조건 : 거치기간 없이 5년 이내 원리금 균등분활상환\n- 지원조건 : 무담보, 대표자 연대보증",
      "benefit": "서울특별시 성북구 관내 사회적경제 조직을 대상으로 하는 융자 사업",
      "application": "정부24온라인신청||방문신청",
      "contact": "서울특별시 성북구"
    }
  },
  {
    "slug": "gov24-연천군-어르신-교통비-지원사업",
    "title": "연천군 어르신 교통비 지원사업",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군 65세 이상 어르신 대상 연간 20만원(분기별 5만원) 한도 시내버스 교통비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "연천군 어르신 교통비 지원사업",
      "주거",
      "경기",
      "경기도 연천군",
      "상시",
      "어르신",
      "아동",
      "복지",
      "연천군",
      "65세",
      "이상",
      "대상"
    ],
    "summary": "연천군 65세 이상 어르신 대상 연간 20만원(분기별 5만원) 한도 시내버스 교통비 지원",
    "audience": "연천군 65세 이상 어르신을 대상으로 연간 20만원(분기별 5만원) 한도 시내버스 교통비 실사용액 지원\n ※ 실사용 시내버스 사용요금을 분기별 최대 5만원 이내 지원(분기별 남은금액은 이월되지 않음)\n ex) 분기별 시내버스 사용요금이 3만원일 경우 3만원 지원\n ex) 분기별 시내버스 사용요금이 7만원일 경우 5만원 지원",
    "benefits": [
      "연천군 65세 이상 어르신 대상 연간 20만원(분기별 5만원) 한도 시내버스 교통비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000449",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000449",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "연천군 65세 이상 어르신을 대상으로 연간 20만원(분기별 5만원) 한도 시내버스 교통비 실사용액 지원\n ※ 실사용 시내버스 사용요금을 분기별 최대 5만원 이내 지원(분기별 남은금액은 이월되지 않음)\n ex) 분기별 시내버스 사용요금이 3만원일 경우 3만원 지원\n ex) 분기별 시내버스 사용요금이 7만원일 경우 5만원 지원",
      "benefit": "연천군 65세 이상 어르신 대상 연간 20만원(분기별 5만원) 한도 시내버스 교통비 지원",
      "application": "방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-인터넷-수능방송-지원-강남인강",
    "title": "인터넷 수능방송 지원(강남인강)",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "강남구 인터넷 수능방송(강남인강) 이용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "인터넷 수능방송 지원(강남인강)",
      "청년",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "부모/육아",
      "장애인",
      "청소년",
      "임신·출산·육아",
      "복지",
      "강남구",
      "인터넷"
    ],
    "summary": "강남구 인터넷 수능방송(강남인강) 이용 지원",
    "audience": "강남구 인터넷 수능방송[강남인강] 1년 수강료 일부 지원\n - 취약계층 : 연 가입비 전액 지원\n(수급자, 차상위계층, 장애인, 한부모가족, 유공자, 학교밖청소년, 북한이탈주민 등)\n - 일반 : 연 가입비 중 일부 지원 ※ 학생 자부담금 : 10,000원",
    "benefits": [
      "강남구 인터넷 수능방송(강남인강) 이용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000296",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000296",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "강남구 인터넷 수능방송[강남인강] 1년 수강료 일부 지원\n - 취약계층 : 연 가입비 전액 지원\n(수급자, 차상위계층, 장애인, 한부모가족, 유공자, 학교밖청소년, 북한이탈주민 등)\n - 일반 : 연 가입비 중 일부 지원 ※ 학생 자부담금 : 10,000원",
      "benefit": "강남구 인터넷 수능방송(강남인강) 이용 지원",
      "application": "직접입력",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-농기계임대사업",
    "title": "농기계임대사업",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "❍ 임대사업용 농기계 구입 - 사업대상: 연천군 농업인(농업경영체 등록된 농업인)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농기계임대사업",
      "주거",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "❍",
      "임대사업용",
      "농기계",
      "구입",
      "-"
    ],
    "summary": "❍ 임대사업용 농기계 구입 - 사업대상: 연천군 농업인(농업경영체 등록된 농업인)",
    "audience": "❍ 임대사업용 농기계 구입\n - 사업대상: 연천군 농업인(농업경영체 등록된 농업인)\n - 예 산 안: 2,000백만원\n - 사업내용: 농기계１대당 90,000천원까지 기금으로 지급하고 45,000천원을 임대료로 수익\n - 지원품목: 트랙터, 콤바인 등",
    "benefits": [
      "❍ 임대사업용 농기계 구입 - 사업대상: 연천군 농업인(농업경영체 등록된 농업인)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000450",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000450",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "❍ 임대사업용 농기계 구입\n - 사업대상: 연천군 농업인(농업경영체 등록된 농업인)\n - 예 산 안: 2,000백만원\n - 사업내용: 농기계１대당 90,000천원까지 기금으로 지급하고 45,000천원을 임대료로 수익\n - 지원품목: 트랙터, 콤바인 등",
      "benefit": "❍ 임대사업용 농기계 구입 - 사업대상: 연천군 농업인(농업경영체 등록된 농업인)",
      "application": "방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-연천군-농업발전기금",
    "title": "연천군 농업발전기금",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군 농업발전기금(경영자금, 농어업생산유통시설자금) 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "연천군 농업발전기금",
      "농림어업",
      "경기",
      "경기도 연천군",
      "모집중",
      "농어업인",
      "전체",
      "연천군",
      "농업발전기금(경영자금,",
      "농어업생산유통시설자금)",
      "지원"
    ],
    "summary": "연천군 농업발전기금(경영자금, 농어업생산유통시설자금) 지원",
    "audience": "○ 지원대상\n-일반농업: 원예, 특작, 과수, 수도작을 경영하는 모든 개별농가 및 영농조합법인\n- 축산: 가축을 사육 중인 축산농가(개별농가, 축산단지, 영농조합)/ 대상축종: 한우, 젖소, 돼지, 닭, 축산업법상의 기타가축\n- 연천군 내 거주하며 군내 위치한 사업장에서 1년 이상 일반농업, 축산, 수산업에 종사하고 있는 농어업인 및 농어업인단체(영농조합법인)로서 다음 조건을 모두 갖춘 농가\n• 해당 품목별 대출금액에 상응하는 경영규모를 갖추고 발전기금 지원으로 경영개선이 될 수 있다고 인정되는 농가\n• 대출 취급기관에 연체중인 대출금이 없고 신용 상태가 양호한 농가\n\n○ 지원한도\n- 경영자금: 30백만원 이내\n- 농어업생산유통시설자금 등: 50백만원 이내\n\n○ 자금용도\n- 농어업을 경영하는데 소요되는 경비\n- 농어업생산유통시설에 필요한 자금\n\n○ 지원조건\n- 농어업경영자금: 1.0% (1년거치 2년 균등 분할 상환)\n- 농어업생산유통시설자금: 1.0% (2년거치 3년 균등 분할 상환)",
    "benefits": [
      "연천군 농업발전기금(경영자금, 농어업생산유통시설자금) 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000451",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000451",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상\n-일반농업: 원예, 특작, 과수, 수도작을 경영하는 모든 개별농가 및 영농조합법인\n- 축산: 가축을 사육 중인 축산농가(개별농가, 축산단지, 영농조합)/ 대상축종: 한우, 젖소, 돼지, 닭, 축산업법상의 기타가축\n- 연천군 내 거주하며 군내 위치한 사업장에서 1년 이상 일반농업, 축산, 수산업에 종사하고 있는 농어업인 및 농어업인단체(영농조합법인)로서 다음 조건을 모두 갖춘 농가\n• 해당 품목별 대출금액에 상응하는 경영규모를 갖추고 발전기금 지원으로 경영개선이 될 수 있다고 인정되는 농가\n• 대출 취급기관에 연체중인 대출금이 없고 신용 상태가 양호한 농가\n\n○ 지원한도\n- 경영자금: 30백만원 이내\n- 농어업생산유통시설자금 등: 50백만원 이내\n\n○ 자금용도\n- 농어업을 경영하는데 소요되는 경비\n- 농어업생산유통시설에 필요한 자금\n\n○ 지원조건\n- 농어업경영자금: 1.0% (1년거치 2년 균등 분할 상환)\n- 농어업생산유통시설자금: 1.0% (2년거치 3년 균등 분할 상환)",
      "benefit": "연천군 농업발전기금(경영자금, 농어업생산유통시설자금) 지원",
      "application": "방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-보훈명예수당-등-사망참전유공자의-배우자-복지수당",
    "title": "보훈명예수당 등, 사망참전유공자의 배우자 복지수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군의 국가보훈대상자 및 사망 참전유공자의 배우자에게 현금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보훈명예수당 등, 사망참전유공자의 배우자 복지수당",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "일반",
      "전체",
      "연천군의",
      "국가보훈대상자",
      "및",
      "사망",
      "참전유공자의"
    ],
    "summary": "연천군의 국가보훈대상자 및 사망 참전유공자의 배우자에게 현금 지급",
    "audience": "연천군에 주민등록을 두고 국가보훈부에 국가보훈대상자로 등록된 자, 사망참전유공자의 배우자에게 매월 25일 150,000원 지급\n국가보훈부에 등록된 국가보훈대상자 중 참전유공자 및 참전유공자의 배우자에게 매월 25일 30,000원 지급",
    "benefits": [
      "연천군의 국가보훈대상자 및 사망 참전유공자의 배우자에게 현금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000448",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000448",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "연천군에 주민등록을 두고 국가보훈부에 국가보훈대상자로 등록된 자, 사망참전유공자의 배우자에게 매월 25일 150,000원 지급\n국가보훈부에 등록된 국가보훈대상자 중 참전유공자 및 참전유공자의 배우자에게 매월 25일 30,000원 지급",
      "benefit": "연천군의 국가보훈대상자 및 사망 참전유공자의 배우자에게 현금 지급",
      "application": "방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-남토북수-브랜드-포장재-제작-및-구입비-지원",
    "title": "남토북수 브랜드 포장재 제작 및 구입비 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군 지역에서 생산되면서, ‘남토북수’ 인증을 받은 농특산물에 대한 포장재 제작 및 구입",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "남토북수 브랜드 포장재 제작 및 구입비 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "모집중",
      "농어업인",
      "전체",
      "연천군",
      "지역에서",
      "생산되면서,",
      "‘남토북수’",
      "인증을"
    ],
    "summary": "연천군 지역에서 생산되면서, ‘남토북수’ 인증을 받은 농특산물에 대한 포장재 제작 및 구입",
    "audience": "연천군 지역에서 생산되면서, ‘남토북수’ 인증을 받은 농특산물에 대한 포장재 제작 및 구입비(동판비, 원료비 포함) 지원",
    "benefits": [
      "연천군 지역에서 생산되면서, ‘남토북수’ 인증을 받은 농특산물에 대한 포장재 제작 및 구입"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000454",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000454",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "연천군 지역에서 생산되면서, ‘남토북수’ 인증을 받은 농특산물에 대한 포장재 제작 및 구입비(동판비, 원료비 포함) 지원",
      "benefit": "연천군 지역에서 생산되면서, ‘남토북수’ 인증을 받은 농특산물에 대한 포장재 제작 및 구입",
      "application": "방문신청",
      "contact": "경기도 연천군"
    }
  }
];

policies.push(...gov24PromotionPolicies);

const gov24PromotionPoliciesBatch2: Policy[] = [
  {
    "slug": "gov24-귀농-청년농업인-주거비-월세-지원",
    "title": "귀농 청년농업인 주거비(월세) 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군에 주소를 두고 귀농한 청년농업인으로 월임차료 최대 20씩 예산범위 안에서 지원함",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년·주거",
    "targetGroup": "청년, 농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "귀농 청년농업인 주거비(월세) 지원",
      "청년",
      "경기",
      "경기도 연천군",
      "상시",
      "농어업인",
      "주거",
      "연천군에",
      "주소를",
      "두고",
      "귀농한",
      "청년농업인으로"
    ],
    "summary": "연천군에 주소를 두고 귀농한 청년농업인으로 월임차료 최대 20씩 예산범위 안에서 지원함",
    "audience": "○ 사 업 명: 연천군 귀농 청년농업인 주거비 지원사업\n ○ 신청기간: 2026. 1월 ~ 12월(예산 소진시까지)\n ○ 지원대상\n - 19세 이상 39세 이하 2026년 기준 연령: 1986년~2006년생의 청년농업인으로 연천군에 주소를 두고 실제 임차주택에 거주하고 있는 자\n - ｢농어업경영체 육성법｣에 따라 관내에 농지를 두고 농업경영정보를 ‘경영주’로 등록한 “독립경영체”로 본인이 직접 영농에 종사하는 자\n - 무주택 청년으로 별도의 독립세대(세대주)를 구성한 자\n ○ 지원기준: 월세 임차료 최대 20만원/월",
    "benefits": [
      "연천군에 주소를 두고 귀농한 청년농업인으로 월임차료 최대 20씩 예산범위 안에서 지원함"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000456",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000456",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 사 업 명: 연천군 귀농 청년농업인 주거비 지원사업\n ○ 신청기간: 2026. 1월 ~ 12월(예산 소진시까지)\n ○ 지원대상\n - 19세 이상 39세 이하 2026년 기준 연령: 1986년~2006년생의 청년농업인으로 연천군에 주소를 두고 실제 임차주택에 거주하고 있는 자\n - ｢농어업경영체 육성법｣에 따라 관내에 농지를 두고 농업경영정보를 ‘경영주’로 등록한 “독립경영체”로 본인이 직접 영농에 종사하는 자\n - 무주택 청년으로 별도의 독립세대(세대주)를 구성한 자\n ○ 지원기준: 월세 임차료 최대 20만원/월",
      "benefit": "연천군에 주소를 두고 귀농한 청년농업인으로 월임차료 최대 20씩 예산범위 안에서 지원함",
      "application": "방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-고대산-자연휴양림-시설사용료-경감",
    "title": "고대산 자연휴양림 시설사용료 경감",
    "category": "문화생활",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "대상자에게 비수기 주중에 한하여 시설사용료의 100분의 30을 경감",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "고대산 자연휴양림 시설사용료 경감",
      "문화생활",
      "경기",
      "경기도 연천군",
      "상시",
      "장애인",
      "전체",
      "복지",
      "대상자에게",
      "비수기",
      "주중에",
      "한하여"
    ],
    "summary": "대상자에게 비수기 주중에 한하여 시설사용료의 100분의 30을 경감",
    "audience": "○ 비수기 주중에 한하여 숲속의집, 산림문화휴양관 및 숲속수련원 시설사용료의 100분의 30을 경감\n1. 다자녀 가정 \n2. 「장애인복지법」제32조에 따라 등록된 장애인(장애정도가 심한 장애인의 경우에는 그 보호자를 포함한다) \n3. 국가보훈대상자로서 다음 각 목에 해당하는 사람 \n 가. 「국가유공자 등 예우 및 지원에 관한 법률」에 따른 전상군경, 공상군경, 4ㆍ19혁명부상자, 공상공무원, 특별공로상이자, 6ㆍ18자유상이자, 지원공상군경, 지원공상공무원 \n 나. 「보훈보상대상자 지원에 관한 법률」에 따른 재해부상군경, 재해부상공무원 \n 다. 「특수임무유공자 예우 및 단체설립에 관한 법률」에 따른 특수임무부상자 \n 라. 「5ㆍ18민주유공자예우 및 단체설립에 관한 법률」에 따른 5ㆍ18 민주화운동부상자",
    "benefits": [
      "대상자에게 비수기 주중에 한하여 시설사용료의 100분의 30을 경감"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000447",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000447",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 비수기 주중에 한하여 숲속의집, 산림문화휴양관 및 숲속수련원 시설사용료의 100분의 30을 경감\n1. 다자녀 가정 \n2. 「장애인복지법」제32조에 따라 등록된 장애인(장애정도가 심한 장애인의 경우에는 그 보호자를 포함한다) \n3. 국가보훈대상자로서 다음 각 목에 해당하는 사람 \n 가. 「국가유공자 등 예우 및 지원에 관한 법률」에 따른 전상군경, 공상군경, 4ㆍ19혁명부상자, 공상공무원, 특별공로상이자, 6ㆍ18자유상이자, 지원공상군경, 지원공상공무원 \n 나. 「보훈보상대상자 지원에 관한 법률」에 따른 재해부상군경, 재해부상공무원 \n 다. 「특수임무유공자 예우 및 단체설립에 관한 법률」에 따른 특수임무부상자 \n 라. 「5ㆍ18민주유공자예우 및 단체설립에 관한 법률」에 따른 5ㆍ18 민주화운동부상자",
      "benefit": "대상자에게 비수기 주중에 한하여 시설사용료의 100분의 30을 경감",
      "application": "기타 온라인신청||방문신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-동대문구-성병진단검사",
    "title": "동대문구 성병진단검사",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "HIV/AIDS 진단검사 실시",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 성병진단검사",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "HIV/AIDS",
      "진단검사",
      "실시"
    ],
    "summary": "서울특별시 동대문구에서 HIV/AIDS 진단검사를 안내하는 보건의료 서비스입니다. 검사 대상과 운영 기간은 공식 공고에서 확인하세요.",
    "audience": "ㅇ검진 대상 : 검사를 희망하는 동대문구민\n- 신분증 필수 지참 (주민등록증, 운전면허증, 외국인일 경우 외국인등록증-여권불가)\n- 정기검진대상자(유흥접객원 등 의무검진 대상자) 포함\n\nㅇ진료 및 검사항목\n남성 : 매독, 임질, HIV / 여성 : 매독, HIV\n\nㅇ검사수수료 : 무료",
    "benefits": [
      "HIV/AIDS 진단검사 실시"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000295",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000295",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ검진 대상 : 검사를 희망하는 동대문구민\n- 신분증 필수 지참 (주민등록증, 운전면허증, 외국인일 경우 외국인등록증-여권불가)\n- 정기검진대상자(유흥접객원 등 의무검진 대상자) 포함\n\nㅇ진료 및 검사항목\n남성 : 매독, 임질, HIV / 여성 : 매독, HIV\n\nㅇ검사수수료 : 무료",
      "benefit": "HIV/AIDS 진단검사 실시",
      "application": "방문신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-암환자-가발-구입비-지원",
    "title": "동대문구 암환자 가발 구입비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "암환자에게 가발구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 암환자 가발 구입비 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "복지",
      "암환자에게",
      "가발구입비",
      "지원"
    ],
    "summary": "서울특별시 동대문구에서 암환자를 대상으로 가발 구입비 지원을 안내하는 보건의료 사업입니다. 지원 조건과 신청기간은 공식 공고에서 확인하세요.",
    "audience": "ㅇ대상 : 암환자 의료비 지원대상자 중, 항암치료에 의한 탈모로 가발이 필요한 자로서 아래 조건을 모두 만족하는 \n1) 신청일 기준 6개월 이상 서울특별시 동대문구에 주민등록을 두고 지급완료일까지 실제로 거주하는 18세 이상인 암환자\n2) 보건복지부「암환자에 대한 의료비 지원기준 등에 관한 고시」에 따른 의료비 지원 기준에 적합한 암환자(의료급여수급자, 건강보험 차상위 본인부담 경감대상자)\n3) 항암치료 중 탈모가 발생했다는 의사소견서를 제출한 사람\n\nㅇ지원내용 : 암환자 가발 구입비의 90% 지원(최대 70만원, 1인 1회에 한함)\n\nㅇ신청기간 : 의사소견서 발급일로부터 1년 이내\n\nㅇ지원절차 : 자격확인 및 가발구입 -> 보건소 방문 후 구비서류 제출(가발구입 영수증, 소견서) -> 지원대상여부 확인 후 처리",
    "benefits": [
      "암환자에게 가발구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000297",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000297",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ대상 : 암환자 의료비 지원대상자 중, 항암치료에 의한 탈모로 가발이 필요한 자로서 아래 조건을 모두 만족하는 \n1) 신청일 기준 6개월 이상 서울특별시 동대문구에 주민등록을 두고 지급완료일까지 실제로 거주하는 18세 이상인 암환자\n2) 보건복지부「암환자에 대한 의료비 지원기준 등에 관한 고시」에 따른 의료비 지원 기준에 적합한 암환자(의료급여수급자, 건강보험 차상위 본인부담 경감대상자)\n3) 항암치료 중 탈모가 발생했다는 의사소견서를 제출한 사람\n\nㅇ지원내용 : 암환자 가발 구입비의 90% 지원(최대 70만원, 1인 1회에 한함)\n\nㅇ신청기간 : 의사소견서 발급일로부터 1년 이내\n\nㅇ지원절차 : 자격확인 및 가발구입 -> 보건소 방문 후 구비서류 제출(가발구입 영수증, 소견서) -> 지원대상여부 확인 후 처리",
      "benefit": "암환자에게 가발구입비 지원",
      "application": "방문신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-장애인-전용-미용실-동행헤어-운영",
    "title": "동대문구 장애인 전용 미용실 [동행헤어] 운영",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "중증장애인도 이·미용이 가능하도록 미용기구를 설치한 전용 미용실 운영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 장애인 전용 미용실 [동행헤어] 운영",
      "복지",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "장애인",
      "전체",
      "중증장애인도",
      "이·미용이",
      "가능하도록",
      "미용기구를",
      "설치한"
    ],
    "summary": "중증장애인도 이·미용이 가능하도록 미용기구를 설치한 전용 미용실 운영",
    "audience": "ㅇ 장애인 전용미용실〔동행헤어〕운영 \n - 대상 : 동대문구 등록 장애인 \n - 운영시간 : 일 ~ 금(10:00 ~ 17:00), 토요일 및 공휴일 휴무, 사전 예약제\n - 사업내용 : 저렴한 가격으로 이·미용(커트, 염색, 펌) 서비스 (차상위 및 수급자 50%감면)\n - 시술메뉴 : 커트(6,000원), 일반펌(19,000원), 염색(15,000원), 열펌(39,000원) \n - 운영인력 : 3명〔전문미용인 2명, 사회복지사 1명(겸직)〕\n - 운영기관 : 동대문시각특화장애인복지관 위탁운영",
    "benefits": [
      "중증장애인도 이·미용이 가능하도록 미용기구를 설치한 전용 미용실 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청||직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000300",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000300",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ 장애인 전용미용실〔동행헤어〕운영 \n - 대상 : 동대문구 등록 장애인 \n - 운영시간 : 일 ~ 금(10:00 ~ 17:00), 토요일 및 공휴일 휴무, 사전 예약제\n - 사업내용 : 저렴한 가격으로 이·미용(커트, 염색, 펌) 서비스 (차상위 및 수급자 50%감면)\n - 시술메뉴 : 커트(6,000원), 일반펌(19,000원), 염색(15,000원), 열펌(39,000원) \n - 운영인력 : 3명〔전문미용인 2명, 사회복지사 1명(겸직)〕\n - 운영기관 : 동대문시각특화장애인복지관 위탁운영",
      "benefit": "중증장애인도 이·미용이 가능하도록 미용기구를 설치한 전용 미용실 운영",
      "application": "기타 온라인신청||직접입력",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-장애인-친화미용실-운영",
    "title": "동대문구 장애인 친화미용실 운영",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "이·미용(커트, 염색, 펌) 시 일부 서비스 이용료 지원 (1인당 월 1회, 최대 2만원 지원 / 커트 1만원, 염색·펌 2만원 지원)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 장애인 친화미용실 운영",
      "복지",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "장애인",
      "전체",
      "이·미용(커트,",
      "염색,",
      "펌)",
      "시",
      "일부"
    ],
    "summary": "이·미용(커트, 염색, 펌) 시 일부 서비스 이용료 지원 (1인당 월 1회, 최대 2만원 지원 / 커트 1만원, 염색·펌 2만원 지원)",
    "audience": "ㅇ서비스대상 : 동대문구에 주소를 둔 심한 장애인\nㅇ서비스내용\n - 이·미용(커트, 염색, 펌) 시 일부 서비스 이용료 지원\n * 1인당 월 1회, 최대 2만원 지원 - 커트 1만원, 염색·펌 2만원 지원\nㅇ이용방법 : 유선으로 사전예약 후 증빙서류 지참하여 방문, 시술\nㅇ증빙서류 : 장애인복지카드 또는 장애인증명서\n * 본인이 증빙하지 않는 경우 지원 불가\n\n \nㅇ미소미용실 : 천호대로 31길 23(용두동), 010-3710-6869\nㅇ조은선헤어 : 홍릉로 23(청량리동), 010-3727-4937, 010-9247-7815, 수요일 휴무\nㅇ난다랑미용실 : 답십리로63길 118(장안동), 010-7118-0646, 목요일 휴무\nㅇ헤어엘 : 왕산로186 우남SL타워 300 516호(전농1동), 02-966-9505, 일요일 휴무\nㅇ헤어라운지 : 전농로15길 8(전농1동), 010-7900-0457, 02-2243-7467, 수요일휴무",
    "benefits": [
      "이·미용(커트, 염색, 펌) 시 일부 서비스 이용료 지원 (1인당 월 1회, 최대 2만원 지원 / 커트 1만원, 염색·펌 2만원 지원)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000301",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000301",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ서비스대상 : 동대문구에 주소를 둔 심한 장애인\nㅇ서비스내용\n - 이·미용(커트, 염색, 펌) 시 일부 서비스 이용료 지원\n * 1인당 월 1회, 최대 2만원 지원 - 커트 1만원, 염색·펌 2만원 지원\nㅇ이용방법 : 유선으로 사전예약 후 증빙서류 지참하여 방문, 시술\nㅇ증빙서류 : 장애인복지카드 또는 장애인증명서\n * 본인이 증빙하지 않는 경우 지원 불가\n\n \nㅇ미소미용실 : 천호대로 31길 23(용두동), 010-3710-6869\nㅇ조은선헤어 : 홍릉로 23(청량리동), 010-3727-4937, 010-9247-7815, 수요일 휴무\nㅇ난다랑미용실 : 답십리로63길 118(장안동), 010-7118-0646, 목요일 휴무\nㅇ헤어엘 : 왕산로186 우남SL타워 300 516호(전농1동), 02-966-9505, 일요일 휴무\nㅇ헤어라운지 : 전농로15길 8(전농1동), 010-7900-0457, 02-2243-7467, 수요일휴무",
      "benefit": "이·미용(커트, 염색, 펌) 시 일부 서비스 이용료 지원 (1인당 월 1회, 최대 2만원 지원 / 커트 1만원, 염색·펌 2만원 지원)",
      "application": "직접입력",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-중랑양원미디어센터-미디어-교육-및-영화-상영",
    "title": "중랑양원미디어센터 미디어 교육 및 영화 상영",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "미디어 교육 제공과 영화 무료 상영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑양원미디어센터 미디어 교육 및 영화 상영",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "일반",
      "전체",
      "미디어",
      "제공과",
      "영화",
      "무료",
      "상영"
    ],
    "summary": "서울특별시 중랑구의 중랑양원미디어센터에서 미디어 교육과 무료 영화 상영을 제공하는 프로그램입니다. 이용 일정과 신청 방법은 공식 안내를 확인하세요.",
    "audience": "○ 미디어교육\n - 스마트폰을 활용한 생활 속 미디어 활용 교육\n - 미디어 리터러시, 미디어 인문학 등의 이론교육\n - 전문적인 영상 제작을 위한 촬영, 편집 등의 기술 교육\n\n○ 영화상영\n - 주제별로 엄선한 영화 및 구민들의 추천을 받은 작품 상영\n - 고전영화, 독립예술영화, 단편영화 등 다양한 장르의 영화 상영\n\n○ 미디어체험\n - 센터 내 스튜디오 등을 활용하여 다양한 미디어 체험 경험 제공",
    "benefits": [
      "미디어 교육 제공과 영화 무료 상영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000234",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000234",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 미디어교육\n - 스마트폰을 활용한 생활 속 미디어 활용 교육\n - 미디어 리터러시, 미디어 인문학 등의 이론교육\n - 전문적인 영상 제작을 위한 촬영, 편집 등의 기술 교육\n\n○ 영화상영\n - 주제별로 엄선한 영화 및 구민들의 추천을 받은 작품 상영\n - 고전영화, 독립예술영화, 단편영화 등 다양한 장르의 영화 상영\n\n○ 미디어체험\n - 센터 내 스튜디오 등을 활용하여 다양한 미디어 체험 경험 제공",
      "benefit": "미디어 교육 제공과 영화 무료 상영",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑구-환경교육센터-프로그램-신청",
    "title": "중랑구 환경교육센터 프로그램 신청",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "ㅇ 개인(유아~성인), 단체(어린이집~학교) 등 모든 연령대 맞춤형 환경 교육 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑구 환경교육센터 프로그램 신청",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "모집중",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "ㅇ",
      "개인(유아~성인),",
      "단체(어린이집~학교)",
      "등"
    ],
    "summary": "ㅇ 개인(유아~성인), 단체(어린이집~학교) 등 모든 연령대 맞춤형 환경 교육 제공",
    "audience": "ㅇ 홈페이지를 통해 시기에 따라 다른 교육을 제공하며 개인 또는 단체의 개별 신청 \n *월요일은 휴관으로 문의는 화~토요일만 가능\n\nㅇ 대상별 맞춤형 환경 교육 진행\n - 생애주기별 환경교육 : 생애주기 맞춤형 환경교육 프로그램 설계 및 운영\n - 전시체험교육 : 실감미디어 바탕 상설기획 전시 운영, 전시 기반 게임형 체험교육 운영\n - 학교환경교육 : 유아 ~ 고등학교 교과과정 및 학교 연계 환경교육 프로그램 운영\n - 민·관 협력 환경교육 : 관내 기관ㆍ동 주민자치회 방문 및 행사·축제 현장 환경교육",
    "benefits": [
      "ㅇ 개인(유아~성인), 단체(어린이집~학교) 등 모든 연령대 맞춤형 환경 교육 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000232",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000232",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ 홈페이지를 통해 시기에 따라 다른 교육을 제공하며 개인 또는 단체의 개별 신청 \n *월요일은 휴관으로 문의는 화~토요일만 가능\n\nㅇ 대상별 맞춤형 환경 교육 진행\n - 생애주기별 환경교육 : 생애주기 맞춤형 환경교육 프로그램 설계 및 운영\n - 전시체험교육 : 실감미디어 바탕 상설기획 전시 운영, 전시 기반 게임형 체험교육 운영\n - 학교환경교육 : 유아 ~ 고등학교 교과과정 및 학교 연계 환경교육 프로그램 운영\n - 민·관 협력 환경교육 : 관내 기관ㆍ동 주민자치회 방문 및 행사·축제 현장 환경교육",
      "benefit": "ㅇ 개인(유아~성인), 단체(어린이집~학교) 등 모든 연령대 맞춤형 환경 교육 제공",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-자치회관-수강료-및-사용료-감면-지원",
    "title": "자치회관 수강료 및 사용료 감면 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "자치회관 프로그램 수강료 감면 및 시설사용료 감면 내용",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "자치회관 수강료 및 사용료 감면 지원",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "모집중",
      "부모/육아",
      "어르신",
      "장애인",
      "아동",
      "임신·출산·육아",
      "복지",
      "자치회관"
    ],
    "summary": "자치회관 프로그램 수강료 감면 및 시설사용료 감면 내용",
    "audience": "○ 자치회관 사용료 및 수강료 면제\n - 국가 또는 지방자치단체가 공공의 목적으로 사용할 때\n - 행정기관이 지원 육성하는 유관기관이나 직능단체가 본래의 목적으로 사용하는 경우\n - 주민의 복리증진과 문화의식 함양을 위한 순수한 공익성 비영리 문화행사\n - 「국민기초생활 보장법」에 따른 수급자\n - 「한부모가족지원법」에 따른 지원대상자\n - 다둥이 행복카드 소지자 중 18세 이하의 자녀가 3명 이상인 가정의 부모와 자녀\n\n○ 자치회관 사용료 및 수강료 감면(50%)\n - 「국가유공자 등 예우 및 지원에 관한 법률」에 따른 국가유공자 또는 유가족\n - 「장애인복지법」에 따른 등록된 장애인\n - 다둥이 행복카드 소지자 중 18세 이하의 자녀가 2명 이상인 가정의 부모와 자녀\n - 「서울특별시 중랑구 병역명문가 예우 및 지원에 관한 조례」에 따른 예우대상자\n - 「노인복지법」 제26조의 경로우대 대상자(65세 이상 어르신)",
    "benefits": [
      "자치회관 프로그램 수강료 감면 및 시설사용료 감면 내용"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000228",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000228",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 자치회관 사용료 및 수강료 면제\n - 국가 또는 지방자치단체가 공공의 목적으로 사용할 때\n - 행정기관이 지원 육성하는 유관기관이나 직능단체가 본래의 목적으로 사용하는 경우\n - 주민의 복리증진과 문화의식 함양을 위한 순수한 공익성 비영리 문화행사\n - 「국민기초생활 보장법」에 따른 수급자\n - 「한부모가족지원법」에 따른 지원대상자\n - 다둥이 행복카드 소지자 중 18세 이하의 자녀가 3명 이상인 가정의 부모와 자녀\n\n○ 자치회관 사용료 및 수강료 감면(50%)\n - 「국가유공자 등 예우 및 지원에 관한 법률」에 따른 국가유공자 또는 유가족\n - 「장애인복지법」에 따른 등록된 장애인\n - 다둥이 행복카드 소지자 중 18세 이하의 자녀가 2명 이상인 가정의 부모와 자녀\n - 「서울특별시 중랑구 병역명문가 예우 및 지원에 관한 조례」에 따른 예우대상자\n - 「노인복지법」 제26조의 경로우대 대상자(65세 이상 어르신)",
      "benefit": "자치회관 프로그램 수강료 감면 및 시설사용료 감면 내용",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑구-통합-교육지원센터",
    "title": "중랑구 통합 교육지원센터",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "연계·맞춤·통합 교육지원센터",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑구 통합 교육지원센터",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "확인필요",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "연계·맞춤·통합",
      "교육지원센터"
    ],
    "summary": "서울특별시 중랑구에서 운영하는 통합 교육지원센터 관련 교육 지원 서비스입니다. 세부 프로그램과 신청 가능 여부는 공식 공고에서 확인하세요.",
    "audience": "○ 창의적 민주시민으로 자라는 방정환 전인 교육 운영\n○ 학교와 함께 학생들을 지원하는 학교 연계 프로그램 운영\n○ 학생들의 꿈과 재능을 키워주는 진로 지원 프로그램 운영\n○ 학생의 역량과 목표 성장을 위한 진학·학습 지원 프로그램 운영",
    "benefits": [
      "연계·맞춤·통합 교육지원센터"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000226",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000226",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 창의적 민주시민으로 자라는 방정환 전인 교육 운영\n○ 학교와 함께 학생들을 지원하는 학교 연계 프로그램 운영\n○ 학생들의 꿈과 재능을 키워주는 진로 지원 프로그램 운영\n○ 학생의 역량과 목표 성장을 위한 진학·학습 지원 프로그램 운영",
      "benefit": "연계·맞춤·통합 교육지원센터",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-망우역사문화공원-천체관측-프로그램-안내",
    "title": "망우역사문화공원 천체관측 프로그램 안내",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "초등학생 이상의 자녀와 부모님(회당 40명)에게 천체관측프로그램 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "망우역사문화공원 천체관측 프로그램 안내",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "모집중",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "초등학생",
      "이상의",
      "자녀와",
      "부모님(회당"
    ],
    "summary": "초등학생 이상의 자녀와 부모님(회당 40명)에게 천체관측프로그램 제공",
    "audience": "초등학생 이상의 자녀와 부모님(회당 40명)에게 천체관측프로그램 제공\n - 당일 관측 대상 및 우주에 대한 이론 교육 및 질의응답\n - 레이저 포인터를 이용한 별자리 육안 관측\n - 천체 망원경 사용법 교육 및 망원경을 이용하여 달과 행성 등 관측\n\n3월 ~ 11월 매월 첫째, 셋째 주 진행",
    "benefits": [
      "초등학생 이상의 자녀와 부모님(회당 40명)에게 천체관측프로그램 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000223",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000223",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "초등학생 이상의 자녀와 부모님(회당 40명)에게 천체관측프로그램 제공\n - 당일 관측 대상 및 우주에 대한 이론 교육 및 질의응답\n - 레이저 포인터를 이용한 별자리 육안 관측\n - 천체 망원경 사용법 교육 및 망원경을 이용하여 달과 행성 등 관측\n\n3월 ~ 11월 매월 첫째, 셋째 주 진행",
      "benefit": "초등학생 이상의 자녀와 부모님(회당 40명)에게 천체관측프로그램 제공",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑구-공동육아방-서비스-이용-안내",
    "title": "중랑구 공동육아방 서비스 이용 안내",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑구 공동육아방 서비스 이용 안내",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "확인필요",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "영역별",
      "놀이교구",
      "제공",
      "및"
    ],
    "summary": "영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영",
    "audience": "(1회차)10:00~12:00 (2회차)13:00~15:00 (3회차)15:30~17:30\n영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영",
    "benefits": [
      "영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000220",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000220",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "(1회차)10:00~12:00 (2회차)13:00~15:00 (3회차)15:30~17:30\n영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영",
      "benefit": "영역별 놀이교구 제공 및 다양한 놀이 프로그램 운영",
      "application": "기타 온라인신청||방문신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-구민-정보화교육",
    "title": "구민 정보화교육",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "ㅇ 구민 정보화교육 안내 - 수강료: 무료(교재비 별도) - 접수기간: 매월 25일 이후 2일~3일",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·사업",
    "targetGroup": "소상공인, 부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "구민 정보화교육",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "모집중",
      "소상공인",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "사업",
      "ㅇ",
      "구민"
    ],
    "summary": "ㅇ 구민 정보화교육 안내 - 수강료: 무료(교재비 별도) - 접수기간: 매월 25일 이후 2일~3일",
    "audience": "구민의 정보화 격차 해소 및 디지털역량 강화를 위한 교육 기회를 제공하여 실생활에 도움이 될 수 있도록 지원합니다.\n\nㅇ 구민 정보화교육 안내\n - 교육장소 : 신내동, 면목5동, 망우본동 구민정보화교육장\n - 수강료 : 무료(교재비 별도)\n - 대상: 30세이상 중랑구민, 중랑구 관내사업자, \n 재직자",
    "benefits": [
      "ㅇ 구민 정보화교육 안내 - 수강료: 무료(교재비 별도) - 접수기간: 매월 25일 이후 2일~3일"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000222",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000222",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "구민의 정보화 격차 해소 및 디지털역량 강화를 위한 교육 기회를 제공하여 실생활에 도움이 될 수 있도록 지원합니다.\n\nㅇ 구민 정보화교육 안내\n - 교육장소 : 신내동, 면목5동, 망우본동 구민정보화교육장\n - 수강료 : 무료(교재비 별도)\n - 대상: 30세이상 중랑구민, 중랑구 관내사업자, \n 재직자",
      "benefit": "ㅇ 구민 정보화교육 안내 - 수강료: 무료(교재비 별도) - 접수기간: 매월 25일 이후 2일~3일",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-국가보훈대상자-사망위로금-중랑구",
    "title": "국가보훈대상자 사망위로금(중랑구)",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "국가보훈대상자를 위해 사망위로금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "국가보훈대상자 사망위로금(중랑구)",
      "복지",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "일반",
      "전체",
      "국가보훈대상자를",
      "위해",
      "사망위로금",
      "지급"
    ],
    "summary": "국가보훈대상자를 위해 사망위로금 지급",
    "audience": "○ 국가보훈대상자 사망위로금 : 국가보훈대상자 본인 및 우선순위 유족 사망 시 40만원을 지급\n\n※사망일 현재 중랑구에 거주하고있는 국가보훈대상자 본인 및 우선순위 유족",
    "benefits": [
      "국가보훈대상자를 위해 사망위로금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000111",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000111",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 국가보훈대상자 사망위로금 : 국가보훈대상자 본인 및 우선순위 유족 사망 시 40만원을 지급\n\n※사망일 현재 중랑구에 거주하고있는 국가보훈대상자 본인 및 우선순위 유족",
      "benefit": "국가보훈대상자를 위해 사망위로금 지급",
      "application": "방문신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑구-보훈예우수당",
    "title": "중랑구 보훈예우수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "국가보훈대상자 본인 및 우선순위 유족을 위해 중랑구 보훈예우수당 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑구 보훈예우수당",
      "복지",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "일반",
      "전체",
      "국가보훈대상자",
      "본인",
      "및",
      "우선순위",
      "유족을"
    ],
    "summary": "국가보훈대상자 본인 및 우선순위 유족을 위해 중랑구 보훈예우수당 지급",
    "audience": "○ 중랑구 보훈예우수당 : 국가보훈대상자 본인 및 우선순위 유족에게 월 5만원을 지급\n\n ※신청한 달부터 지급",
    "benefits": [
      "국가보훈대상자 본인 및 우선순위 유족을 위해 중랑구 보훈예우수당 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000101",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 중랑구 보훈예우수당 : 국가보훈대상자 본인 및 우선순위 유족에게 월 5만원을 지급\n\n ※신청한 달부터 지급",
      "benefit": "국가보훈대상자 본인 및 우선순위 유족을 위해 중랑구 보훈예우수당 지급",
      "application": "방문신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑구-난임부부-약제비-지원-난임시술-이후-원외약제비-청구",
    "title": "[중랑구]난임부부 약제비 지원(난임시술 이후 원외약제비 청구)",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "[중랑구]난임부부 약제비 지원(난임시술 이후 원외약제비 청구)",
      "보건의료",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "난임시술",
      "이후",
      "해당",
      "시술건에"
    ],
    "summary": "난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원",
    "audience": "난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원\n\n \n- 통지서 발급 이후 시술기간 동안의 급여 및 비급여 약제\n※ 해당 시술의 지원 한도액 내에서 지원금이 남았을 경우 신청가능",
    "benefits": [
      "난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "정부24온라인신청||방문신청||직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000210",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000210",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원\n\n \n- 통지서 발급 이후 시술기간 동안의 급여 및 비급여 약제\n※ 해당 시술의 지원 한도액 내에서 지원금이 남았을 경우 신청가능",
      "benefit": "난임시술 이후 해당 시술건에 대해 처방받은 원외약제비 청구 및 접수, 지원",
      "application": "정부24온라인신청||방문신청||직접입력",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-생활체육교실-운영",
    "title": "생활체육교실 운영",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "생활체육교실들을 개설함으로써 구민들의 건강 증진과 생활체육 저변확대를 도모함",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "생활체육교실 운영",
      "청년",
      "서울",
      "서울특별시 중랑구",
      "확인필요",
      "장애인",
      "아동",
      "청소년",
      "복지",
      "생활체육교실들을",
      "개설함으로써",
      "구민들의"
    ],
    "summary": "생활체육교실들을 개설함으로써 구민들의 건강 증진과 생활체육 저변확대를 도모함",
    "audience": "○ 추진근거\n - 국민체육진흥법 제8조 및 동법 제16조, 동법 시행령 제6조\n - 문화체육관광부 지방체육업무편람\n - 서울특별시 중랑구 체육진흥 조례 제4조 및 동법 제6조\n\n ○ 운영기간 : 2025. 1. ~ 12.\n\n ○ 운영교실 : 11개 종목, 20개 생활체육교실(게이트볼, 탁구, 스쿼시, 장애인 댄스스포츠 등)\n\n ○ 운영방법 : 전문 강사 초빙 지도(주 1회 ~ 5회)\n\n ○ 사업대상자 : 중랑구에 주소지를 둔 20세 이상 중랑구민(주민등록지 기준)",
    "benefits": [
      "생활체육교실들을 개설함으로써 구민들의 건강 증진과 생활체육 저변확대를 도모함"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000229",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000229",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 추진근거\n - 국민체육진흥법 제8조 및 동법 제16조, 동법 시행령 제6조\n - 문화체육관광부 지방체육업무편람\n - 서울특별시 중랑구 체육진흥 조례 제4조 및 동법 제6조\n\n ○ 운영기간 : 2025. 1. ~ 12.\n\n ○ 운영교실 : 11개 종목, 20개 생활체육교실(게이트볼, 탁구, 스쿼시, 장애인 댄스스포츠 등)\n\n ○ 운영방법 : 전문 강사 초빙 지도(주 1회 ~ 5회)\n\n ○ 사업대상자 : 중랑구에 주소지를 둔 20세 이상 중랑구민(주민등록지 기준)",
      "benefit": "생활체육교실들을 개설함으로써 구민들의 건강 증진과 생활체육 저변확대를 도모함",
      "application": "기타 온라인신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-저소득-국민건강보험료-및-장기요양보험료-지원",
    "title": "저소득 국민건강보험료 및 장기요양보험료 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "저소득층에 국민건강보험료 및 노인장기요양보험료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득 국민건강보험료 및 장기요양보험료 지원",
      "보건의료",
      "서울",
      "서울특별시 중랑구",
      "확인필요",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "저소득층에",
      "국민건강보험료",
      "및"
    ],
    "summary": "저소득층에 국민건강보험료 및 노인장기요양보험료 지원",
    "audience": "저소득층에 국민건강보험료 및 노인장기요양보험료 지원",
    "benefits": [
      "저소득층에 국민건강보험료 및 노인장기요양보험료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000106",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000106",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "저소득층에 국민건강보험료 및 노인장기요양보험료 지원",
      "benefit": "저소득층에 국민건강보험료 및 노인장기요양보험료 지원",
      "application": "신청불필요",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-장애인-활동지원-추가",
    "title": "장애인 활동지원(추가)",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "중증, 최중증 수급자 등에게 활동지원급여 추가 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인 활동지원(추가)",
      "복지",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "장애인",
      "전체",
      "중증,",
      "최중증",
      "수급자",
      "등에게",
      "활동지원급여"
    ],
    "summary": "중증, 최중증 수급자 등에게 활동지원급여 추가 지원",
    "audience": "○ 장애인활동지원 수급자 중 중증,최중증 와상 또는 사지마비 수급자에게 월100~350시간 활동지원급여 제공",
    "benefits": [
      "중증, 최중증 수급자 등에게 활동지원급여 추가 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000104",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000104",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장애인활동지원 수급자 중 중증,최중증 와상 또는 사지마비 수급자에게 월100~350시간 활동지원급여 제공",
      "benefit": "중증, 최중증 수급자 등에게 활동지원급여 추가 지원",
      "application": "방문신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑청년청-운영",
    "title": "중랑청년청 운영",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "연계·맞춤·통합 센터",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·청년",
    "targetGroup": "청년, 부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑청년청 운영",
      "청년",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "부모/육아",
      "임신·출산·육아",
      "연계·맞춤·통합",
      "센터"
    ],
    "summary": "서울특별시 중랑구에서 청년을 위한 연계·맞춤형 센터 운영을 안내하는 사업입니다. 이용 대상과 프로그램은 공식 안내를 기준으로 확인하세요.",
    "audience": "ㅇ 청년 정책사업 연계를 위한 중랑청년청 공간 활용 증대 및 참여 욕구별 다양한 청년 활동 지원 프로그램 활성화\nㅇ 청년의 생활권 가까이, 청년과 지역사회를 연결하는 거점 역할 수행을 위하여 지역자원을 활용한 청년-지역 연결성 확대\nㅇ 지역내 다양한 커뮤니티 모임을 지원하고 공간을 제공하여 청년의 네트워킹 활동을 촉진하고 소통과 교류 증진",
    "benefits": [
      "연계·맞춤·통합 센터"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "기타 온라인신청||방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000233",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000233",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ 청년 정책사업 연계를 위한 중랑청년청 공간 활용 증대 및 참여 욕구별 다양한 청년 활동 지원 프로그램 활성화\nㅇ 청년의 생활권 가까이, 청년과 지역사회를 연결하는 거점 역할 수행을 위하여 지역자원을 활용한 청년-지역 연결성 확대\nㅇ 지역내 다양한 커뮤니티 모임을 지원하고 공간을 제공하여 청년의 네트워킹 활동을 촉진하고 소통과 교류 증진",
      "benefit": "연계·맞춤·통합 센터",
      "application": "기타 온라인신청||방문신청",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-고등학생-결핵이동검진-지원",
    "title": "고등학생 결핵이동검진 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "고등학교 2학년 학생을 대상으로 결핵이동검진 비용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "고등학생 결핵이동검진 지원",
      "교육",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "일반",
      "청소년",
      "전체",
      "고등학교",
      "2학년",
      "학생을",
      "대상으로"
    ],
    "summary": "고등학교 2학년 학생을 대상으로 결핵이동검진 비용 지원",
    "audience": "○ 관내 고등학교 2학년 학생 대상 결핵이동검진 비용 지원\n - 검진위탁기관 : 대한결핵협회 서울특별시지부\n - 검진대상 : 관내 고등학교 2학년 학생\n ㆍ학교보건법 제7조, 학교건강검사규칙 제6조에 의거, 학생별도검사 대상\n - 지원방법 : 검진위탁기관에 검진비 지급",
    "benefits": [
      "고등학교 2학년 학생을 대상으로 결핵이동검진 비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신청불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000109",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000109",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내 고등학교 2학년 학생 대상 결핵이동검진 비용 지원\n - 검진위탁기관 : 대한결핵협회 서울특별시지부\n - 검진대상 : 관내 고등학교 2학년 학생\n ㆍ학교보건법 제7조, 학교건강검사규칙 제6조에 의거, 학생별도검사 대상\n - 지원방법 : 검진위탁기관에 검진비 지급",
      "benefit": "고등학교 2학년 학생을 대상으로 결핵이동검진 비용 지원",
      "application": "신청불필요",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑-미취업-청년-자격증-응시료-지원",
    "title": "중랑 미취업 청년 자격증 응시료 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "중랑구 거주 미취업 청년에게 응시료 실비 지원 (1인 연10만 이내)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "마감",
    "startDate": null,
    "endDate": null,
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년·취업·사업",
    "targetGroup": "청년, 구직자, 소상공인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑 미취업 청년 자격증 응시료 지원",
      "청년",
      "서울",
      "서울특별시 중랑구",
      "마감",
      "구직자",
      "소상공인",
      "취업",
      "사업",
      "중랑구",
      "거주",
      "미취업"
    ],
    "summary": "중랑구 거주 미취업 청년에게 응시료 실비 지원 (1인 연10만 이내)",
    "audience": "○ 사업기간: 2025년 2월 ~ 11월 (예산소진시까지) \n○ 신청기간: 매월 20일까지 신청 접수\n○ 지원대상: 중랑구 거주 19~39세(1986년∼2006년생) 미취업 청년 \n - 신청일 기준 중랑구 거주 청년 \n - 응시일부터 신청일까지 미취업 및 사업자 미등록 청년 \n - 2025년 1월 1일 이후 실시한 국가기술(전문)자격시험, 국가공인자격시험 \n 어학시험(토익 등), 한국사능력검정시험 등 각종 자격시험에 응시한 자 \n○ 지원내용: 1인당 연 최대 10만원 (당해 연도 응시한 시험 통합1회 신청) \n○ 지원방법: 서류심사 후 응시료 실비 입금(예산범위 내 순차적 지원)",
    "benefits": [
      "중랑구 거주 미취업 청년에게 응시료 실비 지원 (1인 연10만 이내)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000224",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000224",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 사업기간: 2025년 2월 ~ 11월 (예산소진시까지) \n○ 신청기간: 매월 20일까지 신청 접수\n○ 지원대상: 중랑구 거주 19~39세(1986년∼2006년생) 미취업 청년 \n - 신청일 기준 중랑구 거주 청년 \n - 응시일부터 신청일까지 미취업 및 사업자 미등록 청년 \n - 2025년 1월 1일 이후 실시한 국가기술(전문)자격시험, 국가공인자격시험 \n 어학시험(토익 등), 한국사능력검정시험 등 각종 자격시험에 응시한 자 \n○ 지원내용: 1인당 연 최대 10만원 (당해 연도 응시한 시험 통합1회 신청) \n○ 지원방법: 서류심사 후 응시료 실비 입금(예산범위 내 순차적 지원)",
      "benefit": "중랑구 거주 미취업 청년에게 응시료 실비 지원 (1인 연10만 이내)",
      "application": "직접입력",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-중랑구-구민안전보험",
    "title": "중랑구 구민안전보험",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중랑구 구민안전보험",
      "보건의료",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "일반",
      "전체",
      "재난이나",
      "그밖의",
      "각종",
      "사고로",
      "피해가"
    ],
    "summary": "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상",
    "audience": "온열질환진단비 10만원\n화상수술비 10만원\n가스상해사고 사망 500만원\n가스상해사고 후유장해 500만원\n뺑소니 무보험차 상해 사망 300만원\n뺑소니 무보험차 상해 후유장해 300만원\n물놀이사고사망 100만원\n강력범죄상해 100만원\n의료사고법률비용지원 100만원\n개물림부딪힘사고진단비10만원",
    "benefits": [
      "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청||직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000212",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000212",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "온열질환진단비 10만원\n화상수술비 10만원\n가스상해사고 사망 500만원\n가스상해사고 후유장해 500만원\n뺑소니 무보험차 상해 사망 300만원\n뺑소니 무보험차 상해 후유장해 300만원\n물놀이사고사망 100만원\n강력범죄상해 100만원\n의료사고법률비용지원 100만원\n개물림부딪힘사고진단비10만원",
      "benefit": "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상",
      "application": "방문신청||직접입력",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-지역화폐-중랑사랑상품권",
    "title": "지역화폐(중랑사랑상품권)",
    "category": "소상공인",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 중랑구",
    "region": "서울",
    "amount": "지역 소상공인 및 주민 등을 위한 지역사랑상품권 혜택 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "사업",
    "targetGroup": "소상공인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "지역화폐(중랑사랑상품권)",
      "소상공인",
      "서울",
      "서울특별시 중랑구",
      "상시",
      "전체",
      "사업",
      "지역",
      "및",
      "주민",
      "등을",
      "위한"
    ],
    "summary": "지역 소상공인 및 주민 등을 위한 지역사랑상품권 혜택 지원",
    "audience": "○ 지역사랑상품권 발행으로 인한 지역경제 활성화 제공",
    "benefits": [
      "지역 소상공인 및 주민 등을 위한 지역사랑상품권 혜택 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "직접입력",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000107",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/306000000107",
    "contact": "서울특별시 중랑구",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지역사랑상품권 발행으로 인한 지역경제 활성화 제공",
      "benefit": "지역 소상공인 및 주민 등을 위한 지역사랑상품권 혜택 지원",
      "application": "직접입력",
      "contact": "서울특별시 중랑구"
    }
  },
  {
    "slug": "gov24-예방접종관리",
    "title": "예방접종관리",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "영유아 국가필수예방접종, 신증후군출혈열 및 장티푸스 예방접종, 인플루엔자",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "예방접종관리",
      "복지",
      "경북",
      "경상북도 의성군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "영유아",
      "국가필수예방접종,",
      "신증후군출혈열",
      "및"
    ],
    "summary": "영유아 국가필수예방접종, 신증후군출혈열 및 장티푸스 예방접종, 인플루엔자",
    "audience": "국가필수예방접종(BCG, B형간염, DTaP, IPV, Hib, 폐렴구균, 로타바이러스, MMR, 수두, A형간염, 일본뇌염, HPV, 인플루엔자)\n선택예방접종(대상포진-기초생활수급자)\n성인예방접종(신증후군출혈열, 장티푸스)",
    "benefits": [
      "영유아 국가필수예방접종, 신증후군출혈열 및 장티푸스 예방접종, 인플루엔자"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "보건소 내방하여 예진표 작성 후 예방접종 실시",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000139",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000139",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "국가필수예방접종(BCG, B형간염, DTaP, IPV, Hib, 폐렴구균, 로타바이러스, MMR, 수두, A형간염, 일본뇌염, HPV, 인플루엔자)\n선택예방접종(대상포진-기초생활수급자)\n성인예방접종(신증후군출혈열, 장티푸스)",
      "benefit": "영유아 국가필수예방접종, 신증후군출혈열 및 장티푸스 예방접종, 인플루엔자",
      "application": "보건소 내방하여 예진표 작성 후 예방접종 실시",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-농토배양-지원",
    "title": "농토배양 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "각 사업별 대상농가에 보조금 또는 비용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농토배양 지원",
      "농림어업",
      "경북",
      "경상북도 청송군",
      "모집중",
      "농어업인",
      "전체",
      "각",
      "사업별",
      "대상농가에",
      "보조금",
      "또는"
    ],
    "summary": "각 사업별 대상농가에 보조금 또는 비용 지원",
    "audience": "○ 객토사업 농가에 보조금 지원\n\n○ 축분퇴비생산 농가에 보조금 지원\n\n○ 논갈이경운에 소요되는 비용 지원\n\n○ 밭갈이경운에 소요되는 비용 지원\n\n○ 퇴비생산 농가에 보조금 지원",
    "benefits": [
      "각 사업별 대상농가에 보조금 또는 비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000116",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000116",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 객토사업 농가에 보조금 지원\n\n○ 축분퇴비생산 농가에 보조금 지원\n\n○ 논갈이경운에 소요되는 비용 지원\n\n○ 밭갈이경운에 소요되는 비용 지원\n\n○ 퇴비생산 농가에 보조금 지원",
      "benefit": "각 사업별 대상농가에 보조금 또는 비용 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-보훈관련-수당-및-위로금-지원",
    "title": "보훈관련 수당 및 위로금 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "국가유공자를 위해 보훈명예수당 및 사망위로금 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보훈관련 수당 및 위로금 지원",
      "복지",
      "경북",
      "경상북도 청송군",
      "상시",
      "일반",
      "전체",
      "국가유공자를",
      "위해",
      "보훈명예수당",
      "및",
      "사망위로금"
    ],
    "summary": "국가유공자를 위해 보훈명예수당 및 사망위로금 등 지원",
    "audience": "○ 국가유공자(참전유공자 및 사망한 참전유공자의 배우자, 국가보훈대상자)에게 매달 일정액의 수당 제공\n\n1.참전유공자 지원 \n- 사망위로금(30만원)\n- 6.25참전수당 월 25만원(도비10만원, 군비 15만원), \n-월남참전월21만원(도비6만원군비15만원), 전몰군경6만원(도비)\n2.참전유공자 배우자 지원 : 월 10만원\n3.보훈예우수당 지원 : 월 13만원(군비), 사망위로금(30만원)",
    "benefits": [
      "국가유공자를 위해 보훈명예수당 및 사망위로금 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000117",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000117",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 국가유공자(참전유공자 및 사망한 참전유공자의 배우자, 국가보훈대상자)에게 매달 일정액의 수당 제공\n\n1.참전유공자 지원 \n- 사망위로금(30만원)\n- 6.25참전수당 월 25만원(도비10만원, 군비 15만원), \n-월남참전월21만원(도비6만원군비15만원), 전몰군경6만원(도비)\n2.참전유공자 배우자 지원 : 월 10만원\n3.보훈예우수당 지원 : 월 13만원(군비), 사망위로금(30만원)",
      "benefit": "국가유공자를 위해 보훈명예수당 및 사망위로금 등 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 주민센터에 방문 신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-축산-환경개선-지원",
    "title": "축산 환경개선 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "축산농가 등에 가축분뇨 수분조절제, 악취저감 미생물 공급 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산 환경개선 지원",
      "농림어업",
      "경기",
      "경기도 가평군",
      "확인필요",
      "농어업인",
      "전체",
      "축산농가",
      "등에",
      "가축분뇨",
      "수분조절제,",
      "악취저감"
    ],
    "summary": "축산농가 등에 가축분뇨 수분조절제, 악취저감 미생물 공급 지원",
    "audience": "○ 가축분비료공장 가축분뇨 수분조절제(톱밥 지원), 축산농가에 악취저감 미생물 공급",
    "benefits": [
      "축산농가 등에 가축분뇨 수분조절제, 악취저감 미생물 공급 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 농가 및 축산단체 직접 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000104",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000104",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가축분비료공장 가축분뇨 수분조절제(톱밥 지원), 축산농가에 악취저감 미생물 공급",
      "benefit": "축산농가 등에 가축분뇨 수분조절제, 악취저감 미생물 공급 지원",
      "application": "○ 방문 신청\n - 기타 : 농가 및 축산단체 직접 방문",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-고혈압당뇨병-약제비-지원",
    "title": "고혈압·당뇨병 약제비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "만 65세 이상 고혈압 당뇨병 환자에게 약제비 본인부담금 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "고혈압·당뇨병 약제비 지원",
      "보건의료",
      "경기",
      "경기도 가평군",
      "상시",
      "어르신",
      "아동",
      "전체",
      "만",
      "65세",
      "이상",
      "고혈압"
    ],
    "summary": "만 65세 이상 고혈압 당뇨병 환자에게 약제비 본인부담금 일부 지원",
    "audience": "○ 고혈압 당뇨병에 대한 약제비 본인 부담금을 최대 월 12,000원까지 지원(매월 초일~말일 기준)",
    "benefits": [
      "만 65세 이상 고혈압 당뇨병 환자에게 약제비 본인부담금 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 관할 보건소, 보건지소, 보건진료소 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000105",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 고혈압 당뇨병에 대한 약제비 본인 부담금을 최대 월 12,000원까지 지원(매월 초일~말일 기준)",
      "benefit": "만 65세 이상 고혈압 당뇨병 환자에게 약제비 본인부담금 일부 지원",
      "application": "○ 방문 신청\n - 관할 보건소, 보건지소, 보건진료소 방문 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-축산-경영안정-지원",
    "title": "축산 경영안정 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "축산농가에 헬퍼, 소모품, 생균제 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산 경영안정 지원",
      "농림어업",
      "경기",
      "경기도 가평군",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "헬퍼,",
      "소모품,",
      "생균제",
      "등"
    ],
    "summary": "축산농가에 헬퍼, 소모품, 생균제 등 지원",
    "audience": "○ 축산농가 헬퍼 지원, 기타가축사육농가(양봉, 한봉, 사슴) 포장재 등 소모품지원, 축산농가 생균제 지원 등",
    "benefits": [
      "축산농가에 헬퍼, 소모품, 생균제 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 농가 및 축산단체 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000116",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000116",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 축산농가 헬퍼 지원, 기타가축사육농가(양봉, 한봉, 사슴) 포장재 등 소모품지원, 축산농가 생균제 지원 등",
      "benefit": "축산농가에 헬퍼, 소모품, 생균제 등 지원",
      "application": "○ 방문 신청\n - 기타 : 농가 및 축산단체 방문",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-경기도-가평군-군민안전보험",
    "title": "경기도 가평군 군민안전보험",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "경기도 가평군 군민안전보험",
      "보건의료",
      "경기",
      "경기도 가평군",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "재난이나",
      "각종",
      "사고로"
    ],
    "summary": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "audience": "자연재해사망 군민이 자연재해(일사병, 열사병, 저체온증 포함)로 사망한 경우\n(만15세미만자 제외) 2,000만원\n\n폭발･화재･붕괴 상해사망 군민이 폭발･화재･붕괴사태 사고로 상해 사망한 경우\n(만15세미만자 제외) 2,000만원\n\n폭발･화재･붕괴 상해후유장해 군민이 폭발･화재･붕괴사태 사고로 3%~100%의 상해 후유장해가 발생한 경우 1,000만원 한도\n(장애비율에 따라)\n\n대중교통이용 중 상해사망 군민이 대중교통 이용 중 상해 사망한 경우\n(만15세 미만자 제외) 2,000만원\n\n대중교통이용 중 상해후유장해 가평군민이 대중교통 이용 중 3% - 100%의 상해후유장해가 발생한 경우 1,000만원 한도\n(장애비율에 따라)\n\n익사사망 군민이 급격하고도 우연한 익사사고로 인해 상해의 직접결과로써 사망한 경우\n(질병제외, 만15세미만자 제외) 2,000만원\n\n스쿨존 교통사고 부상치료비 군민이 스쿨존 교통사고로 인해 부상시 부상등급에 따라 치료비 지급\n(만12세 이하) 1,000만원 한도\n\n농기계상해 사망 군민이 농기계사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우\n(만15세미만자 제외) 2,000만원\n\n농기계상해 후유장해 군민이 농기계사고에 의해 발생한 상해의 직접적인 결과로 3%~100% 상해 후유장해가 발생한 경우 1,000만원 한도\n(장애비율에 따라)\n\n개물림 사고 응급실 내원 치료비 군민이 국내에서 발생한 개물림 사고의 직접결과로서 응급실에 내원하여 진료를 받은 경우 50만원 한도\n* 담보 가입금액: 40만원 한도 \n\n개물림･부딪힘사고 진단비 군민이 국내에서 발생한 개 물림 또는 부딪힘 사고로 의료법 제3조(의료기관)에서 의료기관에서 진단을 받은 경우\n* 담보 가입금액: 10만원 한도 \n\n실버존 사고 치료비 군민(만65세 이상) 노인보호구역을 지정한 지역 내에서 교통사고로 인해 부상시 부상등급에 따라 치료비 지급 1,000만원 한도\n\n사회재난사망 군민이 사회재난(재난상황으로 보고된 건에 한함)으로 사망한 경우 1,000만원 한도\n(만15세미만자 제외), * 담보 가입금액: 1,000만원 한도",
    "benefits": [
      "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "한국지방재정공제회 전화문의 후 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000263",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000263",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "자연재해사망 군민이 자연재해(일사병, 열사병, 저체온증 포함)로 사망한 경우\n(만15세미만자 제외) 2,000만원\n\n폭발･화재･붕괴 상해사망 군민이 폭발･화재･붕괴사태 사고로 상해 사망한 경우\n(만15세미만자 제외) 2,000만원\n\n폭발･화재･붕괴 상해후유장해 군민이 폭발･화재･붕괴사태 사고로 3%~100%의 상해 후유장해가 발생한 경우 1,000만원 한도\n(장애비율에 따라)\n\n대중교통이용 중 상해사망 군민이 대중교통 이용 중 상해 사망한 경우\n(만15세 미만자 제외) 2,000만원\n\n대중교통이용 중 상해후유장해 가평군민이 대중교통 이용 중 3% - 100%의 상해후유장해가 발생한 경우 1,000만원 한도\n(장애비율에 따라)\n\n익사사망 군민이 급격하고도 우연한 익사사고로 인해 상해의 직접결과로써 사망한 경우\n(질병제외, 만15세미만자 제외) 2,000만원\n\n스쿨존 교통사고 부상치료비 군민이 스쿨존 교통사고로 인해 부상시 부상등급에 따라 치료비 지급\n(만12세 이하) 1,000만원 한도\n\n농기계상해 사망 군민이 농기계사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우\n(만15세미만자 제외) 2,000만원\n\n농기계상해 후유장해 군민이 농기계사고에 의해 발생한 상해의 직접적인 결과로 3%~100% 상해 후유장해가 발생한 경우 1,000만원 한도\n(장애비율에 따라)\n\n개물림 사고 응급실 내원 치료비 군민이 국내에서 발생한 개물림 사고의 직접결과로서 응급실에 내원하여 진료를 받은 경우 50만원 한도\n* 담보 가입금액: 40만원 한도 \n\n개물림･부딪힘사고 진단비 군민이 국내에서 발생한 개 물림 또는 부딪힘 사고로 의료법 제3조(의료기관)에서 의료기관에서 진단을 받은 경우\n* 담보 가입금액: 10만원 한도 \n\n실버존 사고 치료비 군민(만65세 이상) 노인보호구역을 지정한 지역 내에서 교통사고로 인해 부상시 부상등급에 따라 치료비 지급 1,000만원 한도\n\n사회재난사망 군민이 사회재난(재난상황으로 보고된 건에 한함)으로 사망한 경우 1,000만원 한도\n(만15세미만자 제외), * 담보 가입금액: 1,000만원 한도",
      "benefit": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
      "application": "한국지방재정공제회 전화문의 후 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-출산지원",
    "title": "출산지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "의성군 출생가정에 출산장려금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "출산지원",
      "복지",
      "경북",
      "경상북도 의성군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "의성군",
      "출생가정에",
      "출산장려금",
      "지원"
    ],
    "summary": "경상북도 의성군에서 출생가정을 대상으로 출산장려금 지원을 안내하는 사업입니다. 지원 조건과 신청 절차는 공식 공고에서 확인하세요.",
    "audience": "○ 지원내용(2025. 7. 1. 이후 출생아)\n - 출생아 : 출생축하금 100만원, 월 30만원×60개월\n - 자녀 출생일 기준 6개월 이전부터 부모 중 1인 의성군에 거주 필요\n\n○ 지원내용(2024. 7. 1. ~ 2025. 6. 30. 이전 출생아): 별도 문의\n\n○ 지원내용(2024. 6. 30. 이전 출생아)\n - 첫째아 : 출생축하금 100만원, 첫돌 축하금 100만원, 월 10만원×24개월\n - 둘째아 : 출생축하금 100만원, 첫돌 축하금 100만원, 월 20만원×36개월\n - 셋째아 : 첫돌 축하금 100만원, 월 25만원×60개월\n - 넷째이상 : 첫돌 축하금 100만원, 월 30만원×60개월\n\n○ 신청방법 : 읍·면사무소 방문 또는 온라인(정부24)신청",
    "benefits": [
      "의성군 출생가정에 출산장려금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 읍·면사무소 방문 또는 온라인(정부24)신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000101",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원내용(2025. 7. 1. 이후 출생아)\n - 출생아 : 출생축하금 100만원, 월 30만원×60개월\n - 자녀 출생일 기준 6개월 이전부터 부모 중 1인 의성군에 거주 필요\n\n○ 지원내용(2024. 7. 1. ~ 2025. 6. 30. 이전 출생아): 별도 문의\n\n○ 지원내용(2024. 6. 30. 이전 출생아)\n - 첫째아 : 출생축하금 100만원, 첫돌 축하금 100만원, 월 10만원×24개월\n - 둘째아 : 출생축하금 100만원, 첫돌 축하금 100만원, 월 20만원×36개월\n - 셋째아 : 첫돌 축하금 100만원, 월 25만원×60개월\n - 넷째이상 : 첫돌 축하금 100만원, 월 30만원×60개월\n\n○ 신청방법 : 읍·면사무소 방문 또는 온라인(정부24)신청",
      "benefit": "의성군 출생가정에 출산장려금 지원",
      "application": "○ 읍·면사무소 방문 또는 온라인(정부24)신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-맞춤형-농자재-지원",
    "title": "맞춤형 농자재 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "소모성 농자재 및 농기계 구입, 수리, 임대료 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "맞춤형 농자재 지원",
      "주거",
      "경북",
      "경상북도 의성군",
      "모집중",
      "농어업인",
      "전체",
      "소모성",
      "농자재",
      "및",
      "농기계",
      "구입,"
    ],
    "summary": "소모성 농자재 및 농기계 구입, 수리, 임대료 등 지원",
    "audience": "경작하는 모든 작물에 대해 일정 단가에 따라 면적만큼 소모성 농자재 구입비, 농기계 수리비 및 임대료 등을 지원",
    "benefits": [
      "소모성 농자재 및 농기계 구입, 수리, 임대료 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000116",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000116",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "경작하는 모든 작물에 대해 일정 단가에 따라 면적만큼 소모성 농자재 구입비, 농기계 수리비 및 임대료 등을 지원",
      "benefit": "소모성 농자재 및 농기계 구입, 수리, 임대료 등 지원",
      "application": "○ 방문 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-결혼이민자농가-농어촌진흥기금",
    "title": "결혼이민자농가 농어촌진흥기금",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "결혼이민자농가 농어촌진흥기금 지원[농가당 30백만원 범위 내 대출 금리 지원(균분상환)]",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "결혼이민자농가 농어촌진흥기금",
      "주거",
      "경북",
      "경상북도 의성군",
      "모집중",
      "농어업인",
      "전체",
      "결혼이민자농가",
      "농어촌진흥기금",
      "지원[농가당",
      "30백만원",
      "범위"
    ],
    "summary": "결혼이민자농가 농어촌진흥기금 지원[농가당 30백만원 범위 내 대출 금리 지원(균분상환)]",
    "audience": "사업대상(지원대상)\n ○ 관내 농촌지역에 거주하면서 외국인과 결혼한 농가로 실제 영농에 종사하는 농어업인 사업분야\n ○ 경종분야(수도작, 원예, 과수, 특작, 복합영농 등)의 영농규모 확대, 시설·장비 확충 및 개보수\n ∙ 하우스 설치, 과원조성, 묘목 및 종근 구입, 재배사ㆍ저장시설ㆍ관수시설 설치, 농기계 구입, 기타 농업기반시설 확충\n ○ 기타 농축산물의 생산 및 유통 등에 필요한 사료·비료·자재구입 등\n ※ 지원제외 : 농지 및 건물(주택) 구입(임차)비, 축산분야 FTA 피해보전직불금 \n 대상 축종(한우, 양돈, 양계, 염소, 오리)의 축사 신‧증축(개보수) 및 입식자금 제외\n 지원한도 및 지원형태\n ○ 지원한도 : 농가당 30백만원 범위내(최소 5백만원, 최대 30백만원)\n ○ 대출금리(기한)\n ① 시설자금(장기성) : 연리 1.0%, 3년 거치 7년 균분상환\n ② 운영자금(단기성) : 연리 1.0%, 2년 거치 3년 균분상환\n ○ 자금분류 및 거치기간\n ① 시설자금 : 건축물, 대형 농기계, 선박 개보수(노후어선교체) 등\n ※ 명시되지 않은 운영‧시설자금에 대하여 사업의 성격, 목적 등을 감안하여 농어업에 필요하다고 판단 될 경우 지원할 수 있음.\n ② 운영자금 : 소모성 농어업용 자재, 소형 농기계(500만원 이하),\n 농수산물 수매, 사료구입 등\n ※ 인건비, 유류비, 공공요금 및 객관적 증빙(전자세금계산서 등)이 불가능한 \n 기타 운영비 제외\n ③ 거치기간 : 대여일이 속한 당해년도 말을 1년으로 함\n - 거치기간 산정은 융자실행 시점에 관계없이 당해년도 말이 되면, 1년이 경과한 것으로 한다.",
    "benefits": [
      "결혼이민자농가 농어촌진흥기금 지원[농가당 30백만원 범위 내 대출 금리 지원(균분상환)]"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 주민센터 : 읍면사무소 사업 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000131",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000131",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "사업대상(지원대상)\n ○ 관내 농촌지역에 거주하면서 외국인과 결혼한 농가로 실제 영농에 종사하는 농어업인 사업분야\n ○ 경종분야(수도작, 원예, 과수, 특작, 복합영농 등)의 영농규모 확대, 시설·장비 확충 및 개보수\n ∙ 하우스 설치, 과원조성, 묘목 및 종근 구입, 재배사ㆍ저장시설ㆍ관수시설 설치, 농기계 구입, 기타 농업기반시설 확충\n ○ 기타 농축산물의 생산 및 유통 등에 필요한 사료·비료·자재구입 등\n ※ 지원제외 : 농지 및 건물(주택) 구입(임차)비, 축산분야 FTA 피해보전직불금 \n 대상 축종(한우, 양돈, 양계, 염소, 오리)의 축사 신‧증축(개보수) 및 입식자금 제외\n 지원한도 및 지원형태\n ○ 지원한도 : 농가당 30백만원 범위내(최소 5백만원, 최대 30백만원)\n ○ 대출금리(기한)\n ① 시설자금(장기성) : 연리 1.0%, 3년 거치 7년 균분상환\n ② 운영자금(단기성) : 연리 1.0%, 2년 거치 3년 균분상환\n ○ 자금분류 및 거치기간\n ① 시설자금 : 건축물, 대형 농기계, 선박 개보수(노후어선교체) 등\n ※ 명시되지 않은 운영‧시설자금에 대하여 사업의 성격, 목적 등을 감안하여 농어업에 필요하다고 판단 될 경우 지원할 수 있음.\n ② 운영자금 : 소모성 농어업용 자재, 소형 농기계(500만원 이하),\n 농수산물 수매, 사료구입 등\n ※ 인건비, 유류비, 공공요금 및 객관적 증빙(전자세금계산서 등)이 불가능한 \n 기타 운영비 제외\n ③ 거치기간 : 대여일이 속한 당해년도 말을 1년으로 함\n - 거치기간 산정은 융자실행 시점에 관계없이 당해년도 말이 되면, 1년이 경과한 것으로 한다.",
      "benefit": "결혼이민자농가 농어촌진흥기금 지원[농가당 30백만원 범위 내 대출 금리 지원(균분상환)]",
      "application": "○ 방문신청\n - 주민센터 : 읍면사무소 사업 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-농작물재해보험료-지원사업",
    "title": "농작물재해보험료 지원사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "보험가입 시 보조금분을 제외한 자부담분만 납부(선면제제)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "사업",
    "targetGroup": "소상공인, 농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농작물재해보험료 지원사업",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "소상공인",
      "농어업인",
      "전체",
      "사업",
      "보험가입",
      "시",
      "보조금분을"
    ],
    "summary": "보험가입 시 보조금분을 제외한 자부담분만 납부(선면제제)",
    "audience": "1. 목적\n ❍ 자연재해로 인한 농작물 피해를 보상하여 농가 소득 및 경영안정에 기여\n 2. 사업대상\n ❍ 대상 품목 : 사과, 배, 포도, 복숭아, 단감, 떫은감 등 농림축산식품부(이하 농식품부)에서 지정한 작물\n ❍ 지원 대상 : 농식품부 지침 상 가입요건을 충족하는 자\n ❍ 사업대상자 : 농작물재해보험 사업을 추진하는 금융기관\n ❍ 지원방식 : 선면제제\n - 농가에서는 보험가입 시 보조금분을 제외한 자부담분만 납부하고 보험가입, 보조금분은 사업자가 행정기관(해당시군)으로 청구",
    "benefits": [
      "보험가입 시 보조금분을 제외한 자부담분만 납부(선면제제)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 신청장소: 방문신청(지역농축협 및 품목농협)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000132",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000132",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "1. 목적\n ❍ 자연재해로 인한 농작물 피해를 보상하여 농가 소득 및 경영안정에 기여\n 2. 사업대상\n ❍ 대상 품목 : 사과, 배, 포도, 복숭아, 단감, 떫은감 등 농림축산식품부(이하 농식품부)에서 지정한 작물\n ❍ 지원 대상 : 농식품부 지침 상 가입요건을 충족하는 자\n ❍ 사업대상자 : 농작물재해보험 사업을 추진하는 금융기관\n ❍ 지원방식 : 선면제제\n - 농가에서는 보험가입 시 보조금분을 제외한 자부담분만 납부하고 보험가입, 보조금분은 사업자가 행정기관(해당시군)으로 청구",
      "benefit": "보험가입 시 보조금분을 제외한 자부담분만 납부(선면제제)",
      "application": "○ 신청장소: 방문신청(지역농축협 및 품목농협)",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-기본형-공익직접지불사업",
    "title": "기본형 공익직접지불사업",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "면적직불금 및 소농직불금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "기본형 공익직접지불사업",
      "주거",
      "경북",
      "경상북도 의성군",
      "모집중",
      "농어업인",
      "전체",
      "면적직불금",
      "및",
      "소농직불금",
      "지원"
    ],
    "summary": "경상북도 의성군의 기본형 공익직접지불사업으로 면적직불금과 소농직불금 지원을 안내합니다. 대상 농지와 신청 요건은 공식 공고에서 확인하세요.",
    "audience": "사업목적\n○ 농업활동을 통해 환경보전, 농촌유지, 식품안전 등 농업･농촌의 공익기능 증진과 농업인등의 소득안정 도모\n지원내용\n○ (면적직불금) 논밭 진흥/진흥밖, 면적구간별 역진적 지급단가를 적용하여 농지면적기준으로 농업인에게 직불금 지급\n○ (소농직불금) 소농자격요건을 갖춘 농가 대상 130만원 일률 지급",
    "benefits": [
      "면적직불금 및 소농직불금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000133",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000133",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "사업목적\n○ 농업활동을 통해 환경보전, 농촌유지, 식품안전 등 농업･농촌의 공익기능 증진과 농업인등의 소득안정 도모\n지원내용\n○ (면적직불금) 논밭 진흥/진흥밖, 면적구간별 역진적 지급단가를 적용하여 농지면적기준으로 농업인에게 직불금 지급\n○ (소농직불금) 소농자격요건을 갖춘 농가 대상 130만원 일률 지급",
      "benefit": "면적직불금 및 소농직불금 지원",
      "application": "○ 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-브랜드-쌀-홍보판촉행사-지원사업",
    "title": "브랜드 쌀 홍보판촉행사 지원사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "의성군 브랜드 쌀 홍보 효과가 기대되는 각종 행사 추진 시 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "브랜드 쌀 홍보판촉행사 지원사업",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "의성군",
      "브랜드",
      "쌀",
      "홍보",
      "효과가"
    ],
    "summary": "의성군 브랜드 쌀 홍보 효과가 기대되는 각종 행사 추진 시 지원",
    "audience": "1. 사업대상: 의성군 브랜드 쌀(의성진쌀)을 홍보하고자 하는 생산자 단체 또는 가공 RPC\n2. 지원내용: 유통매장･대량소비처 홍보‧판촉행사 등 의성군 브랜드 쌀 홍보 효과가 기대되는 각종 행사 추진 시 지원\n3. 지원기준\n 가. 홍보‧판촉활동 인부임\n - 행사장별 1인, 월 1회 최대 14일까지 지원, 초과일수는 자부담 처리\n - 대구･경북지역은 50,000원/일, 수도권 등 기타지역 60,000원/일(인부임 중 일부정액지원)\n ※ 각종 행사 추진 시 부대행사로 진행하는 단순 홍보용 쌀 배부는 인부임을 지원하지 않음.\n 나. 홍보용 쌀\n - 홍보용 쌀/500g(1일 100~500개)\n - 단가(개당) : 2,000원 ※ 50%지원\n ※ 홍보용 쌀은 판매실적 및 홍보효과에 따라 증감될 수 있음.",
    "benefits": [
      "의성군 브랜드 쌀 홍보 효과가 기대되는 각종 행사 추진 시 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000137",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000137",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "1. 사업대상: 의성군 브랜드 쌀(의성진쌀)을 홍보하고자 하는 생산자 단체 또는 가공 RPC\n2. 지원내용: 유통매장･대량소비처 홍보‧판촉행사 등 의성군 브랜드 쌀 홍보 효과가 기대되는 각종 행사 추진 시 지원\n3. 지원기준\n 가. 홍보‧판촉활동 인부임\n - 행사장별 1인, 월 1회 최대 14일까지 지원, 초과일수는 자부담 처리\n - 대구･경북지역은 50,000원/일, 수도권 등 기타지역 60,000원/일(인부임 중 일부정액지원)\n ※ 각종 행사 추진 시 부대행사로 진행하는 단순 홍보용 쌀 배부는 인부임을 지원하지 않음.\n 나. 홍보용 쌀\n - 홍보용 쌀/500g(1일 100~500개)\n - 단가(개당) : 2,000원 ※ 50%지원\n ※ 홍보용 쌀은 판매실적 및 홍보효과에 따라 증감될 수 있음.",
      "benefit": "의성군 브랜드 쌀 홍보 효과가 기대되는 각종 행사 추진 시 지원",
      "application": "방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-축산업구조개선",
    "title": "축산업구조개선",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "축산농가에 소모품, 장려금 지원 및 의성군 브랜드 축산물 기반조성 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산업구조개선",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "소모품,",
      "장려금",
      "지원",
      "및"
    ],
    "summary": "축산농가에 소모품, 장려금 지원 및 의성군 브랜드 축산물 기반조성 지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 장려금 지원, \n 의성군 브랜드 축산물 기반조성 지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "축산농가에 소모품, 장려금 지원 및 의성군 브랜드 축산물 기반조성 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 주민센터 : 농가 해당 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000140",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000140",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 장려금 지원, \n 의성군 브랜드 축산물 기반조성 지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "축산농가에 소모품, 장려금 지원 및 의성군 브랜드 축산물 기반조성 지원",
      "application": "○ 방문신청\n - 주민센터 : 농가 해당 읍면사무소 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-광역한우브랜드지원",
    "title": "광역한우브랜드지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "축산농가에 농업용 스키드로더 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "광역한우브랜드지원",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "농업용",
      "스키드로더",
      "지원"
    ],
    "summary": "경상북도 의성군에서 축산농가를 대상으로 농업용 스키드로더 지원을 안내하는 사업입니다. 지원 대상과 접수 방식은 공식 공고에서 확인하세요.",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 농업용 스키드로더 지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "축산농가에 농업용 스키드로더 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 해당농가 읍면사무소 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000142",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000142",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 농업용 스키드로더 지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "축산농가에 농업용 스키드로더 지원",
      "application": "○ 방문신청\n - 해당농가 읍면사무소 방문 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-양돈지원사업",
    "title": "양돈지원사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "등록된 종돈장에서 생산된 우수 모돈 구매 비용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양돈지원사업",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "등록된",
      "종돈장에서",
      "생산된",
      "우수",
      "모돈"
    ],
    "summary": "등록된 종돈장에서 생산된 우수 모돈 구매 비용 지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 양돈 사육농가\n◦ 사업내용 : 등록된 종돈장에서 생산된 우수 모돈 구매 비용 지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. : 신청공고 및 대상자 신청 접수\n◦ 2026. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2026. 3. : 보조금교부결정 및 사업시행\n◦ 2026. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "등록된 종돈장에서 생산된 우수 모돈 구매 비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 농가해당 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000146",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000146",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 양돈 사육농가\n◦ 사업내용 : 등록된 종돈장에서 생산된 우수 모돈 구매 비용 지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. : 신청공고 및 대상자 신청 접수\n◦ 2026. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2026. 3. : 보조금교부결정 및 사업시행\n◦ 2026. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "등록된 종돈장에서 생산된 우수 모돈 구매 비용 지원",
      "application": "○ 방문신청\n - 농가해당 읍면사무소 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-양봉산업육성추진",
    "title": "양봉산업육성추진",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "축산업 기반조성을 위한 소모품 및 기자재지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양봉산업육성추진",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "축산업",
      "기반조성을",
      "위한",
      "소모품",
      "및"
    ],
    "summary": "축산업 기반조성을 위한 소모품 및 기자재지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 등록된 관내 양봉 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "축산업 기반조성을 위한 소모품 및 기자재지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n- 주민센터 : 농가해당 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000147",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000147",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 등록된 관내 양봉 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "축산업 기반조성을 위한 소모품 및 기자재지원",
      "application": "○ 방문신청\n- 주민센터 : 농가해당 읍면사무소 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-양봉지원사업",
    "title": "양봉지원사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "축산업 기반조성을 위한 소모품 및 기자재지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양봉지원사업",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "축산업",
      "기반조성을",
      "위한",
      "소모품",
      "및"
    ],
    "summary": "축산업 기반조성을 위한 소모품 및 기자재지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 양봉 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "축산업 기반조성을 위한 소모품 및 기자재지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 농가해당 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000148",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000148",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 양봉 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "축산업 기반조성을 위한 소모품 및 기자재지원",
      "application": "○ 방문신청\n - 농가해당 읍면사무소 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-전문단지조성용사일리지제조지원",
    "title": "전문단지조성용사일리지제조지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "양질의 국내산 조사료 제조에 소요되는 비용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "전문단지조성용사일리지제조지원",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "양질의",
      "국내산",
      "조사료",
      "제조에",
      "소요되는"
    ],
    "summary": "양질의 국내산 조사료 제조에 소요되는 비용 지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 조사료생산기반확충사업 공통요건에 부합하는 자로서 사료작물을 재배(계약재배 포함) 또는 자생식물 활용 허용부지(간척지, 하천부지, 군부대 부지 등)에서 야생풀을 채취하여 사일리지, 건초 등으로 제조하는 자\n◦ 사업내용 : 양질의 국내산 조사료 제조에 소요되는 비용 지원\n * 사일리지 제조용 비닐, 망사, 발효제, 연료 및 감가상각비, 관내 단거리 운반비용, 인건비, 사일리지 및 건초 사후관리 비용, 보온덮개 등\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "양질의 국내산 조사료 제조에 소요되는 비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 해당 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000149",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000149",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 조사료생산기반확충사업 공통요건에 부합하는 자로서 사료작물을 재배(계약재배 포함) 또는 자생식물 활용 허용부지(간척지, 하천부지, 군부대 부지 등)에서 야생풀을 채취하여 사일리지, 건초 등으로 제조하는 자\n◦ 사업내용 : 양질의 국내산 조사료 제조에 소요되는 비용 지원\n * 사일리지 제조용 비닐, 망사, 발효제, 연료 및 감가상각비, 관내 단거리 운반비용, 인건비, 사일리지 및 건초 사후관리 비용, 보온덮개 등\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "양질의 국내산 조사료 제조에 소요되는 비용 지원",
      "application": "○ 방문신청\n - 해당 읍면사무소 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-전문단지조성용종자구입지원",
    "title": "전문단지조성용종자구입지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "사료작물 및 목초 재배에 필요한 종자구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "전문단지조성용종자구입지원",
      "주거",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "사료작물",
      "및",
      "목초",
      "재배에",
      "필요한"
    ],
    "summary": "사료작물 및 목초 재배에 필요한 종자구입비 지원",
    "audience": "○ 지원자격 : 사료작물 재배를 위해 종자를 파종하고자 하는자\n\n○ 지원대상 : 목초, 풋베기사료작물, 종자, 기타(트리티케일 등 사료작물로 사용가능한 것), 단 수입 종자의 경우 수입적응성시험을 받고 대상작물에 등재된 것에 한함 \n\n○ 지원내용 : 사료작물 및 목초 재배에 필요한 종자구입비 지원\n\n○ 지원기준 \n - 보리 종자구입비 지원은 보증받은 전용품종에 국한\n - 다른 사업에서 종자를 지원받는 경우 종자대 지원대상에서 제외\n - 농가 자가생산 종자에는 지급하지 않으며, 국내 육성품종 또는 수입적응성 인증품종으로서 품질검사를 완료하고, 농업기술센터(국내생산 종자분), 지역 농축협(농협경제지주 계통 구매분) 또는 낙농육우협회를 통해 구입한 비용(영수증 등 증빙자료 첨부)\n - 농가의 종자 신청이 시·군(농업기술센터 포함), 지역조합, 낙농육우협회 등에 중복 신청되지 않도록 상호 사업대상자 통보·확인\n\n○ 사업기간 : ′25. 01. ~ ′25. 12.\n\n○ 종자대 정산시 유의사항\n - 사업대상자는 종자 인수전 지역조합, 낙농육우협회 및 농업 기술센터에 납부\n - 지역조합, 낙농육우협회 및 농업기술센터로부터 농가별 종자공급 실적을 확인(인수증 또는 현장확인) 후 보조금 지급\n - 지역조합, 낙농육우협회 및 농업기술센터에 이중으로 구매한 농가에 대해서는 실적을 확인하여 중복되지 않도록 보조금 지원금액을 해당 기관 공급분에 대해서 각각 지원\n - 조사료 생산용 종자 중 과세종자는 부가가치세 환급 대상이므로 보조금 신청시 부가가치세 제외 지급",
    "benefits": [
      "사료작물 및 목초 재배에 필요한 종자구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 군청 직접 방문 접수",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000150",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000150",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원자격 : 사료작물 재배를 위해 종자를 파종하고자 하는자\n\n○ 지원대상 : 목초, 풋베기사료작물, 종자, 기타(트리티케일 등 사료작물로 사용가능한 것), 단 수입 종자의 경우 수입적응성시험을 받고 대상작물에 등재된 것에 한함 \n\n○ 지원내용 : 사료작물 및 목초 재배에 필요한 종자구입비 지원\n\n○ 지원기준 \n - 보리 종자구입비 지원은 보증받은 전용품종에 국한\n - 다른 사업에서 종자를 지원받는 경우 종자대 지원대상에서 제외\n - 농가 자가생산 종자에는 지급하지 않으며, 국내 육성품종 또는 수입적응성 인증품종으로서 품질검사를 완료하고, 농업기술센터(국내생산 종자분), 지역 농축협(농협경제지주 계통 구매분) 또는 낙농육우협회를 통해 구입한 비용(영수증 등 증빙자료 첨부)\n - 농가의 종자 신청이 시·군(농업기술센터 포함), 지역조합, 낙농육우협회 등에 중복 신청되지 않도록 상호 사업대상자 통보·확인\n\n○ 사업기간 : ′25. 01. ~ ′25. 12.\n\n○ 종자대 정산시 유의사항\n - 사업대상자는 종자 인수전 지역조합, 낙농육우협회 및 농업 기술센터에 납부\n - 지역조합, 낙농육우협회 및 농업기술센터로부터 농가별 종자공급 실적을 확인(인수증 또는 현장확인) 후 보조금 지급\n - 지역조합, 낙농육우협회 및 농업기술센터에 이중으로 구매한 농가에 대해서는 실적을 확인하여 중복되지 않도록 보조금 지원금액을 해당 기관 공급분에 대해서 각각 지원\n - 조사료 생산용 종자 중 과세종자는 부가가치세 환급 대상이므로 보조금 신청시 부가가치세 제외 지급",
      "benefit": "사료작물 및 목초 재배에 필요한 종자구입비 지원",
      "application": "○ 방문신청\n - 군청 직접 방문 접수",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-방역시설설치지원",
    "title": "방역시설설치지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "악성가축전염병의 재발 및 유입 방지를 위해 농장 및 축사 출입구에 소독시설 설치 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "방역시설설치지원",
      "보건의료",
      "경북",
      "경상북도 의성군",
      "모집중",
      "농어업인",
      "전체",
      "악성가축전염병의",
      "재발",
      "및",
      "유입",
      "방지를"
    ],
    "summary": "악성가축전염병의 재발 및 유입 방지를 위해 농장 및 축사 출입구에 소독시설 설치 지원",
    "audience": "구제역 및 고병원성 조류인플루엔자 등 악성가축전염병의 재발 및 유입 방지를 위해 농장 및 축사 출입구로부터 원천적인 차단방역을 위한 소독시설 지원\n ∙축산관련 집단시설 및 축산단지 등에 지원하고 고가소독시설 설치 등에 따른 추가비용 발생 시에는 자부담으로 충당\n ∙시설기준\n - 축산관련시설 및 농장 출입구 등에 통과차량을 소독할 수 있는 시설\n - 자체엔진 및 좌우측 분무시설이 부착되어 있고 자동감지센스가 있는 것\n - 동절기에도 얼지 않고 소독이 가능한 시설\n - 소독실, 소독기, 기타(보온이 가능한 소독약품통 등)\n ∙축산관련시설 및 농가당 1대를 지원하고 고가 장비 구입에 따른 추가비용 발생 시에는 자부담으로 충당\n ∙장비기준\n - 농장 출입구, 축사 내외부 소독용 고성능 분무기(부대장비 포함)\n - 구입 후 A/S가 용이하며 사용이 편리한 제품\n - 상반기 중 설치 완료 추진\n - 농장 출입자 소독을 위한 대인소독기 구입 가능",
    "benefits": [
      "악성가축전염병의 재발 및 유입 방지를 위해 농장 및 축사 출입구에 소독시설 설치 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 정해진 신청기간에 읍면사무소로 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000152",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000152",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "구제역 및 고병원성 조류인플루엔자 등 악성가축전염병의 재발 및 유입 방지를 위해 농장 및 축사 출입구로부터 원천적인 차단방역을 위한 소독시설 지원\n ∙축산관련 집단시설 및 축산단지 등에 지원하고 고가소독시설 설치 등에 따른 추가비용 발생 시에는 자부담으로 충당\n ∙시설기준\n - 축산관련시설 및 농장 출입구 등에 통과차량을 소독할 수 있는 시설\n - 자체엔진 및 좌우측 분무시설이 부착되어 있고 자동감지센스가 있는 것\n - 동절기에도 얼지 않고 소독이 가능한 시설\n - 소독실, 소독기, 기타(보온이 가능한 소독약품통 등)\n ∙축산관련시설 및 농가당 1대를 지원하고 고가 장비 구입에 따른 추가비용 발생 시에는 자부담으로 충당\n ∙장비기준\n - 농장 출입구, 축사 내외부 소독용 고성능 분무기(부대장비 포함)\n - 구입 후 A/S가 용이하며 사용이 편리한 제품\n - 상반기 중 설치 완료 추진\n - 농장 출입자 소독을 위한 대인소독기 구입 가능",
      "benefit": "악성가축전염병의 재발 및 유입 방지를 위해 농장 및 축사 출입구에 소독시설 설치 지원",
      "application": "○ 방문신청\n - 정해진 신청기간에 읍면사무소로 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-자원관리지원",
    "title": "자원관리지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "친환경 축산업 기반조성을 위한 소모품 및 기자재지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "자원관리지원",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "친환경",
      "축산업",
      "기반조성을",
      "위한",
      "소모품"
    ],
    "summary": "친환경 축산업 기반조성을 위한 소모품 및 기자재지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 친환경 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. : 신청공고 및 대상자 신청 접수\n◦ 2026. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2026. 3. : 보조금교부결정 및 사업시행\n◦ 2026. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "친환경 축산업 기반조성을 위한 소모품 및 기자재지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "해당농가 읍면 사무소 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000153",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000153",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 친환경 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. : 신청공고 및 대상자 신청 접수\n◦ 2026. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2026. 3. : 보조금교부결정 및 사업시행\n◦ 2026. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "친환경 축산업 기반조성을 위한 소모품 및 기자재지원",
      "application": "해당농가 읍면 사무소 방문 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-축산농가지원",
    "title": "축산농가지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "축산업 기반조성을 위한 소모품 및 기자재지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산농가지원",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "축산업",
      "기반조성을",
      "위한",
      "소모품",
      "및"
    ],
    "summary": "축산업 기반조성을 위한 소모품 및 기자재지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. : 신청공고 및 대상자 신청 접수\n◦ 2026. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2026. 3. : 보조금교부결정 및 사업시행\n◦ 2026. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "축산업 기반조성을 위한 소모품 및 기자재지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 농가 해당 읍면사무소 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000154",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000154",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 사육농가\n◦ 사업내용 : 축산업 기반조성을 위한 소모품 및 기자재지원\n\n□ 사전절차 및 추진계획 \n◦ 2026. 1. : 신청공고 및 대상자 신청 접수\n◦ 2026. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2026. 3. : 보조금교부결정 및 사업시행\n◦ 2026. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "축산업 기반조성을 위한 소모품 및 기자재지원",
      "application": "○ 방문신청\n - 농가 해당 읍면사무소 방문 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-의성군-신혼부부-주거비용-지원-인구늘리기-시책",
    "title": "의성군 신혼부부 주거비용 지원(인구늘리기 시책)",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "전세자금 대출금 이자 또는 월세 자금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거",
    "targetGroup": "신혼부부",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "의성군 신혼부부 주거비용 지원(인구늘리기 시책)",
      "주거",
      "경북",
      "경상북도 의성군",
      "상시",
      "신혼부부",
      "전체",
      "전세자금",
      "대출금",
      "이자",
      "또는",
      "월세"
    ],
    "summary": "전세자금 대출금 이자 또는 월세 자금 지원",
    "audience": "전세자금 대출금 이자 또는 월세 자금 지원\n - 가구당 월 최대 10만원 지원\n - 최대 24개월 지원",
    "benefits": [
      "전세자금 대출금 이자 또는 월세 자금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 신청방법 : 주소지 읍/면 사무소 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000169",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000169",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "전세자금 대출금 이자 또는 월세 자금 지원\n - 가구당 월 최대 10만원 지원\n - 최대 24개월 지원",
      "benefit": "전세자금 대출금 이자 또는 월세 자금 지원",
      "application": "○ 신청방법 : 주소지 읍/면 사무소 방문 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-의성군-군민안전보험",
    "title": "의성군 군민안전보험",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "의성군 군민안전보험",
      "복지",
      "경북",
      "경상북도 의성군",
      "상시",
      "장애인",
      "전체",
      "재난이나",
      "각종",
      "사고로",
      "피해",
      "발생"
    ],
    "summary": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "audience": "자연재해(일사병, 열사병, 저체온증 포함)으로 사망한 경우 2000\n화재, 폭발, 붕괴사태 사고로 상해 사망한 경우 2000\n화재, 폭발, 붕괴사태 사고로 상해로 인한 후유장해 2000\n대중교통 이용 중 사망 2000\n대중교통 이용 중 상해 또는 3~100% 상해후유장해가 발생한 경우 2000\n스쿨존 교통사고로 인해 부상시 부상등급에 따라 치료비 지급 2000\n급격하고도 우연한 익사사고로 인해 상해의 직접적인 결과로 사망한 경우(질병제외) 2000\n농기계사고로 사망한 경우 2000\n농기계사고로 3~100% 후유장해가 발생한 경우 2000\n야생동물피해보상사망 500\n야생동물피해보상치료비담보 100\n실버존사고 치료비 담보(1~5급) 2000\n사회재난법에 의한 사회재난으로 인한 사망시 2000\n자연재해상해후유장애 2000\n사회재난상해후유장애 2000",
    "benefits": [
      "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "1577-5939 콜센터로 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000170",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000170",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "자연재해(일사병, 열사병, 저체온증 포함)으로 사망한 경우 2000\n화재, 폭발, 붕괴사태 사고로 상해 사망한 경우 2000\n화재, 폭발, 붕괴사태 사고로 상해로 인한 후유장해 2000\n대중교통 이용 중 사망 2000\n대중교통 이용 중 상해 또는 3~100% 상해후유장해가 발생한 경우 2000\n스쿨존 교통사고로 인해 부상시 부상등급에 따라 치료비 지급 2000\n급격하고도 우연한 익사사고로 인해 상해의 직접적인 결과로 사망한 경우(질병제외) 2000\n농기계사고로 사망한 경우 2000\n농기계사고로 3~100% 후유장해가 발생한 경우 2000\n야생동물피해보상사망 500\n야생동물피해보상치료비담보 100\n실버존사고 치료비 담보(1~5급) 2000\n사회재난법에 의한 사회재난으로 인한 사망시 2000\n자연재해상해후유장애 2000\n사회재난상해후유장애 2000",
      "benefit": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
      "application": "1577-5939 콜센터로 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-임신진단비-및-기형아검사비-지원",
    "title": "임신진단비 및 기형아검사비 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "임산부에게 임신진단비 및 기형아검사비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임신진단비 및 기형아검사비 지원",
      "복지",
      "경북",
      "경상북도 청송군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "임산부에게",
      "임신진단비",
      "및",
      "기형아검사비"
    ],
    "summary": "임산부에게 임신진단비 및 기형아검사비 지원",
    "audience": "○ 임산부에게 임신진단비 및 기형아검사비 각 5만원 한도 지원",
    "benefits": [
      "임산부에게 임신진단비 및 기형아검사비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건의료원 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000114",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000114",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 임산부에게 임신진단비 및 기형아검사비 각 5만원 한도 지원",
      "benefit": "임산부에게 임신진단비 및 기형아검사비 지원",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건의료원 방문",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-김포시-소상공인-특례보증-지원",
    "title": "김포시 소상공인 특례보증 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "소상공인 대상 특례보증 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "사업",
    "targetGroup": "소상공인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "김포시 소상공인 특례보증 지원",
      "주거",
      "경기",
      "경기도 김포시",
      "상시",
      "소상공인",
      "전체",
      "사업",
      "대상",
      "특례보증",
      "지원"
    ],
    "summary": "경기도 김포시에서 소상공인을 대상으로 특례보증 지원을 안내하는 사업입니다. 보증 조건과 접수 절차는 공식 공고에서 확인하세요.",
    "audience": "특례보증 : 업체당 5천만원 이내 특례보증 지원",
    "benefits": [
      "소상공인 대상 특례보증 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "경기도신용보증재단 김포지점 접수",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000115",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "특례보증 : 업체당 5천만원 이내 특례보증 지원",
      "benefit": "소상공인 대상 특례보증 지원",
      "application": "경기도신용보증재단 김포지점 접수",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-북부지역-치매환자-맞춤형-사례관리-사업",
    "title": "북부지역 치매환자 맞춤형 사례관리 사업",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "치매환자가 보다 오랫동안 가정에서 생활할 수 있도록 지원하는 서비스",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "북부지역 치매환자 맞춤형 사례관리 사업",
      "교육",
      "경기",
      "경기도 김포시",
      "상시",
      "어르신",
      "복지",
      "치매환자가",
      "보다",
      "오랫동안",
      "가정에서",
      "생활할"
    ],
    "summary": "치매환자가 보다 오랫동안 가정에서 생활할 수 있도록 지원하는 서비스",
    "audience": "○ 대상: 김포시 북부지역에 등록된 치매 어르신 중 독거치매, 부부치매, 의료수급권자 및 취약계층\n○ 내용: \n 1. 건강관리 : 환자상태 및 가족요구 파악, 복약정보 제공 및 관리\n 2. 일상생활관리 : 응급상황 시 대처요령, 가정에서 할 수 있는 기능훈련 지도\n 3. 가정 내 안전관리 : 낙상과 사고방지를 위한 교육, 안전콕 설치 \n 4. 센터 내 직접 서비스 제공 : 쉽터 및 가족카페 프로그램 연계\n 5. 센터 외 서비스 연계 : 독거노인 생활관리사, 김포푸드뱅크, 아름다운가게 물품지원, 방문간호 등 지역사회 의료, 복지 서비스 \n○ 기간: 최대5년 \n○ 방법: 가정방문, 내소, 안부전화 등",
    "benefits": [
      "치매환자가 보다 오랫동안 가정에서 생활할 수 있도록 지원하는 서비스"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신분증 지참 후 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000124",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000124",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 대상: 김포시 북부지역에 등록된 치매 어르신 중 독거치매, 부부치매, 의료수급권자 및 취약계층\n○ 내용: \n 1. 건강관리 : 환자상태 및 가족요구 파악, 복약정보 제공 및 관리\n 2. 일상생활관리 : 응급상황 시 대처요령, 가정에서 할 수 있는 기능훈련 지도\n 3. 가정 내 안전관리 : 낙상과 사고방지를 위한 교육, 안전콕 설치 \n 4. 센터 내 직접 서비스 제공 : 쉽터 및 가족카페 프로그램 연계\n 5. 센터 외 서비스 연계 : 독거노인 생활관리사, 김포푸드뱅크, 아름다운가게 물품지원, 방문간호 등 지역사회 의료, 복지 서비스 \n○ 기간: 최대5년 \n○ 방법: 가정방문, 내소, 안부전화 등",
      "benefit": "치매환자가 보다 오랫동안 가정에서 생활할 수 있도록 지원하는 서비스",
      "application": "신분증 지참 후 방문 신청",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-북부지역-어르신-신체활동-강화-지원서비스",
    "title": "북부지역 어르신 신체활동 강화 지원서비스",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "김포시보건소 북부보건센터(통진읍)에서 신체활동 강화사업 시행.",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "북부지역 어르신 신체활동 강화 지원서비스",
      "보건의료",
      "경기",
      "경기도 김포시",
      "상시",
      "어르신",
      "아동",
      "복지",
      "김포시보건소",
      "북부보건센터(통진읍)에서",
      "신체활동",
      "강화사업"
    ],
    "summary": "김포시보건소 북부보건센터(통진읍)에서 신체활동 강화사업 시행.",
    "audience": "북부지역(통진읍, 양촌읍, 대곶면, 월곶면, 하성면)의 어르신을 대상으로 북부보건센터(통진읍) 내에서 음악, 소도구, 순환운동시스템 등을 활용한 건강체조 시행.",
    "benefits": [
      "김포시보건소 북부보건센터(통진읍)에서 신체활동 강화사업 시행."
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "유선",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000127",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000127",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "북부지역(통진읍, 양촌읍, 대곶면, 월곶면, 하성면)의 어르신을 대상으로 북부보건센터(통진읍) 내에서 음악, 소도구, 순환운동시스템 등을 활용한 건강체조 시행.",
      "benefit": "김포시보건소 북부보건센터(통진읍)에서 신체활동 강화사업 시행.",
      "application": "유선",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-북부지역-근력강화-순환운동-프로그램-제공",
    "title": "북부지역 근력강화 순환운동 프로그램 제공",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "북부보건센터 2층 재활운동센터에서 장애인 및 일반인을 대상으로 운동프로그램 시행",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "북부지역 근력강화 순환운동 프로그램 제공",
      "보건의료",
      "경기",
      "경기도 김포시",
      "상시",
      "장애인",
      "전체",
      "복지",
      "북부보건센터",
      "2층",
      "재활운동센터에서",
      "및"
    ],
    "summary": "북부보건센터 2층 재활운동센터에서 장애인 및 일반인을 대상으로 운동프로그램 시행",
    "audience": "북부지역(통진읍, 양촌읍, 대곶면, 월곶면, 하성면) 지역주민을 대상으로 북부보건센터(통진읍) 내에서 순환운동시스템, 소도구 등을 활용한 맞춤형 운동프로그램 시행.",
    "benefits": [
      "북부보건센터 2층 재활운동센터에서 장애인 및 일반인을 대상으로 운동프로그램 시행"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000128",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000128",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "북부지역(통진읍, 양촌읍, 대곶면, 월곶면, 하성면) 지역주민을 대상으로 북부보건센터(통진읍) 내에서 순환운동시스템, 소도구 등을 활용한 맞춤형 운동프로그램 시행.",
      "benefit": "북부보건센터 2층 재활운동센터에서 장애인 및 일반인을 대상으로 운동프로그램 시행",
      "application": "방문신청",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-소상공인-대출이자차액-보전",
    "title": "소상공인 대출이자차액 보전",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "관내 소상공인 대출이자(2.0~3.0%) 지원(5천만원 한도)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "사업",
    "targetGroup": "소상공인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "소상공인 대출이자차액 보전",
      "주거",
      "경기",
      "경기도 김포시",
      "상시",
      "소상공인",
      "전체",
      "사업",
      "관내",
      "대출이자(2.0~3.0%)",
      "지원(5천만원",
      "한도)"
    ],
    "summary": "관내 소상공인 대출이자(2.0~3.0%) 지원(5천만원 한도)",
    "audience": "지원대상 : 김포시에 사업장을 두고 사업자 등록 기준 3개월이 경과한 소상공인\n대출한도 : 업체당 최대 5천만원 이내 \n지원내용 : 협약은행으로부터 융자받은 자금에 대한 대출이자 지원 \n지원금리 : 대출금리 중 2.0~3.0% 이자지원 \n융자기간 : 1년~4년(업체별 선택 / 일시 또는 분할상환) \n접수기간 : 수시(사업비 소진시까지)\n문 의 처 : 경기신용보증재단 김포지점(☎ 1577-5900)",
    "benefits": [
      "관내 소상공인 대출이자(2.0~3.0%) 지원(5천만원 한도)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "경기도신용보증재단 김포지점 접수",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000150",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000150",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "지원대상 : 김포시에 사업장을 두고 사업자 등록 기준 3개월이 경과한 소상공인\n대출한도 : 업체당 최대 5천만원 이내 \n지원내용 : 협약은행으로부터 융자받은 자금에 대한 대출이자 지원 \n지원금리 : 대출금리 중 2.0~3.0% 이자지원 \n융자기간 : 1년~4년(업체별 선택 / 일시 또는 분할상환) \n접수기간 : 수시(사업비 소진시까지)\n문 의 처 : 경기신용보증재단 김포지점(☎ 1577-5900)",
      "benefit": "관내 소상공인 대출이자(2.0~3.0%) 지원(5천만원 한도)",
      "application": "경기도신용보증재단 김포지점 접수",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-축산농가-분뇨처리-및-시설-지원",
    "title": "축산농가 분뇨처리 및 시설 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "농가에 분뇨처리 및 시설 신축(개선)지원 (악취를 저감할 수 있는 시설 지원)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산농가 분뇨처리 및 시설 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "농가에",
      "분뇨처리",
      "및",
      "시설",
      "신축(개선)지원"
    ],
    "summary": "농가에 분뇨처리 및 시설 신축(개선)지원 (악취를 저감할 수 있는 시설 지원)",
    "audience": "○ 관내 가축사육업 허가 농가 중 분뇨처리 및 시설 지원\n - 악취를 저감 할 수 있는 시설 지원",
    "benefits": [
      "농가에 분뇨처리 및 시설 신축(개선)지원 (악취를 저감할 수 있는 시설 지원)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 연천군청 농업기술센터 축산과 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000101",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내 가축사육업 허가 농가 중 분뇨처리 및 시설 지원\n - 악취를 저감 할 수 있는 시설 지원",
      "benefit": "농가에 분뇨처리 및 시설 신축(개선)지원 (악취를 저감할 수 있는 시설 지원)",
      "application": "○ 방문 신청\n - 연천군청 농업기술센터 축산과 방문",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-벼보급종차액지원",
    "title": "벼보급종차액지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "지원대상 품종 종자 구입비 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "벼보급종차액지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "지원대상",
      "품종",
      "종자",
      "구입비",
      "일부"
    ],
    "summary": "지원대상 품종 종자 구입비 일부 지원",
    "audience": "○ 관내 벼 보급종 신청농가에게 국고납입 종자 구입비 일부 지원",
    "benefits": [
      "지원대상 품종 종자 구입비 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터(산업팀) 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000104",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000104",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내 벼 보급종 신청농가에게 국고납입 종자 구입비 일부 지원",
      "benefit": "지원대상 품종 종자 구입비 일부 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터(산업팀) 방문",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-축산-폭염피해-방지-냉방기-지원",
    "title": "축산 폭염피해 방지 냉방기 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "축산농가에 냉방기 구입비용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산 폭염피해 방지 냉방기 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "축산농가에",
      "냉방기",
      "구입비용",
      "지원"
    ],
    "summary": "경기도 연천군에서 축산농가의 폭염 피해 예방을 위해 냉방기 구입비용 지원을 안내하는 사업입니다. 신청 가능 여부는 공식 공고에서 확인하세요.",
    "audience": "○ 냉방기 구입비용 지원",
    "benefits": [
      "축산농가에 냉방기 구입비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000106",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000106",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 냉방기 구입비용 지원",
      "benefit": "축산농가에 냉방기 구입비용 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-중-고-대학생-장학금-지급",
    "title": "중,고,대학생 장학금 지급",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "중·고교생 및 대학생에게 장학금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·청년",
    "targetGroup": "청년, 부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중,고,대학생 장학금 지급",
      "청년",
      "경기",
      "경기도 연천군",
      "확인필요",
      "부모/육아",
      "임신·출산·육아",
      "중·고교생",
      "및",
      "대학생에게",
      "장학금",
      "지급"
    ],
    "summary": "중·고교생 및 대학생에게 장학금 지급",
    "audience": "○ 중, 고, 대학생 장학금 지급",
    "benefits": [
      "중·고교생 및 대학생에게 장학금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 연천군 통일평생교육원에 중,고,대학생 장학금 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000110",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 중, 고, 대학생 장학금 지급",
      "benefit": "중·고교생 및 대학생에게 장학금 지급",
      "application": "○ 연천군 통일평생교육원에 중,고,대학생 장학금 신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-영세농-유기질비료-지원",
    "title": "영세농 유기질비료 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "영세농가에 가축분퇴비 비용 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "영세농 유기질비료 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "영세농가에",
      "가축분퇴비",
      "비용",
      "일부",
      "지원"
    ],
    "summary": "영세농가에 가축분퇴비 비용 일부 지원",
    "audience": "○ 농업경영체 등록기준(1,000㎡이상 경작)이 되지 않아 국비사업 수혜를 못 받는 영세농을 대상으로 가축분퇴비 비용 일부지원",
    "benefits": [
      "영세농가에 가축분퇴비 비용 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청 : 주소지 관할 읍·면 행정복지센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000116",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000116",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 농업경영체 등록기준(1,000㎡이상 경작)이 되지 않아 국비사업 수혜를 못 받는 영세농을 대상으로 가축분퇴비 비용 일부지원",
      "benefit": "영세농가에 가축분퇴비 비용 일부 지원",
      "application": "○ 방문 신청 : 주소지 관할 읍·면 행정복지센터 방문",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-기초생활수급자-등-수도요금-감면서비스",
    "title": "기초생활수급자 등 수도요금 감면서비스",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "기초생활수급자 등 감면대상자 수도요금 일부 감면서비스",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "기초생활수급자 등 수도요금 감면서비스",
      "보건의료",
      "경기",
      "경기도 연천군",
      "상시",
      "일반",
      "전체",
      "복지",
      "기초생활수급자",
      "등",
      "감면대상자",
      "수도요금"
    ],
    "summary": "기초생활수급자 등 감면대상자 수도요금 일부 감면서비스",
    "audience": "수도요금 감면 대상 확인 > 대상자 관할 읍면을 통하여 신청 > 읍면 공문 접수 후 검토 > 감면 적용\n\n수도요금 감면 대상\n - 국민기초생활보장법의 규정에 따른 기초생활수급자와「의료급여법」규정에 따른 의료급여대상자(총 사용수량의 10㎥이하 면제)",
    "benefits": [
      "기초생활수급자 등 감면대상자 수도요금 일부 감면서비스"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문접수: 주민등록지 읍면 행정복지센터",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000124",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000124",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "수도요금 감면 대상 확인 > 대상자 관할 읍면을 통하여 신청 > 읍면 공문 접수 후 검토 > 감면 적용\n\n수도요금 감면 대상\n - 국민기초생활보장법의 규정에 따른 기초생활수급자와「의료급여법」규정에 따른 의료급여대상자(총 사용수량의 10㎥이하 면제)",
      "benefit": "기초생활수급자 등 감면대상자 수도요금 일부 감면서비스",
      "application": "방문접수: 주민등록지 읍면 행정복지센터",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-농자재-지원사업",
    "title": "농자재 지원사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "○ 농자재 구입비 일부지원(보조50%, 자부담 50%)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농자재 지원사업",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "○",
      "농자재",
      "구입비",
      "일부지원(보조50%,",
      "자부담"
    ],
    "summary": "○ 농자재 구입비 일부지원(보조50%, 자부담 50%)",
    "audience": "○ 사 업 내 용: 저온저장고 외 22종 구입비 50% 보조",
    "benefits": [
      "○ 농자재 구입비 일부지원(보조50%, 자부담 50%)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청: 주소지 또는 농지소재시 읍·면 행정복지센터",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000441",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000441",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 사 업 내 용: 저온저장고 외 22종 구입비 50% 보조",
      "benefit": "○ 농자재 구입비 일부지원(보조50%, 자부담 50%)",
      "application": "○ 방문신청: 주소지 또는 농지소재시 읍·면 행정복지센터",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-보육아동-급간식비-지원",
    "title": "보육아동 급간식비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "어린이집을 이용하는 영유아에게 급간식비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보육아동 급간식비 지원",
      "교육",
      "경북",
      "경상북도 경산시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "어린이집을",
      "이용하는",
      "영유아에게",
      "급간식비"
    ],
    "summary": "어린이집을 이용하는 영유아에게 급간식비 지원",
    "audience": "○ 지원대상 : 관내 어린이집을 이용하는 영유아\n\n○ 지원내용 : 보육아동 급간식비\n\n○ 지원금액 : 15,000원(1인/월1회)\n\n○ 지원방법 : 보육통합정보시스템을 통해 어린이집으로 지원",
    "benefits": [
      "어린이집을 이용하는 영유아에게 급간식비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 온라인 신청\n - 보육통합정보시스템 : cpms.childcare.go.kr",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000110",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상 : 관내 어린이집을 이용하는 영유아\n\n○ 지원내용 : 보육아동 급간식비\n\n○ 지원금액 : 15,000원(1인/월1회)\n\n○ 지원방법 : 보육통합정보시스템을 통해 어린이집으로 지원",
      "benefit": "어린이집을 이용하는 영유아에게 급간식비 지원",
      "application": "○ 온라인 신청\n - 보육통합정보시스템 : cpms.childcare.go.kr",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-저출산-극복-인구정책-추진",
    "title": "저출산 극복 인구정책 추진",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "출생아(입양아)를 위한 출산축하금·장려금 및 건강보험료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저출산 극복 인구정책 추진",
      "보건의료",
      "경북",
      "경상북도 경산시",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "출생아(입양아)를",
      "위한",
      "출산축하금·장려금",
      "및"
    ],
    "summary": "출생아(입양아)를 위한 출산축하금·장려금 및 건강보험료 지원",
    "audience": "○ 2022. 8. 5. 이후 출생아부터 확대된 금액으로 지원\n\n○ 출산축하금 지원 : 신생아 한 사람당 50만원 1회 지급\n\n○ 출생순위에 따른 출산장려금 지원\n - 첫째 120만원 분할지원(10만원 12회)\n - 둘째 240만원 분할지원(20만원 12회)\n - 셋째 360만원 분할지원(30만원 12회)\n - 넷째이상 1,200만원 분할지원(50만원 24회)\n\n○ 둘째아이상 출생아 건강보험료 지원\n - 월 27,000원 이내 36회 지원\n - 보험사 용역 지원 : 보장성 보험 3년납 10년 만기",
    "benefits": [
      "출생아(입양아)를 위한 출산축하금·장려금 및 건강보험료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 읍면동행정복지센터에서 출생신고 시 행복출산원스톱 신청 또는 출생신고 한 날로부터 90일 이내 개인별 신청\n○ 온라인 신청\n - 정부24의 원스톱서비스 행복출산 신청\n 링크 : https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001&tp_seq=01",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000113",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000113",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 2022. 8. 5. 이후 출생아부터 확대된 금액으로 지원\n\n○ 출산축하금 지원 : 신생아 한 사람당 50만원 1회 지급\n\n○ 출생순위에 따른 출산장려금 지원\n - 첫째 120만원 분할지원(10만원 12회)\n - 둘째 240만원 분할지원(20만원 12회)\n - 셋째 360만원 분할지원(30만원 12회)\n - 넷째이상 1,200만원 분할지원(50만원 24회)\n\n○ 둘째아이상 출생아 건강보험료 지원\n - 월 27,000원 이내 36회 지원\n - 보험사 용역 지원 : 보장성 보험 3년납 10년 만기",
      "benefit": "출생아(입양아)를 위한 출산축하금·장려금 및 건강보험료 지원",
      "application": "○ 방문 신청\n - 읍면동행정복지센터에서 출생신고 시 행복출산원스톱 신청 또는 출생신고 한 날로부터 90일 이내 개인별 신청\n○ 온라인 신청\n - 정부24의 원스톱서비스 행복출산 신청\n 링크 : https://www.gov.kr/mw/AA020InfoCappView.do?CappBizCD=17410000001&tp_seq=01",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-경산시-시민안전보험",
    "title": "경산시 시민안전보험",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "경산시 시민안전보험",
      "주거",
      "경북",
      "경상북도 경산시",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "재난이나",
      "각종",
      "사고로"
    ],
    "summary": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "audience": "폭발·화재·붕괴 상해 사망 - 폭발·화재·붕괴·산사태 사고로 상해 사망한 경우(만15세 미만자 제외) 2,000만원\n폭발·화재·붕괴 상해후유장해 - 폭발·화재·붕괴·산사태로 사고로 3%~100%의 상해 후유장해가 발생한 경우 2,000만원 한도\n대중교통 이용 중 상해사망(전세버스포함) - 대중교통 이용 중 상해 사망한 경우(만15세 미만자 제외) 2,000만원\n대중교통 이용 중 상해후유장해(전세버스포함) - 대중교통 이용 중 3%~100%의 상해후유장해가 발생한 경우 2,000만원 한도\n농기계사고 상해사망 - 농기계사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우(만15세 미만자 제외) 2,000만원\n농기계사고 상해후유장해 - 농기계사고에 의해 발생한 상해의 직접적인 결과로 3%~100%의 상해 후유장해가 발생한 경우 2,000만원 한도\n스쿨존 교통사고 부상치료비 - 만12세 이하인 자가 어린이보호구역으로 지정된 지역에서 교통사고로 인해 상해를 입은 경우(부상등급에 따라 치료비 지급) 2,000만원 한도\n자연재해사망 - 자연재해(일사병,열사병 포함)로 사망한 경우(만15세 미만자 제외) 2,000만원\n익사사고 사망 - 급격하고도 우연한 익사사고로 인해 사망한 경우(질병제외)(만15세 미만자 제외) 2,000만원\n상해사망장례지원금(교통상해사망제외) - 상해(교통상해사망 제외)의 직접적인 결과로써 사망한 경우 장례식장 이용으로 발생된 장례비용을 지원( 만15세 미만자 제외) 500만원 한도\n사회재난사망(감염병 제외) - 사회재난(감염병 제외)으로 사망한 경우 2,000만원\n사회재난 후유장해(감염병 제외) - 사회재난(감염병 제외)으로 3%~100%의 상해 후유장해가 발생한 경우 1,000만원 한도\n자전거사고 사망 - 자전거사고에 의한 사고의 직접적인 결과로 사망한 경우(만15세 미만 제외) 1,000만원\n자전거사고 후유장해 - 자전거사고에 의한 직접적인 결과로 3%~100%의 상해 후유장애가 발생한 경우 1,000만원 한도\n개물림,부딪힘 사고 진단비 - 개물림 또는 부딪힘 사고로 인하여 「의료기관」에서 최초 진단을 받고 실제 치료 중이거나 치료가 종료된 경우 10만원(연간1회한)\n화상수술비 - 상해로 화상을 입고 병원 또는 의원 등에서 수술을 받은 경우 50만원\n실버존 교통상해 부상치료비 - 만65세 이상인 자로 보험 기간 중에 노인보호구역으로 지정한 지역에서 교통사고로 상해를 입은 경우 2,000만원 한도",
    "benefits": [
      "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "보험사 통합콜센터 전화문의(1522-3556) 후 청구서 및 필요서류 접수",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000363",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000363",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "폭발·화재·붕괴 상해 사망 - 폭발·화재·붕괴·산사태 사고로 상해 사망한 경우(만15세 미만자 제외) 2,000만원\n폭발·화재·붕괴 상해후유장해 - 폭발·화재·붕괴·산사태로 사고로 3%~100%의 상해 후유장해가 발생한 경우 2,000만원 한도\n대중교통 이용 중 상해사망(전세버스포함) - 대중교통 이용 중 상해 사망한 경우(만15세 미만자 제외) 2,000만원\n대중교통 이용 중 상해후유장해(전세버스포함) - 대중교통 이용 중 3%~100%의 상해후유장해가 발생한 경우 2,000만원 한도\n농기계사고 상해사망 - 농기계사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우(만15세 미만자 제외) 2,000만원\n농기계사고 상해후유장해 - 농기계사고에 의해 발생한 상해의 직접적인 결과로 3%~100%의 상해 후유장해가 발생한 경우 2,000만원 한도\n스쿨존 교통사고 부상치료비 - 만12세 이하인 자가 어린이보호구역으로 지정된 지역에서 교통사고로 인해 상해를 입은 경우(부상등급에 따라 치료비 지급) 2,000만원 한도\n자연재해사망 - 자연재해(일사병,열사병 포함)로 사망한 경우(만15세 미만자 제외) 2,000만원\n익사사고 사망 - 급격하고도 우연한 익사사고로 인해 사망한 경우(질병제외)(만15세 미만자 제외) 2,000만원\n상해사망장례지원금(교통상해사망제외) - 상해(교통상해사망 제외)의 직접적인 결과로써 사망한 경우 장례식장 이용으로 발생된 장례비용을 지원( 만15세 미만자 제외) 500만원 한도\n사회재난사망(감염병 제외) - 사회재난(감염병 제외)으로 사망한 경우 2,000만원\n사회재난 후유장해(감염병 제외) - 사회재난(감염병 제외)으로 3%~100%의 상해 후유장해가 발생한 경우 1,000만원 한도\n자전거사고 사망 - 자전거사고에 의한 사고의 직접적인 결과로 사망한 경우(만15세 미만 제외) 1,000만원\n자전거사고 후유장해 - 자전거사고에 의한 직접적인 결과로 3%~100%의 상해 후유장애가 발생한 경우 1,000만원 한도\n개물림,부딪힘 사고 진단비 - 개물림 또는 부딪힘 사고로 인하여 「의료기관」에서 최초 진단을 받고 실제 치료 중이거나 치료가 종료된 경우 10만원(연간1회한)\n화상수술비 - 상해로 화상을 입고 병원 또는 의원 등에서 수술을 받은 경우 50만원\n실버존 교통상해 부상치료비 - 만65세 이상인 자로 보험 기간 중에 노인보호구역으로 지정한 지역에서 교통사고로 상해를 입은 경우 2,000만원 한도",
      "benefit": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
      "application": "보험사 통합콜센터 전화문의(1522-3556) 후 청구서 및 필요서류 접수",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-아이사랑육아용품대여사업",
    "title": "아이사랑육아용품대여사업",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "출산육아용품 무료대여소 운영 연중, 월~금 (9:00~18:00) 보건소 아이들행복꿈터 내",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "아이사랑육아용품대여사업",
      "보건의료",
      "경북",
      "경상북도 의성군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "출산육아용품",
      "무료대여소",
      "운영",
      "연중,"
    ],
    "summary": "출산육아용품 무료대여소 운영 연중, 월~금 (9:00~18:00) 보건소 아이들행복꿈터 내",
    "audience": "출산육아용품 무료대여소 운영\n연중, 월~금 (9:00~18:00)\n보건소 아이들행복꿈터 내 출산육아용품 무료 대여소\n- 장난감: 영유아 및 영유아가정\n- 육아용품: 임산부 및 영유아 가정\n회원등록 후 무료대여(1인/1회/2점)",
    "benefits": [
      "출산육아용품 무료대여소 운영 연중, 월~금 (9:00~18:00) 보건소 아이들행복꿈터 내"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문접수",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000138",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000138",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "출산육아용품 무료대여소 운영\n연중, 월~금 (9:00~18:00)\n보건소 아이들행복꿈터 내 출산육아용품 무료 대여소\n- 장난감: 영유아 및 영유아가정\n- 육아용품: 임산부 및 영유아 가정\n회원등록 후 무료대여(1인/1회/2점)",
      "benefit": "출산육아용품 무료대여소 운영 연중, 월~금 (9:00~18:00) 보건소 아이들행복꿈터 내",
      "application": "방문접수",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-순환농업활성화지원",
    "title": "순환농업활성화지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "친환경축산 구축을 위한 축사바닥용 깔짚지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "순환농업활성화지원",
      "농림어업",
      "경북",
      "경상북도 의성군",
      "상시",
      "농어업인",
      "전체",
      "친환경축산",
      "구축을",
      "위한",
      "축사바닥용",
      "깔짚지원"
    ],
    "summary": "친환경축산 구축을 위한 축사바닥용 깔짚지원",
    "audience": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 한우, 낙농농가\n◦ 사업내용 : 친환경축산 구축을 위한 축사바닥용 깔짚지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
    "benefits": [
      "친환경축산 구축을 위한 축사바닥용 깔짚지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 농가해당 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000145",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000145",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "□ 사업개요 \n◦ 추진근거 : 축산법 제3조, 의성군 축산업 육성 및 발전에 관한 지원조례 제6조\n◦ 기 간 : 1월 ~ 12월(연중)\n◦ 대 상 : 축산업 허가·등록된 관내 축산 한우, 낙농농가\n◦ 사업내용 : 친환경축산 구축을 위한 축사바닥용 깔짚지원\n\n□ 사전절차 및 추진계획 \n◦ 2025. 1. : 신청공고 및 대상자 신청 접수\n◦ 2025. 2. : 보조금심의회 개최 및 대상자 확정\n◦ 2025. 3. : 보조금교부결정 및 사업시행\n◦ 2025. 4. ~ 12. : 사업완료 확인 및 보조금 지급",
      "benefit": "친환경축산 구축을 위한 축사바닥용 깔짚지원",
      "application": "○ 방문신청\n - 농가해당 읍면사무소 방문신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-귀농인-지원",
    "title": "귀농인 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 청송군",
    "region": "경북",
    "amount": "귀농인에게 영농정착금, 주택신축수리비 , 농지구입 세제지원, 농지구입 이자지원 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "어르신, 농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "귀농인 지원",
      "주거",
      "경북",
      "경상북도 청송군",
      "확인필요",
      "어르신",
      "농어업인",
      "아동",
      "전체",
      "귀농인에게",
      "영농정착금,",
      "주택신축수리비"
    ],
    "summary": "귀농인에게 영농정착금, 주택신축수리비 , 농지구입 세제지원, 농지구입 이자지원 등 지원",
    "audience": "○ 영농정착금지원 : 농기계, 묘목 구입, 비닐하우스 설치 등 영농기반 마련, 4백만원 이하/농가당\n\n○ 주택신축·수리비지원 : 귀농인 주택신축 및 주택 시설 수리, 400만원 이하/농가당\n\n○ 농지구입 세제지원 : 200만원/농가당\n\n○ 농지구입이자지원 : 정책자금으로 구입한 농지에 대한 이자 지원, 매년 150만원 이하/농가당 3년간\n\n○ 귀농관련수강료지원 : 30만원 이하/농가당",
    "benefits": [
      "귀농인에게 영농정착금, 주택신축수리비 , 농지구입 세제지원, 농지구입 이자지원 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청 \n - 주민센터 : 거주지 관할 읍면 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/516000000115",
    "contact": "경상북도 청송군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 영농정착금지원 : 농기계, 묘목 구입, 비닐하우스 설치 등 영농기반 마련, 4백만원 이하/농가당\n\n○ 주택신축·수리비지원 : 귀농인 주택신축 및 주택 시설 수리, 400만원 이하/농가당\n\n○ 농지구입 세제지원 : 200만원/농가당\n\n○ 농지구입이자지원 : 정책자금으로 구입한 농지에 대한 이자 지원, 매년 150만원 이하/농가당 3년간\n\n○ 귀농관련수강료지원 : 30만원 이하/농가당",
      "benefit": "귀농인에게 영농정착금, 주택신축수리비 , 농지구입 세제지원, 농지구입 이자지원 등 지원",
      "application": "○ 방문 신청 \n - 주민센터 : 거주지 관할 읍면 주민센터에 방문 신청",
      "contact": "경상북도 청송군"
    }
  },
  {
    "slug": "gov24-귀농귀촌인-정착-지원",
    "title": "귀농귀촌인 정착 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "○ 전입세대: 주택(농업용창고)설계 또는 주택수리 지원 ○ 귀농인: 농자재 구입 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "귀농귀촌인 정착 지원",
      "주거",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "○",
      "전입세대:",
      "주택(농업용창고)설계",
      "또는",
      "주택수리"
    ],
    "summary": "○ 전입세대: 주택(농업용창고)설계 또는 주택수리 지원 ○ 귀농인: 농자재 구입 지원",
    "audience": "○ 단독주택 설계비(또는 농업용창고 설계비)\n - 지원대상: 단독주택을 신축하여 전입한 세대 * 단독주택이 아닌 경우 지원 불가\n - 지원내용: 주택(또는 농업용창고) 설계에 따른 1백만원 이내의 실비\n - 신청기한: 전입일 기준 1년 이내 신청\n\n○ 단독주택 수리비\n - 지원대상: 단독주택을 구입하거나 2년 이상 임차하여 전입한 세대 * 단독주택이 아닌 경우 지원 불가\n ※ 전입세대원이 전입한 날로부터 1년이전 또는 1년 이내에 주거목적의 단독주택을 구입하거나 2년이상 임차한 경우 지원가능 \n - 지원내용: 단독주택 수리에 따른 2백만원 이내의 실비\n - 신청기한: 전입일 기준 1년 이내 신청\n\n○ 영농정착금\n - 지원대상: 연천군에 전입한 세대가 농업경영체를 신규 등록하고 관내 소재 농지에서 실경작하는 만65새 이하의 세대주\n - 지원내용: 전입일 기준 1년 전 또는 1년 이내에 구입한 농자재 구입에 따른 1백만원 이내의 실비\n - 신청기한: 전입일 기준 1년 이내 신청\n\n귀농인 : 영농정착금(1백만원 이내 실비)",
    "benefits": [
      "○ 전입세대: 주택(농업용창고)설계 또는 주택수리 지원 ○ 귀농인: 농자재 구입 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000118",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000118",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 단독주택 설계비(또는 농업용창고 설계비)\n - 지원대상: 단독주택을 신축하여 전입한 세대 * 단독주택이 아닌 경우 지원 불가\n - 지원내용: 주택(또는 농업용창고) 설계에 따른 1백만원 이내의 실비\n - 신청기한: 전입일 기준 1년 이내 신청\n\n○ 단독주택 수리비\n - 지원대상: 단독주택을 구입하거나 2년 이상 임차하여 전입한 세대 * 단독주택이 아닌 경우 지원 불가\n ※ 전입세대원이 전입한 날로부터 1년이전 또는 1년 이내에 주거목적의 단독주택을 구입하거나 2년이상 임차한 경우 지원가능 \n - 지원내용: 단독주택 수리에 따른 2백만원 이내의 실비\n - 신청기한: 전입일 기준 1년 이내 신청\n\n○ 영농정착금\n - 지원대상: 연천군에 전입한 세대가 농업경영체를 신규 등록하고 관내 소재 농지에서 실경작하는 만65새 이하의 세대주\n - 지원내용: 전입일 기준 1년 전 또는 1년 이내에 구입한 농자재 구입에 따른 1백만원 이내의 실비\n - 신청기한: 전입일 기준 1년 이내 신청\n\n귀농인 : 영농정착금(1백만원 이내 실비)",
      "benefit": "○ 전입세대: 주택(농업용창고)설계 또는 주택수리 지원 ○ 귀농인: 농자재 구입 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-가평보훈명예수당",
    "title": "가평보훈명예수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "국가유공자 및 유족에게 보훈명예수당 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "가평보훈명예수당",
      "복지",
      "경기",
      "경기도 가평군",
      "상시",
      "일반",
      "전체",
      "국가유공자",
      "및",
      "유족에게",
      "보훈명예수당",
      "지급"
    ],
    "summary": "국가유공자 및 유족에게 보훈명예수당 지급",
    "audience": "○ 가평군에 주소지를 두고 있고, 국가보훈처에 등록되어 있는 국가유공자 본인 또는 유족에게 매월 15일 170,000원 지급\n\n ※ 지자체별 서비스 내용이 상이할 수 있습니다.",
    "benefits": [
      "국가유공자 및 유족에게 보훈명예수당 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청 \n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000108",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000108",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가평군에 주소지를 두고 있고, 국가보훈처에 등록되어 있는 국가유공자 본인 또는 유족에게 매월 15일 170,000원 지급\n\n ※ 지자체별 서비스 내용이 상이할 수 있습니다.",
      "benefit": "국가유공자 및 유족에게 보훈명예수당 지급",
      "application": "○ 방문 신청 \n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-가평참전명예수당",
    "title": "가평참전명예수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "참전유공자에게 참전명예수당 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "가평참전명예수당",
      "복지",
      "경기",
      "경기도 가평군",
      "상시",
      "일반",
      "전체",
      "참전유공자에게",
      "참전명예수당",
      "지원"
    ],
    "summary": "경기도 가평군에서 참전유공자를 대상으로 참전명예수당 지원을 안내하는 복지 사업입니다. 지급 대상과 신청 방법은 공식 공고에서 확인하세요.",
    "audience": "○ 가평군에 주소지를 두고 있고, 국가보훈처에 등록되어 있는 국가유공자(6.25 및 월남전 참전용사) 본인에게 매월 15일 170,000원 지급\n\n ※ 지자체별 서비스 내용이 상이할 수 있습니다.",
    "benefits": [
      "참전유공자에게 참전명예수당 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청 \n - 주민센터 : 관할 주민센터 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000114",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000114",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가평군에 주소지를 두고 있고, 국가보훈처에 등록되어 있는 국가유공자(6.25 및 월남전 참전용사) 본인에게 매월 15일 170,000원 지급\n\n ※ 지자체별 서비스 내용이 상이할 수 있습니다.",
      "benefit": "참전유공자에게 참전명예수당 지원",
      "application": "○ 방문 신청 \n - 주민센터 : 관할 주민센터 방문신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-보훈예우수당-지원",
    "title": "보훈예우수당 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "경산시에 주소를 둔 65세 이상 보훈예우수당 대상자에 월 12만원 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보훈예우수당 지원",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "어르신",
      "아동",
      "전체",
      "경산시에",
      "주소를",
      "둔",
      "65세"
    ],
    "summary": "경산시에 주소를 둔 65세 이상 보훈예우수당 대상자에 월 12만원 지원",
    "audience": "경산시에 주소를 둔 65세 이상 아래 법률에 해당하는 보훈예우수당 대상자에게 월 12만원 지급\n - 국가유공자법 제4조제1항제1호~제18호\n - 5.18민주유공자예우 및 단체설립에 관한 법률 제4조\n - 고엽제후유의증 등 환자지원 및 단체설립에 관한 법률 제3조\n - 특수임무유공자 예우 및 단체설립에 관한 법률 제3조",
    "benefits": [
      "경산시에 주소를 둔 65세 이상 보훈예우수당 대상자에 월 12만원 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍면동 행정복지센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000353",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000353",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "경산시에 주소를 둔 65세 이상 아래 법률에 해당하는 보훈예우수당 대상자에게 월 12만원 지급\n - 국가유공자법 제4조제1항제1호~제18호\n - 5.18민주유공자예우 및 단체설립에 관한 법률 제4조\n - 고엽제후유의증 등 환자지원 및 단체설립에 관한 법률 제3조\n - 특수임무유공자 예우 및 단체설립에 관한 법률 제3조",
      "benefit": "경산시에 주소를 둔 65세 이상 보훈예우수당 대상자에 월 12만원 지원",
      "application": "관할 읍면동 행정복지센터에 방문 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-참전명예수당-지원",
    "title": "참전명예수당 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "경산시에 주소를 둔 참전유공자에 참전유공자 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "참전명예수당 지원",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "일반",
      "전체",
      "경산시에",
      "주소를",
      "둔",
      "참전유공자에",
      "참전유공자"
    ],
    "summary": "경산시에 주소를 둔 참전유공자에 참전유공자 지원",
    "audience": "○ 참전명예수당 : 경산시에 주소를 둔 참전유공자\n - 6.25참전유공자 : 월 25만원(도 10, 시 20)\n - 월남전참전자 : 월 25만원(도 10, 시 20)",
    "benefits": [
      "경산시에 주소를 둔 참전유공자에 참전유공자 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍면동 행정복지센터 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000354",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000354",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 참전명예수당 : 경산시에 주소를 둔 참전유공자\n - 6.25참전유공자 : 월 25만원(도 10, 시 20)\n - 월남전참전자 : 월 25만원(도 10, 시 20)",
      "benefit": "경산시에 주소를 둔 참전유공자에 참전유공자 지원",
      "application": "관할 읍면동 행정복지센터 방문 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-유가족-명예수당-지원",
    "title": "유가족 명예수당 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "경산시에 주소를 둔 전몰군경유족에 월 10만원 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "유가족 명예수당 지원",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "일반",
      "전체",
      "경산시에",
      "주소를",
      "둔",
      "전몰군경유족에",
      "월"
    ],
    "summary": "경산시에 주소를 둔 전몰군경유족에 월 10만원 지원",
    "audience": "경산시에 주소를 둔 전몰군경유족에 월 10만원 지원",
    "benefits": [
      "경산시에 주소를 둔 전몰군경유족에 월 10만원 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍면동 행정복지센터 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000355",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000355",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "경산시에 주소를 둔 전몰군경유족에 월 10만원 지원",
      "benefit": "경산시에 주소를 둔 전몰군경유족에 월 10만원 지원",
      "application": "관할 읍면동 행정복지센터 방문 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-사망한-참전유공자의-배우자-복지수당-미망인수당-지원",
    "title": "사망한 참전유공자의 배우자 복지수당(미망인수당) 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "사망한 참전유공자의 배우자에게 월 10만원 복지수당 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "사망한 참전유공자의 배우자 복지수당(미망인수당) 지원",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "일반",
      "전체",
      "사망한",
      "참전유공자의",
      "배우자에게",
      "월",
      "10만원"
    ],
    "summary": "사망한 참전유공자의 배우자에게 월 10만원 복지수당 지급",
    "audience": "사망한 참전유공자의 배우자에게 월 10만원 복지수당 지급",
    "benefits": [
      "사망한 참전유공자의 배우자에게 월 10만원 복지수당 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍면동 행정복지센터 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000356",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000356",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "사망한 참전유공자의 배우자에게 월 10만원 복지수당 지급",
      "benefit": "사망한 참전유공자의 배우자에게 월 10만원 복지수당 지급",
      "application": "관할 읍면동 행정복지센터 방문 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-국가유공자-사망위로금-지급",
    "title": "국가유공자 사망위로금 지급",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "사망위로금 30만원 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "국가유공자 사망위로금 지급",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "일반",
      "전체",
      "사망위로금",
      "30만원",
      "지급"
    ],
    "summary": "경상북도 경산시에서 국가유공자 사망위로금 지급을 안내하는 복지 사업입니다. 지급 대상과 신청 절차는 공식 공고에서 확인하세요.",
    "audience": "경산시에 주소를 둔 보훈예우수당 수급권자, 참전유공자, 사망한 참전유공자의 배우자가 사망한 경우 사망위로금 30만원 지급",
    "benefits": [
      "사망위로금 30만원 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍면동 행정복지센터 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000357",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000357",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "경산시에 주소를 둔 보훈예우수당 수급권자, 참전유공자, 사망한 참전유공자의 배우자가 사망한 경우 사망위로금 30만원 지급",
      "benefit": "사망위로금 30만원 지급",
      "application": "관할 읍면동 행정복지센터 방문 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-보훈예우수당-경북도-지원",
    "title": "보훈예우수당(경북도) 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "경북도 보훈예우수당 보훈대상자에게 월 5만원 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보훈예우수당(경북도) 지원",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "어르신",
      "아동",
      "전체",
      "경북도",
      "보훈예우수당",
      "보훈대상자에게",
      "월"
    ],
    "summary": "경북도 보훈예우수당 보훈대상자에게 월 5만원 지급",
    "audience": "경산시 거주 65세 이상 아래에 해당하는 보훈대상자(본인)에게 월 5만원 지급 \n - 전상군경 본인\n - 무공수훈자 본인\n - 4.19혁명공로자 본인\n - 5.18민주유공자 본인\n - 특수임무유공자 본인",
    "benefits": [
      "경북도 보훈예우수당 보훈대상자에게 월 5만원 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍/면/동 행정복지센터에 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000364",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000364",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "경산시 거주 65세 이상 아래에 해당하는 보훈대상자(본인)에게 월 5만원 지급 \n - 전상군경 본인\n - 무공수훈자 본인\n - 4.19혁명공로자 본인\n - 5.18민주유공자 본인\n - 특수임무유공자 본인",
      "benefit": "경북도 보훈예우수당 보훈대상자에게 월 5만원 지급",
      "application": "관할 읍/면/동 행정복지센터에 방문신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-연천군-부업대학생-운영",
    "title": "연천군 부업대학생 운영",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "대학생 방학기간 중(동·하계) 대학생 아르바이트 운영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년·취업·사업",
    "targetGroup": "청년, 구직자",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "연천군 부업대학생 운영",
      "청년",
      "경기",
      "경기도 연천군",
      "확인필요",
      "구직자",
      "취업",
      "사업",
      "대학생",
      "방학기간",
      "중(동·하계)",
      "아르바이트"
    ],
    "summary": "대학생 방학기간 중(동·하계) 대학생 아르바이트 운영",
    "audience": "대학생 행정체험 아르바이트 운영\n○ 근무장소: 연천군 각 부서, 읍면 및 시설관리공단\n○ 근무조건: 주 5일(배치된 부서 업무 특성상 실외근무 및 주말 근무의 형태로 운영될 수 있음)\n○ 운영내용: 행정업무 보조 등",
    "benefits": [
      "대학생 방학기간 중(동·하계) 대학생 아르바이트 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 온라인신청: 연천군 통합예약시스템\n\n온라인: https://www.yeoncheon.go.kr/reserve/stuPtjMain.do?key=4368&amp;rep=1",
    "officialUrl": "https://www.yeoncheon.go.kr/reserve/stuPtjMain.do?key=4368&amp;rep=1",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000444",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "대학생 행정체험 아르바이트 운영\n○ 근무장소: 연천군 각 부서, 읍면 및 시설관리공단\n○ 근무조건: 주 5일(배치된 부서 업무 특성상 실외근무 및 주말 근무의 형태로 운영될 수 있음)\n○ 운영내용: 행정업무 보조 등",
      "benefit": "대학생 방학기간 중(동·하계) 대학생 아르바이트 운영",
      "application": "○ 온라인신청: 연천군 통합예약시스템\n\n온라인: https://www.yeoncheon.go.kr/reserve/stuPtjMain.do?key=4368&amp;rep=1",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-저소득-및-다문화가정-아동-입학준비금-지원",
    "title": "저소득 및 다문화가정 아동 입학준비금 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "어린이집에 입학하는 관내 거주 저소득 및 다문화 가정의 아동에게 입학준비금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득 및 다문화가정 아동 입학준비금 지원",
      "교육",
      "경기",
      "경기도 양평군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "복지",
      "어린이집에",
      "입학하는",
      "관내"
    ],
    "summary": "어린이집에 입학하는 관내 거주 저소득 및 다문화 가정의 아동에게 입학준비금 지원",
    "audience": "○ 저소득 및 다문화가정 아동을 대상으로 대상자 당 10만원 한도 내 어린이집 입학 준비금(원복, 체육복, 모자 등) 지원",
    "benefits": [
      "어린이집에 입학하는 관내 거주 저소득 및 다문화 가정의 아동에게 입학준비금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 관할 어린이집 입소시",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000101",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 저소득 및 다문화가정 아동을 대상으로 대상자 당 10만원 한도 내 어린이집 입학 준비금(원복, 체육복, 모자 등) 지원",
      "benefit": "어린이집에 입학하는 관내 거주 저소득 및 다문화 가정의 아동에게 입학준비금 지원",
      "application": "○ 방문 신청\n - 기타 : 관할 어린이집 입소시",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-차상위계층-주거환경개선-지원",
    "title": "차상위계층 주거환경개선 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "차상위계층에 주택내부시설 보수 등 주거환경개선 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "차상위계층 주거환경개선 지원",
      "주거",
      "경북",
      "경상북도 경산시",
      "모집중",
      "일반",
      "전체",
      "차상위계층에",
      "주택내부시설",
      "보수",
      "등",
      "주거환경개선"
    ],
    "summary": "차상위계층에 주택내부시설 보수 등 주거환경개선 지원",
    "audience": "○ 지원대상 : 경산시 관내 거주자 중 차상위계층 및 자가가구 소유자 및 실거주자이며, 수선유지급여를 받지 않는 자\n - 단, 동일사업 지원받은 지 3년이 지나지 않으면 지원불가\n\n○ 지원내용 : 경보수(채광, 통풍, 주택 내부시설 일부 보수 등)\n\n○ 지원형태 : 사업완료 후 보조금 지급 및 정산",
    "benefits": [
      "차상위계층에 주택내부시설 보수 등 주거환경개선 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 경산시 관내 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000103",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000103",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상 : 경산시 관내 거주자 중 차상위계층 및 자가가구 소유자 및 실거주자이며, 수선유지급여를 받지 않는 자\n - 단, 동일사업 지원받은 지 3년이 지나지 않으면 지원불가\n\n○ 지원내용 : 경보수(채광, 통풍, 주택 내부시설 일부 보수 등)\n\n○ 지원형태 : 사업완료 후 보조금 지급 및 정산",
      "benefit": "차상위계층에 주택내부시설 보수 등 주거환경개선 지원",
      "application": "○ 방문 신청\n - 주민센터 : 경산시 관내 읍면동 주민센터에 방문 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-경상북도-장애인-활동지원급여-추가",
    "title": "경상북도 장애인 활동지원급여(추가)",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "장애인활동지원 국비지원 대상자 중 추가시간이 필요한 대상자 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "경상북도 장애인 활동지원급여(추가)",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "부모/육아",
      "장애인",
      "아동",
      "임신·출산·육아",
      "장애인활동지원",
      "국비지원",
      "대상자"
    ],
    "summary": "장애인활동지원 국비지원 대상자 중 추가시간이 필요한 대상자 지원",
    "audience": "○ 활동보조(신체활동,가사활동,이동보조 등) 및 방문목욕\n * 지원사유별 지원시간 차등지원 : 요건해당시 월 최저 20시간~ 최대 449시간 지원\n(지원사유 해당여부 주소지 읍면동 행정복지센터 복지팀 장애업무담당자 유선 또는 방문 문의)",
    "benefits": [
      "장애인활동지원 국비지원 대상자 중 추가시간이 필요한 대상자 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청 : 주소지 관할 읍면동 주민센터에 방문 신청, 신청시 구비서류는 지원기준별 상이할 수 있기에 방문전 유선문의",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000109",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000109",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 활동보조(신체활동,가사활동,이동보조 등) 및 방문목욕\n * 지원사유별 지원시간 차등지원 : 요건해당시 월 최저 20시간~ 최대 449시간 지원\n(지원사유 해당여부 주소지 읍면동 행정복지센터 복지팀 장애업무담당자 유선 또는 방문 문의)",
      "benefit": "장애인활동지원 국비지원 대상자 중 추가시간이 필요한 대상자 지원",
      "application": "○ 방문 신청 : 주소지 관할 읍면동 주민센터에 방문 신청, 신청시 구비서류는 지원기준별 상이할 수 있기에 방문전 유선문의",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-재가-암환자-관리-지원",
    "title": "재가 암환자 관리 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "재가암환자에게 기본 건강관리서비스 및 영양제 등 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "재가 암환자 관리 지원",
      "보건의료",
      "경북",
      "경상북도 경산시",
      "상시",
      "일반",
      "전체",
      "재가암환자에게",
      "기본",
      "건강관리서비스",
      "및",
      "영양제"
    ],
    "summary": "재가암환자에게 기본 건강관리서비스 및 영양제 등 제공",
    "audience": "○ 재가암환자관리 : 기본 건강관리서비스(혈압, 혈당검사) 제공, 영양제 및 소모품 제공",
    "benefits": [
      "재가암환자에게 기본 건강관리서비스 및 영양제 등 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 유선 상담 및 신청\n - 경산시 보건소 전화(053-810-6172)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000111",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000111",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 재가암환자관리 : 기본 건강관리서비스(혈압, 혈당검사) 제공, 영양제 및 소모품 제공",
      "benefit": "재가암환자에게 기본 건강관리서비스 및 영양제 등 제공",
      "application": "○ 유선 상담 및 신청\n - 경산시 보건소 전화(053-810-6172)",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-예방접종지원",
    "title": "예방접종지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "시민을 대상으로 B형간염, 인플루엔자 등 예방접종 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "예방접종지원",
      "보건의료",
      "경북",
      "경상북도 경산시",
      "상시",
      "부모/육아",
      "어르신",
      "장애인",
      "아동",
      "임신·출산·육아",
      "복지",
      "시민을"
    ],
    "summary": "시민을 대상으로 B형간염, 인플루엔자 등 예방접종 지원",
    "audience": "○ 예방접종 지원\n - 인플루엔자 예방접종\n * 주소지 무관 : 어린이(생후6개월~13세) / 임신부 / 65세이상인 자\n * 경산시민 : 장애정도가 심한 장애인(14세~59세) / 60~64세인 자\n - B형간염 유료 예방접종",
    "benefits": [
      "시민을 대상으로 B형간염, 인플루엔자 등 예방접종 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청 : 보건소 또는 위탁의료기관",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000112",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000112",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 예방접종 지원\n - 인플루엔자 예방접종\n * 주소지 무관 : 어린이(생후6개월~13세) / 임신부 / 65세이상인 자\n * 경산시민 : 장애정도가 심한 장애인(14세~59세) / 60~64세인 자\n - B형간염 유료 예방접종",
      "benefit": "시민을 대상으로 B형간염, 인플루엔자 등 예방접종 지원",
      "application": "○ 방문 신청 : 보건소 또는 위탁의료기관",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-경산시-산후조리비-지원",
    "title": "경산시 산후조리비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "경산시 출산가정에 출산 및 산후조리 관련 비용 사후 정산 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "경산시 산후조리비 지원",
      "보건의료",
      "경북",
      "경상북도 경산시",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "경산시",
      "출산가정에",
      "출산",
      "및"
    ],
    "summary": "경산시 출산가정에 출산 및 산후조리 관련 비용 사후 정산 지원",
    "audience": "신생아 출생일 기준 6개월 이내 산후조리를 목적으로 하는 진료비, 약제비, 산후조리비 등 지원\n\n2025년 이후 출생아 : 100만원 이하",
    "benefits": [
      "경산시 출산가정에 출산 및 산후조리 관련 비용 사후 정산 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문, 온라인\n\n방문 신청: 신생아 출생일 기준 1년 이내 관할 보건소 방문신청(구비서류 지참)\n온라인 신청 : 신생아 출생일 기준1년 이내 정부24(www.gov.kr)접속 (공동인증서 본인인증) 후 구비서류 업로드",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000365",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000365",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "신생아 출생일 기준 6개월 이내 산후조리를 목적으로 하는 진료비, 약제비, 산후조리비 등 지원\n\n2025년 이후 출생아 : 100만원 이하",
      "benefit": "경산시 출산가정에 출산 및 산후조리 관련 비용 사후 정산 지원",
      "application": "방문, 온라인\n\n방문 신청: 신생아 출생일 기준 1년 이내 관할 보건소 방문신청(구비서류 지참)\n온라인 신청 : 신생아 출생일 기준1년 이내 정부24(www.gov.kr)접속 (공동인증서 본인인증) 후 구비서류 업로드",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-사망한-참전유공자-배우자-복지수당",
    "title": "사망한 참전유공자 배우자 복지수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "사망한 참전유공자의 배우자에게 복지수당 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "사망한 참전유공자 배우자 복지수당",
      "복지",
      "경북",
      "경상북도 의성군",
      "상시",
      "일반",
      "전체",
      "사망한",
      "참전유공자의",
      "배우자에게",
      "복지수당",
      "지급"
    ],
    "summary": "사망한 참전유공자의 배우자에게 복지수당 지급",
    "audience": "○ 월 10만원 수당 매월 지급\n\n○ 관련 조례 : 의성군 참전유공자 지원 조례",
    "benefits": [
      "사망한 참전유공자의 배우자에게 복지수당 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 찾아가는보건복지팀에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000102",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000102",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 월 10만원 수당 매월 지급\n\n○ 관련 조례 : 의성군 참전유공자 지원 조례",
      "benefit": "사망한 참전유공자의 배우자에게 복지수당 지급",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 찾아가는보건복지팀에 방문 신청",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-국가유공자-보훈명예수당-및-사망위로금-지급",
    "title": "국가유공자 보훈명예수당 및 사망위로금 지급",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "국가유공자를 위해 보훈명예수당 및 사망위로금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "국가유공자 보훈명예수당 및 사망위로금 지급",
      "복지",
      "경북",
      "경상북도 의성군",
      "상시",
      "일반",
      "전체",
      "국가유공자를",
      "위해",
      "보훈명예수당",
      "및",
      "사망위로금"
    ],
    "summary": "국가유공자를 위해 보훈명예수당 및 사망위로금 지급",
    "audience": "○ 월 15만원의 보훈예우수당 매월지급, 사망시 사망위로금 30만원/회 지급\n\n○ 관련 조례 : 의성군 국가보훈대상자 예우 및 지원에 관한 조례",
    "benefits": [
      "국가유공자를 위해 보훈명예수당 및 사망위로금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 찾아가는보건복지팀에 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000110",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 월 15만원의 보훈예우수당 매월지급, 사망시 사망위로금 30만원/회 지급\n\n○ 관련 조례 : 의성군 국가보훈대상자 예우 및 지원에 관한 조례",
      "benefit": "국가유공자를 위해 보훈명예수당 및 사망위로금 지급",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 찾아가는보건복지팀에 방문",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-참전유공자명예수당-및-사망위로금-지급",
    "title": "참전유공자명예수당 및 사망위로금 지급",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "참전유공자를 위해 명예수당, 사망위로금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "참전유공자명예수당 및 사망위로금 지급",
      "복지",
      "경북",
      "경상북도 의성군",
      "상시",
      "일반",
      "전체",
      "참전유공자를",
      "위해",
      "명예수당,",
      "사망위로금",
      "지원"
    ],
    "summary": "참전유공자를 위해 명예수당, 사망위로금 지원",
    "audience": "○ 월 15만원의 수당을 매월 지급, 사망시 사망위로금 30만원/1회 지급\n\n○ 관련 조례 : 의성군 참전유공자 지원 조례",
    "benefits": [
      "참전유공자를 위해 명예수당, 사망위로금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 찾아가는보건복지팀에 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000114",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000114",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 월 15만원의 수당을 매월 지급, 사망시 사망위로금 30만원/1회 지급\n\n○ 관련 조례 : 의성군 참전유공자 지원 조례",
      "benefit": "참전유공자를 위해 명예수당, 사망위로금 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 찾아가는보건복지팀에 방문",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-청년근로자-사랑채움-사업",
    "title": "청년근로자 사랑채움 사업",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 의성군",
    "region": "경북",
    "amount": "2년 만기 시 청년근로자 960만원+이자의 적립금 수령",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년·취업·사업",
    "targetGroup": "청년, 구직자",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "청년근로자 사랑채움 사업",
      "청년",
      "경북",
      "경상북도 의성군",
      "상시",
      "구직자",
      "취업",
      "사업",
      "2년",
      "만기",
      "시",
      "청년근로자"
    ],
    "summary": "2년 만기 시 청년근로자 960만원+이자의 적립금 수령",
    "audience": "○ 청년근로자 자산형성 지원\n - 2년 만기예금, 960만원+이자\n · 청년 적립금 480만원(매월 20만원, 총 24회 적립)\n · 지자체 지원금 480만원(청년적립금 납입 후 익월 2주 이내)\n*결혼축하금 120만원(단, 만기 시 결혼한 가입자 지급)\n○ 청년근로자 장기 재직 여부 및 거주지 확인을 통한 참여 청년 관리\n · 기업 방문이나 유선 확인을 통한 지속적인 사업 모니터링",
    "benefits": [
      "2년 만기 시 청년근로자 960만원+이자의 적립금 수령"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "경북일자리종합센터 온라인 접수\n\n온라인: https://gbwork.kr/",
    "officialUrl": "https://gbwork.kr/",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/515000000168",
    "contact": "경상북도 의성군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 청년근로자 자산형성 지원\n - 2년 만기예금, 960만원+이자\n · 청년 적립금 480만원(매월 20만원, 총 24회 적립)\n · 지자체 지원금 480만원(청년적립금 납입 후 익월 2주 이내)\n*결혼축하금 120만원(단, 만기 시 결혼한 가입자 지급)\n○ 청년근로자 장기 재직 여부 및 거주지 확인을 통한 참여 청년 관리\n · 기업 방문이나 유선 확인을 통한 지속적인 사업 모니터링",
      "benefit": "2년 만기 시 청년근로자 960만원+이자의 적립금 수령",
      "application": "경북일자리종합센터 온라인 접수\n\n온라인: https://gbwork.kr/",
      "contact": "경상북도 의성군"
    }
  },
  {
    "slug": "gov24-김포시민안전보험",
    "title": "김포시민안전보험",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "재난 및 안전사고 등으로 피해를 입은 경우 약정된 보험금을 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "김포시민안전보험",
      "주거",
      "경기",
      "경기도 김포시",
      "확인필요",
      "일반",
      "아동",
      "재난",
      "및",
      "안전사고",
      "등으로",
      "피해를"
    ],
    "summary": "재난 및 안전사고 등으로 피해를 입은 경우 약정된 보험금을 지급",
    "audience": "- 상해의료비(공유형 자전거·PM 제외, 교통상해 보장 제외) : 최고 50만원(※ 실손의료비보험가입자 제외, 청구 건당 자기부담금 3만원)\n- 상해사고 진단 위로금(교통상해 사고 제외) : 4 ~ 5주 10만원, 6 ~ 7주 20만원, 8주 이상 30만원(※ 상해의료비와 중복수령 가능)\n\n- 자연재해 사망(일사병, 열사병, 저체온증 포함) : 1000만원\n\n- 사회재난 사망(감염병 제외) : 1000만원\n\n- 폭발, 화재, 붕괴, 산사태 상해 사망 : 1000만원\n- 폭발, 화재, 붕괴, 산사태 상해 후유장해 : 최고 1000만원\n\n- 자전거·PM 사고 상해 사망(공유형 자전거·PM 포함) : 1000만원\n- 자전거·PM 사고 상해 후유장해(공유형 자전거·PM 포함) : 최고 1000만원\n- 자전거 사고 상해진단위로금 : 10만원 (4주 이상)\n\n- 대중교통 이용 중 상해 사망(전세버스 포함, 택시 제외) : 1000만원\n- 대중교통 이용 중 상해 후유장해(전세버스 포함, 택시 제외) : 최고 1000만원\n- 대중교통 이용 중 상해 부상치료비(전세버스 포함, 택시 제외) : 최고 50만원\n\n- 도로 보행 중 교통상해 사망(휠체어, 의료용 스쿠터 포함) : 500만원\n- 도로 보행 중 교통상해 후유장해(휠체어, 의료용 스쿠터 포함) : 최고 500만원\n\n- 상해 사망(교통상해 보장 제외) : 500만원\n- 상해 후유장해(교통상해 보장 제외) : 최고 300만원",
    "benefits": [
      "재난 및 안전사고 등으로 피해를 입은 경우 약정된 보험금을 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "접수 및 보상문의 : 시민안전보험 접수센터(☎1522-3556)\n\n청구방법\n - 우편 : 서울특별시 강동구 천호대로 176길 8 형도빌딩 3층 (05373)\n - 팩스 : 0507-774-0662\n - 이메일 : simin@siminins.co.kr",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000135",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000135",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 상해의료비(공유형 자전거·PM 제외, 교통상해 보장 제외) : 최고 50만원(※ 실손의료비보험가입자 제외, 청구 건당 자기부담금 3만원)\n- 상해사고 진단 위로금(교통상해 사고 제외) : 4 ~ 5주 10만원, 6 ~ 7주 20만원, 8주 이상 30만원(※ 상해의료비와 중복수령 가능)\n\n- 자연재해 사망(일사병, 열사병, 저체온증 포함) : 1000만원\n\n- 사회재난 사망(감염병 제외) : 1000만원\n\n- 폭발, 화재, 붕괴, 산사태 상해 사망 : 1000만원\n- 폭발, 화재, 붕괴, 산사태 상해 후유장해 : 최고 1000만원\n\n- 자전거·PM 사고 상해 사망(공유형 자전거·PM 포함) : 1000만원\n- 자전거·PM 사고 상해 후유장해(공유형 자전거·PM 포함) : 최고 1000만원\n- 자전거 사고 상해진단위로금 : 10만원 (4주 이상)\n\n- 대중교통 이용 중 상해 사망(전세버스 포함, 택시 제외) : 1000만원\n- 대중교통 이용 중 상해 후유장해(전세버스 포함, 택시 제외) : 최고 1000만원\n- 대중교통 이용 중 상해 부상치료비(전세버스 포함, 택시 제외) : 최고 50만원\n\n- 도로 보행 중 교통상해 사망(휠체어, 의료용 스쿠터 포함) : 500만원\n- 도로 보행 중 교통상해 후유장해(휠체어, 의료용 스쿠터 포함) : 최고 500만원\n\n- 상해 사망(교통상해 보장 제외) : 500만원\n- 상해 후유장해(교통상해 보장 제외) : 최고 300만원",
      "benefit": "재난 및 안전사고 등으로 피해를 입은 경우 약정된 보험금을 지급",
      "application": "접수 및 보상문의 : 시민안전보험 접수센터(☎1522-3556)\n\n청구방법\n - 우편 : 서울특별시 강동구 천호대로 176길 8 형도빌딩 3층 (05373)\n - 팩스 : 0507-774-0662\n - 이메일 : simin@siminins.co.kr",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-친환경농법-볏짚환원-지원",
    "title": "친환경농법 볏짚환원 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "○ 친환경 인증 필지 볏짚환원 지원 1ha당 350천원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "친환경농법 볏짚환원 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "○",
      "친환경",
      "인증",
      "필지",
      "볏짚환원"
    ],
    "summary": "○ 친환경 인증 필지 볏짚환원 지원 1ha당 350천원",
    "audience": "○ 친환경 인증 필지 볏짚환원 지원 1ha당 350천원",
    "benefits": [
      "○ 친환경 인증 필지 볏짚환원 지원 1ha당 350천원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청(거주지 기준 주소지 관할 읍·면 행정복지센터 산업팀)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000115",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 친환경 인증 필지 볏짚환원 지원 1ha당 350천원",
      "benefit": "○ 친환경 인증 필지 볏짚환원 지원 1ha당 350천원",
      "application": "○ 방문신청(거주지 기준 주소지 관할 읍·면 행정복지센터 산업팀)",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-벼-육묘용-및-원예용-상토-지원",
    "title": "벼 육묘용 및 원예용 상토 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "관내 거주하는 수도작 및 밭작물(원예) 재배 농업인에게 상토 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "벼 육묘용 및 원예용 상토 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "관내",
      "거주하는",
      "수도작",
      "및",
      "밭작물(원예)"
    ],
    "summary": "관내 거주하는 수도작 및 밭작물(원예) 재배 농업인에게 상토 지원",
    "audience": "○ 신청자격: 관내 거주하는 수도작 및 원예작물 재배 농업인\n○ 벼 육묘용 상토: 1ha당 30포 지원(포당 5,700원)\n○ 원예용 상토: 1ha당 20포 지원(포당 5,700원 / 최대 5ha까지 신청 가능)",
    "benefits": [
      "관내 거주하는 수도작 및 밭작물(원예) 재배 농업인에게 상토 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청: 거주지(등본) 관할 읍면 행정복지센터 산업팀",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000430",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000430",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 신청자격: 관내 거주하는 수도작 및 원예작물 재배 농업인\n○ 벼 육묘용 상토: 1ha당 30포 지원(포당 5,700원)\n○ 원예용 상토: 1ha당 20포 지원(포당 5,700원 / 최대 5ha까지 신청 가능)",
      "benefit": "관내 거주하는 수도작 및 밭작물(원예) 재배 농업인에게 상토 지원",
      "application": "○ 방문신청: 거주지(등본) 관할 읍면 행정복지센터 산업팀",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-맞춤형비료-지원",
    "title": "맞춤형비료 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군 관내에 주소를 둔 수도작 재배 농가에게 맞춤형 비료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "맞춤형비료 지원",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "연천군",
      "관내에",
      "주소를",
      "둔",
      "수도작"
    ],
    "summary": "연천군 관내에 주소를 둔 수도작 재배 농가에게 맞춤형 비료 지원",
    "audience": "○ 사업대상: 연천군 관내에 주소를 둔 수도작 재배 농가 및 밭작물 재배농가 \n○ 맞춤형비료 지원 1ha당 20포(포당 6,000원 정액지원)",
    "benefits": [
      "연천군 관내에 주소를 둔 수도작 재배 농가에게 맞춤형 비료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청: 거주지(등본) 관할지 읍면 행정복지센터 산업팀",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000431",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000431",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 사업대상: 연천군 관내에 주소를 둔 수도작 재배 농가 및 밭작물 재배농가 \n○ 맞춤형비료 지원 1ha당 20포(포당 6,000원 정액지원)",
      "benefit": "연천군 관내에 주소를 둔 수도작 재배 농가에게 맞춤형 비료 지원",
      "application": "○ 방문신청: 거주지(등본) 관할지 읍면 행정복지센터 산업팀",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-장수수당",
    "title": "장수수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "장수노인에게 장수수당 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장수수당",
      "복지",
      "경기",
      "경기도 양평군",
      "상시",
      "어르신",
      "장수노인에게",
      "지급"
    ],
    "summary": "경기도 양평군에서 장수노인을 대상으로 장수수당 지급을 안내하는 복지 사업입니다. 대상 기준과 신청 방법은 공식 공고에서 확인하세요.",
    "audience": "○ 1인당 3만원씩 매월 15일에 지급",
    "benefits": [
      "장수노인에게 장수수당 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000105",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 1인당 3만원씩 매월 15일에 지급",
      "benefit": "장수노인에게 장수수당 지급",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-치매조기검진지원",
    "title": "치매조기검진지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "치매환자의 진단검사비 및 감별검사비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "치매조기검진지원",
      "보건의료",
      "경기",
      "경기도 양평군",
      "상시",
      "일반",
      "아동",
      "전체",
      "치매환자의",
      "진단검사비",
      "및",
      "감별검사비"
    ],
    "summary": "치매환자의 진단검사비 및 감별검사비 지원",
    "audience": "○ 서비스 내용\n - 양평군치매안심센터에서 실시하는 치매조기검진 1단계(선별검사)를 통한 인지저하자를 대상으로 2단계(진단검사) 및 3단계(감별검사) 검사비 지원\n\n○ 서비스 금액\n - 진단검사: 상한 15만원\n - 감별검사: 의원/병원/종합병원급 8만원 한도, 상급종합병원 상한 11만원\n * 비급여하목을 제외한 급여항목의 본인부담비용",
    "benefits": [
      "치매환자의 진단검사비 및 감별검사비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 양평군치매안심센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000108",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000108",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 서비스 내용\n - 양평군치매안심센터에서 실시하는 치매조기검진 1단계(선별검사)를 통한 인지저하자를 대상으로 2단계(진단검사) 및 3단계(감별검사) 검사비 지원\n\n○ 서비스 금액\n - 진단검사: 상한 15만원\n - 감별검사: 의원/병원/종합병원급 8만원 한도, 상급종합병원 상한 11만원\n * 비급여하목을 제외한 급여항목의 본인부담비용",
      "benefit": "치매환자의 진단검사비 및 감별검사비 지원",
      "application": "○ 방문 신청\n - 기타 : 양평군치매안심센터 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-임산부-엽산제-및-철분제-지원",
    "title": "임산부 엽산제 및 철분제 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "예비부부 및 임산부 등에게 엽산제와 철분제 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임산부 엽산제 및 철분제 지원",
      "보건의료",
      "경기",
      "경기도 양평군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "예비부부",
      "및",
      "임산부",
      "등에게"
    ],
    "summary": "예비부부 및 임산부 등에게 엽산제와 철분제 지원",
    "audience": "○ 서비스 내용\n - 예비부부, 임신준비부부 및 임산부를 대상으로 엽산제 및 철분제 지원\n (방문수령 : 의약품 제공, 택배수령 : 건강기능식품 제공) * 택배비 3,500원~4,000원 본인부담\n\n○ 제공대상\n - 예비부부 및 임신준비부부: 엽산제 3개월분(여성)\n - 임산부: 엽산제 3개월분(임신12주까지), 철분제 5개월분(임신 20주~40주), 분만 후 철분제 1개월분 추가 제공\n 쌍둥이 임산부는 철분제 2배 지원 및 빈혈 임산부 추가 지원",
    "benefits": [
      "예비부부 및 임산부 등에게 엽산제와 철분제 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 온라인 신청 \n - 정부24 : www.gov.kr (맘편한 임신)\n\n○ 방문 신청\n - 보건소 : 관할 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000111",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000111",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 서비스 내용\n - 예비부부, 임신준비부부 및 임산부를 대상으로 엽산제 및 철분제 지원\n (방문수령 : 의약품 제공, 택배수령 : 건강기능식품 제공) * 택배비 3,500원~4,000원 본인부담\n\n○ 제공대상\n - 예비부부 및 임신준비부부: 엽산제 3개월분(여성)\n - 임산부: 엽산제 3개월분(임신12주까지), 철분제 5개월분(임신 20주~40주), 분만 후 철분제 1개월분 추가 제공\n 쌍둥이 임산부는 철분제 2배 지원 및 빈혈 임산부 추가 지원",
      "benefit": "예비부부 및 임산부 등에게 엽산제와 철분제 지원",
      "application": "○ 온라인 신청 \n - 정부24 : www.gov.kr (맘편한 임신)\n\n○ 방문 신청\n - 보건소 : 관할 보건소 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-북한이탈주민-기초생활-물품-지원",
    "title": "북한이탈주민 기초생활 물품 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "북한이탈주민에게 기초생활물품 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "북한이탈주민 기초생활 물품 지원",
      "복지",
      "경북",
      "경상북도 경산시",
      "상시",
      "일반",
      "아동",
      "북한이탈주민에게",
      "기초생활물품",
      "제공"
    ],
    "summary": "경상북도 경산시에서 북한이탈주민을 대상으로 기초생활 물품 지원을 안내하는 사업입니다. 지원 절차와 대상 여부는 공식 안내를 확인하세요.",
    "audience": "○ 정착지원시설로부터 경산시로 전입한 북한이탈주민에게 기초생활물품을 제공\n - 지원기준 1세대 : 100만원 이내",
    "benefits": [
      "북한이탈주민에게 기초생활물품 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 북한이탈주민이 경산시로 전입할경우 정착지원시설 또는 경산경찰서로 부터 통보가 옴에 따라 통보온 주민을 대상으로 경산경찰서 보안자문협의회가 기초물품 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000105",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 정착지원시설로부터 경산시로 전입한 북한이탈주민에게 기초생활물품을 제공\n - 지원기준 1세대 : 100만원 이내",
      "benefit": "북한이탈주민에게 기초생활물품 제공",
      "application": "○ 개인 신청절차 없음\n - 북한이탈주민이 경산시로 전입할경우 정착지원시설 또는 경산경찰서로 부터 통보가 옴에 따라 통보온 주민을 대상으로 경산경찰서 보안자문협의회가 기초물품 신청",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-산모신생아-건강관리사업-본인부담금-지원",
    "title": "산모신생아 건강관리사업 본인부담금 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "산모신생아 건강관리 지원 서비스 이용 본인부담금의 90퍼센트 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "산모신생아 건강관리사업 본인부담금 지원",
      "보건의료",
      "경기",
      "경기도 김포시",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "산모신생아",
      "건강관리",
      "지원",
      "서비스"
    ],
    "summary": "산모신생아 건강관리 지원 서비스 이용 본인부담금의 90퍼센트 지원",
    "audience": "- 지원대상 : 산모신생아 건강관리 지원 서비스 이용자 중 \n1. 신생아의 출생일 180일 이전부터 본인부담금 신청일 현재까지 시에 주민등록 또는 외국인 등록을 두고 계속하여 거주한 산모\n2. 산모의 김포시 거주 기한이 신생아 출생일 이전 180일 미만인 경우, 신생아의 출생일로부터 180일 경과한 날까지 시에 주민등록 또는 외국인등록을 두고 계속하여 거주한 산모\n\n- 지원내용 : 산모신생아 건강관리 지원 서비스 본인부담금의 90퍼센트를 지원. 단, 연장형을 이용한 대상자는 표준형 금액으로 지원\n\n * 단, 지급 시 다른 지방자치단체로 전출한 경우 지급대상 제외",
    "benefits": [
      "산모신생아 건강관리 지원 서비스 이용 본인부담금의 90퍼센트 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "보건소 방문신청 또는 정부24(혜택알리미) 온라인 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000134",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000134",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 지원대상 : 산모신생아 건강관리 지원 서비스 이용자 중 \n1. 신생아의 출생일 180일 이전부터 본인부담금 신청일 현재까지 시에 주민등록 또는 외국인 등록을 두고 계속하여 거주한 산모\n2. 산모의 김포시 거주 기한이 신생아 출생일 이전 180일 미만인 경우, 신생아의 출생일로부터 180일 경과한 날까지 시에 주민등록 또는 외국인등록을 두고 계속하여 거주한 산모\n\n- 지원내용 : 산모신생아 건강관리 지원 서비스 본인부담금의 90퍼센트를 지원. 단, 연장형을 이용한 대상자는 표준형 금액으로 지원\n\n * 단, 지급 시 다른 지방자치단체로 전출한 경우 지급대상 제외",
      "benefit": "산모신생아 건강관리 지원 서비스 이용 본인부담금의 90퍼센트 지원",
      "application": "보건소 방문신청 또는 정부24(혜택알리미) 온라인 신청",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-장수축하물품-지급",
    "title": "장수축하물품 지급",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "김포시에 1년 이상 거주중인 100세 이상의 노인으로, 50만원 상당의 가전제품 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장수축하물품 지급",
      "보건의료",
      "경기",
      "경기도 김포시",
      "상시",
      "어르신",
      "아동",
      "복지",
      "김포시에",
      "1년",
      "이상",
      "거주중인"
    ],
    "summary": "김포시에 1년 이상 거주중인 100세 이상의 노인으로, 50만원 상당의 가전제품 지급",
    "audience": "신청 대상: 김포시에 1년 이상 거주하고 있는 100세 이상의 노인 \n신청 방법: 거주지 관할 읍면동 행정복지센터 신청에 따른 지급\n사업 내용: 1인당 50만원 상당의 주방, 생활, 건강 가전 지급\n신청 기간: 100세 도래 월부터 1년 이내 신청\n지급 기간: 신청월의 다음 달 말일까지 \n지급 제외: 지급일 기준 사망 또는 말소 또는 전출한 경우 등",
    "benefits": [
      "김포시에 1년 이상 거주중인 100세 이상의 노인으로, 50만원 상당의 가전제품 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청: 거주지 관할 읍면동 행정복지센터(신분증 지참)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000144",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000144",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "신청 대상: 김포시에 1년 이상 거주하고 있는 100세 이상의 노인 \n신청 방법: 거주지 관할 읍면동 행정복지센터 신청에 따른 지급\n사업 내용: 1인당 50만원 상당의 주방, 생활, 건강 가전 지급\n신청 기간: 100세 도래 월부터 1년 이내 신청\n지급 기간: 신청월의 다음 달 말일까지 \n지급 제외: 지급일 기준 사망 또는 말소 또는 전출한 경우 등",
      "benefit": "김포시에 1년 이상 거주중인 100세 이상의 노인으로, 50만원 상당의 가전제품 지급",
      "application": "방문신청: 거주지 관할 읍면동 행정복지센터(신분증 지참)",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-가정위탁아동-생계비-및-생필품-지원",
    "title": "가정위탁아동 생계비 및 생필품 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "가정위탁아동을 위해 생계비 및 생필품비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "가정위탁아동 생계비 및 생필품 지원",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "가정위탁아동을",
      "위해",
      "생계비",
      "및"
    ],
    "summary": "가정위탁아동을 위해 생계비 및 생필품비 지원",
    "audience": "○ 가정위탁아동 3, 6, 9, 12월 생계비(5만원) 현금지급 / 가정위탁아동 설, 추석 생필품비(3만원) 현금지급",
    "benefits": [
      "가정위탁아동을 위해 생계비 및 생필품비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 별도 신청 불필요",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000103",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000103",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가정위탁아동 3, 6, 9, 12월 생계비(5만원) 현금지급 / 가정위탁아동 설, 추석 생필품비(3만원) 현금지급",
      "benefit": "가정위탁아동을 위해 생계비 및 생필품비 지원",
      "application": "○ 개인 신청절차 없음\n - 별도 신청 불필요",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-저소득노인-긴급입소비-지원",
    "title": "저소득노인 긴급입소비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "장기요양등급 시설등급외자에게 긴급입소비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득노인 긴급입소비 지원",
      "보건의료",
      "경기",
      "경기도 연천군",
      "상시",
      "어르신",
      "복지",
      "장기요양등급",
      "시설등급외자에게",
      "긴급입소비",
      "지원"
    ],
    "summary": "장기요양등급 시설등급외자에게 긴급입소비 지원",
    "audience": "○ 장기요양등급외자 중 입소보호조치가 필요한 경우 비용 지원",
    "benefits": [
      "장기요양등급 시설등급외자에게 긴급입소비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000111",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000111",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.26",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장기요양등급외자 중 입소보호조치가 필요한 경우 비용 지원",
      "benefit": "장기요양등급 시설등급외자에게 긴급입소비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 연천군"
    }
  }
];

policies.push(...gov24PromotionPoliciesBatch2);

const gov24PromotionPoliciesBatch3: Policy[] = [
  {
    "slug": "gov24-신재생에너지설비-설치-보조금-지원",
    "title": "신재생에너지설비 설치 보조금 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "군민이 신재생에너지 설비(태양광, 태양열, 지열) 설치 시 보조금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "신재생에너지설비 설치 보조금 지원",
      "주거",
      "경기",
      "경기도 가평군",
      "상시",
      "일반",
      "전체",
      "군민이",
      "신재생에너지",
      "설비(태양광,",
      "태양열,",
      "지열)"
    ],
    "summary": "군민이 신재생에너지 설비(태양광, 태양열, 지열) 설치 시 보조금 지급",
    "audience": "○ 가평군민이 가평관내 신재생에너지 설비(태양광, 태양열, 지열) 설치 시 보조금 지급",
    "benefits": [
      "군민이 신재생에너지 설비(태양광, 태양열, 지열) 설치 시 보조금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 관할 군청 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000113",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000113",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가평군민이 가평관내 신재생에너지 설비(태양광, 태양열, 지열) 설치 시 보조금 지급",
      "benefit": "군민이 신재생에너지 설비(태양광, 태양열, 지열) 설치 시 보조금 지급",
      "application": "○ 방문 신청\n - 시군구 : 관할 군청 방문",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-가평군-난임부부-시술비-약제비-지원-난임시술-이후-원외-약제비-청구",
    "title": "[가평군] 난임부부 시술비 약제비 지원(난임시술 이후 원외 약제비 청구)",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "[가평군] 난임부부 시술비 약제비 지원(난임시술 이후 원외 약제비 청구)",
      "복지",
      "경기",
      "경기도 가평군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "난임부부",
      "시술과",
      "직접적",
      "관련"
    ],
    "summary": "난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 지원",
    "audience": "○ 난임부부 시술비 지원사업 관련, 난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부 지원금액 한도 내에서 지원\n지원범위 → [정부지원금] - [시술확인서에 청구된 비용]의 차액\n\n* 지원결정통지서 발급일 이후부터 해당 시술 차수 시갈 기간 내에 발생한 약제비만 청구 가능\n* 크리논겔, 싸이클로제스트, 루티너스질정 등 프로게스테론 호르몬 종류가 포함된 영수증만 청구 가능\n* 시술 종료일로부터 1개월 이내 청구",
    "benefits": [
      "난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 시술 완료 후 관련 서류를 첨부하여 시술 완료 후 1개월 이내 보건소로 청구(지원결정통지서 발급 보건소)\n \n- 방문신청: 가평군보건소 2층 건강증진과 생명사랑팀\n- 온라인신청: 정부24 온라인 신청\n- e보건소로 난임시술비 지원 신청하였을 경우, 약제비도 e보건소로 청구 가능 \n\n○ 지급 시기\n- 청구일로부터 1개월 이내 지급",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000267",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000267",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 난임부부 시술비 지원사업 관련, 난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 정부 지원금액 한도 내에서 지원\n지원범위 → [정부지원금] - [시술확인서에 청구된 비용]의 차액\n\n* 지원결정통지서 발급일 이후부터 해당 시술 차수 시갈 기간 내에 발생한 약제비만 청구 가능\n* 크리논겔, 싸이클로제스트, 루티너스질정 등 프로게스테론 호르몬 종류가 포함된 영수증만 청구 가능\n* 시술 종료일로부터 1개월 이내 청구",
      "benefit": "난임부부 시술과 직접적 관련 있는 원외처방 약제비에 대해 지원",
      "application": "○ 시술 완료 후 관련 서류를 첨부하여 시술 완료 후 1개월 이내 보건소로 청구(지원결정통지서 발급 보건소)\n \n- 방문신청: 가평군보건소 2층 건강증진과 생명사랑팀\n- 온라인신청: 정부24 온라인 신청\n- e보건소로 난임시술비 지원 신청하였을 경우, 약제비도 e보건소로 청구 가능 \n\n○ 지급 시기\n- 청구일로부터 1개월 이내 지급",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-주거위기가구-임시주거지원",
    "title": "주거위기가구 임시주거지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "주거위기가구를 위해 임시주거지 제공 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "주거위기가구 임시주거지원",
      "주거",
      "경기",
      "경기도 양평군",
      "상시",
      "일반",
      "전체",
      "복지",
      "주거위기가구를",
      "위해",
      "임시주거지",
      "제공"
    ],
    "summary": "주거위기가구를 위해 임시주거지 제공 지원",
    "audience": "○ 주거위기가구를 대상으로 공공임대주택 지원 이전에 임시주거지 제공",
    "benefits": [
      "주거위기가구를 위해 임시주거지 제공 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 양평군청 건축과 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000120",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000120",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 주거위기가구를 대상으로 공공임대주택 지원 이전에 임시주거지 제공",
      "benefit": "주거위기가구를 위해 임시주거지 제공 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 양평군청 건축과 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-특별교통수단-운영지원",
    "title": "특별교통수단 운영지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 경산시",
    "region": "경북",
    "amount": "장애 및 고령으로 인하여 대중교통 이용이 제한되는 교통약자에 대한 이동지원 서비스 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "특별교통수단 운영지원",
      "보건의료",
      "경북",
      "경상북도 경산시",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "장애",
      "및",
      "고령으로"
    ],
    "summary": "장애 및 고령으로 인하여 대중교통 이용이 제한되는 교통약자에 대한 이동지원 서비스 제공",
    "audience": "장애 및 고령으로 인하여 대중교통 이용이 제한되는 교통약자에 대한 이동지원 서비스 제공",
    "benefits": [
      "장애 및 고령으로 인하여 대중교통 이용이 제한되는 교통약자에 대한 이동지원 서비스 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "광역이동지원센터 및 경산교통 유선 신청\n\n - 최초 이용자 등록 관련 경산교통 : 053-802-1700\n\n - 이용자 등록 후 배차 관련 경북 광역이동지원센터 : http://www.brmcall.co.kr/main.do 또는 연락처 1899-7770",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000360",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/513000000360",
    "contact": "경상북도 경산시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "장애 및 고령으로 인하여 대중교통 이용이 제한되는 교통약자에 대한 이동지원 서비스 제공",
      "benefit": "장애 및 고령으로 인하여 대중교통 이용이 제한되는 교통약자에 대한 이동지원 서비스 제공",
      "application": "광역이동지원센터 및 경산교통 유선 신청\n\n - 최초 이용자 등록 관련 경산교통 : 053-802-1700\n\n - 이용자 등록 후 배차 관련 경북 광역이동지원센터 : http://www.brmcall.co.kr/main.do 또는 연락처 1899-7770",
      "contact": "경상북도 경산시"
    }
  },
  {
    "slug": "gov24-대학생-학습멘토링-프로그램-운영",
    "title": "대학생 학습멘토링 프로그램 운영",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "서울시 소재 대학 및 동대문구 기숙학사 대학생을 동대문구 학생들과 매칭하여 수업을 진행",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·청년",
    "targetGroup": "청년, 부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "대학생 학습멘토링 프로그램 운영",
      "청년",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "서울시",
      "소재",
      "대학",
      "및"
    ],
    "summary": "서울시 소재 대학 및 동대문구 기숙학사 대학생을 동대문구 학생들과 매칭하여 수업을 진행",
    "audience": "○ 서울시 대학생들과 동대문구 초중고교, 지역아동센터 및 우리동네키움센터 소속 학생들을 연계하여 학습 서비스 제공\n - 상반기, 하반기 연 2회 운영",
    "benefits": [
      "서울시 소재 대학 및 동대문구 기숙학사 대학생을 동대문구 학생들과 매칭하여 수업을 진행"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 모집기간 중 동대문구 초중고교, 지역아동센터 및 우리동네키움센터의 추천을 통한 멘티학생 선정",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000152",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000152",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 서울시 대학생들과 동대문구 초중고교, 지역아동센터 및 우리동네키움센터 소속 학생들을 연계하여 학습 서비스 제공\n - 상반기, 하반기 연 2회 운영",
      "benefit": "서울시 소재 대학 및 동대문구 기숙학사 대학생을 동대문구 학생들과 매칭하여 수업을 진행",
      "application": "○ 모집기간 중 동대문구 초중고교, 지역아동센터 및 우리동네키움센터의 추천을 통한 멘티학생 선정",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-1차진료-내과-서비스",
    "title": "1차진료(내과) 서비스",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "1차진료 및 검사 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "1차진료(내과) 서비스",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "1차진료",
      "및",
      "검사"
    ],
    "summary": "1차진료 및 검사 지원",
    "audience": "ㅇ만성질환, 성인병 중심 진료\n - 고혈압, 고지혈증, 당뇨 등 만성질환\n - 관절염, 요통 등에 대한 약·물리치료 처방 : 정형외과적 검사 제외\n - 급성 인후두염(감기), 소화장애 등 경증 질환 : 전문 검사 제외\n - 일반적인 임상병리 검사(혈액, 소변검사) : 암검사 제외\n\nㅇ 진료비\n - 의료급여수급자, 국가유공자, 독립유공자, 5·18민주유공자, 고엽제후유증 환자 : 진료비 무료\n - 65세 이상 서울시민: 진료비 무료 (단, 일반 검사 및 제증명 발급 수수료는 유료)\n - 65세 이하 서울시민: 진료비 500원~6,090원\n\nㅇ진료시간 : 평일 09:00~18:00(점심시간 12:00~13:00)",
    "benefits": [
      "1차진료 및 검사 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 보건소 민원실 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000290",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000290",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ만성질환, 성인병 중심 진료\n - 고혈압, 고지혈증, 당뇨 등 만성질환\n - 관절염, 요통 등에 대한 약·물리치료 처방 : 정형외과적 검사 제외\n - 급성 인후두염(감기), 소화장애 등 경증 질환 : 전문 검사 제외\n - 일반적인 임상병리 검사(혈액, 소변검사) : 암검사 제외\n\nㅇ 진료비\n - 의료급여수급자, 국가유공자, 독립유공자, 5·18민주유공자, 고엽제후유증 환자 : 진료비 무료\n - 65세 이상 서울시민: 진료비 무료 (단, 일반 검사 및 제증명 발급 수수료는 유료)\n - 65세 이하 서울시민: 진료비 500원~6,090원\n\nㅇ진료시간 : 평일 09:00~18:00(점심시간 12:00~13:00)",
      "benefit": "1차진료 및 검사 지원",
      "application": "○ 방문신청\n - 보건소 민원실 방문신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-보건소-한방진료-지원",
    "title": "보건소 한방진료 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "만 15세 이상 전 구민에게 한방진료 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보건소 한방진료 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "만",
      "15세",
      "이상"
    ],
    "summary": "만 15세 이상 전 구민에게 한방진료 제공",
    "audience": "ㅇ진료내용 : 한방건강상담 및 한방보험약제 처방 침, 부항 등 한방요법 진료\n * 보험에 해당하지 않는 첩약 처방, 조제는 진료내용 범위에 포함되지 않음\nㅇ진료시간 : 매주 월요일 ~ 금요일(오전 9시~오후 6시)\nㅇ대상 : 만 15세이상 전 주민\nㅇ무료진료 : 만 65세 이상 서울시민 및 의료급여수급권자,장애인 1~3급, 국가유공자 본인 등.\nㅇ유료진료 : 65세 미만 주민 1,100원~ (약 처방 일수에 따라 추가)\nㅇ진료예약 : 방문 및 전화로 사전예약(신분증 및 관련서류 지참)",
    "benefits": [
      "만 15세 이상 전 구민에게 한방진료 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 및 전화로 사전예약(신분증 및 관련서류 지참)\n- 장소 : 동대문구청 2층 한방과(세무과와 다목적강당 사이)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000291",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000291",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ진료내용 : 한방건강상담 및 한방보험약제 처방 침, 부항 등 한방요법 진료\n * 보험에 해당하지 않는 첩약 처방, 조제는 진료내용 범위에 포함되지 않음\nㅇ진료시간 : 매주 월요일 ~ 금요일(오전 9시~오후 6시)\nㅇ대상 : 만 15세이상 전 주민\nㅇ무료진료 : 만 65세 이상 서울시민 및 의료급여수급권자,장애인 1~3급, 국가유공자 본인 등.\nㅇ유료진료 : 65세 미만 주민 1,100원~ (약 처방 일수에 따라 추가)\nㅇ진료예약 : 방문 및 전화로 사전예약(신분증 및 관련서류 지참)",
      "benefit": "만 15세 이상 전 구민에게 한방진료 제공",
      "application": "방문 및 전화로 사전예약(신분증 및 관련서류 지참)\n- 장소 : 동대문구청 2층 한방과(세무과와 다목적강당 사이)",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-보제원-한방이동진료실-운영",
    "title": "보제원 한방이동진료실 운영",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "한방진료 및 상담 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "보제원 한방이동진료실 운영",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "한방진료",
      "및",
      "상담"
    ],
    "summary": "한방진료 및 상담 지원",
    "audience": "ㅇ진료내용 : 한방건강상담 및 한방보험약제 처방 침, 부항 등 한방요법 진료\nㅇ진료시간 : 매주 화요일~토요일(오전 9시~오후 6시)\nㅇ대상\n - 무료진료 : 만 65세 이상 서울시민 및 의료급여수급권자,장애인 1~3급, 국가유공자 본인 등.\n - 무료상담 : 일반 내 · 외국인 누구나 가능\nㅇ진료예약 : 방문 및 전화로 사전예약(신분증 및 관련서류 지참)",
    "benefits": [
      "한방진료 및 상담 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 및 전화로 사전예약 후 진료\n - 주소 : 동대문구 약령중앙로 26 서울한방진흥센터 3층 보제원 한방이동진료실\n(제기역 2번출구 약령시장 방면으로 직진)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000292",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000292",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ진료내용 : 한방건강상담 및 한방보험약제 처방 침, 부항 등 한방요법 진료\nㅇ진료시간 : 매주 화요일~토요일(오전 9시~오후 6시)\nㅇ대상\n - 무료진료 : 만 65세 이상 서울시민 및 의료급여수급권자,장애인 1~3급, 국가유공자 본인 등.\n - 무료상담 : 일반 내 · 외국인 누구나 가능\nㅇ진료예약 : 방문 및 전화로 사전예약(신분증 및 관련서류 지참)",
      "benefit": "한방진료 및 상담 지원",
      "application": "방문 및 전화로 사전예약 후 진료\n - 주소 : 동대문구 약령중앙로 26 서울한방진흥센터 3층 보제원 한방이동진료실\n(제기역 2번출구 약령시장 방면으로 직진)",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-구강보건서비스",
    "title": "구강보건서비스",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "아동,청소년, 노인, 장애인 등에게 구강보건서비스 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "구강보건서비스",
      "청년",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "부모/육아",
      "어르신",
      "장애인",
      "아동",
      "청소년",
      "임신·출산·육아",
      "복지"
    ],
    "summary": "아동,청소년, 노인, 장애인 등에게 구강보건서비스 지원",
    "audience": "ㅇ대상 : 동대문구 거주 만 4세이상 주민\nㅇ진료내용\n - 치아홈메우기(관내 초등학생 건전한 영구치 큰 어금니)\n - 급성 치주질환 치료\n - 치아마모증 치료(보험재료)\n - 초기 충치치료(보험재료)\n - 단순발치)\n\n*진료제외 : 신경치료, 스케일링, 난발치(사랑니, 뿌리만 남은 치아 등), 비보험치료(레진, 보철)\n\nㅇ진료비\n - 만65세 이상 서울시민 및 국가유공자, 의료급여대상자, 장애인 1~3급 : 무료\n - 만65세 미만 서울시민 : 진료비 500원~6,090원",
    "benefits": [
      "아동,청소년, 노인, 장애인 등에게 구강보건서비스 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 거주지 관할 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000293",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000293",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ대상 : 동대문구 거주 만 4세이상 주민\nㅇ진료내용\n - 치아홈메우기(관내 초등학생 건전한 영구치 큰 어금니)\n - 급성 치주질환 치료\n - 치아마모증 치료(보험재료)\n - 초기 충치치료(보험재료)\n - 단순발치)\n\n*진료제외 : 신경치료, 스케일링, 난발치(사랑니, 뿌리만 남은 치아 등), 비보험치료(레진, 보철)\n\nㅇ진료비\n - 만65세 이상 서울시민 및 국가유공자, 의료급여대상자, 장애인 1~3급 : 무료\n - 만65세 미만 서울시민 : 진료비 500원~6,090원",
      "benefit": "아동,청소년, 노인, 장애인 등에게 구강보건서비스 지원",
      "application": "○ 방문 신청\n - 보건소 : 거주지 관할 보건소 방문",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-장애인-보장구-수리-지원",
    "title": "장애인 보장구 수리 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "보조기기 수리 및 부품교체 지원 - 기초수급자 : 연 20만원 /일반 연10만원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인 보장구 수리 지원",
      "보건의료",
      "경기",
      "경기도 양평군",
      "상시",
      "장애인",
      "전체",
      "복지",
      "보조기기",
      "수리",
      "및",
      "부품교체"
    ],
    "summary": "보조기기 수리 및 부품교체 지원 - 기초수급자 : 연 20만원 /일반 연10만원",
    "audience": "○ 장애인 보조기기(수동, 자동 휠체어 및 스쿠터 등) 단순수리 및 부품교체",
    "benefits": [
      "보조기기 수리 및 부품교체 지원 - 기초수급자 : 연 20만원 /일반 연10만원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 거주지 읍면사무소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000106",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000106",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장애인 보조기기(수동, 자동 휠체어 및 스쿠터 등) 단순수리 및 부품교체",
      "benefit": "보조기기 수리 및 부품교체 지원 - 기초수급자 : 연 20만원 /일반 연10만원",
      "application": "○ 거주지 읍면사무소 방문신청",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-장애인-자립생활-정착금-지원",
    "title": "장애인 자립생활 정착금 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "시설퇴소 장애인에게 자립생활 정착금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인 자립생활 정착금 지원",
      "주거",
      "경기",
      "경기도 양평군",
      "상시",
      "장애인",
      "전체",
      "복지",
      "시설퇴소",
      "장애인에게",
      "자립생활",
      "정착금"
    ],
    "summary": "시설퇴소 장애인에게 자립생활 정착금 지원",
    "audience": "○ 장애인 거주시설 및 체험 수료 장애인을 대상으로 자립을 위해 시설에서 퇴소 시 초기 거주비용(임대보증금, 월세), 편의시설 설치, 생활용품 구입 등 정착금 지원",
    "benefits": [
      "시설퇴소 장애인에게 자립생활 정착금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 양평군청 가족복지과 방문\n - 각 읍면 : 각읍면 복지팀 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000107",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000107",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장애인 거주시설 및 체험 수료 장애인을 대상으로 자립을 위해 시설에서 퇴소 시 초기 거주비용(임대보증금, 월세), 편의시설 설치, 생활용품 구입 등 정착금 지원",
      "benefit": "시설퇴소 장애인에게 자립생활 정착금 지원",
      "application": "○ 방문 신청\n - 시군구 : 양평군청 가족복지과 방문\n - 각 읍면 : 각읍면 복지팀 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-유기질비료-지원-및-팔당댐-상류지역-영농비-지원",
    "title": "유기질비료 지원 및 팔당댐 상류지역 영농비 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "농가에 혼합유박 및 가축분퇴비 등 비료구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "유기질비료 지원 및 팔당댐 상류지역 영농비 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "확인필요",
      "농어업인",
      "전체",
      "농가에",
      "혼합유박",
      "및",
      "가축분퇴비",
      "등"
    ],
    "summary": "농가에 혼합유박 및 가축분퇴비 등 비료구입비 지원",
    "audience": "○ 농업인을 대상으로 혼합유박 및 가축분퇴비 등 비료구입비 지원",
    "benefits": [
      "농가에 혼합유박 및 가축분퇴비 등 비료구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 읍.면사무소 : 주소지 관할 읍·면·사무소",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000110",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 농업인을 대상으로 혼합유박 및 가축분퇴비 등 비료구입비 지원",
      "benefit": "농가에 혼합유박 및 가축분퇴비 등 비료구입비 지원",
      "application": "○ 방문 신청\n - 읍.면사무소 : 주소지 관할 읍·면·사무소",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-친환경-인증-농가-농업생산자재-지원",
    "title": "친환경 인증 농가 농업생산자재 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "친환경인증농지를 보유한 농가에 유기농업자재 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "친환경 인증 농가 농업생산자재 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "확인필요",
      "농어업인",
      "전체",
      "친환경인증농지를",
      "보유한",
      "농가에",
      "유기농업자재",
      "구입비"
    ],
    "summary": "친환경인증농지를 보유한 농가에 유기농업자재 구입비 지원",
    "audience": "○ 친환경인증농가를 대상으로 영농에 필요한 유기농업자재 구입비 지원\n\n ※ 친환경인증 면적에 따라 보조금액 산정",
    "benefits": [
      "친환경인증농지를 보유한 농가에 유기농업자재 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면사무소방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000118",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000118",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 친환경인증농가를 대상으로 영농에 필요한 유기농업자재 구입비 지원\n\n ※ 친환경인증 면적에 따라 보조금액 산정",
      "benefit": "친환경인증농지를 보유한 농가에 유기농업자재 구입비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면사무소방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-로컬푸드-직매장-및-농가-생산-및-가공-지원",
    "title": "로컬푸드 직매장 및 농가 생산 및 가공 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "경기도 로컬푸드 납품농가 등에 생산 및 가공시설 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "로컬푸드 직매장 및 농가 생산 및 가공 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "확인필요",
      "농어업인",
      "전체",
      "경기도",
      "로컬푸드",
      "납품농가",
      "등에",
      "생산"
    ],
    "summary": "경기도 로컬푸드 납품농가 등에 생산 및 가공시설 지원",
    "audience": "○ 서비스 내용\n - 로컬푸드 직매장 및 납품농가를 대상으로 생산 및 가공시설 지원\n - 비닐하우스, 난방기, 다겹보온커튼,자동개폐시설, 이동식저류조, 저온저장고, 기타 생산시설 지원\n\n○ 서비스 금액\n - 보조금 50% / 자부담 50%",
    "benefits": [
      "경기도 로컬푸드 납품농가 등에 생산 및 가공시설 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면 주민센터에 방문 신청\n - 기타 : 양평군 농업기술센터 친환경농업과 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000124",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000124",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 서비스 내용\n - 로컬푸드 직매장 및 납품농가를 대상으로 생산 및 가공시설 지원\n - 비닐하우스, 난방기, 다겹보온커튼,자동개폐시설, 이동식저류조, 저온저장고, 기타 생산시설 지원\n\n○ 서비스 금액\n - 보조금 50% / 자부담 50%",
      "benefit": "경기도 로컬푸드 납품농가 등에 생산 및 가공시설 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면 주민센터에 방문 신청\n - 기타 : 양평군 농업기술센터 친환경농업과 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-농작물-재해보험료-지원",
    "title": "농작물 재해보험료 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "농작물 재해보험 가입 시 총보험료의 10%만 개인 부담",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농작물 재해보험료 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "확인필요",
      "농어업인",
      "전체",
      "농작물",
      "재해보험",
      "가입",
      "시",
      "총보험료의"
    ],
    "summary": "농작물 재해보험 가입 시 총보험료의 10%만 개인 부담",
    "audience": "지원대상: 관내 거주하고 관내 농지를 소유한 보험 가입 농가(경작지는 1,000㎡ 이상)\n\n지원내용: 총 보험료의 10%만 개인 부담\n\n접수처: 농협중앙회 군위군지부, 지역조합, 품목조합",
    "benefits": [
      "농작물 재해보험 가입 시 총보험료의 10%만 개인 부담"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514100000002",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514100000002",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "지원대상: 관내 거주하고 관내 농지를 소유한 보험 가입 농가(경작지는 1,000㎡ 이상)\n\n지원내용: 총 보험료의 10%만 개인 부담\n\n접수처: 농협중앙회 군위군지부, 지역조합, 품목조합",
      "benefit": "농작물 재해보험 가입 시 총보험료의 10%만 개인 부담",
      "application": "방문 신청",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-장애인-인플루엔자-백신-및-접종-지원",
    "title": "(장애인)인플루엔자 백신 및 접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "장애인 인플루엔자 예방접종 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "(장애인)인플루엔자 백신 및 접종 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "장애인",
      "아동",
      "복지",
      "인플루엔자",
      "예방접종",
      "지원"
    ],
    "summary": "장애인 인플루엔자 예방접종 지원",
    "audience": "장애인 인플루엔자 예방접종",
    "benefits": [
      "장애인 인플루엔자 예방접종 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "장애인복지카드 등 지참 후 관내 위탁의료기관에서 접종",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000282",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000282",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "장애인 인플루엔자 예방접종",
      "benefit": "장애인 인플루엔자 예방접종 지원",
      "application": "장애인복지카드 등 지참 후 관내 위탁의료기관에서 접종",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-국가유공자-인플루엔자-백신-및-접종-지원",
    "title": "(국가유공자)인플루엔자 백신 및 접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "국가유공자 인플루엔자 예방접종 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "(국가유공자)인플루엔자 백신 및 접종 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "일반",
      "전체",
      "국가유공자",
      "인플루엔자",
      "예방접종",
      "지원"
    ],
    "summary": "국가유공자 인플루엔자 예방접종 지원",
    "audience": "국가유공자 인플루엔자 예방접종",
    "benefits": [
      "국가유공자 인플루엔자 예방접종 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "해당 신분증(국가유공자증 등)을 지참 후 관내 위탁의료기관에서 접종",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000283",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000283",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "국가유공자 인플루엔자 예방접종",
      "benefit": "국가유공자 인플루엔자 예방접종 지원",
      "application": "해당 신분증(국가유공자증 등)을 지참 후 관내 위탁의료기관에서 접종",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-기초생활수급자-인플루엔자-백신-및-접종-지원",
    "title": "(기초생활수급자)인플루엔자 백신 및 접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "기초생활수급자 인플루엔자 예방접종 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "(기초생활수급자)인플루엔자 백신 및 접종 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "일반",
      "아동",
      "복지",
      "기초생활수급자",
      "인플루엔자",
      "예방접종",
      "지원"
    ],
    "summary": "기초생활수급자 인플루엔자 예방접종 지원",
    "audience": "15세~64세 동대문구민 중 기초생활수급자 인플루엔자 예방접종",
    "benefits": [
      "기초생활수급자 인플루엔자 예방접종 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "신분증, 수급자증명서 등을 지참 후 관내 위탁의료기관에서 접종",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000284",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000284",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "15세~64세 동대문구민 중 기초생활수급자 인플루엔자 예방접종",
      "benefit": "기초생활수급자 인플루엔자 예방접종 지원",
      "application": "신분증, 수급자증명서 등을 지참 후 관내 위탁의료기관에서 접종",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-대상포진-예방접종-지원",
    "title": "대상포진 예방접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "대상포진 예방접종 1회 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "대상포진 예방접종 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "어르신",
      "아동",
      "복지",
      "대상포진",
      "예방접종",
      "1회",
      "지원"
    ],
    "summary": "대상포진 예방접종 1회 지원",
    "audience": "접종일 현재 동대문구에 주민등록을 두고 있는\n65세 이상 구민 중 기초생활수급자 및 차상위계층 대상포진 예방접종 1회 지원",
    "benefits": [
      "대상포진 예방접종 1회 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "보건소에 전화로 백신잔량 확인 후 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000285",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000285",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "접종일 현재 동대문구에 주민등록을 두고 있는\n65세 이상 구민 중 기초생활수급자 및 차상위계층 대상포진 예방접종 1회 지원",
      "benefit": "대상포진 예방접종 1회 지원",
      "application": "보건소에 전화로 백신잔량 확인 후 방문",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-b형간염-유료-예방접종-지원",
    "title": "B형간염 유료 예방접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "항원항체검사 결과 음성인 접종희망자를 대상으로 B형간염 예방접종 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "B형간염 유료 예방접종 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "항원항체검사",
      "결과",
      "음성인",
      "접종희망자를",
      "대상으로"
    ],
    "summary": "항원항체검사 결과 음성인 접종희망자를 대상으로 B형간염 예방접종 제공",
    "audience": "○ 항원항체검사 결과 음성인 접종희망자를 대상으로 유료 B형간염 예방접종 제공\n\n○ 접종방법: 0~1~6개월(총3회 접종)\n\n○ 수수료 : 회당 6,900원\n ※ 접종 수수료 변동 가능",
    "benefits": [
      "항원항체검사 결과 음성인 접종희망자를 대상으로 B형간염 예방접종 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 전 백신잔량 확인 후 보건소 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000287",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000287",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 항원항체검사 결과 음성인 접종희망자를 대상으로 유료 B형간염 예방접종 제공\n\n○ 접종방법: 0~1~6개월(총3회 접종)\n\n○ 수수료 : 회당 6,900원\n ※ 접종 수수료 변동 가능",
      "benefit": "항원항체검사 결과 음성인 접종희망자를 대상으로 B형간염 예방접종 제공",
      "application": "방문 전 백신잔량 확인 후 보건소 방문 신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-친환경농산물-직접지불금-지원",
    "title": "친환경농산물 직접지불금 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "친환경인증 농가에 직불금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "친환경농산물 직접지불금 지원",
      "농림어업",
      "경기",
      "경기도 김포시",
      "모집중",
      "농어업인",
      "전체",
      "친환경인증",
      "농가에",
      "직불금",
      "지급"
    ],
    "summary": "친환경인증 농가에 직불금 지급",
    "audience": "친환경 인증 농업인에게 직불금 지급\n - 유기농인증(곡류) : 2,150천원/ha, 무농약인증(쌀) : 1,500천원/ha\n - 유기농인증(채소류) : 3,950천원/ha, 무농약인증(채소) : 2,950천원/ha\n - 유기농인증(과실류) : 4,950천원/ha, 무농약인증(과실류) : 3,950천원/ha",
    "benefits": [
      "친환경인증 농가에 직불금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 신청\n - 주민센터 : 농지소재지 관할 행정복지센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000121",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000121",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "친환경 인증 농업인에게 직불금 지급\n - 유기농인증(곡류) : 2,150천원/ha, 무농약인증(쌀) : 1,500천원/ha\n - 유기농인증(채소류) : 3,950천원/ha, 무농약인증(채소) : 2,950천원/ha\n - 유기농인증(과실류) : 4,950천원/ha, 무농약인증(과실류) : 3,950천원/ha",
      "benefit": "친환경인증 농가에 직불금 지급",
      "application": "방문 신청\n - 주민센터 : 농지소재지 관할 행정복지센터에 방문 신청",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-유기질비료-지원-사업",
    "title": "유기질비료 지원 사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "유기질비료 및 부숙유기질비료 구입 비용 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "유기질비료 지원 사업",
      "농림어업",
      "경기",
      "경기도 김포시",
      "확인필요",
      "농어업인",
      "전체",
      "유기질비료",
      "및",
      "부숙유기질비료",
      "구입",
      "비용"
    ],
    "summary": "유기질비료 및 부숙유기질비료 구입 비용 일부 지원",
    "audience": "유기질비료 및 부숙유기질비료 구입 비용 일부 지원",
    "benefits": [
      "유기질비료 및 부숙유기질비료 구입 비용 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 읍면동 행정복지센터",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000151",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000151",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "유기질비료 및 부숙유기질비료 구입 비용 일부 지원",
      "benefit": "유기질비료 및 부숙유기질비료 구입 비용 일부 지원",
      "application": "○ 방문신청\n - 읍면동 행정복지센터",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-친환경-농산물-인증비-지원-사업",
    "title": "친환경 농산물 인증비 지원 사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "친환경농산물 인증 검사비 수수료 지원(30%, 최대15만원)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "친환경 농산물 인증비 지원 사업",
      "농림어업",
      "경기",
      "경기도 김포시",
      "상시",
      "농어업인",
      "전체",
      "친환경농산물",
      "인증",
      "검사비",
      "수수료",
      "지원(30%,"
    ],
    "summary": "친환경농산물 인증 검사비 수수료 지원(30%, 최대15만원)",
    "audience": "친환경농산물 인증 검사비 수수료 지원",
    "benefits": [
      "친환경농산물 인증 검사비 수수료 지원(30%, 최대15만원)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청\n - 농지소재지 읍면동 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000152",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000152",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "친환경농산물 인증 검사비 수수료 지원",
      "benefit": "친환경농산물 인증 검사비 수수료 지원(30%, 최대15만원)",
      "application": "○ 방문신청\n - 농지소재지 읍면동 방문 신청",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-김포금쌀밥집-육성-지원",
    "title": "김포금쌀밥집 육성 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 김포시",
    "region": "경기",
    "amount": "인증간판 및 지정증 제공, 쌀 구매차액 지원, 홍보지원, 김포맛집 가산점 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "김포금쌀밥집 육성 지원",
      "농림어업",
      "경기",
      "경기도 김포시",
      "상시",
      "농어업인",
      "전체",
      "인증간판",
      "및",
      "지정증",
      "제공,",
      "쌀"
    ],
    "summary": "인증간판 및 지정증 제공, 쌀 구매차액 지원, 홍보지원, 김포맛집 가산점 제공",
    "audience": "- 김포금쌀밥집 인증간판 및 지정증(케이스 포함) 제공\n- 김포금쌀 구매 차액 지원\n- 홍보 지원 : 김포시청 홈페이지, SNS 등 홍보\n- 김포맛집 인증신청 시 가산점 제공",
    "benefits": [
      "인증간판 및 지정증 제공, 쌀 구매차액 지원, 홍보지원, 김포맛집 가산점 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청 : 김포시농업기술센터 농업정책과 유통팀\n우편접수 : 경기도 김포시 월곶면 오리정로 13(농업기술센터), 본관 2층 농업정책과 유통팀",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000158",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/409000000158",
    "contact": "경기도 김포시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "- 김포금쌀밥집 인증간판 및 지정증(케이스 포함) 제공\n- 김포금쌀 구매 차액 지원\n- 홍보 지원 : 김포시청 홈페이지, SNS 등 홍보\n- 김포맛집 인증신청 시 가산점 제공",
      "benefit": "인증간판 및 지정증 제공, 쌀 구매차액 지원, 홍보지원, 김포맛집 가산점 제공",
      "application": "방문신청 : 김포시농업기술센터 농업정책과 유통팀\n우편접수 : 경기도 김포시 월곶면 오리정로 13(농업기술센터), 본관 2층 농업정책과 유통팀",
      "contact": "경기도 김포시"
    }
  },
  {
    "slug": "gov24-치매환자-조호물품-기저귀-지원",
    "title": "치매환자 조호물품(기저귀) 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "치매환자에게 연 한도 내의 조호물품 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "치매환자 조호물품(기저귀) 지원",
      "보건의료",
      "경기",
      "경기도 가평군",
      "상시",
      "일반",
      "전체",
      "치매환자에게",
      "연",
      "한도",
      "내의",
      "조호물품"
    ],
    "summary": "치매환자에게 연 한도 내의 조호물품 제공",
    "audience": "○ 치매환자에게 연 한도 내의 조호물품 제공",
    "benefits": [
      "치매환자에게 연 한도 내의 조호물품 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000101",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 치매환자에게 연 한도 내의 조호물품 제공",
      "benefit": "치매환자에게 연 한도 내의 조호물품 제공",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-가평군-장학생-선발-및-장학금-지원",
    "title": "가평군 장학생 선발 및 장학금 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "중·고교생 및 대학생에게 장학금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·청년",
    "targetGroup": "청년, 부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "가평군 장학생 선발 및 장학금 지원",
      "청년",
      "경기",
      "경기도 가평군",
      "확인필요",
      "부모/육아",
      "청소년",
      "임신·출산·육아",
      "중·고교생",
      "및",
      "대학생에게",
      "장학금"
    ],
    "summary": "중·고교생 및 대학생에게 장학금 지원",
    "audience": "○ 가평군의 우수한 인재양성을 위하여 가평군 장학기금을 재원으로 장학생 선발 지원\n - 지원금액(1, 2학기 50%씩 나누어 지급)\n · 중학생 : 600,000원\n · 고등학생 : 900,000원\n · 대학생 :최대 3,000,000원\n - 지급일 : 상반기분 5월, 하반기분 9월\n ※ 부득이한 사정이 있는 경우, 지급 시기 조정 가능",
    "benefits": [
      "중·고교생 및 대학생에게 장학금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 신청방법: 거주지 관할 읍면 행정복지센터에 방문하여 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000115",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 가평군의 우수한 인재양성을 위하여 가평군 장학기금을 재원으로 장학생 선발 지원\n - 지원금액(1, 2학기 50%씩 나누어 지급)\n · 중학생 : 600,000원\n · 고등학생 : 900,000원\n · 대학생 :최대 3,000,000원\n - 지급일 : 상반기분 5월, 하반기분 9월\n ※ 부득이한 사정이 있는 경우, 지급 시기 조정 가능",
      "benefit": "중·고교생 및 대학생에게 장학금 지원",
      "application": "○ 신청방법: 거주지 관할 읍면 행정복지센터에 방문하여 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-출산축하금-지원",
    "title": "출산축하금 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "출산부모에게 출산축하금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "출산축하금 지원",
      "복지",
      "경기",
      "경기도 가평군",
      "확인필요",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "출산부모에게",
      "출산축하금",
      "지원"
    ],
    "summary": "출산부모에게 출산축하금 지원",
    "audience": "○ 출생순위에 따른 출산축하금 지급(50%는 지역화폐로 지급)\n - 첫째아 100만원\n - 둘째아 400만원(200만원씩 2년 분할)\n - 셋째야 1,000만원(200만원씩 5년분할)\n - 넷째아 이상 2,000만원(200만원씩 10년분할)",
    "benefits": [
      "출산부모에게 출산축하금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000117",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000117",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 출생순위에 따른 출산축하금 지급(50%는 지역화폐로 지급)\n - 첫째아 100만원\n - 둘째아 400만원(200만원씩 2년 분할)\n - 셋째야 1,000만원(200만원씩 5년분할)\n - 넷째아 이상 2,000만원(200만원씩 10년분할)",
      "benefit": "출산부모에게 출산축하금 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-시설아동-하계수련비-지원",
    "title": "시설아동 하계수련비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "아동양육시설아동의 하계수련비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "시설아동 하계수련비 지원",
      "교육",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "아동양육시설아동의",
      "하계수련비",
      "지원"
    ],
    "summary": "아동양육시설아동의 하계수련비 지원",
    "audience": "○ 아동양육시설아동 하계수련비 지원\n - 1인 7만원, 체험활동 등",
    "benefits": [
      "아동양육시설아동의 하계수련비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 시설에서 관리",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000105",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 아동양육시설아동 하계수련비 지원\n - 1인 7만원, 체험활동 등",
      "benefit": "아동양육시설아동의 하계수련비 지원",
      "application": "○ 개인 신청절차 없음\n - 시설에서 관리",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-시설아동-교육자재비-지원",
    "title": "시설아동 교육자재비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "아동양육시설아동의 교육자재비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "시설아동 교육자재비 지원",
      "교육",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "아동양육시설아동의",
      "교육자재비",
      "지원"
    ],
    "summary": "아동양육시설아동의 교육자재비 지원",
    "audience": "○ 아동양육시설아동 교육자재비 지원\n - 1인 5만원, 취학아동 서적, 학용품비 구입",
    "benefits": [
      "아동양육시설아동의 교육자재비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 시설에서 관리",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000106",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000106",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 아동양육시설아동 교육자재비 지원\n - 1인 5만원, 취학아동 서적, 학용품비 구입",
      "benefit": "아동양육시설아동의 교육자재비 지원",
      "application": "○ 개인 신청절차 없음\n - 시설에서 관리",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-인삼생약산업-육성-지원",
    "title": "인삼생약산업 육성 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "오미자재배 농업인 등에게 농기계, 설비 등 농자재 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "인삼생약산업 육성 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "오미자재배",
      "농업인",
      "등에게",
      "농기계,",
      "설비"
    ],
    "summary": "오미자재배 농업인 등에게 농기계, 설비 등 농자재 구입비 지원",
    "audience": "○ 농기계, 설비 등 영농에 필요한 농자재 구입비 지원",
    "benefits": [
      "오미자재배 농업인 등에게 농기계, 설비 등 농자재 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000107",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000107",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 농기계, 설비 등 영농에 필요한 농자재 구입비 지원",
      "benefit": "오미자재배 농업인 등에게 농기계, 설비 등 농자재 구입비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-지역아동센터-등-급식-지원",
    "title": "지역아동센터 등 급식 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "지역아동센터에 급식비 보조금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "지역아동센터 등 급식 지원",
      "교육",
      "경북",
      "경상북도 문경시",
      "모집중",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "지역아동센터에",
      "급식비",
      "보조금",
      "지급"
    ],
    "summary": "지역아동센터에 급식비 보조금 지급",
    "audience": "○ 지역아동센터에 급식비 보조금 지급",
    "benefits": [
      "지역아동센터에 급식비 보조금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000108",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000108",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지역아동센터에 급식비 보조금 지급",
      "benefit": "지역아동센터에 급식비 보조금 지급",
      "application": "○ 개인 신청절차 없음",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-과수농가-지원",
    "title": "과수농가 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "과수재배 농업인 등에게 농업용 자재 구입비용 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "과수농가 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "과수재배",
      "농업인",
      "등에게",
      "농업용",
      "자재"
    ],
    "summary": "과수재배 농업인 등에게 농업용 자재 구입비용 일부 지원",
    "audience": "○ 문경시에 주소를 두고 농업경영체를 등록한 농업인, 농업법인, 생산자 단체 등에 과수재배에 필요한 농기계, 포장재 등 농업용 자재 구입비용 일부 지원",
    "benefits": [
      "과수재배 농업인 등에게 농업용 자재 구입비용 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000109",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000109",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 문경시에 주소를 두고 농업경영체를 등록한 농업인, 농업법인, 생산자 단체 등에 과수재배에 필요한 농기계, 포장재 등 농업용 자재 구입비용 일부 지원",
      "benefit": "과수재배 농업인 등에게 농업용 자재 구입비용 일부 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-농산물-유통기반-조성-지원",
    "title": "농산물 유통기반 조성 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "농업 경영체에 장기저장 처리제, 소형 선별기 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농산물 유통기반 조성 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "확인필요",
      "농어업인",
      "전체",
      "농업",
      "경영체에",
      "장기저장",
      "처리제,",
      "소형"
    ],
    "summary": "농업 경영체에 장기저장 처리제, 소형 선별기 등 지원",
    "audience": "○ 상품 장기저장 처리제 지원 : 관내 산지유통시설에 출하되는 문경사과의 장기저장에 따른 처리비용 일부지원\n\n○ 농가형 소형 선별기 지원 : 농가용 소형 사과선별기 지원\n\n○ 소규모 농식품 가공산업 육성지원 : 지역 농산물을 이용, 제조가공하는 농업경영체에 기계 및 관련 장비 지원",
    "benefits": [
      "농업 경영체에 장기저장 처리제, 소형 선별기 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 해당 시군 홈페이지 공고내용 확인 후 시군 유통관련 부서 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000110",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000110",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 상품 장기저장 처리제 지원 : 관내 산지유통시설에 출하되는 문경사과의 장기저장에 따른 처리비용 일부지원\n\n○ 농가형 소형 선별기 지원 : 농가용 소형 사과선별기 지원\n\n○ 소규모 농식품 가공산업 육성지원 : 지역 농산물을 이용, 제조가공하는 농업경영체에 기계 및 관련 장비 지원",
      "benefit": "농업 경영체에 장기저장 처리제, 소형 선별기 등 지원",
      "application": "○ 방문 신청\n - 시군구 : 해당 시군 홈페이지 공고내용 확인 후 시군 유통관련 부서 방문 신청",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-문경-약돌한우-브랜드-육성-지원",
    "title": "문경 약돌한우 브랜드 육성 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "문경약돌한우 브랜드 사육농가 등에 유통활성화, 출하장려금, 기타 첨가제 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "문경 약돌한우 브랜드 육성 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "모집중",
      "농어업인",
      "전체",
      "문경약돌한우",
      "브랜드",
      "사육농가",
      "등에",
      "유통활성화,"
    ],
    "summary": "문경약돌한우 브랜드 사육농가 등에 유통활성화, 출하장려금, 기타 첨가제 등 지원",
    "audience": "○ 약돌한우 고급육 출하 장려금 : 문경약돌한우 브랜드 농가에서 생산한 한우를 상표권 사용업체로 출하하여 1++AB, 1+AB등급을 받은 농가\n\n○ 약돌한우 입식장려금 : 문경약돌한우 브랜드 지정농가에서 생산된 송아지를 문경축협전자경매시장통해 구입할 경우 입식장려금 지급\n\n○ 문경약돌한우 사료첨가제 및 약돌분말 지원 : 약돌한우 사육간 사료첨가제 및 약돌분말가루 지원",
    "benefits": [
      "문경약돌한우 브랜드 사육농가 등에 유통활성화, 출하장려금, 기타 첨가제 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 해당 시군 홈페이지 공고내용 확인 후 읍면동 및 시군 유통관련 부서 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000111",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000111",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 약돌한우 고급육 출하 장려금 : 문경약돌한우 브랜드 농가에서 생산한 한우를 상표권 사용업체로 출하하여 1++AB, 1+AB등급을 받은 농가\n\n○ 약돌한우 입식장려금 : 문경약돌한우 브랜드 지정농가에서 생산된 송아지를 문경축협전자경매시장통해 구입할 경우 입식장려금 지급\n\n○ 문경약돌한우 사료첨가제 및 약돌분말 지원 : 약돌한우 사육간 사료첨가제 및 약돌분말가루 지원",
      "benefit": "문경약돌한우 브랜드 사육농가 등에 유통활성화, 출하장려금, 기타 첨가제 등 지원",
      "application": "○ 방문 신청\n - 시군구 : 해당 시군 홈페이지 공고내용 확인 후 읍면동 및 시군 유통관련 부서 방문 신청",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-신혼부부-주택자금-대출이자-지원",
    "title": "신혼부부 주택자금 대출이자 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "결혼 2년이내 부부에게 주택구입 또는 전세자금 대출이자 지원(100만원 한도)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거",
    "targetGroup": "신혼부부",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "신혼부부 주택자금 대출이자 지원",
      "주거",
      "경북",
      "경상북도 문경시",
      "상시",
      "신혼부부",
      "전체",
      "결혼",
      "2년이내",
      "부부에게",
      "주택구입",
      "또는"
    ],
    "summary": "결혼 2년이내 부부에게 주택구입 또는 전세자금 대출이자 지원(100만원 한도)",
    "audience": "○ 주택구입 또는 전세자금 대출이자 연 100만원 한도 지원",
    "benefits": [
      "결혼 2년이내 부부에게 주택구입 또는 전세자금 대출이자 지원(100만원 한도)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 구비서류 : 이자납입 증명서, 주민등록초본(부부 각 1부), 혼인관계증명서, 대출증명서, 지방세 세목별 과세증명서(부부 각 1부),가족관계증명서",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000112",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000112",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 주택구입 또는 전세자금 대출이자 연 100만원 한도 지원",
      "benefit": "결혼 2년이내 부부에게 주택구입 또는 전세자금 대출이자 지원(100만원 한도)",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 구비서류 : 이자납입 증명서, 주민등록초본(부부 각 1부), 혼인관계증명서, 대출증명서, 지방세 세목별 과세증명서(부부 각 1부),가족관계증명서",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-임산물-생산기반-지원",
    "title": "임산물 생산기반 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "각 임산물별 농가를 대상으로 원목, 배지, 묘목, 종자 등 구입 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임산물 생산기반 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "확인필요",
      "농어업인",
      "전체",
      "각",
      "임산물별",
      "농가를",
      "대상으로",
      "원목,"
    ],
    "summary": "각 임산물별 농가를 대상으로 원목, 배지, 묘목, 종자 등 구입 지원",
    "audience": "○ 표고 원목 구입비 지원\n - 지원내용 : 표고 원목 구입비 지원(2025년도 신목 구입자)\n - 지원기준\n ㆍ기준금액 : 원목(자가벌채 제외) 본당 5,000원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정 가능)\n ㆍ지 원 량 : 330㎡ 당 1,000본 \n\n○ 표고 톱밥배지 구입비 지원\n - 지원내용 : 표고 톱밥배지 구입비 지원\n - 지원기준\n ㆍ기준금액 : 접종배지 680원/kg, 갈변(접종·배양)배지 900원/kg\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정 가능)\n ㆍ지 원 량 : 원통형(10,000봉/330㎡), 봉형(6,000봉/330㎡), 사각(8,000봉/330㎡) \n ※ 국내산 배지 및 종자산업법에 따른 종자업 등록업체에서 구입한 표고 톱밥배지만 지원\n\n○ 호두 묘목 구입비 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 호두 묘목 구입비 지원\n - 지원기준\n - 지원단가\n 1본당 15,000원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능\n\n○ 산양삼 종자·종묘 구입비 지원\n - 대 상 지 : 전문기관(한국임업진흥원)에서 실시하는 생산적합성 조사에 합격한 토양\n - 지원내용 : 산양삼 종자·종묘 구입비 지원\n - 지원기준\n ㆍ대상품목 : 전문기관(한국임업진흥원)에서 실시하는 생산적합성 조사에 합격한 산양삼 종자 또는 종묘(4년생 이내)\n ㆍ지원단가 : 종자 1kg당 200,000원, 종묘 4년생 기준 본당 4,000원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정 가능)\n※ 종자산업법에 따른 종자업 등록업체에서 구입한 산양삼 종자 ·종묘만 지원\n\n○ 두릅단지조성 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 참두릅 묘목 구입비 지원\n - 지원기준\n ㆍ대상품목 : 참두릅 묘목\n ㆍ지원단가 : 1본당 3,000원 \n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능\n\n○ 음나무 묘목 구입비 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 음나무 묘목 구입비 지원\n - 지원기준\n ㆍ대상품목 : 음나무 묘목\n ㆍ지원단가 : 1본당 5,000원 \n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능\n\n○ 복분자 묘목 구입비 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 복분자 묘목 구입비 지원\n - 지원기준\n ㆍ대상품목 : 복분자 묘목\n ㆍ지원단가 : 1본당 700원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능",
    "benefits": [
      "각 임산물별 농가를 대상으로 원목, 배지, 묘목, 종자 등 구입 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 사업대상지 소재 관할 읍·면·동 행정복지센터(주민센터)에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000113",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000113",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 표고 원목 구입비 지원\n - 지원내용 : 표고 원목 구입비 지원(2025년도 신목 구입자)\n - 지원기준\n ㆍ기준금액 : 원목(자가벌채 제외) 본당 5,000원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정 가능)\n ㆍ지 원 량 : 330㎡ 당 1,000본 \n\n○ 표고 톱밥배지 구입비 지원\n - 지원내용 : 표고 톱밥배지 구입비 지원\n - 지원기준\n ㆍ기준금액 : 접종배지 680원/kg, 갈변(접종·배양)배지 900원/kg\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정 가능)\n ㆍ지 원 량 : 원통형(10,000봉/330㎡), 봉형(6,000봉/330㎡), 사각(8,000봉/330㎡) \n ※ 국내산 배지 및 종자산업법에 따른 종자업 등록업체에서 구입한 표고 톱밥배지만 지원\n\n○ 호두 묘목 구입비 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 호두 묘목 구입비 지원\n - 지원기준\n - 지원단가\n 1본당 15,000원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능\n\n○ 산양삼 종자·종묘 구입비 지원\n - 대 상 지 : 전문기관(한국임업진흥원)에서 실시하는 생산적합성 조사에 합격한 토양\n - 지원내용 : 산양삼 종자·종묘 구입비 지원\n - 지원기준\n ㆍ대상품목 : 전문기관(한국임업진흥원)에서 실시하는 생산적합성 조사에 합격한 산양삼 종자 또는 종묘(4년생 이내)\n ㆍ지원단가 : 종자 1kg당 200,000원, 종묘 4년생 기준 본당 4,000원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정 가능)\n※ 종자산업법에 따른 종자업 등록업체에서 구입한 산양삼 종자 ·종묘만 지원\n\n○ 두릅단지조성 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 참두릅 묘목 구입비 지원\n - 지원기준\n ㆍ대상품목 : 참두릅 묘목\n ㆍ지원단가 : 1본당 3,000원 \n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능\n\n○ 음나무 묘목 구입비 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 음나무 묘목 구입비 지원\n - 지원기준\n ㆍ대상품목 : 음나무 묘목\n ㆍ지원단가 : 1본당 5,000원 \n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능\n\n○ 복분자 묘목 구입비 지원\n - 대 상 지 : 관내 일원\n - 지원내용 : 복분자 묘목 구입비 지원\n - 지원기준\n ㆍ대상품목 : 복분자 묘목\n ㆍ지원단가 : 1본당 700원\n ㆍ지원비율 : 보조 50%, 자부담 50%(예산범위 내 조정가능)\n ※ 총 사업비 1,000천원 이상 신청 가능",
      "benefit": "각 임산물별 농가를 대상으로 원목, 배지, 묘목, 종자 등 구입 지원",
      "application": "○ 방문 신청\n - 사업대상지 소재 관할 읍·면·동 행정복지센터(주민센터)에 방문 신청",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-축산업-환경개선-관리",
    "title": "축산업 환경개선 관리",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "축산농가에 분뇨처리용 톱밥, 축산환경개선제 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축산업 환경개선 관리",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "분뇨처리용",
      "톱밥,",
      "축산환경개선제",
      "지원"
    ],
    "summary": "축산농가에 분뇨처리용 톱밥, 축산환경개선제 지원",
    "audience": "○ 축산분뇨 처리용 톱밥 지원 : 축사 내 깔짚 대용 축분처리용 수분조절제(톱밥, 왕겨 등) 구입비 지원\n\n○ 축산환경개선제 지원 : 축사악취제거를 목적으로 하는 사료첨가제 또는 살포용 제품 구입비 지원",
    "benefits": [
      "축산농가에 분뇨처리용 톱밥, 축산환경개선제 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 해당시군 축산부서 문의 및 신청 (홈페이지 공고내용 확인)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000114",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000114",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 축산분뇨 처리용 톱밥 지원 : 축사 내 깔짚 대용 축분처리용 수분조절제(톱밥, 왕겨 등) 구입비 지원\n\n○ 축산환경개선제 지원 : 축사악취제거를 목적으로 하는 사료첨가제 또는 살포용 제품 구입비 지원",
      "benefit": "축산농가에 분뇨처리용 톱밥, 축산환경개선제 지원",
      "application": "○ 방문 신청\n - 시군구 : 해당시군 축산부서 문의 및 신청 (홈페이지 공고내용 확인)",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-국가유공자-보훈명예수당",
    "title": "국가유공자 보훈명예수당",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "국가유공자를 위해 보훈명예수당 및 사망위로금 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "국가유공자 보훈명예수당",
      "복지",
      "경북",
      "경상북도 문경시",
      "상시",
      "일반",
      "전체",
      "국가유공자를",
      "위해",
      "보훈명예수당",
      "및",
      "사망위로금"
    ],
    "summary": "국가유공자를 위해 보훈명예수당 및 사망위로금 지급",
    "audience": "○ 지원대상 : 국가유공자 등 예우 및 지원에 관한 법률 제4조 제1호부터 제18호까지의 규정에 해당하는 국가유공자 및 그 유족으로 지급일 현재 문경시에 주소를 둔 사람\n\n○ 지원내용\n - 매월 15일 보훈명예수당 지급(월 15만원)\n - 국가유공자 사망위로금 지급(30만원) : 사망일 기준 1년 이내 신청 가능",
    "benefits": [
      "국가유공자를 위해 보훈명예수당 및 사망위로금 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 구비서류 : 신청서, 국가유공자증, 통장사본 등",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000115",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상 : 국가유공자 등 예우 및 지원에 관한 법률 제4조 제1호부터 제18호까지의 규정에 해당하는 국가유공자 및 그 유족으로 지급일 현재 문경시에 주소를 둔 사람\n\n○ 지원내용\n - 매월 15일 보훈명예수당 지급(월 15만원)\n - 국가유공자 사망위로금 지급(30만원) : 사망일 기준 1년 이내 신청 가능",
      "benefit": "국가유공자를 위해 보훈명예수당 및 사망위로금 지급",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 구비서류 : 신청서, 국가유공자증, 통장사본 등",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-어르신-목욕-및-이미용비-지원사업",
    "title": "어르신 목욕 및 이·미용비 지원사업",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "문경시 관내 거주 70세 이상 노인을 대상으로 목욕 및 이·미용비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "어르신 목욕 및 이·미용비 지원사업",
      "보건의료",
      "경북",
      "경상북도 문경시",
      "모집중",
      "어르신",
      "아동",
      "복지",
      "문경시",
      "관내",
      "거주",
      "70세"
    ],
    "summary": "문경시 관내 거주 70세 이상 노인을 대상으로 목욕 및 이·미용비 지원",
    "audience": "○ 지원인원 : 17,400여명\n\n○ 지원대상 : 70세 이상 노인(단, 노인의료복지시설 입소자 제외)\n\n○ 지원기준 : 1인 연간 6만원 \n\n○ 지원방법 : 전자바우처카드에 충전하여 지원",
    "benefits": [
      "문경시 관내 거주 70세 이상 노인을 대상으로 목욕 및 이·미용비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 별도의 신청없이 주소지 관할 읍·면·동 행정복지센터에서 대상자에 연1회 일괄 배부",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000116",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000116",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원인원 : 17,400여명\n\n○ 지원대상 : 70세 이상 노인(단, 노인의료복지시설 입소자 제외)\n\n○ 지원기준 : 1인 연간 6만원 \n\n○ 지원방법 : 전자바우처카드에 충전하여 지원",
      "benefit": "문경시 관내 거주 70세 이상 노인을 대상으로 목욕 및 이·미용비 지원",
      "application": "○ 별도의 신청없이 주소지 관할 읍·면·동 행정복지센터에서 대상자에 연1회 일괄 배부",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-시설아동-간식비-지원",
    "title": "시설아동 간식비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "아동양육시설아동을 위해 간식비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "시설아동 간식비 지원",
      "교육",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "아동양육시설아동을",
      "위해",
      "간식비",
      "지원"
    ],
    "summary": "아동양육시설아동을 위해 간식비 지원",
    "audience": "○ 아동양육시설아동 간식비 지원\n - 1일 1인 800원",
    "benefits": [
      "아동양육시설아동을 위해 간식비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 시설에서 관리",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000120",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000120",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 아동양육시설아동 간식비 지원\n - 1일 1인 800원",
      "benefit": "아동양육시설아동을 위해 간식비 지원",
      "application": "○ 개인 신청절차 없음\n - 시설에서 관리",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-셋째아-이상-출생아-건강보험료-지원",
    "title": "셋째아 이상 출생아 건강보험료 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "셋째 이상 출산가정에 보장성 건강보험료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "셋째아 이상 출생아 건강보험료 지원",
      "보건의료",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "셋째",
      "이상",
      "출산가정에",
      "보장성"
    ],
    "summary": "셋째 이상 출산가정에 보장성 건강보험료 지원",
    "audience": "○ 지원대상 : 신생아 출산일 기준 부 또는 모가 문경시에 주소를 둔 셋째아 이상 자녀(전입자 제외)\n\n○ 지원내용 : 세자녀 이상 보장성 건강보험료 5만원 이내(3년납/10년보장)",
    "benefits": [
      "셋째 이상 출산가정에 보장성 건강보험료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 온라인 신청\n - 정부24 : 출산 서비스 통합처리 신청 시 자동으로 신청됨\n\n○ 방문 신청\n - 행정복지센터 : 출산 서비스 통합처리 신청 시 자동으로 신청됨",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000121",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000121",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 지원대상 : 신생아 출산일 기준 부 또는 모가 문경시에 주소를 둔 셋째아 이상 자녀(전입자 제외)\n\n○ 지원내용 : 세자녀 이상 보장성 건강보험료 5만원 이내(3년납/10년보장)",
      "benefit": "셋째 이상 출산가정에 보장성 건강보험료 지원",
      "application": "○ 온라인 신청\n - 정부24 : 출산 서비스 통합처리 신청 시 자동으로 신청됨\n\n○ 방문 신청\n - 행정복지센터 : 출산 서비스 통합처리 신청 시 자동으로 신청됨",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-시설아동-부식비-및-김장비-지원",
    "title": "시설아동 부식비 및 김장비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "아동양육시설아동의 부식비 및 김장비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "시설아동 부식비 및 김장비 지원",
      "교육",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "아동양육시설아동의",
      "부식비",
      "및",
      "김장비"
    ],
    "summary": "아동양육시설아동의 부식비 및 김장비 지원",
    "audience": "○ 아동양육시설아동 부식비 및 김장비 지원\n - 1인 5만원",
    "benefits": [
      "아동양육시설아동의 부식비 및 김장비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 시설에서 관리",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000122",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000122",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 아동양육시설아동 부식비 및 김장비 지원\n - 1인 5만원",
      "benefit": "아동양육시설아동의 부식비 및 김장비 지원",
      "application": "○ 개인 신청절차 없음\n - 시설에서 관리",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-시설아동-건강검진비-지원",
    "title": "시설아동 건강검진비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "아동양육시설아동을 위해 건강검진비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "시설아동 건강검진비 지원",
      "보건의료",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "아동양육시설아동을",
      "위해",
      "건강검진비",
      "지원"
    ],
    "summary": "아동양육시설아동을 위해 건강검진비 지원",
    "audience": "○ 아동양육시설아동 건강검진비 지원\n - 1인 25,000원",
    "benefits": [
      "아동양육시설아동을 위해 건강검진비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 시설에서 관리",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000123",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000123",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 아동양육시설아동 건강검진비 지원\n - 1인 25,000원",
      "benefit": "아동양육시설아동을 위해 건강검진비 지원",
      "application": "○ 개인 신청절차 없음\n - 시설에서 관리",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-양식장첨단기자재공급-지원",
    "title": "양식장첨단기자재공급 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "양식어업 어가에 양식장 기자재 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양식장첨단기자재공급 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "모집중",
      "농어업인",
      "전체",
      "양식어업",
      "어가에",
      "양식장",
      "기자재",
      "구입비"
    ],
    "summary": "양식어업 어가에 양식장 기자재 구입비 지원",
    "audience": "○ 양식장첨단기자재 지원 : 내수면 양식장 첨단 기자재, 액화산소 등 구입비 지원",
    "benefits": [
      "양식어업 어가에 양식장 기자재 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 해당시군 축산부서 문의 및 신청 (홈페이지 공고내용 확인)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000124",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000124",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 양식장첨단기자재 지원 : 내수면 양식장 첨단 기자재, 액화산소 등 구입비 지원",
      "benefit": "양식어업 어가에 양식장 기자재 구입비 지원",
      "application": "○ 방문 신청\n - 시군구 : 해당시군 축산부서 문의 및 신청 (홈페이지 공고내용 확인)",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-시설아동-기능교육비-지원",
    "title": "시설아동 기능교육비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "아동양육시설아동의 기능교육비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "시설아동 기능교육비 지원",
      "교육",
      "경북",
      "경상북도 문경시",
      "상시",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "아동양육시설아동의",
      "기능교육비",
      "지원"
    ],
    "summary": "아동양육시설아동의 기능교육비 지원",
    "audience": "○ 아동양육시설아동 기능교육비 지원\n - 1인 50만원, 컴퓨터교육, 요리교육, 제빵교육 등",
    "benefits": [
      "아동양육시설아동의 기능교육비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 개인 신청절차 없음\n - 시설에서 관리",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000126",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000126",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 아동양육시설아동 기능교육비 지원\n - 1인 50만원, 컴퓨터교육, 요리교육, 제빵교육 등",
      "benefit": "아동양육시설아동의 기능교육비 지원",
      "application": "○ 개인 신청절차 없음\n - 시설에서 관리",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-오미자-사업-지원",
    "title": "오미자 사업 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "오미자 재배농가 등에 자재 구입비용 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "오미자 사업 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "오미자",
      "재배농가",
      "등에",
      "자재",
      "구입비용"
    ],
    "summary": "오미자 재배농가 등에 자재 구입비용 일부 지원",
    "audience": "○ 오미자 재배 농가, 작목반, 생산자 단체 등에 재배에 필요한 자재 구입비용 일부 지원",
    "benefits": [
      "오미자 재배농가 등에 자재 구입비용 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000129",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000129",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 오미자 재배 농가, 작목반, 생산자 단체 등에 재배에 필요한 자재 구입비용 일부 지원",
      "benefit": "오미자 재배농가 등에 자재 구입비용 일부 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-원예-특작-사업-지원",
    "title": "원예 특작 사업 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "채소특작 재배농가 등에 자재 구입비용 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "원예 특작 사업 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "채소특작",
      "재배농가",
      "등에",
      "자재",
      "구입비용"
    ],
    "summary": "채소특작 재배농가 등에 자재 구입비용 일부 지원",
    "audience": "○ 채소특작 재배농가, 작목반 등에 재배에 필요한 농업용 자재 구입비용 일부 지원",
    "benefits": [
      "채소특작 재배농가 등에 자재 구입비용 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000130",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000130",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 채소특작 재배농가, 작목반 등에 재배에 필요한 농업용 자재 구입비용 일부 지원",
      "benefit": "채소특작 재배농가 등에 자재 구입비용 일부 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-과수재배-농기계-자재-구입비용-지원",
    "title": "과수재배 농기계 자재 구입비용 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "과수재배농업인 등에게 농업용 자재 구입비용 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "과수재배 농기계 자재 구입비용 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "과수재배농업인",
      "등에게",
      "농업용",
      "자재",
      "구입비용"
    ],
    "summary": "과수재배농업인 등에게 농업용 자재 구입비용 일부 지원",
    "audience": "○ 문경시에 주소를 두고 농업경영체를 등록한 농업인, 농업법인, 생산자 단체 등에 과수재배에 필요한 농기계 등 농업용 자재 구입비용 일부 지원",
    "benefits": [
      "과수재배농업인 등에게 농업용 자재 구입비용 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000131",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000131",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 문경시에 주소를 두고 농업경영체를 등록한 농업인, 농업법인, 생산자 단체 등에 과수재배에 필요한 농기계 등 농업용 자재 구입비용 일부 지원",
      "benefit": "과수재배농업인 등에게 농업용 자재 구입비용 일부 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-당뇨-합병증-검진-쿠폰-지급",
    "title": "당뇨 합병증 검진 쿠폰 지급",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "당뇨환자에게 당뇨합병증 검진 쿠폰 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "당뇨 합병증 검진 쿠폰 지급",
      "보건의료",
      "경북",
      "경상북도 문경시",
      "상시",
      "일반",
      "전체",
      "당뇨환자에게",
      "당뇨합병증",
      "검진",
      "쿠폰",
      "지원"
    ],
    "summary": "당뇨환자에게 당뇨합병증 검진 쿠폰 지원",
    "audience": "○ 대상 : 당뇨병환자(약 복용 또는 치료중인 자)\n\n○ 기관 : 협력의료기관(삼성안과, 성모안과)\n\n○ 기간 : 2024년 2월 ~ 예산소진시까지\n\n○ 내용 : 안저검사(연 1회)",
    "benefits": [
      "당뇨환자에게 당뇨합병증 검진 쿠폰 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 보건소 방문하여 당뇨합병증 검진 쿠폰 발급",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000133",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000133",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 대상 : 당뇨병환자(약 복용 또는 치료중인 자)\n\n○ 기관 : 협력의료기관(삼성안과, 성모안과)\n\n○ 기간 : 2024년 2월 ~ 예산소진시까지\n\n○ 내용 : 안저검사(연 1회)",
      "benefit": "당뇨환자에게 당뇨합병증 검진 쿠폰 지원",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 보건소 방문하여 당뇨합병증 검진 쿠폰 발급",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-우수모돈-농가보급사업",
    "title": "우수모돈 농가보급사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "양돈농가에 모돈 도태실시 후 신규 후보돈 구입 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "우수모돈 농가보급사업",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "양돈농가에",
      "모돈",
      "도태실시",
      "후",
      "신규"
    ],
    "summary": "양돈농가에 모돈 도태실시 후 신규 후보돈 구입 지원",
    "audience": "생산능력이 부진한 모돈 도태실시 후 신규 후보돈 구입 시 지원",
    "benefits": [
      "양돈농가에 모돈 도태실시 후 신규 후보돈 구입 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 해당 시군 홈페이지 공고내용 확인 후 시군 유통관련 부서 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000134",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000134",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "생산능력이 부진한 모돈 도태실시 후 신규 후보돈 구입 시 지원",
      "benefit": "양돈농가에 모돈 도태실시 후 신규 후보돈 구입 지원",
      "application": "○ 방문 신청\n - 시군구 : 해당 시군 홈페이지 공고내용 확인 후 시군 유통관련 부서 방문 신청",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-원예-소득-작목-육성-지원",
    "title": "원예 소득 작목 육성 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "농업인 등에게 농자재 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "원예 소득 작목 육성 지원",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "상시",
      "농어업인",
      "전체",
      "농업인",
      "등에게",
      "농자재",
      "구입비",
      "지원"
    ],
    "summary": "농업인 등에게 농자재 구입비 지원",
    "audience": "○ 농기계, 설비 등 영농에 필요한 농자재 구입비 지원",
    "benefits": [
      "농업인 등에게 농자재 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000135",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000135",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 농기계, 설비 등 영농에 필요한 농자재 구입비 지원",
      "benefit": "농업인 등에게 농자재 구입비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 시청 농정과 문의 및 방문",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-농업-신기술-보급-시범사업",
    "title": "농업 신기술 보급 시범사업",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "지역 신소득원 발굴 및 현장애로기술 등 신기술을 보급을 위한 시범사업 추진",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인, 농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농업 신기술 보급 시범사업",
      "농림어업",
      "경북",
      "경상북도 문경시",
      "확인필요",
      "장애인",
      "농어업인",
      "전체",
      "복지",
      "지역",
      "신소득원",
      "발굴"
    ],
    "summary": "지역 신소득원 발굴 및 현장애로기술 등 신기술을 보급을 위한 시범사업 추진",
    "audience": "지역 신소득원 발굴 및 현장애로기술 등 신기술을 보급을 위한 시범사업 추진",
    "benefits": [
      "지역 신소득원 발굴 및 현장애로기술 등 신기술을 보급을 위한 시범사업 추진"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 신청 (문경시농업기술센터 및 각읍면동 농업인상담소)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000138",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000138",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "지역 신소득원 발굴 및 현장애로기술 등 신기술을 보급을 위한 시범사업 추진",
      "benefit": "지역 신소득원 발굴 및 현장애로기술 등 신기술을 보급을 위한 시범사업 추진",
      "application": "방문 신청 (문경시농업기술센터 및 각읍면동 농업인상담소)",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-문경시-시민민안전보험",
    "title": "문경시 시민민안전보험",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경상북도 문경시",
    "region": "경북",
    "amount": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "문경시 시민민안전보험",
      "복지",
      "경북",
      "경상북도 문경시",
      "상시",
      "어르신",
      "아동",
      "재난이나",
      "각종",
      "사고로",
      "피해",
      "발생"
    ],
    "summary": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
    "audience": "자연재해(일사병, 열사병, 저체온증 포함)로 사망한 경우(단, 15세 미만자 제외) 3000\n시민이 폭발, 화재, 붕괴, 산사태 사고로 상해 사망한 경우(만15세 미만자 제외) 2500\n시민이 폭발, 화재, 붕괴, 산사태 사고로 3~100%의 상해 후유장해가 발생한 경우 2500\n시민이 가스 사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우(15세 미만자 제외) 2000\n시민이 가스 사고에 의해 발생한 상해의 직접적인 결과로 3~100% 상해 후유장해가 발생한 경우 2000\n시민이 대중교통 이용 중 상해 사망한 경우(만15세미만자 제외) 3000\n시민이 대중교통 이용 중 3~10% 상해 후유장해가 발생한 경우 3000\n시민(만12세 이하)이 어린이보호구역으로 지정한 지역에서 교통상해를 입은 경우(1~5등급) 1000\n시민(만65세 이상)이 노인보호구역으로 지정한 지역 내에서 교통상해로 인한 부상시 부상등급에 따라 치료비 지급(1~5등급) 1000\n시민이 익사사고로 사망한 경우 2000\n시민이 농기게사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우 3000\n시민이 농기게사고에 의해 발생한 상해의 직접적인 결과로 3~100% 상해 후유장해가 발생한 경우 3000\n살인, 폭행, 강간, 강도 등 강력범죄에 의해 상해를 입었을 경우(1개월 초과 치료) 500\n시민이 형법 등에서 정하는 성폭력 범죄로 피해를 입은 경우 1000\n시민이 직무외 행위로 타인의 생명, 신체 또는 재산의 급박한 피해를 구제하다 신체상해를 입어 의사상자로 인정된 경우 10000\n시민이 공제기간 중에 사회재난(감염병 제외)으로 인하여 사망한 경우 1000\n개물림 사고에 의한 응급실 내원을 한 경우 50",
    "benefits": [
      "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000144",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/512000000144",
    "contact": "경상북도 문경시",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "자연재해(일사병, 열사병, 저체온증 포함)로 사망한 경우(단, 15세 미만자 제외) 3000\n시민이 폭발, 화재, 붕괴, 산사태 사고로 상해 사망한 경우(만15세 미만자 제외) 2500\n시민이 폭발, 화재, 붕괴, 산사태 사고로 3~100%의 상해 후유장해가 발생한 경우 2500\n시민이 가스 사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우(15세 미만자 제외) 2000\n시민이 가스 사고에 의해 발생한 상해의 직접적인 결과로 3~100% 상해 후유장해가 발생한 경우 2000\n시민이 대중교통 이용 중 상해 사망한 경우(만15세미만자 제외) 3000\n시민이 대중교통 이용 중 3~10% 상해 후유장해가 발생한 경우 3000\n시민(만12세 이하)이 어린이보호구역으로 지정한 지역에서 교통상해를 입은 경우(1~5등급) 1000\n시민(만65세 이상)이 노인보호구역으로 지정한 지역 내에서 교통상해로 인한 부상시 부상등급에 따라 치료비 지급(1~5등급) 1000\n시민이 익사사고로 사망한 경우 2000\n시민이 농기게사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우 3000\n시민이 농기게사고에 의해 발생한 상해의 직접적인 결과로 3~100% 상해 후유장해가 발생한 경우 3000\n살인, 폭행, 강간, 강도 등 강력범죄에 의해 상해를 입었을 경우(1개월 초과 치료) 500\n시민이 형법 등에서 정하는 성폭력 범죄로 피해를 입은 경우 1000\n시민이 직무외 행위로 타인의 생명, 신체 또는 재산의 급박한 피해를 구제하다 신체상해를 입어 의사상자로 인정된 경우 10000\n시민이 공제기간 중에 사회재난(감염병 제외)으로 인하여 사망한 경우 1000\n개물림 사고에 의한 응급실 내원을 한 경우 50",
      "benefit": "재난이나 각종 사고로 피해 발생 시, 보상을 위해 자치단체가 제공하는 손해배상 보험",
      "application": "방문신청",
      "contact": "경상북도 문경시"
    }
  },
  {
    "slug": "gov24-저소득-보훈회원-위문-설-추석",
    "title": "저소득 보훈회원 위문(설, 추석)",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "저소득 국가유공자에게 현금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득 보훈회원 위문(설, 추석)",
      "복지",
      "경기",
      "경기도 연천군",
      "확인필요",
      "일반",
      "전체",
      "저소득",
      "국가유공자에게",
      "현금",
      "지원"
    ],
    "summary": "저소득 국가유공자에게 현금 지원",
    "audience": "○ (설,추석) 저소득 보훈 단체 회원 현금 5만원 지원",
    "benefits": [
      "저소득 국가유공자에게 현금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 신청 불필요\n - 시군구 : 각 보훈단체 추천",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000102",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000102",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ (설,추석) 저소득 보훈 단체 회원 현금 5만원 지원",
      "benefit": "저소득 국가유공자에게 현금 지원",
      "application": "○ 신청 불필요\n - 시군구 : 각 보훈단체 추천",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-홀로사는노인-생필품-지원서비스",
    "title": "홀로사는노인 생필품 지원서비스",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "홀로사는 수급자 노인에게 상품권 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "홀로사는노인 생필품 지원서비스",
      "보건의료",
      "경기",
      "경기도 연천군",
      "확인필요",
      "어르신",
      "아동",
      "복지",
      "홀로사는",
      "수급자",
      "노인에게",
      "상품권"
    ],
    "summary": "홀로사는 수급자 노인에게 상품권 지급",
    "audience": "○ 설, 추석시 홀로 사는 노인 국민기초수급자 상품권 지급",
    "benefits": [
      "홀로사는 수급자 노인에게 상품권 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 별도의 신청 절차 없으며, 읍면동 맞춤형복지팀에서 지원대상자 직접발굴하여 지원",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000107",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000107",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 설, 추석시 홀로 사는 노인 국민기초수급자 상품권 지급",
      "benefit": "홀로사는 수급자 노인에게 상품권 지급",
      "application": "○ 별도의 신청 절차 없으며, 읍면동 맞춤형복지팀에서 지원대상자 직접발굴하여 지원",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-노인용보조보행차-본인부담비용지원",
    "title": "노인용보조보행차 본인부담비용지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "저소득보행불편자에게 보행보조기 구입비 50% 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "노인용보조보행차 본인부담비용지원",
      "보건의료",
      "경기",
      "경기도 연천군",
      "상시",
      "어르신",
      "아동",
      "복지",
      "저소득보행불편자에게",
      "보행보조기",
      "구입비",
      "50%"
    ],
    "summary": "저소득보행불편자에게 보행보조기 구입비 50% 지원",
    "audience": "○ 보행보조기 구입시 50% 지원(15만원 이내)",
    "benefits": [
      "저소득보행불편자에게 보행보조기 구입비 50% 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000108",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000108",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 보행보조기 구입시 50% 지원(15만원 이내)",
      "benefit": "저소득보행불편자에게 보행보조기 구입비 50% 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-임산부-산전검사-신혼부부검진",
    "title": "임산부 산전검사(신혼부부검진)",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "신혼부부 임신 전 검사 및 임산부 산전검사 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·주거",
    "targetGroup": "신혼부부, 부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임산부 산전검사(신혼부부검진)",
      "보건의료",
      "경기",
      "경기도 연천군",
      "상시",
      "신혼부부",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "주거",
      "임신",
      "전"
    ],
    "summary": "신혼부부 임신 전 검사 및 임산부 산전검사 등 지원",
    "audience": "○ 임산부산전검사(풍진,기형아쿼드, 빈혈)\n\n○ 예비부부검진(여 6종:B형간염항체,빈혈, 혈당,풍진, 매독,에이즈/ 남 3종:B형간염항체,매독,에이즈 )",
    "benefits": [
      "신혼부부 임신 전 검사 및 임산부 산전검사 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 임산부등록시 서류지참\n - 구비서류 : 임신확인서, 등본, 청첩장",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000117",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000117",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 임산부산전검사(풍진,기형아쿼드, 빈혈)\n\n○ 예비부부검진(여 6종:B형간염항체,빈혈, 혈당,풍진, 매독,에이즈/ 남 3종:B형간염항체,매독,에이즈 )",
      "benefit": "신혼부부 임신 전 검사 및 임산부 산전검사 등 지원",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 임산부등록시 서류지참\n - 구비서류 : 임신확인서, 등본, 청첩장",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-장애인-보조기구-수리비용-지원",
    "title": "장애인 보조기구 수리비용 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "수급자 또는 차상위계층 장애인에게 보조기구 수리비용 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인 보조기구 수리비용 지원",
      "보건의료",
      "경기",
      "경기도 연천군",
      "상시",
      "장애인",
      "전체",
      "복지",
      "수급자",
      "또는",
      "차상위계층",
      "장애인에게"
    ],
    "summary": "수급자 또는 차상위계층 장애인에게 보조기구 수리비용 지원",
    "audience": "○ 「국민기초생활보장법」에 따른 수급자 및 「의료급여법」에 따른 수급자에 해당하는 장애인에 대한 수리비용 : 연간 20만원 이내 \n\n○ 「국민기초생활보장법」에 따른 차상위계층 장애인에 대한 수리비용 : 연간 10만원 이내(수리비용의 2분의1)",
    "benefits": [
      "수급자 또는 차상위계층 장애인에게 보조기구 수리비용 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문\n\n○ 연천장애인수리지원센터\n -경기도 연천군 전곡읍 전곡로 13",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000119",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000119",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 「국민기초생활보장법」에 따른 수급자 및 「의료급여법」에 따른 수급자에 해당하는 장애인에 대한 수리비용 : 연간 20만원 이내 \n\n○ 「국민기초생활보장법」에 따른 차상위계층 장애인에 대한 수리비용 : 연간 10만원 이내(수리비용의 2분의1)",
      "benefit": "수급자 또는 차상위계층 장애인에게 보조기구 수리비용 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문\n\n○ 연천장애인수리지원센터\n -경기도 연천군 전곡읍 전곡로 13",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-장수수당-지급",
    "title": "장수수당 지급",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "장수수당 : 만 80세이상 연천군 거주자 중 신청자에 한하여 월 2만원 지급",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장수수당 지급",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "일반",
      "아동",
      "전체",
      "장수수당",
      ":",
      "만",
      "80세이상"
    ],
    "summary": "장수수당 : 만 80세이상 연천군 거주자 중 신청자에 한하여 월 2만원 지급",
    "audience": "장수수당 : 만 80세이상 연천군 거주자 중 신청자에 한하여 월 2만원 지급",
    "benefits": [
      "장수수당 : 만 80세이상 연천군 거주자 중 신청자에 한하여 월 2만원 지급"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 신청방법: 방문(주소지 읍면동 행정복지센터)\n○ 신청시기: 상시\n○ 지급시기: 신청자가 주민등록상 만80세가 되는 날이 속하는 달부터",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000426",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000426",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "장수수당 : 만 80세이상 연천군 거주자 중 신청자에 한하여 월 2만원 지급",
      "benefit": "장수수당 : 만 80세이상 연천군 거주자 중 신청자에 한하여 월 2만원 지급",
      "application": "○ 신청방법: 방문(주소지 읍면동 행정복지센터)\n○ 신청시기: 상시\n○ 지급시기: 신청자가 주민등록상 만80세가 되는 날이 속하는 달부터",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-외국인여성-출산가사-돌보미-지원",
    "title": "외국인여성 출산가사 돌보미 지원",
    "category": "문화생활",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "외국인여성 출산가사 돌보미 지원",
      "문화생활",
      "경기",
      "경기도 연천군",
      "확인필요",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "관내",
      "거주하는",
      "외국인주민(다문화가정)으로",
      "자녀를"
    ],
    "summary": "관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원",
    "audience": "관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원",
    "benefits": [
      "관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "출생일로부터 180일 이내 부 또는 모가 거주지 읍·면 사무소에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000428",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000428",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원",
      "benefit": "관내 거주하는 외국인주민(다문화가정)으로 자녀를 출생한 자에게 출생아 1인당 60만원 지원",
      "application": "출생일로부터 180일 이내 부 또는 모가 거주지 읍·면 사무소에 방문 신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-연천군-군민안전보험",
    "title": "연천군 군민안전보험",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "연천군 군민안전보험",
      "주거",
      "경기",
      "경기도 연천군",
      "상시",
      "어르신",
      "아동",
      "복지",
      "재난이나",
      "그밖의",
      "각종",
      "사고로"
    ],
    "summary": "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상",
    "audience": "자연재해(열사병, 일사병, 저체온증 포함)로 인하여 사망한 경우(질병제외) 2000\n폭발·화재·붕괴사태(땅꺼짐 포함) 사고로 상해 사망한 경우 2000\n상해의 직접결과로써 화상분류표에서 정한 화상(심재성 2도 이상)을 입고 그 치료를 목적으로 수술을 받은 경우 100\n폭발·화재·붕괴사태(땅꺼짐 포함) 사고로 상해 후유장해가 발생한 경우 2000\n대중교통 이용 중 상해 사망한 경우 2000\n대중교통 이용 중 상해 후유장해가 발생한 경우 2000\n전세버스 이용 중 상해 사망한 경우 2000\n전세버스 이용 중 상해 후유장해가 발생한 경우 2000\n만12세 이하인 자가 스쿨존 교통사고로 인해 부상시 부상등급에 따라 치료비 지급(부상등급1~14등급) 2000\n만65세 이상인 자가 노인보호구역으로 지정한 지역 내에서 교통사고로 인해 부상시 부상등급에 따라 치료비 지급(부상등급1~14등급) 2000\n뺑소니사고 또는 무보험자동차에 의한 사고로 사망한 경우 2000\n뺑소니사고 또는 무보험자동차에 의한 사고로 상해 후유장해가 발생한 경우 2000\n급격하고도 우연한 익사사고로 인해 상해의 직접결과로써 사망한 경우(질병 제외) 1000\n농기계사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우 2000\n농기계사고에 의해 발생한 상해의 직접적인 결과로 상해 후유장해가 발생한 경우 2000\n강도에 의해 발생한 사고의 직접적인 결과로 사망한 경우 2000\n강도에 의해 발생한 사고의 직접적인 결과로 상해 후유장해가 발생한 경우 2000\n사회재난(감염병 제외)으로 인하여 사망한 경우 1000\n국내에서 발생한 개물림 사고의 직접결과로써 응급실에 내원하여 진료를 받은 경우 50\n자연재난(열사병, 일사병, 저체온증 포함)로 발생한 상해의 직접결과로써 장해상태가 되었을 때 2000\n사회재난(감염병 제외)으로 발생한 상해의 직접결과로써 장해상태가 되었을 때 2000\n국내에서 발생한 개물림, 개부딪힘 사고로 진단받은 경우 10\n직무 외 행위로 타인의 생명, 신체 또는 재산의 급박한 피해를 구제하다가 신체 상해를 입어 의사상자로 인정된 경우 1000\n개인형 이동장치 사고로 입은 상해의 직접결과로써 사망한 경우(질병 제외) 1,000\n개인형 이동장치 사고로 입은 상해의 직접결과로써 장해상태가 되었을 때 1,000",
    "benefits": [
      "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "콜센터 전화 문의 후 우편, 방문 등 접수",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000434",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000434",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "자연재해(열사병, 일사병, 저체온증 포함)로 인하여 사망한 경우(질병제외) 2000\n폭발·화재·붕괴사태(땅꺼짐 포함) 사고로 상해 사망한 경우 2000\n상해의 직접결과로써 화상분류표에서 정한 화상(심재성 2도 이상)을 입고 그 치료를 목적으로 수술을 받은 경우 100\n폭발·화재·붕괴사태(땅꺼짐 포함) 사고로 상해 후유장해가 발생한 경우 2000\n대중교통 이용 중 상해 사망한 경우 2000\n대중교통 이용 중 상해 후유장해가 발생한 경우 2000\n전세버스 이용 중 상해 사망한 경우 2000\n전세버스 이용 중 상해 후유장해가 발생한 경우 2000\n만12세 이하인 자가 스쿨존 교통사고로 인해 부상시 부상등급에 따라 치료비 지급(부상등급1~14등급) 2000\n만65세 이상인 자가 노인보호구역으로 지정한 지역 내에서 교통사고로 인해 부상시 부상등급에 따라 치료비 지급(부상등급1~14등급) 2000\n뺑소니사고 또는 무보험자동차에 의한 사고로 사망한 경우 2000\n뺑소니사고 또는 무보험자동차에 의한 사고로 상해 후유장해가 발생한 경우 2000\n급격하고도 우연한 익사사고로 인해 상해의 직접결과로써 사망한 경우(질병 제외) 1000\n농기계사고에 의해 발생한 상해의 직접적인 결과로 사망한 경우 2000\n농기계사고에 의해 발생한 상해의 직접적인 결과로 상해 후유장해가 발생한 경우 2000\n강도에 의해 발생한 사고의 직접적인 결과로 사망한 경우 2000\n강도에 의해 발생한 사고의 직접적인 결과로 상해 후유장해가 발생한 경우 2000\n사회재난(감염병 제외)으로 인하여 사망한 경우 1000\n국내에서 발생한 개물림 사고의 직접결과로써 응급실에 내원하여 진료를 받은 경우 50\n자연재난(열사병, 일사병, 저체온증 포함)로 발생한 상해의 직접결과로써 장해상태가 되었을 때 2000\n사회재난(감염병 제외)으로 발생한 상해의 직접결과로써 장해상태가 되었을 때 2000\n국내에서 발생한 개물림, 개부딪힘 사고로 진단받은 경우 10\n직무 외 행위로 타인의 생명, 신체 또는 재산의 급박한 피해를 구제하다가 신체 상해를 입어 의사상자로 인정된 경우 1000\n개인형 이동장치 사고로 입은 상해의 직접결과로써 사망한 경우(질병 제외) 1,000\n개인형 이동장치 사고로 입은 상해의 직접결과로써 장해상태가 되었을 때 1,000",
      "benefit": "재난이나 그밖의 각종 사고로 피해가 발생한 경우 그 피해를 보상",
      "application": "콜센터 전화 문의 후 우편, 방문 등 접수",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-신생아-출산용품-지원",
    "title": "신생아 출산용품 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군 관내 출생아에게 신생아 출산용품을 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "신생아 출산용품 지원",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "연천군",
      "관내",
      "출생아에게",
      "신생아"
    ],
    "summary": "연천군 관내 출생아에게 신생아 출산용품을 지원",
    "audience": "○ 신생아 출산용품 지원",
    "benefits": [
      "연천군 관내 출생아에게 신생아 출산용품을 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○방문신청\n-보건소: 관할 보건소 방문\n-구비서류: 주민등록 등본(출생아가 등록된 등본)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000436",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000436",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 신생아 출산용품 지원",
      "benefit": "연천군 관내 출생아에게 신생아 출산용품을 지원",
      "application": "○방문신청\n-보건소: 관할 보건소 방문\n-구비서류: 주민등록 등본(출생아가 등록된 등본)",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-유축기-대여-서비스",
    "title": "유축기 대여 서비스",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "모유수유를 원하는 가정에 유축기를 대여",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "유축기 대여 서비스",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "모유수유를",
      "원하는",
      "가정에",
      "유축기를"
    ],
    "summary": "모유수유를 원하는 가정에 유축기를 대여",
    "audience": "○ 유축기 대여 서비스",
    "benefits": [
      "모유수유를 원하는 가정에 유축기를 대여"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 구비서류 : 등본, 출생증명서(출생아가 등본에 미등록된 경우 필요한 추가서류)\n※관내 임산부 등록된 가정은 제출서류 생략 가능",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000437",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000437",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 유축기 대여 서비스",
      "benefit": "모유수유를 원하는 가정에 유축기를 대여",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 구비서류 : 등본, 출생증명서(출생아가 등본에 미등록된 경우 필요한 추가서류)\n※관내 임산부 등록된 가정은 제출서류 생략 가능",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-임산부-등록-지원",
    "title": "임산부 등록 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "관내 임산부에게 튼살크림 및 영양제 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임산부 등록 지원",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "관내",
      "임산부에게",
      "튼살크림",
      "및"
    ],
    "summary": "관내 임산부에게 튼살크림 및 영양제 지원",
    "audience": "○임산부 등록사업\n-튼살크림 지원\n-영양제 지원(철분, 엽산)",
    "benefits": [
      "관내 임산부에게 튼살크림 및 영양제 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 임산부등록시 서류지참\n - 구비서류 : 임신확인서, 등본, 신분증",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000438",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000438",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○임산부 등록사업\n-튼살크림 지원\n-영양제 지원(철분, 엽산)",
      "benefit": "관내 임산부에게 튼살크림 및 영양제 지원",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 임산부등록시 서류지참\n - 구비서류 : 임신확인서, 등본, 신분증",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-100세-이상-장수어르신-생필품-지원",
    "title": "100세 이상 장수어르신 생필품 지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "연천군에 거주하는 만 100세 이상 장수노인에게 연 1회 생필품 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "100세 이상 장수어르신 생필품 지원",
      "복지",
      "경기",
      "경기도 연천군",
      "상시",
      "어르신",
      "아동",
      "연천군에",
      "거주하는",
      "만",
      "100세",
      "이상"
    ],
    "summary": "연천군에 거주하는 만 100세 이상 장수노인에게 연 1회 생필품 지원",
    "audience": "=연천군에 거주하는 만 100세 이상 장수노인에게 연 1회 10만원 상당의 생필품 지원",
    "benefits": [
      "연천군에 거주하는 만 100세 이상 장수노인에게 연 1회 생필품 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "해당 서비스는 신청없이 자격대상자에게 자동적으로 제공됩니다.",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000439",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000439",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "=연천군에 거주하는 만 100세 이상 장수노인에게 연 1회 10만원 상당의 생필품 지원",
      "benefit": "연천군에 거주하는 만 100세 이상 장수노인에게 연 1회 생필품 지원",
      "application": "해당 서비스는 신청없이 자격대상자에게 자동적으로 제공됩니다.",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-농작물-병해충-방제약제-지원-대상작물-벼-콩-배추무-과수",
    "title": "농작물 병해충 방제약제 지원(대상작물: 벼, 콩, 배추·무, 과수)",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "방제약제 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "농작물 병해충 방제약제 지원(대상작물: 벼, 콩, 배추·무, 과수)",
      "농림어업",
      "경기",
      "경기도 연천군",
      "확인필요",
      "농어업인",
      "전체",
      "방제약제",
      "지원"
    ],
    "summary": "방제약제 지원",
    "audience": "○ 벼 병해충 방제약제 지원\n○ 콩 노린재 방제약제 지원\n○ 무·배추 뿌리혹병 방제약제 지원\n○ 과수 돌발해충(미국선녀벌레 등)방제약제 지원\n○ 사과·배 과수화상병 방제약제 지원",
    "benefits": [
      "방제약제 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관할 읍면 행정복지센터에 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000443",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000443",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 벼 병해충 방제약제 지원\n○ 콩 노린재 방제약제 지원\n○ 무·배추 뿌리혹병 방제약제 지원\n○ 과수 돌발해충(미국선녀벌레 등)방제약제 지원\n○ 사과·배 과수화상병 방제약제 지원",
      "benefit": "방제약제 지원",
      "application": "관할 읍면 행정복지센터에 신청",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-연천군민-65세-이상-및-장애인-진료비-감면",
    "title": "연천군민 65세 이상 및 장애인 진료비 감면",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "65세 이상 노인 및 장애정도가 심한 장애인을 위한 진료비 (본인부담금 중 1,500원)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "어르신, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "연천군민 65세 이상 및 장애인 진료비 감면",
      "보건의료",
      "경기",
      "경기도 연천군",
      "상시",
      "어르신",
      "장애인",
      "아동",
      "복지",
      "65세",
      "이상",
      "노인"
    ],
    "summary": "65세 이상 노인 및 장애정도가 심한 장애인을 위한 진료비 (본인부담금 중 1,500원)",
    "audience": "연천군보건의료원 및 보건지소·진료소 내원 환자로서 진료 당시 연천군 관내에 주민등록상 주소를 둔 65세 이상 노인 및 장애정도가 심한 장애인을 위한 진료비 (본인부담금 중 1,500원) 감면",
    "benefits": [
      "65세 이상 노인 및 장애정도가 심한 장애인을 위한 진료비 (본인부담금 중 1,500원)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n-주소를 확인할 수 있는 관련 증명서 지참",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000446",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000446",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "연천군보건의료원 및 보건지소·진료소 내원 환자로서 진료 당시 연천군 관내에 주민등록상 주소를 둔 65세 이상 노인 및 장애정도가 심한 장애인을 위한 진료비 (본인부담금 중 1,500원) 감면",
      "benefit": "65세 이상 노인 및 장애정도가 심한 장애인을 위한 진료비 (본인부담금 중 1,500원)",
      "application": "○ 방문 신청\n-주소를 확인할 수 있는 관련 증명서 지참",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-국공립-어린이집-시설개선공사",
    "title": "국공립 어린이집 시설개선공사",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 연천군",
    "region": "경기",
    "amount": "국공립어린이집 시설개선 공사(개보수)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "국공립 어린이집 시설개선공사",
      "교육",
      "경기",
      "경기도 연천군",
      "확인필요",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "국공립어린이집",
      "시설개선",
      "공사(개보수)"
    ],
    "summary": "국공립어린이집 시설개선 공사(개보수)",
    "audience": "국공립 어린이집 시설개선 공사",
    "benefits": [
      "국공립어린이집 시설개선 공사(개보수)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "사회복지과 방문)\n연천군 관내 국공립어린이집 개보수 신청 (구비서류: 개보수사업비 요청서, 견적서, 어린이집사업자등록증 등)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000457",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/414000000457",
    "contact": "경기도 연천군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "국공립 어린이집 시설개선 공사",
      "benefit": "국공립어린이집 시설개선 공사(개보수)",
      "application": "사회복지과 방문)\n연천군 관내 국공립어린이집 개보수 신청 (구비서류: 개보수사업비 요청서, 견적서, 어린이집사업자등록증 등)",
      "contact": "경기도 연천군"
    }
  },
  {
    "slug": "gov24-장애인-스포츠강좌이용권-지원-사업",
    "title": "장애인 스포츠강좌이용권 지원 사업",
    "category": "문화생활",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "○ 장애인 스포츠강좌이용권 지원 사업 - 1인당 매월 9만5천원 범위 내 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "장애인 스포츠강좌이용권 지원 사업",
      "문화생활",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "장애인",
      "아동",
      "청년",
      "복지",
      "○",
      "스포츠강좌이용권",
      "지원"
    ],
    "summary": "○ 장애인 스포츠강좌이용권 지원 사업 - 1인당 매월 9만5천원 범위 내 지원",
    "audience": "○ 장애인 스포츠강좌이용권 지원 사업\n - 1인당 매월 9만5천원 범위 내 스포츠강좌 수강료 지원",
    "benefits": [
      "○ 장애인 스포츠강좌이용권 지원 사업 - 1인당 매월 9만5천원 범위 내 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 온라인 신청, 방문 신청\n○ 온라인 신청(https://svoucher.kspo.or.kr/main.do)\n○ 온라인 신청기간 도과 시 방문 신청(구청 또는 동 주민센터)\n\n온라인: https://svoucher.kspo.or.kr/main.do",
    "officialUrl": "https://svoucher.kspo.or.kr/main.do",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000126",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 장애인 스포츠강좌이용권 지원 사업\n - 1인당 매월 9만5천원 범위 내 스포츠강좌 수강료 지원",
      "benefit": "○ 장애인 스포츠강좌이용권 지원 사업 - 1인당 매월 9만5천원 범위 내 지원",
      "application": "○ 온라인 신청, 방문 신청\n○ 온라인 신청(https://svoucher.kspo.or.kr/main.do)\n○ 온라인 신청기간 도과 시 방문 신청(구청 또는 동 주민센터)\n\n온라인: https://svoucher.kspo.or.kr/main.do",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-취약계층-반려동물-의료비-지원",
    "title": "취약계층 반려동물 의료비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "관내 수급자, 차상위계층, 한부모가족 반려동물 의료비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "취약계층 반려동물 의료비 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "일반",
      "전체",
      "복지",
      "관내",
      "수급자,",
      "차상위계층,",
      "한부모가족"
    ],
    "summary": "관내 수급자, 차상위계층, 한부모가족 반려동물 의료비 지원",
    "audience": "지원대상 : 관내 주민등록을 두고 개와 고양이를 기르는 기초생활수급자, 차상위계층 및 한부모가족(가구당 2마리까지 신청 가능)\n\n사업기간 : ~ 예산소진시까지\n\n신청방법 : 동물등록자 본인이 반려동물과 함께 준비서류를 준비하여 관내 지정 동물병원에 방문하여 신청\n *준비서류 : 신분증, 취약계층 증빙서류(수급자 증명서, 차상위계층, 한부모가족 확인서)-3개월이내 발급/ 반려견,반려묘의 경우 동물등록증\n\n지원내용\n \n 1. 필수진료 : 반려동물 필수 동물의료지원(정해진 진료 항목만 지원가능)\n - 기초건강검진, 필수예방접종, 심장사상충 예방약\n - 마리당 20만원 이내 지원, 보호자 1만원 부담\n 2. 선택진료 : 필수진료 후 추가 진료 요청시 지원\n - 기초검진과정 중 발견된 증상, 질병에 대해 치료 또는 중성화 수술\n - 진료 후 치료가 필요한 진료 항목만을 지원하며, 미용, 심장사상충 예방약, 영양제 등 단순 처방은 제외\n - 마리당 20만원 이내 지원(초과하는 진료비는 보호자 부담)",
    "benefits": [
      "관내 수급자, 차상위계층, 한부모가족 반려동물 의료비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "본인이 반려동물과 함께 준비서류를 준비하여 관내 지정 동물병원에 방문하여 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000130",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000130",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "지원대상 : 관내 주민등록을 두고 개와 고양이를 기르는 기초생활수급자, 차상위계층 및 한부모가족(가구당 2마리까지 신청 가능)\n\n사업기간 : ~ 예산소진시까지\n\n신청방법 : 동물등록자 본인이 반려동물과 함께 준비서류를 준비하여 관내 지정 동물병원에 방문하여 신청\n *준비서류 : 신분증, 취약계층 증빙서류(수급자 증명서, 차상위계층, 한부모가족 확인서)-3개월이내 발급/ 반려견,반려묘의 경우 동물등록증\n\n지원내용\n \n 1. 필수진료 : 반려동물 필수 동물의료지원(정해진 진료 항목만 지원가능)\n - 기초건강검진, 필수예방접종, 심장사상충 예방약\n - 마리당 20만원 이내 지원, 보호자 1만원 부담\n 2. 선택진료 : 필수진료 후 추가 진료 요청시 지원\n - 기초검진과정 중 발견된 증상, 질병에 대해 치료 또는 중성화 수술\n - 진료 후 치료가 필요한 진료 항목만을 지원하며, 미용, 심장사상충 예방약, 영양제 등 단순 처방은 제외\n - 마리당 20만원 이내 지원(초과하는 진료비는 보호자 부담)",
      "benefit": "관내 수급자, 차상위계층, 한부모가족 반려동물 의료비 지원",
      "application": "본인이 반려동물과 함께 준비서류를 준비하여 관내 지정 동물병원에 방문하여 신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-유기동물-입양비-지원",
    "title": "동대문구 유기동물 입양비 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "관내 유실,유기동물을 반려 목적의 입양 후 소요된 소유자 부담 비용 지원/1마리당 25만원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 유기동물 입양비 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "관내",
      "유실,유기동물을",
      "반려",
      "목적의",
      "입양"
    ],
    "summary": "관내 유실,유기동물을 반려 목적의 입양 후 소요된 소유자 부담 비용 지원/1마리당 25만원",
    "audience": "1. 지원대상 : 우리 구 보호중인 유기동물을 반려 목적으로 입양하려는 자로써 동물등록 완료 입양자\n - 유기돔물 입양 후 6개월 이내 신청 건에 한하여 지급\n2. 신청방법 : 입양자 본인이 유기동물 입양관련 비용 지출 후 서류 준비하여 신청(방문, 이메일) 검토 후 지급\n - 준비서류 : 입양비 신청서, 입양자 신분증, 입양확인서 사본, 등물등록증 사본, 입양비 지출 관련 증빙서류(지출영수증, 병원진료내역서, 기타 입양관련 지출내역 등)\n 입양자 본인명의 통장사본\n3. 지원내용 : 질병질단비, 치료비, 예방접종, 중성화수술비, 내장형 동물 등록비, 미용비, 펫보험 가입비(신청일 기준 유효한 것) \n 중 입양 시 지출한 비용 중 마리당 최대 25 만원까지 지원",
    "benefits": [
      "관내 유실,유기동물을 반려 목적의 입양 후 소요된 소유자 부담 비용 지원/1마리당 25만원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "입양자가 유기동물 입양시 관련 비용 지출 후 신청 준비서류 준비하여 방문 혹은 이메일로 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000132",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000132",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "1. 지원대상 : 우리 구 보호중인 유기동물을 반려 목적으로 입양하려는 자로써 동물등록 완료 입양자\n - 유기돔물 입양 후 6개월 이내 신청 건에 한하여 지급\n2. 신청방법 : 입양자 본인이 유기동물 입양관련 비용 지출 후 서류 준비하여 신청(방문, 이메일) 검토 후 지급\n - 준비서류 : 입양비 신청서, 입양자 신분증, 입양확인서 사본, 등물등록증 사본, 입양비 지출 관련 증빙서류(지출영수증, 병원진료내역서, 기타 입양관련 지출내역 등)\n 입양자 본인명의 통장사본\n3. 지원내용 : 질병질단비, 치료비, 예방접종, 중성화수술비, 내장형 동물 등록비, 미용비, 펫보험 가입비(신청일 기준 유효한 것) \n 중 입양 시 지출한 비용 중 마리당 최대 25 만원까지 지원",
      "benefit": "관내 유실,유기동물을 반려 목적의 입양 후 소요된 소유자 부담 비용 지원/1마리당 25만원",
      "application": "입양자가 유기동물 입양시 관련 비용 지출 후 신청 준비서류 준비하여 방문 혹은 이메일로 신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구형-산모신생아-건강관리-본인부담금-지원-사업",
    "title": "동대문구형 산모신생아 건강관리 본인부담금 지원 사업",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "산모신생아 건강관리 서비스 본인부담금의 90%를 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구형 산모신생아 건강관리 본인부담금 지원 사업",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "부모/육아",
      "장애인",
      "전체",
      "임신·출산·육아",
      "복지",
      "산모신생아",
      "건강관리"
    ],
    "summary": "산모신생아 건강관리 서비스 본인부담금의 90%를 지원",
    "audience": "○ 동대문구 취약계층 출산가정에 산모신생아 건강관리 서비스 본인부담금 지원\n- 산모신생아 건강관리 서비스 본인부담금의 90% 지원",
    "benefits": [
      "산모신생아 건강관리 서비스 본인부담금의 90%를 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 산모신생아 건강관리 서비스 종료 후 3개월이내에 보건소에 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000136",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000136",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 동대문구 취약계층 출산가정에 산모신생아 건강관리 서비스 본인부담금 지원\n- 산모신생아 건강관리 서비스 본인부담금의 90% 지원",
      "benefit": "산모신생아 건강관리 서비스 본인부담금의 90%를 지원",
      "application": "○ 산모신생아 건강관리 서비스 종료 후 3개월이내에 보건소에 신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-중소기업육성기금-융자",
    "title": "중소기업육성기금 융자",
    "category": "소상공인",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "동대문구 내에서 6개월 이상 사업한 소상공인 및 중소기업 융자",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "사업",
    "targetGroup": "소상공인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "중소기업육성기금 융자",
      "소상공인",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "전체",
      "사업",
      "동대문구",
      "내에서",
      "6개월",
      "이상",
      "사업한"
    ],
    "summary": "동대문구 내에서 6개월 이상 사업한 소상공인 및 중소기업 융자",
    "audience": "동대문구 내에서 6개월 이상 사업한 소상공인 및 중소기업 융자\n- 소상공인 : 최대3천만원\n- 중소기업 : 최대1억원 \n- 상환조건 : 1년거치 4년균등분할상환\n- 금 리 : 1.5%",
    "benefits": [
      "동대문구 내에서 6개월 이상 사업한 소상공인 및 중소기업 융자"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "동대문구청 지하2층 소상공인 지원반 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000146",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000146",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "동대문구 내에서 6개월 이상 사업한 소상공인 및 중소기업 융자\n- 소상공인 : 최대3천만원\n- 중소기업 : 최대1억원 \n- 상환조건 : 1년거치 4년균등분할상환\n- 금 리 : 1.5%",
      "benefit": "동대문구 내에서 6개월 이상 사업한 소상공인 및 중소기업 융자",
      "application": "동대문구청 지하2층 소상공인 지원반 방문 신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-1인가구-안심장비-지원사업",
    "title": "1인가구 안심장비 지원사업",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "동대문구 거주 단독세대주 및 범죄피해자 안심홈4종세트 지원 사업",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년·주거",
    "targetGroup": "청년",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "1인가구 안심장비 지원사업",
      "청년",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "중장년",
      "주거",
      "동대문구",
      "거주",
      "단독세대주",
      "및",
      "범죄피해자"
    ],
    "summary": "동대문구 거주 단독세대주 및 범죄피해자 안심홈4종세트 지원 사업",
    "audience": "◎ 신청기간 : 별도공지\n\n◎ 지원물품 : 현관문안전고리, 창문잠금장치, 스마트 초인종, 가정용CCTV 총 4종세트\n\n◎ 신청방법 \n ① QR코드로 신청서 제출 ② 전·월세계약서 이메일 제출 \n ※ 이메일주소 : ddmfc@daum.net\n\n◎ 지원대상 : 동대문구에 거주하는 1인가구(1인단독 세대주)\n ※ 청년·중장년 여성 1인가구, 범죄피해를 경험한 남성 1인가구(증빙자료 필수) 우선지원\n\n◎ 필수조건 : 전·월세 보증금(전세환산가액) 1억 5천만원 이하\n ※ 아파트 거주자, 자가 소유자 제외\n ※ 전세환산가액 계산법 : 보증금 +(월세×12)\n\n◎ 진행절차 \n ① 서류제출 완료자 대상 선정심의회\n ②선정결과 발표\n ③임대인 및 건물주 설치동의서 제출\n ④선정된 가구 대상 설치 지원\n\n ◎ 문의전화 : 동대문구1인가구지원센터 ☎ 070-7459-3301~3",
    "benefits": [
      "동대문구 거주 단독세대주 및 범죄피해자 안심홈4종세트 지원 사업"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "◎ 신청방법 \n ① QR코드로 신청서 제출 또는 https://docs.google.com/forms/d/19orxfvtlP5vwhSjnGyUjN1K1ZKtCVSbl4I0mQVW6oqk/edit \n ② 전·월세계약서 이메일 제출 \n ※ 이메일주소 : ddmfc@daum.net",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000147",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000147",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "◎ 신청기간 : 별도공지\n\n◎ 지원물품 : 현관문안전고리, 창문잠금장치, 스마트 초인종, 가정용CCTV 총 4종세트\n\n◎ 신청방법 \n ① QR코드로 신청서 제출 ② 전·월세계약서 이메일 제출 \n ※ 이메일주소 : ddmfc@daum.net\n\n◎ 지원대상 : 동대문구에 거주하는 1인가구(1인단독 세대주)\n ※ 청년·중장년 여성 1인가구, 범죄피해를 경험한 남성 1인가구(증빙자료 필수) 우선지원\n\n◎ 필수조건 : 전·월세 보증금(전세환산가액) 1억 5천만원 이하\n ※ 아파트 거주자, 자가 소유자 제외\n ※ 전세환산가액 계산법 : 보증금 +(월세×12)\n\n◎ 진행절차 \n ① 서류제출 완료자 대상 선정심의회\n ②선정결과 발표\n ③임대인 및 건물주 설치동의서 제출\n ④선정된 가구 대상 설치 지원\n\n ◎ 문의전화 : 동대문구1인가구지원센터 ☎ 070-7459-3301~3",
      "benefit": "동대문구 거주 단독세대주 및 범죄피해자 안심홈4종세트 지원 사업",
      "application": "◎ 신청방법 \n ① QR코드로 신청서 제출 또는 https://docs.google.com/forms/d/19orxfvtlP5vwhSjnGyUjN1K1ZKtCVSbl4I0mQVW6oqk/edit \n ② 전·월세계약서 이메일 제출 \n ※ 이메일주소 : ddmfc@daum.net",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-광견병-예방접종-실시",
    "title": "광견병 예방접종 실시",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "*반려동물 광견병 예방접종 실시",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "광견병 예방접종 실시",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "농어업인",
      "전체",
      "*반려동물",
      "광견병",
      "예방접종",
      "실시"
    ],
    "summary": "*반려동물 광견병 예방접종 실시",
    "audience": "*광견병 예방접종 실시(연 2회/봄,가을)\n- 접종장소 : 동대문구 소재 동물병원 27개소\n- 접종대상 : 생후 3개월 이상 된 모든 개, 고양이\n- 예방접종 시술료 : 10,000원(소유자 부담) / 예방백신 약품비용 무료",
    "benefits": [
      "*반려동물 광견병 예방접종 실시"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "병원방문후 예방접종",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000148",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000148",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "*광견병 예방접종 실시(연 2회/봄,가을)\n- 접종장소 : 동대문구 소재 동물병원 27개소\n- 접종대상 : 생후 3개월 이상 된 모든 개, 고양이\n- 예방접종 시술료 : 10,000원(소유자 부담) / 예방백신 약품비용 무료",
      "benefit": "*반려동물 광견병 예방접종 실시",
      "application": "병원방문후 예방접종",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-양봉농가-구제약품지원",
    "title": "양봉농가 구제약품지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "*양봉농가 구제약품 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양봉농가 구제약품지원",
      "농림어업",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "농어업인",
      "전체",
      "*양봉농가",
      "구제약품",
      "지원"
    ],
    "summary": "*양봉농가 구제약품 지원",
    "audience": "*양봉농가 구제약품 지원\n-응애류, 노제마병, 낭충봉아부패병 구제 약품 지원",
    "benefits": [
      "*양봉농가 구제약품 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "해당 서비스는 신청없이 자격대상자에게 자동적으로 제공됩니다.",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000149",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000149",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "*양봉농가 구제약품 지원\n-응애류, 노제마병, 낭충봉아부패병 구제 약품 지원",
      "benefit": "*양봉농가 구제약품 지원",
      "application": "해당 서비스는 신청없이 자격대상자에게 자동적으로 제공됩니다.",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-1인-가구-고독사-예방-안부확인-서비스",
    "title": "1인 가구 고독사 예방 안부확인 서비스",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "- 전력, 통신데이터 사용 패턴 분석으로 대상가구 상시 안부 확인",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "1인 가구 고독사 예방 안부확인 서비스",
      "복지",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "아동",
      "중장년",
      "-",
      "전력,",
      "통신데이터",
      "사용"
    ],
    "summary": "- 전력, 통신데이터 사용 패턴 분석으로 대상가구 상시 안부 확인",
    "audience": "ㅇ1인 가구 고독사 예방을 위한 안부살핌 서비스\n- 지원대상 : 중장년(50~64세) 1인 고독사 위험가구 \n- 전력, 통신데이터 사용 패턴 분석으로 1인 가구의 사용패턴을 인공지능 등으로 분석, 평상시와 다른 사용 패넡 감지시 동복지플래너에게 알림 전송하여 대상자의 안부확인 서비스\n- 별도의 기기, 센서 설치 없이 기설치된 전력 및 통신 인프라 활용",
    "benefits": [
      "- 전력, 통신데이터 사용 패턴 분석으로 대상가구 상시 안부 확인"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "- 방문신청 : 주민등록지 동주민센터(신분증 지참)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000150",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000150",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ1인 가구 고독사 예방을 위한 안부살핌 서비스\n- 지원대상 : 중장년(50~64세) 1인 고독사 위험가구 \n- 전력, 통신데이터 사용 패턴 분석으로 1인 가구의 사용패턴을 인공지능 등으로 분석, 평상시와 다른 사용 패넡 감지시 동복지플래너에게 알림 전송하여 대상자의 안부확인 서비스\n- 별도의 기기, 센서 설치 없이 기설치된 전력 및 통신 인프라 활용",
      "benefit": "- 전력, 통신데이터 사용 패턴 분석으로 대상가구 상시 안부 확인",
      "application": "- 방문신청 : 주민등록지 동주민센터(신분증 지참)",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-한국외국어대학교-영어체험교실",
    "title": "한국외국어대학교 영어체험교실",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "관내 초등학생 3~6학년을 대상으로 방학기간 중 원어민과 함께하는 영어체험교실 운영",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "한국외국어대학교 영어체험교실",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "관내",
      "초등학생",
      "3~6학년을",
      "대상으로"
    ],
    "summary": "관내 초등학생 3~6학년을 대상으로 방학기간 중 원어민과 함께하는 영어체험교실 운영",
    "audience": "○ 원어민과 함께하는 여름방학, 겨울방학 영어체험교실\n - 대상 : 관내 초등학생 3~6학년 \n - 장소 : 한국외국어대학교 서울캠퍼스(이문동)\n - 기간 : 여름방학, 겨울방학 중 12일 \n - 비용 : 1인당 80만원(구 지원40만원, 자부담 40만원)\n - 내용 : 회화 및 체험형 중심의 영어 학습",
    "benefits": [
      "관내 초등학생 3~6학년을 대상으로 방학기간 중 원어민과 함께하는 영어체험교실 운영"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "온라인 신청\n\n온라인: https://hufsportal.hufs.ac.kr/tesol/student.php",
    "officialUrl": "https://hufsportal.hufs.ac.kr/tesol/student.php",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000151",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 원어민과 함께하는 여름방학, 겨울방학 영어체험교실\n - 대상 : 관내 초등학생 3~6학년 \n - 장소 : 한국외국어대학교 서울캠퍼스(이문동)\n - 기간 : 여름방학, 겨울방학 중 12일 \n - 비용 : 1인당 80만원(구 지원40만원, 자부담 40만원)\n - 내용 : 회화 및 체험형 중심의 영어 학습",
      "benefit": "관내 초등학생 3~6학년을 대상으로 방학기간 중 원어민과 함께하는 영어체험교실 운영",
      "application": "온라인 신청\n\n온라인: https://hufsportal.hufs.ac.kr/tesol/student.php",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-부동산-상담관-제도",
    "title": "부동산 상담관 제도",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "개업공인중개사를 상담관으로 위촉하여 부동산 매매 및 임대차 관련 분쟁, 부동산거래관련 상담",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "부동산 상담관 제도",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "복지",
      "개업공인중개사를",
      "상담관으로",
      "위촉하여",
      "부동산"
    ],
    "summary": "개업공인중개사를 상담관으로 위촉하여 부동산 매매 및 임대차 관련 분쟁, 부동산거래관련 상담",
    "audience": "※ 부동산 상담관 제도\n - 부동산 전문가인 공인중개사를 부동산 상담관으로 위촉하여 부동산 매매,임대차 관련 분쟁 등에 대해 무료상담 해줌으로써 주민 불편사항을 해소하고, 개업공인중개사의 사회공헌 활동을 통한 민관 네트워크를 구성하여 맞춤형 복지서비스를 제공\n - 주1회 매주 화요일 상담 서비스 제공 (시간 14:00 ~ 17:00)",
    "benefits": [
      "개업공인중개사를 상담관으로 위촉하여 부동산 매매 및 임대차 관련 분쟁, 부동산거래관련 상담"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문, 유선신청 가능\n - 장소 : 동대문구 부동산정보과 (1층)\n - 전화 : 02-2127-4215",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000155",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000155",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "※ 부동산 상담관 제도\n - 부동산 전문가인 공인중개사를 부동산 상담관으로 위촉하여 부동산 매매,임대차 관련 분쟁 등에 대해 무료상담 해줌으로써 주민 불편사항을 해소하고, 개업공인중개사의 사회공헌 활동을 통한 민관 네트워크를 구성하여 맞춤형 복지서비스를 제공\n - 주1회 매주 화요일 상담 서비스 제공 (시간 14:00 ~ 17:00)",
      "benefit": "개업공인중개사를 상담관으로 위촉하여 부동산 매매 및 임대차 관련 분쟁, 부동산거래관련 상담",
      "application": "○ 방문, 유선신청 가능\n - 장소 : 동대문구 부동산정보과 (1층)\n - 전화 : 02-2127-4215",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-아파트-공동체-활성화-사업",
    "title": "아파트 공동체 활성화 사업",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "아파트 단지 내 주민이 제안한 활동 프로그램을 지원함으로써 이웃간 소통을 활성화",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "아파트 공동체 활성화 사업",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "일반",
      "전체",
      "아파트",
      "단지",
      "내",
      "주민이",
      "제안한"
    ],
    "summary": "아파트 단지 내 주민이 제안한 활동 프로그램을 지원함으로써 이웃간 소통을 활성화",
    "audience": "아파트 단지 내 주민이 제안한 다양한 활동 프로그램을 지원함으로써 이웃간 소통을 활성화 하고 공동체 의식 함양\n\no 사업내용 : 친환경제품만들기, 녹색장터, 텃밭가꾸기, 재능기부, 나눔행사 등\no 지원금액 : 00,000천원 : 매칭사업(시비 40%, 구비 60%)\no 신청자격 : 입주자(임차인)대표회의, 공동체활성화단체, 관리주체의 3자 공동명의 신청\n - 공동체 활성화 단체 구성 : 아파트 내외 주민 10명 이상\n (아파트 단지 내 자부담이 있는 사업입니다.)\no 지원방법 : 공동주택지원 심의위원회 심의 및 결정",
    "benefits": [
      "아파트 단지 내 주민이 제안한 활동 프로그램을 지원함으로써 이웃간 소통을 활성화"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "o 신청방법 : 신청 구비서류를 지참 방문 접수( 동대문구청 주택과 2127-4664)\n - 접수 하기 전 사전에 구청에 공모사업에 필요한 제반 사항을 상담하시기 바랍니다. \n (커뮤니티 전문가 선생님 컨설팅 상담 문의)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000156",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000156",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "아파트 단지 내 주민이 제안한 다양한 활동 프로그램을 지원함으로써 이웃간 소통을 활성화 하고 공동체 의식 함양\n\no 사업내용 : 친환경제품만들기, 녹색장터, 텃밭가꾸기, 재능기부, 나눔행사 등\no 지원금액 : 00,000천원 : 매칭사업(시비 40%, 구비 60%)\no 신청자격 : 입주자(임차인)대표회의, 공동체활성화단체, 관리주체의 3자 공동명의 신청\n - 공동체 활성화 단체 구성 : 아파트 내외 주민 10명 이상\n (아파트 단지 내 자부담이 있는 사업입니다.)\no 지원방법 : 공동주택지원 심의위원회 심의 및 결정",
      "benefit": "아파트 단지 내 주민이 제안한 활동 프로그램을 지원함으로써 이웃간 소통을 활성화",
      "application": "o 신청방법 : 신청 구비서류를 지참 방문 접수( 동대문구청 주택과 2127-4664)\n - 접수 하기 전 사전에 구청에 공모사업에 필요한 제반 사항을 상담하시기 바랍니다. \n (커뮤니티 전문가 선생님 컨설팅 상담 문의)",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-장애인-로봇재활-시범사업",
    "title": "장애인 로봇재활 시범사업",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "로봇재활기기를 공공의료에 도입하여 장애인의 건강능력향상 도모",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인 로봇재활 시범사업",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "장애인",
      "전체",
      "복지",
      "로봇재활기기를",
      "공공의료에",
      "도입하여",
      "장애인의"
    ],
    "summary": "로봇재활기기를 공공의료에 도입하여 장애인의 건강능력향상 도모",
    "audience": "❍ 로봇재활 운동교실 운영\n - 상하지 관절에 로봇재활기기를 적용하여 관절가동범위 향상, 관절구축예방\n - 로봇재활기기를 이용한 근력강화\n - 대상 : 뇌병변 및 지체장애 \n\n❍ 장애인 복지관 대여 및 재활서비스\n - 관내 장애인 복지관 2개소에 대여하여 복지관 이용 장애인을 대상으로 프로그램 운영\n\n❍ 가정대여 및 찾아가는 로봇재활 서비스\n - 가정에 로봇재활기기를 대여하여 스스로 기기를 사용하여 재활운동 시행. 정기적인 모니터링 및 필요시 재교육\n\n❍ 지역 참여기관과의 간담회 및 운영 회의 실시",
    "benefits": [
      "로봇재활기기를 공공의료에 도입하여 장애인의 건강능력향상 도모"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "❍ 방문 및 전화 접수\n - 02)2127-5185",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000161",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000161",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "❍ 로봇재활 운동교실 운영\n - 상하지 관절에 로봇재활기기를 적용하여 관절가동범위 향상, 관절구축예방\n - 로봇재활기기를 이용한 근력강화\n - 대상 : 뇌병변 및 지체장애 \n\n❍ 장애인 복지관 대여 및 재활서비스\n - 관내 장애인 복지관 2개소에 대여하여 복지관 이용 장애인을 대상으로 프로그램 운영\n\n❍ 가정대여 및 찾아가는 로봇재활 서비스\n - 가정에 로봇재활기기를 대여하여 스스로 기기를 사용하여 재활운동 시행. 정기적인 모니터링 및 필요시 재교육\n\n❍ 지역 참여기관과의 간담회 및 운영 회의 실시",
      "benefit": "로봇재활기기를 공공의료에 도입하여 장애인의 건강능력향상 도모",
      "application": "❍ 방문 및 전화 접수\n - 02)2127-5185",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-장애인-활동지원-구비추가사업",
    "title": "장애인 활동지원(구비추가사업)",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "장애인 활동지원 서비스 월30시간 구비 추가시간 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "장애인 활동지원(구비추가사업)",
      "복지",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "장애인",
      "전체",
      "활동지원",
      "서비스",
      "월30시간",
      "구비",
      "추가시간"
    ],
    "summary": "장애인 활동지원 서비스 월30시간 구비 추가시간 제공",
    "audience": "활동지원 서비스 월 30시간의 구비 추가시간 제공",
    "benefits": [
      "장애인 활동지원 서비스 월30시간 구비 추가시간 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청(신분증 지참)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000162",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000162",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "활동지원 서비스 월 30시간의 구비 추가시간 제공",
      "benefit": "장애인 활동지원 서비스 월30시간 구비 추가시간 제공",
      "application": "방문신청(신분증 지참)",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-어린이-한의약-건강관리사업",
    "title": "어린이 한의약 건강관리사업",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "동대문구 관내 아동센터 이용 취약계층 아동을 대상으로 건강 상담 및 첩약을 지원하여 사업",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "마감",
    "startDate": null,
    "endDate": null,
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "어린이 한의약 건강관리사업",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "마감",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "동대문구",
      "관내",
      "아동센터",
      "이용"
    ],
    "summary": "동대문구 관내 아동센터 이용 취약계층 아동을 대상으로 건강 상담 및 첩약을 지원하여 사업",
    "audience": "대 상 : 참여를 희망하는 관내 지역아동센터 아동(초등학교 1~6학년)\n 내 용 \n - 지역아동센터 아동 대상 한의사 진료 및 상담 서비스\n - 허약아동에 대한 첩약지원(년 2회, 2년 연속 지원)\n ※ 첩약 총 2재 지원[1재(성인기준 20첩), 아동 몸무게에 따라 20일~40일분]",
    "benefits": [
      "동대문구 관내 아동센터 이용 취약계층 아동을 대상으로 건강 상담 및 첩약을 지원하여 사업"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "관내 지역아동센터 중 사업 참여 신청 개소 및 참여자 모집",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000163",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000163",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "대 상 : 참여를 희망하는 관내 지역아동센터 아동(초등학교 1~6학년)\n 내 용 \n - 지역아동센터 아동 대상 한의사 진료 및 상담 서비스\n - 허약아동에 대한 첩약지원(년 2회, 2년 연속 지원)\n ※ 첩약 총 2재 지원[1재(성인기준 20첩), 아동 몸무게에 따라 20일~40일분]",
      "benefit": "동대문구 관내 아동센터 이용 취약계층 아동을 대상으로 건강 상담 및 첩약을 지원하여 사업",
      "application": "관내 지역아동센터 중 사업 참여 신청 개소 및 참여자 모집",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-북한이탈주민-취업역량-강화-교육비-지원",
    "title": "북한이탈주민 취업역량 강화 교육비 지원",
    "category": "창업",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "북한이탈주민의 취업역량 강화를 위하여 교육비를 지원해주는 사업",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "취업·사업",
    "targetGroup": "구직자",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "북한이탈주민 취업역량 강화 교육비 지원",
      "창업",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "구직자",
      "전체",
      "취업",
      "사업",
      "북한이탈주민의",
      "취업역량",
      "강화를"
    ],
    "summary": "북한이탈주민의 취업역량 강화를 위하여 교육비를 지원해주는 사업",
    "audience": "북한이탈주민 취업역량 강화를 위한 교육비 지원사업으로 출석율 90% 이상 등 성실히 교육에 임하여야 하며, 90% 미만시 교육비 지원 금액 50% 본인환불의무가 있음\n-바리스타, 요양보호사, 컴퓨터, 메이크업, 요리, 미용 등",
    "benefits": [
      "북한이탈주민의 취업역량 강화를 위하여 교육비를 지원해주는 사업"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "동대문구청 자치행정과로 전화문의(02-2127-4057) 후 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000165",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000165",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "북한이탈주민 취업역량 강화를 위한 교육비 지원사업으로 출석율 90% 이상 등 성실히 교육에 임하여야 하며, 90% 미만시 교육비 지원 금액 50% 본인환불의무가 있음\n-바리스타, 요양보호사, 컴퓨터, 메이크업, 요리, 미용 등",
      "benefit": "북한이탈주민의 취업역량 강화를 위하여 교육비를 지원해주는 사업",
      "application": "동대문구청 자치행정과로 전화문의(02-2127-4057) 후 방문 신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-재건축-재개발-정비사업-법률상담센터-운영",
    "title": "재건축,재개발 정비사업 법률상담센터 운영",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "재건축,재개발 관련한 법률 상담",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "재건축,재개발 정비사업 법률상담센터 운영",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "재건축,재개발",
      "관련한",
      "법률",
      "상담"
    ],
    "summary": "재건축,재개발 관련한 법률 상담",
    "audience": "○ 정비사업 관련 법률 상담\n\n○ 재건축,재개발과 관련한 분쟁 민원 상담\n\n○ 정비사업 소송서류 심사 및 법령해석, 제도개선 발굴 등 지원\n\n○ 주거정비과 재건축,재개발 업무지원(도시분쟁조정위원회 운영) 등",
    "benefits": [
      "재건축,재개발 관련한 법률 상담"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청: 정비사업 법률상담센터",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000166",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000166",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 정비사업 관련 법률 상담\n\n○ 재건축,재개발과 관련한 분쟁 민원 상담\n\n○ 정비사업 소송서류 심사 및 법령해석, 제도개선 발굴 등 지원\n\n○ 주거정비과 재건축,재개발 업무지원(도시분쟁조정위원회 운영) 등",
      "benefit": "재건축,재개발 관련한 법률 상담",
      "application": "○ 방문신청: 정비사업 법률상담센터",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-저소득층-중개보수-지원",
    "title": "저소득층 중개보수 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "관내 기초생활수급자 등 경제적으로 어려운 주민에게 주택임대차 중개보수를 지원해 드립니다.",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득층 중개보수 지원",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "어르신",
      "복지",
      "관내",
      "기초생활수급자",
      "등",
      "경제적으로",
      "어려운"
    ],
    "summary": "관내 기초생활수급자 등 경제적으로 어려운 주민에게 주택임대차 중개보수를 지원해 드립니다.",
    "audience": "저소득층 중개보수 지원\n\n관내 기초생활수급자, 소년·소녀가장, 홀몸어르신 등 경제적으로 어려운 주민에게 주택임대차 중개보수를 지원해 드립니다.\n\n❍지원대상 \n  관내 기초생활 수급자, 홀몸어르신, 소년·소녀가장, 한부모가정 등\n - 전입 장소가 건축물대장 용도상 주거용에 한함 (공공임대주택 및 고시원 등 제외)\n ❍지원금액: 최대 30만원 (부가세 제외)\n  임차보증금 1억원 이하\n ※ 월세 환산보증금 : 월세보증액 + (한달월세액 × 100)\n❍지원신청: 동대문구청 부동산정보과 및 동주민센터\n ❍제출서류 \n  지원신청서, 주택임대차 계약서, 주민등록등본, 통장사본, 중개보수 영수증, 대상자 증빙자료(기초생활수급자증명서, 한부모가정증명서, 기초연금수급자확인서 중 택1)",
    "benefits": [
      "관내 기초생활수급자 등 경제적으로 어려운 주민에게 주택임대차 중개보수를 지원해 드립니다."
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000170",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000170",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "저소득층 중개보수 지원\n\n관내 기초생활수급자, 소년·소녀가장, 홀몸어르신 등 경제적으로 어려운 주민에게 주택임대차 중개보수를 지원해 드립니다.\n\n❍지원대상 \n  관내 기초생활 수급자, 홀몸어르신, 소년·소녀가장, 한부모가정 등\n - 전입 장소가 건축물대장 용도상 주거용에 한함 (공공임대주택 및 고시원 등 제외)\n ❍지원금액: 최대 30만원 (부가세 제외)\n  임차보증금 1억원 이하\n ※ 월세 환산보증금 : 월세보증액 + (한달월세액 × 100)\n❍지원신청: 동대문구청 부동산정보과 및 동주민센터\n ❍제출서류 \n  지원신청서, 주택임대차 계약서, 주민등록등본, 통장사본, 중개보수 영수증, 대상자 증빙자료(기초생활수급자증명서, 한부모가정증명서, 기초연금수급자확인서 중 택1)",
      "benefit": "관내 기초생활수급자 등 경제적으로 어려운 주민에게 주택임대차 중개보수를 지원해 드립니다.",
      "application": "방문신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-라돈측정기-대여",
    "title": "라돈측정기 대여",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "간이 라돈측정기를 대여하여 생활환경의 오염을 확인하고 건강피해를 예방",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "라돈측정기 대여",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "일반",
      "전체",
      "간이",
      "라돈측정기를",
      "대여하여",
      "생활환경의",
      "오염을"
    ],
    "summary": "간이 라돈측정기를 대여하여 생활환경의 오염을 확인하고 건강피해를 예방",
    "audience": "○ 동대문구민을 위한 간이 라돈측정기 대여 서비스\n - 주민등록 기준 동대문구 구민이라면 누구나 대여가능\n - 구청 기후환경과, 각 동주민센터 (사전 전화문의)\n - 신분증 지참\n - 대여기간 : 3일\n - 대여비용 : 무료",
    "benefits": [
      "간이 라돈측정기를 대여하여 생활환경의 오염을 확인하고 건강피해를 예방"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 신분증 필수 지참\n - 방문 전 전화 문의",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000174",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000174",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 동대문구민을 위한 간이 라돈측정기 대여 서비스\n - 주민등록 기준 동대문구 구민이라면 누구나 대여가능\n - 구청 기후환경과, 각 동주민센터 (사전 전화문의)\n - 신분증 지참\n - 대여기간 : 3일\n - 대여비용 : 무료",
      "benefit": "간이 라돈측정기를 대여하여 생활환경의 오염을 확인하고 건강피해를 예방",
      "application": "○ 방문 신청\n - 신분증 필수 지참\n - 방문 전 전화 문의",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-임신부-백일해-예방접종-지원",
    "title": "임신부 백일해 예방접종 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "임신부 백일해 예방접종 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임신부 백일해 예방접종 지원",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "임신부",
      "백일해",
      "예방접종",
      "지원"
    ],
    "summary": "임신부 백일해 예방접종 지원",
    "audience": "접종일 현재 동대문구에 주민등록을 두고 있는\n임신 27주 이상 36주 이내의 임신부 및\n임신기간에 접종하지 않은 분만 2주 이내 산모에게 백일해 백신 접종",
    "benefits": [
      "임신부 백일해 예방접종 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "방문 전 백신잔량 확인 후 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000286",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000286",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "접종일 현재 동대문구에 주민등록을 두고 있는\n임신 27주 이상 36주 이내의 임신부 및\n임신기간에 접종하지 않은 분만 2주 이내 산모에게 백일해 백신 접종",
      "benefit": "임신부 백일해 예방접종 지원",
      "application": "방문 전 백신잔량 확인 후 방문",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-물리치료-제공",
    "title": "물리치료 제공",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "1차 진료실(내과)에서 진찰 후 처방에 의한 물리치료 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "어르신",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "물리치료 제공",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "어르신",
      "아동",
      "전체",
      "1차",
      "진료실(내과)에서",
      "진찰",
      "후"
    ],
    "summary": "1차 진료실(내과)에서 진찰 후 처방에 의한 물리치료 제공",
    "audience": "1차 진료실(내과)에서 진찰 후 처방에 의한 물리치료 제공\n - 65세 이상, 의료보호대상자 무료\n - 그외 : 진찰+물리치료 1,600",
    "benefits": [
      "1차 진료실(내과)에서 진찰 후 처방에 의한 물리치료 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 거주지 관할 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000289",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000289",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "1차 진료실(내과)에서 진찰 후 처방에 의한 물리치료 제공\n - 65세 이상, 의료보호대상자 무료\n - 그외 : 진찰+물리치료 1,600",
      "benefit": "1차 진료실(내과)에서 진찰 후 처방에 의한 물리치료 제공",
      "application": "○ 방문 신청\n - 보건소 : 거주지 관할 보건소 방문",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-전세보증금반환보증-보증료-지원",
    "title": "전세보증금반환보증 보증료 지원",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 가평군",
    "region": "경기",
    "amount": "청년, 청년 외, 신혼부부 등의 전세보증금반환보증 가입 경우 보증수수료 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년·주거",
    "targetGroup": "청년, 신혼부부",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "전세보증금반환보증 보증료 지원",
      "청년",
      "경기",
      "경기도 가평군",
      "상시",
      "신혼부부",
      "주거",
      "청년,",
      "외,",
      "등의",
      "전세보증금반환보증",
      "가입"
    ],
    "summary": "청년, 청년 외, 신혼부부 등의 전세보증금반환보증 가입 경우 보증수수료 지원",
    "audience": "전세보증금반환보증 보증료 최대 30만원 지원(2년에 한번 지원)",
    "benefits": [
      "청년, 청년 외, 신혼부부 등의 전세보증금반환보증 가입 경우 보증수수료 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "- 신청방법: 읍, 면 행정복지센터에 방문하여 신청 또는 민원24로 신청 가능",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000264",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/416000000264",
    "contact": "경기도 가평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "전세보증금반환보증 보증료 최대 30만원 지원(2년에 한번 지원)",
      "benefit": "청년, 청년 외, 신혼부부 등의 전세보증금반환보증 가입 경우 보증수수료 지원",
      "application": "- 신청방법: 읍, 면 행정복지센터에 방문하여 신청 또는 민원24로 신청 가능",
      "contact": "경기도 가평군"
    }
  },
  {
    "slug": "gov24-초중고-입학준비금-지원",
    "title": "초중고 입학준비금 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "관내 초·중·고등학교에 입학하는 신입생에게 입학 준비에 필요한 물품 등 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "초중고 입학준비금 지원",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "모집중",
      "부모/육아",
      "청소년",
      "임신·출산·육아",
      "관내",
      "초·중·고등학교에",
      "입학하는",
      "신입생에게"
    ],
    "summary": "관내 초·중·고등학교에 입학하는 신입생에게 입학 준비에 필요한 물품 등 구입비 지원",
    "audience": "○ 초중고 입학준비금 지원\n - 대 상 : 관내 초·중·고에 입학하는 신입생\n - 지 원 액 : 1인당 20만원, 1인당 30만원\n - 사용범위 : 의류(교복 등), 도서(학교권장도서 등)\n - 지원방법 : 학교 주관 교복 구매 또는 모바일 포인트(제로페이) 중 선택",
    "benefits": [
      "관내 초·중·고등학교에 입학하는 신입생에게 입학 준비에 필요한 물품 등 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "학교 또는 온라인 사이트 신청\n\n온라인: https://start.sen.go.kr/",
    "officialUrl": "https://start.sen.go.kr/",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000133",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 초중고 입학준비금 지원\n - 대 상 : 관내 초·중·고에 입학하는 신입생\n - 지 원 액 : 1인당 20만원, 1인당 30만원\n - 사용범위 : 의류(교복 등), 도서(학교권장도서 등)\n - 지원방법 : 학교 주관 교복 구매 또는 모바일 포인트(제로페이) 중 선택",
      "benefit": "관내 초·중·고등학교에 입학하는 신입생에게 입학 준비에 필요한 물품 등 구입비 지원",
      "application": "학교 또는 온라인 사이트 신청\n\n온라인: https://start.sen.go.kr/",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-저소득-공영장례-지원",
    "title": "저소득 공영장례 지원",
    "category": "주거",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "장제급여 대상 무연고 사망자에 대하여 고인모심 및 공영 장례서비스 제공",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "주거·복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득 공영장례 지원",
      "주거",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "복지",
      "장제급여",
      "대상",
      "무연고",
      "사망자에"
    ],
    "summary": "장제급여 대상 무연고 사망자에 대하여 고인모심 및 공영 장례서비스 제공",
    "audience": "장제급여 대상 무연고 사망자 공영장례 지원 \n- 고인모심, 공영 장례서비스",
    "benefits": [
      "장제급여 대상 무연고 사망자에 대하여 고인모심 및 공영 장례서비스 제공"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "대상자 주민등록지 관할 동주민센터",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000139",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000139",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "장제급여 대상 무연고 사망자 공영장례 지원 \n- 고인모심, 공영 장례서비스",
      "benefit": "장제급여 대상 무연고 사망자에 대하여 고인모심 및 공영 장례서비스 제공",
      "application": "대상자 주민등록지 관할 동주민센터",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-it-희망나눔-사랑의-pc-지원",
    "title": "IT 희망나눔 사랑의 PC 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "중고 PC 정비 후 정보소외 계층에 보급하여 정보접근성 향상 및 정보활용능력 제고",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아, 장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "IT 희망나눔 사랑의 PC 지원",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "부모/육아",
      "장애인",
      "아동",
      "임신·출산·육아",
      "복지",
      "중고",
      "PC"
    ],
    "summary": "중고 PC 정비 후 정보소외 계층에 보급하여 정보접근성 향상 및 정보활용능력 제고",
    "audience": "○ IT 희망나눔 사랑의 PC 보급\n - 내용연수가 경과된 행정업무용 PC를 정비하여 정보소외 계층에 무상 보급\n - 보급장비 : PC, 모니터, 키보드, 마우스, 스피커, 멀티탭",
    "benefits": [
      "중고 PC 정비 후 정보소외 계층에 보급하여 정보접근성 향상 및 정보활용능력 제고"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문신청 : 가까운 동주민센터(신분증, 보급대상 증명서류 지참)",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000158",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000158",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ IT 희망나눔 사랑의 PC 보급\n - 내용연수가 경과된 행정업무용 PC를 정비하여 정보소외 계층에 무상 보급\n - 보급장비 : PC, 모니터, 키보드, 마우스, 스피커, 멀티탭",
      "benefit": "중고 PC 정비 후 정보소외 계층에 보급하여 정보접근성 향상 및 정보활용능력 제고",
      "application": "○ 방문신청 : 가까운 동주민센터(신분증, 보급대상 증명서류 지참)",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-보건소-내소자-결핵검진",
    "title": "동대문구 보건소 내소자 결핵검진",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "지역주민 및 학생을 위한 결핵 검진 및 관리 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 보건소 내소자 결핵검진",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "일반",
      "전체",
      "지역주민",
      "및",
      "학생을",
      "위한",
      "결핵"
    ],
    "summary": "지역주민 및 학생을 위한 결핵 검진 및 관리 지원",
    "audience": "ㅇ 결핵검진 대상\n - 호흡기 계통의 증상이 있는 분(2주 이상 기침, 객담, 혈담이나 객혈)\n - 결핵환자 가족 및 동거가족\n - 병무청 및 민간 병·의원에서 결핵 유소견자로 통보된 분\n - 기타 결핵검진을 희망하는 분\n\nㅇ검사방법\n보건소에 내소하여 흉부엑스선 검사 및 객담검사\n\nㅇ검사수수료\n제증명 서류 발급 시 수수료 있음\n\nㅇ환자등록\n결핵치료는 무료(산정특례)이며, 의료기관으로 연계",
    "benefits": [
      "지역주민 및 학생을 위한 결핵 검진 및 관리 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 보건소 방문신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000294",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000294",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ 결핵검진 대상\n - 호흡기 계통의 증상이 있는 분(2주 이상 기침, 객담, 혈담이나 객혈)\n - 결핵환자 가족 및 동거가족\n - 병무청 및 민간 병·의원에서 결핵 유소견자로 통보된 분\n - 기타 결핵검진을 희망하는 분\n\nㅇ검사방법\n보건소에 내소하여 흉부엑스선 검사 및 객담검사\n\nㅇ검사수수료\n제증명 서류 발급 시 수수료 있음\n\nㅇ환자등록\n결핵치료는 무료(산정특례)이며, 의료기관으로 연계",
      "benefit": "지역주민 및 학생을 위한 결핵 검진 및 관리 지원",
      "application": "○ 방문 신청\n - 보건소 : 보건소 방문신청",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-저소득층-아동-체험행사",
    "title": "저소득층 아동 체험행사",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "관내 저소득층 아동을 대상으로 다양한 체험행사 실시",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "저소득층 아동 체험행사",
      "교육",
      "서울",
      "서울특별시 동대문구",
      "확인필요",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "복지",
      "관내",
      "저소득층",
      "아동을"
    ],
    "summary": "관내 저소득층 아동을 대상으로 다양한 체험행사 실시",
    "audience": "○ 저소득층 아동 체험행사\n - 관내 저소득층 아동을 대상으로 다양한 체험행사 실시",
    "benefits": [
      "관내 저소득층 아동을 대상으로 다양한 체험행사 실시"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 유선 문의",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000173",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000173",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 저소득층 아동 체험행사\n - 관내 저소득층 아동을 대상으로 다양한 체험행사 실시",
      "benefit": "관내 저소득층 아동을 대상으로 다양한 체험행사 실시",
      "application": "○ 유선 문의",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-한의약-치매-건강증진사업",
    "title": "한의약 치매 건강증진사업",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "총명침시술(16~20회) 및 한약 처방, 건강상담",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "마감",
    "startDate": null,
    "endDate": null,
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": true,
    "tags": [
      "한의약 치매 건강증진사업",
      "보건의료",
      "서울",
      "서울특별시 동대문구",
      "마감",
      "장애인",
      "아동",
      "복지",
      "총명침시술(16~20회)",
      "및",
      "한약",
      "처방,"
    ],
    "summary": "총명침시술(16~20회) 및 한약 처방, 건강상담",
    "audience": "? 대 상 : 동대문구민 60세 이상 참여 희망자 \n ※ 단, 치매환자 및 치매안심센터 서비스 이용자 제외 \n \n? 모집인원 : 45명(선착순)\n\n? 지원기준 : 선정검사 후 인지장애 위험군으로 분류된 자 \n\n? 지원내용 : 총명침시술(16~20회) 및 한약 처방, 건강상담\n ※ 최소 16회 침 치료 진행해야 함. \n 중독 탈락 시 추후 선정에 어려움 있음\n\n? 비 용 : 무료",
    "benefits": [
      "총명침시술(16~20회) 및 한약 처방, 건강상담"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "온라인 , 전화 및 방문 접수\n\n온라인: https://www.ddm.go.kr/health/index.do",
    "officialUrl": "https://www.ddm.go.kr/health/index.do",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000277",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "? 대 상 : 동대문구민 60세 이상 참여 희망자 \n ※ 단, 치매환자 및 치매안심센터 서비스 이용자 제외 \n \n? 모집인원 : 45명(선착순)\n\n? 지원기준 : 선정검사 후 인지장애 위험군으로 분류된 자 \n\n? 지원내용 : 총명침시술(16~20회) 및 한약 처방, 건강상담\n ※ 최소 16회 침 치료 진행해야 함. \n 중독 탈락 시 추후 선정에 어려움 있음\n\n? 비 용 : 무료",
      "benefit": "총명침시술(16~20회) 및 한약 처방, 건강상담",
      "application": "온라인 , 전화 및 방문 접수\n\n온라인: https://www.ddm.go.kr/health/index.do",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-동대문구-1인가구-청년-건강검진",
    "title": "동대문구 1인가구 청년 건강검진",
    "category": "청년",
    "source": "정부24 공공서비스 API",
    "agency": "서울특별시 동대문구",
    "region": "서울",
    "amount": "건강관리에 소홀하기 쉬운 청년층 1인 가구 건강검진 무료지원(동대문구에 주민등록을 둔 자)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "청년",
    "targetGroup": "청년",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "동대문구 1인가구 청년 건강검진",
      "청년",
      "서울",
      "서울특별시 동대문구",
      "상시",
      "건강관리에",
      "소홀하기",
      "쉬운",
      "청년층",
      "1인",
      "가구",
      "건강검진"
    ],
    "summary": "건강관리에 소홀하기 쉬운 청년층 1인 가구 건강검진 무료지원(동대문구에 주민등록을 둔 자)",
    "audience": "ㅇ검진대상 : 동대문구에 주민등록이 되어있는 19~39세 1인 가구 청년\n*연나이 기준, 당해연도 국가건강검진 대상자 제외\nㅇ운영시간 : 평일 09:00~11:00\nㅇ검진비용 : 무료\nㅇ검진장소 : 동대문구보건소(접수처 : 보건소 1층 감염병진료실)\nㅇ준비사항\n - 검사 전일 22시부터 금식(최소 10시간 이상)\n - 신분증, 주민등록등본(검사일 기준 1개월 이내) 지참\nㅇ결과확인 : 검진일로부터 7일 이후 온라인 또는 방문 확인",
    "benefits": [
      "건강관리에 소홀하기 쉬운 청년층 1인 가구 건강검진 무료지원(동대문구에 주민등록을 둔 자)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "ㅇ접수장소:동대문구보건소 1층 감염병진료실\n- 운영시간: 평일 09:00 ~ 11:00\n- 준비사항: 신분증, 주민등록등본(검사일기준1개월이내 발급)\n · 검진 전일 22시부터 금식 후 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000288",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/305000000288",
    "contact": "서울특별시 동대문구",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "ㅇ검진대상 : 동대문구에 주민등록이 되어있는 19~39세 1인 가구 청년\n*연나이 기준, 당해연도 국가건강검진 대상자 제외\nㅇ운영시간 : 평일 09:00~11:00\nㅇ검진비용 : 무료\nㅇ검진장소 : 동대문구보건소(접수처 : 보건소 1층 감염병진료실)\nㅇ준비사항\n - 검사 전일 22시부터 금식(최소 10시간 이상)\n - 신분증, 주민등록등본(검사일 기준 1개월 이내) 지참\nㅇ결과확인 : 검진일로부터 7일 이후 온라인 또는 방문 확인",
      "benefit": "건강관리에 소홀하기 쉬운 청년층 1인 가구 건강검진 무료지원(동대문구에 주민등록을 둔 자)",
      "application": "ㅇ접수장소:동대문구보건소 1층 감염병진료실\n- 운영시간: 평일 09:00 ~ 11:00\n- 준비사항: 신분증, 주민등록등본(검사일기준1개월이내 발급)\n · 검진 전일 22시부터 금식 후 보건소 방문",
      "contact": "서울특별시 동대문구"
    }
  },
  {
    "slug": "gov24-예방접종-서비스",
    "title": "예방접종 서비스",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "수급자, 장애인 등에게 예방접종 서비스 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "장애인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "예방접종 서비스",
      "보건의료",
      "대구",
      "대구광역시 군위군",
      "상시",
      "장애인",
      "아동",
      "복지",
      "수급자,",
      "등에게",
      "예방접종",
      "서비스"
    ],
    "summary": "수급자, 장애인 등에게 예방접종 서비스 지원",
    "audience": "○ 군위에 주소지를 둔 군위군민 대상 예방접종 서비스",
    "benefits": [
      "수급자, 장애인 등에게 예방접종 서비스 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 군위군 보건소 예방접종실로 문의\n\n○ 기타\n - 전화 : 054-380-7453~4",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000101",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000101",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 군위에 주소지를 둔 군위군민 대상 예방접종 서비스",
      "benefit": "수급자, 장애인 등에게 예방접종 서비스 지원",
      "application": "○ 방문 신청\n - 보건소 : 군위군 보건소 예방접종실로 문의\n\n○ 기타\n - 전화 : 054-380-7453~4",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-과수농가-자재-지원",
    "title": "과수농가 자재 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "관내 과수농가에 대한 자재 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "확인필요",
    "startDate": null,
    "endDate": null,
    "statusLabel": "공식 공고 확인",
    "statusConfidence": "unknown",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range",
      "ambiguous status",
      "status requires official confirmation"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": false,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "과수농가 자재 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "확인필요",
      "농어업인",
      "전체",
      "관내",
      "과수농가에",
      "대한",
      "자재",
      "지원"
    ],
    "summary": "관내 과수농가에 대한 자재 지원",
    "audience": "○ 군위군에 주소를 두고 농업경영체를 등록한 과수농가에게 농자재 지원",
    "benefits": [
      "관내 과수농가에 대한 자재 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 읍면 사무소 및 소재지 농협, 작물 농협 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000104",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000104",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 군위군에 주소를 두고 농업경영체를 등록한 과수농가에게 농자재 지원",
      "benefit": "관내 과수농가에 대한 자재 지원",
      "application": "○ 방문 신청\n - 읍면 사무소 및 소재지 농협, 작물 농협 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-난임부부-지원",
    "title": "난임부부 지원",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "난임부부에게 정부지원금 외 본인부담금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아·복지",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "난임부부 지원",
      "보건의료",
      "대구",
      "대구광역시 군위군",
      "모집중",
      "부모/육아",
      "아동",
      "임신·출산·육아",
      "복지",
      "난임부부에게",
      "정부지원금",
      "외"
    ],
    "summary": "난임부부에게 정부지원금 외 본인부담금 지원",
    "audience": "○ 체외수정(신선배아, 동결배아), 인공수정 및 비급여(배아동결비, 유산방지제, 착상유도제, 그 밖에 사항) 시술비 중 정부지원금을 제외한 본임부담금 90% 1회당 최대 100만원 지원",
    "benefits": [
      "난임부부에게 정부지원금 외 본인부담금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000105",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000105",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 체외수정(신선배아, 동결배아), 인공수정 및 비급여(배아동결비, 유산방지제, 착상유도제, 그 밖에 사항) 시술비 중 정부지원금을 제외한 본임부담금 90% 1회당 최대 100만원 지원",
      "benefit": "난임부부에게 정부지원금 외 본인부담금 지원",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-학교급식-후식-지원",
    "title": "학교급식 후식 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "관내 학교 학생 대상으로 후식 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "학교급식 후식 지원",
      "교육",
      "대구",
      "대구광역시 군위군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "관내",
      "학교",
      "학생",
      "대상으로"
    ],
    "summary": "관내 학교 학생 대상으로 후식 지원",
    "audience": "○ 관내학교 후식지원\n\n○ 후식지원사업\n - 지원대상 : 관내10개교(초,중,고학교)학생 전원\n - 후식용 제철과일 주2회 공급",
    "benefits": [
      "관내 학교 학생 대상으로 후식 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 시군구 : 군위 농업기술센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000116",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000116",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내학교 후식지원\n\n○ 후식지원사업\n - 지원대상 : 관내10개교(초,중,고학교)학생 전원\n - 후식용 제철과일 주2회 공급",
      "benefit": "관내 학교 학생 대상으로 후식 지원",
      "application": "○ 방문 신청\n - 시군구 : 군위 농업기술센터 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-고품질-과수-생산-지원",
    "title": "고품질 과수 생산 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "과수농가에 반사필름, 착색봉지 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "모집중",
    "startDate": null,
    "endDate": null,
    "statusLabel": "모집중",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "고품질 과수 생산 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "모집중",
      "농어업인",
      "전체",
      "과수농가에",
      "반사필름,",
      "착색봉지",
      "등",
      "지원"
    ],
    "summary": "과수농가에 반사필름, 착색봉지 등 지원",
    "audience": "○ 군위군에 주소를 두고 농업경영체를 등록한 과수농가에게 반사필름, 착색봉지, 수정촉진제, 친환경자재 지원\n - 지원기준 : 보조 50%, 자부담 50%",
    "benefits": [
      "과수농가에 반사필름, 착색봉지 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000121",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000121",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 군위군에 주소를 두고 농업경영체를 등록한 과수농가에게 반사필름, 착색봉지, 수정촉진제, 친환경자재 지원\n - 지원기준 : 보조 50%, 자부담 50%",
      "benefit": "과수농가에 반사필름, 착색봉지 등 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-출산양육비-지원",
    "title": "출산양육비 지원",
    "category": "교육",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "출생아에게 양육지원금 및 초·중·고 입학생에게 입학금 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "출산양육비 지원",
      "교육",
      "대구",
      "대구광역시 군위군",
      "상시",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "출생아에게",
      "양육지원금",
      "및",
      "초·중·고"
    ],
    "summary": "출생아에게 양육지원금 및 초·중·고 입학생에게 입학금 지원",
    "audience": "○ 출생양육지원금 및 입학생, 중3 재학생 지원금",
    "benefits": [
      "출생아에게 양육지원금 및 초·중·고 입학생에게 입학금 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 온라인 신청 \n - 정부24 : www.gov.kr\n\n○ 방문 신청\n - 보건소 : 관할 보건소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000122",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000122",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 출생양육지원금 및 입학생, 중3 재학생 지원금",
      "benefit": "출생아에게 양육지원금 및 초·중·고 입학생에게 입학금 지원",
      "application": "○ 온라인 신청 \n - 정부24 : www.gov.kr\n\n○ 방문 신청\n - 보건소 : 관할 보건소 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-한우분야-지원",
    "title": "한우분야 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "가축인공수정사 등에게 한우거세, 인공수정액 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "한우분야 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "상시",
      "농어업인",
      "전체",
      "가축인공수정사",
      "등에게",
      "한우거세,",
      "인공수정액",
      "지원"
    ],
    "summary": "가축인공수정사 등에게 한우거세, 인공수정액 지원",
    "audience": "○ 군위군에 인공수정소를 개설한 수의사 및 가축인공수정사",
    "benefits": [
      "가축인공수정사 등에게 한우거세, 인공수정액 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 관할 군청 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000102",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000102",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 군위군에 인공수정소를 개설한 수의사 및 가축인공수정사",
      "benefit": "가축인공수정사 등에게 한우거세, 인공수정액 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 관할 군청 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-임산부-건강관리-서비스",
    "title": "임산부 건강관리 서비스",
    "category": "보건의료",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "출산가구에 산모 및 신생아 건강관리 서비스 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "마감",
    "startDate": null,
    "endDate": null,
    "statusLabel": "마감",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "임신·출산·육아",
    "targetGroup": "부모/육아",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "임산부 건강관리 서비스",
      "보건의료",
      "대구",
      "대구광역시 군위군",
      "마감",
      "부모/육아",
      "전체",
      "임신·출산·육아",
      "출산가구에",
      "산모",
      "및",
      "신생아"
    ],
    "summary": "출산가구에 산모 및 신생아 건강관리 서비스 지원",
    "audience": "○ 산모 건강관리 : 유방관리, 부종관리, 영양관리, 좌욕지원, 산후 위생관리\n\n○ 신생아 건강관리 : 신생아 청결·위생관리(목욕, 배꼽관리, 기저귀교체, 용품소독), 수유 및 예방접종 지원\n\n○ 산모·신생아 가사지원 : 산모 식사준비, 산모 및 신생아 주 생활공간 청소, 산모 및 신생아 의류 세탁\n\n○ 산모 정보제공 및 정서지원 : 응급상황 발견 및 대응, 감염 예방 및 관리, 정서 상태 이해 및 지지\n\n ※ 산모·신생아 외 다른 가족 돌봄이나 일반 가사활동영역은 표준 서비스에 포함되지 않는 부가 서비스이므로 원하는 경우 별도로 추가구매가 필요함",
    "benefits": [
      "출산가구에 산모 및 신생아 건강관리 서비스 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 신청기한: 서비스 종료후 3개월 이내\n - 구비서류: 신분증, 산모수첩, 출생증명서(출산 후 신청 시) 등",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000113",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000113",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 산모 건강관리 : 유방관리, 부종관리, 영양관리, 좌욕지원, 산후 위생관리\n\n○ 신생아 건강관리 : 신생아 청결·위생관리(목욕, 배꼽관리, 기저귀교체, 용품소독), 수유 및 예방접종 지원\n\n○ 산모·신생아 가사지원 : 산모 식사준비, 산모 및 신생아 주 생활공간 청소, 산모 및 신생아 의류 세탁\n\n○ 산모 정보제공 및 정서지원 : 응급상황 발견 및 대응, 감염 예방 및 관리, 정서 상태 이해 및 지지\n\n ※ 산모·신생아 외 다른 가족 돌봄이나 일반 가사활동영역은 표준 서비스에 포함되지 않는 부가 서비스이므로 원하는 경우 별도로 추가구매가 필요함",
      "benefit": "출산가구에 산모 및 신생아 건강관리 서비스 지원",
      "application": "○ 방문 신청\n - 보건소 : 관할 보건소 방문\n - 신청기한: 서비스 종료후 3개월 이내\n - 구비서류: 신분증, 산모수첩, 출생증명서(출산 후 신청 시) 등",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-양돈분야-지원",
    "title": "양돈분야 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "축산농가에 돼지인공수정 및 톱밥 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양돈분야 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "돼지인공수정",
      "및",
      "톱밥",
      "지원"
    ],
    "summary": "축산농가에 돼지인공수정 및 톱밥 지원",
    "audience": "○ 관내 주소를 둔 돼지 사육 및 축산농가에 돼지 인공수정 및 톱밥 지원",
    "benefits": [
      "축산농가에 돼지인공수정 및 톱밥 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 관할 군청 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000114",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000114",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내 주소를 둔 돼지 사육 및 축산농가에 돼지 인공수정 및 톱밥 지원",
      "benefit": "축산농가에 돼지인공수정 및 톱밥 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 관할 군청 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-친환경-농업자재-지원",
    "title": "친환경 농업자재 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "○ 친환경 농업을 하는 농가에게 친환경 유기농업자재 구입비 일부 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "친환경 농업자재 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "상시",
      "농어업인",
      "전체",
      "○",
      "친환경",
      "농업을",
      "하는",
      "농가에게"
    ],
    "summary": "○ 친환경 농업을 하는 농가에게 친환경 유기농업자재 구입비 일부 지원",
    "audience": "○ 국립농산물품질관리원 유기농업자재 공시된 제품 구입비의 일부 보조",
    "benefits": [
      "○ 친환경 농업을 하는 농가에게 친환경 유기농업자재 구입비 일부 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 주소지 읍면 행정복지센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000117",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000117",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 국립농산물품질관리원 유기농업자재 공시된 제품 구입비의 일부 보조",
      "benefit": "○ 친환경 농업을 하는 농가에게 친환경 유기농업자재 구입비 일부 지원",
      "application": "○ 주소지 읍면 행정복지센터에 방문 신청",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-양봉분야-지원",
    "title": "양봉분야 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "대구광역시 군위군",
    "region": "대구",
    "amount": "양봉농가에 채밀기, 벌통 등 양봉기자재 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양봉분야 지원",
      "농림어업",
      "대구",
      "대구광역시 군위군",
      "상시",
      "농어업인",
      "전체",
      "양봉농가에",
      "채밀기,",
      "벌통",
      "등",
      "양봉기자재"
    ],
    "summary": "양봉농가에 채밀기, 벌통 등 양봉기자재 등 지원",
    "audience": "○ 관내 양봉농가를 대상으로 양봉분야 전반적인 지원\n - 채밀기지원, 토종벌종보전지원, 벌통지원, 화분지원, 양봉산물저온저장고 지원, 벌통전기가온장치 지원",
    "benefits": [
      "양봉농가에 채밀기, 벌통 등 양봉기자재 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 관할 군청 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000118",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/514000000118",
    "contact": "대구광역시 군위군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 관내 양봉농가를 대상으로 양봉분야 전반적인 지원\n - 채밀기지원, 토종벌종보전지원, 벌통지원, 화분지원, 양봉산물저온저장고 지원, 벌통전기가온장치 지원",
      "benefit": "양봉농가에 채밀기, 벌통 등 양봉기자재 등 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍면동 주민센터에 방문 신청\n - 시군구 : 관할 군청 방문",
      "contact": "대구광역시 군위군"
    }
  },
  {
    "slug": "gov24-양평군-보훈대상자-수당지원",
    "title": "양평군 보훈대상자 수당지원",
    "category": "복지",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "국가보훈대상자에 대한 보훈명예수당, 참전유공자에 대한 참전명예수당 등 지급(중복지원 불가)",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "복지",
    "targetGroup": "일반",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양평군 보훈대상자 수당지원",
      "복지",
      "경기",
      "경기도 양평군",
      "상시",
      "일반",
      "전체",
      "국가보훈대상자에",
      "대한",
      "보훈명예수당,",
      "참전유공자에",
      "참전명예수당"
    ],
    "summary": "국가보훈대상자에 대한 보훈명예수당, 참전유공자에 대한 참전명예수당 등 지급(중복지원 불가)",
    "audience": "○ 서비스 내용 : 양평군 국가보훈대상자를 대상으로 수당 지원\n\n○ 서비스 금액\n - 보훈명예수당 : 월 15만원\n - 참전명예수당 : 월 25만원\n - 배우자복지수당 : 월 15만원\n - 6.25전몰군경유자녀복지수당 : 월 15만원\n ※ 위 수당별 중복지급 안됨\n\n - 독립유공자 광복절기념 위문금 : 연 30만원\n - 사망위로금 : 일시금 30만원",
    "benefits": [
      "국가보훈대상자에 대한 보훈명예수당, 참전유공자에 대한 참전명예수당 등 지급(중복지원 불가)"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000115",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000115",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 서비스 내용 : 양평군 국가보훈대상자를 대상으로 수당 지원\n\n○ 서비스 금액\n - 보훈명예수당 : 월 15만원\n - 참전명예수당 : 월 25만원\n - 배우자복지수당 : 월 15만원\n - 6.25전몰군경유자녀복지수당 : 월 15만원\n ※ 위 수당별 중복지급 안됨\n\n - 독립유공자 광복절기념 위문금 : 연 30만원\n - 사망위로금 : 일시금 30만원",
      "benefit": "국가보훈대상자에 대한 보훈명예수당, 참전유공자에 대한 참전명예수당 등 지급(중복지원 불가)",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-양돈농가-모돈-갱신-지원",
    "title": "양돈농가 모돈 갱신 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "축산농가에 폐모돈 조기 도태 등 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양돈농가 모돈 갱신 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "폐모돈",
      "조기",
      "도태",
      "등"
    ],
    "summary": "축산농가에 폐모돈 조기 도태 등 지원",
    "audience": "○ 양돈농가를 대상으로 폐모돈 조기 도태 등 고품질 규격돈 생산기반 서비스 지원",
    "benefits": [
      "축산농가에 폐모돈 조기 도태 등 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 기타 : 대한한돈협회 양평군지부",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000102",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000102",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 양돈농가를 대상으로 폐모돈 조기 도태 등 고품질 규격돈 생산기반 서비스 지원",
      "benefit": "축산농가에 폐모돈 조기 도태 등 지원",
      "application": "○ 방문 신청\n - 기타 : 대한한돈협회 양평군지부",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-양봉장비-보급-지원",
    "title": "양봉장비 보급 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "양봉농가에 양봉장비 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "양봉장비 보급 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "상시",
      "농어업인",
      "전체",
      "양봉농가에",
      "양봉장비",
      "구입비",
      "지원"
    ],
    "summary": "양봉농가에 양봉장비 구입비 지원",
    "audience": "○ 양봉장비 구입비 지원",
    "benefits": [
      "양봉농가에 양봉장비 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000103",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000103",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 양봉장비 구입비 지원",
      "benefit": "양봉농가에 양봉장비 구입비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 거주지 관할 읍면동 주민센터에 방문 신청",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-가축분뇨-퇴비살포기-등-지원",
    "title": "가축분뇨 퇴비살포기 등 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "가축 사육농가에 가축분뇨 처리장비 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "가축분뇨 퇴비살포기 등 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "상시",
      "농어업인",
      "전체",
      "가축",
      "사육농가에",
      "가축분뇨",
      "처리장비",
      "구입비"
    ],
    "summary": "가축 사육농가에 가축분뇨 처리장비 구입비 지원",
    "audience": "○ 축산농가를 대상으로 가축분뇨 처리장비(퇴비살포기 등) 구입비 지원",
    "benefits": [
      "가축 사육농가에 가축분뇨 처리장비 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000109",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000109",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 축산농가를 대상으로 가축분뇨 처리장비(퇴비살포기 등) 구입비 지원",
      "benefit": "가축 사육농가에 가축분뇨 처리장비 구입비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 주소지 관할 읍·면·동 주민센터 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-젖소-개체-관리장비-지원",
    "title": "젖소 개체 관리장비 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "젖소 사육농가에 젖소 개체 관리 장비 구입비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "젖소 개체 관리장비 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "상시",
      "농어업인",
      "전체",
      "젖소",
      "사육농가에",
      "개체",
      "관리",
      "장비"
    ],
    "summary": "젖소 사육농가에 젖소 개체 관리 장비 구입비 지원",
    "audience": "○ 자동급이기, 보정목걸이, 착유펌프 등 젖소 개체 관리 장비 구입비 지원",
    "benefits": [
      "젖소 사육농가에 젖소 개체 관리 장비 구입비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 관할 읍·면사무소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000113",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000113",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 자동급이기, 보정목걸이, 착유펌프 등 젖소 개체 관리 장비 구입비 지원",
      "benefit": "젖소 사육농가에 젖소 개체 관리 장비 구입비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 관할 읍·면사무소 방문",
      "contact": "경기도 양평군"
    }
  },
  {
    "slug": "gov24-축사-환기시설-환풍기-등-설치-지원",
    "title": "축사 환기시설(환풍기 등) 설치 지원",
    "category": "농림어업",
    "source": "정부24 공공서비스 API",
    "agency": "경기도 양평군",
    "region": "경기",
    "amount": "축산농가에 축사 환기시설 설치비 지원",
    "deadline": "공식 공고 확인",
    "dday": "확인필요",
    "status": "상시",
    "startDate": null,
    "endDate": null,
    "statusLabel": "상시",
    "statusConfidence": "known",
    "dateConfidence": "unknown",
    "applicationPeriodLabel": "공식 공고 확인",
    "requiresOfficialConfirmation": true,
    "warnings": [
      "ambiguous date range"
    ],
    "publishPolicy": {
      "canPublish": true,
      "includeInSearch": true,
      "includeInAllList": true,
      "includeInCategoryPage": true,
      "includeInRegionPage": true,
      "includeInStatusFilters": true,
      "includeInDeadlineSort": false,
      "showDday": false,
      "requiresOfficialConfirmation": true
    },
    "lifeStage": "전체",
    "targetGroup": "농어업인",
    "income": "공식 공고 확인",
    "applyOnline": false,
    "tags": [
      "축사 환기시설(환풍기 등) 설치 지원",
      "농림어업",
      "경기",
      "경기도 양평군",
      "상시",
      "농어업인",
      "전체",
      "축산농가에",
      "축사",
      "환기시설",
      "설치비",
      "지원"
    ],
    "summary": "축산농가에 축사 환기시설 설치비 지원",
    "audience": "○ 축산농가를 대상으로 축사 환기시설 설치비 지원",
    "benefits": [
      "축산농가에 축사 환기시설 설치비 지원"
    ],
    "documents": [
      "공식 공고 확인"
    ],
    "apply": "○ 방문 신청\n - 주민센터 : 관할 읍·면사무소 방문",
    "officialUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000123",
    "officialSourceUrl": "https://www.gov.kr/portal/rcvfvrSvc/dtlEx/417000000123",
    "contact": "경기도 양평군",
    "views": 0,
    "updatedAt": "2026.05.27",
    "matchReasons": [
      "Gov24 공식 공공서비스 원문 기준",
      "공식 신청처 확인 필요"
    ],
    "faq": [
      {
        "q": "GovFind에서 신청 가능 여부를 확정하나요?",
        "a": "아니요. 최종 자격과 신청 가능 여부는 공식 기관에서 확인해야 합니다."
      }
    ],
    "apiDetails": {
      "target": "○ 축산농가를 대상으로 축사 환기시설 설치비 지원",
      "benefit": "축산농가에 축사 환기시설 설치비 지원",
      "application": "○ 방문 신청\n - 주민센터 : 관할 읍·면사무소 방문",
      "contact": "경기도 양평군"
    }
  }
];

policies.push(...gov24PromotionPoliciesBatch3);

policies.push(...welfareApiPolicies);
policies.push(...localWelfareApiPolicies);
policies.push(...publicServiceApiPolicies);
policies.push(...kstartupApiPolicies);
policies.push(...youthApiPolicies);

export const categoryGroups = [
  { slug: "youth", label: "청년", keywords: ["청년", "청년도약", "청년농"] },
  { slug: "welfare", label: "복지", keywords: ["복지", "장려금", "급여", "긴급"] },
  { slug: "housing", label: "주거", keywords: ["주거", "월세", "주거급여"] },
  { slug: "job", label: "고용", keywords: ["고용", "취업", "직업훈련"] },
  { slug: "startup", label: "창업", keywords: ["창업", "사업화", "예비창업"] },
  { slug: "education", label: "교육", keywords: ["교육", "훈련", "내일배움"] },
  { slug: "health", label: "보건의료", keywords: ["보건", "의료", "진료비"] },
  { slug: "culture", label: "문화생활", keywords: ["문화", "생활", "문화누리", "여가"] },
  { slug: "farming", label: "농림어업", keywords: ["농림", "농업", "어업", "영농"] },
  { slug: "small-business", label: "소상공인", keywords: ["소상공인", "정책자금", "사업자"] }
];

export const categories = categoryGroups.map((category) => category.label);
export const regions = ["전국", "서울", "경기", "인천", "부산", "대구", "광주", "대전", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "지역별"];
export const lifeStages = ["청년", "사업자", "청년·중장년", "취약계층", "예비창업·초기창업", "임신·출산·육아", "아동·청소년", "근로자·사업자", "청년·농업인", "어르신", "신혼부부", "농업인", "어업인", "구직자", "청년·근로자"];
export const sources = ["복지로", "복지로 API", "정부24 공공서비스 API", "정부24·지자체", "고용24", "K-Startup", "K-Startup API", "소상공인 정책자금", "국세청", "서민금융진흥원", "국민건강보험", "농림축산식품부", "문화누리", "스포츠강좌이용권", "노인일자리여기", "주택도시기금", "근로복지공단", "해양수산부"];
export const popularKeywords = ["근로장려금", "청년월세", "국민취업지원제도", "소상공인 정책자금", "자녀장려금", "청년도약계좌", "주거급여", "에너지바우처", "내일배움카드", "기초연금", "문화누리카드", "실업급여", "전세자금"];
