import type { Policy } from "../data/policies";
import { sourceLabel } from "./sourceNames";

export const supportedPolicyTags = [
  "정책자금",
  "창업",
  "예비창업",
  "초기창업",
  "사업화",
  "기술지원",
  "수출",
  "판로",
  "경영",
  "마케팅",
  "인증",
  "투자",
  "소상공인",
  "청년취업",
  "청년주거",
  "청년창업",
  "청년교육",
  "긴급복지",
  "생계",
  "의료",
  "주거급여",
  "장애인",
  "노인",
  "한부모",
  "아동청소년",
  "농기계",
  "영농",
  "귀농",
  "축산",
  "어업"
] as const;

export type DerivedPolicyTag = (typeof supportedPolicyTags)[number];

const tagRules: Array<{ tag: DerivedPolicyTag; terms: string[] }> = [
  { tag: "정책자금", terms: ["정책자금", "융자", "대출", "자금", "운전자금", "시설자금", "경영안정자금", "이차보전"] },
  { tag: "창업", terms: ["창업", "스타트업", "벤처", "창업지원", "창업기업"] },
  { tag: "예비창업", terms: ["예비창업", "예비 창업", "예비창업자"] },
  { tag: "초기창업", terms: ["초기창업", "초기 창업", "창업초기", "창업 초기"] },
  { tag: "사업화", terms: ["사업화", "상용화", "실증", "스케일업", "scaleup", "scale-up"] },
  { tag: "기술지원", terms: ["기술지원", "기술 지원", "기술개발", "연구개발", "r&d", "r d", "rd", "시제품", "기술닥터", "기술혁신"] },
  { tag: "수출", terms: ["수출", "해외진출", "해외 진출", "글로벌", "바이어", "무역", "해외시장"] },
  { tag: "판로", terms: ["판로", "입점", "홈쇼핑", "온라인몰", "판매", "유통", "시장개척"] },
  { tag: "경영", terms: ["경영", "컨설팅", "멘토링", "경영개선", "경영안정", "esg"] },
  { tag: "마케팅", terms: ["마케팅", "홍보", "광고", "브랜드", "브랜딩"] },
  { tag: "인증", terms: ["인증", "특허", "지식재산", "ip", "상표", "시험분석", "규격"] },
  { tag: "투자", terms: ["투자", "ir", "펀드", "엔젤", "vc", "투자유치"] },
  { tag: "소상공인", terms: ["소상공인", "소공인", "자영업", "자영업자", "중소기업", "기업지원", "중소벤처"] },
  { tag: "청년취업", terms: ["청년취업", "청년 취업", "청년일자리", "청년 일자리", "청년고용", "청년 고용", "미취업 청년"] },
  { tag: "청년주거", terms: ["청년주거", "청년 주거", "청년월세", "청년 월세", "청년전세", "청년 전세", "머물자리론"] },
  { tag: "청년창업", terms: ["청년창업", "청년 창업", "청년스타트업", "청년 스타트업"] },
  { tag: "청년교육", terms: ["청년교육", "청년 교육", "청년훈련", "청년 훈련", "청년역량", "청년 역량"] },
  { tag: "긴급복지", terms: ["긴급복지", "긴급 복지", "위기지원", "위기 지원"] },
  { tag: "생계", terms: ["생계", "생활비", "생계급여", "생계지원"] },
  { tag: "의료", terms: ["의료", "의료비", "진료", "건강", "치료", "검진", "예방접종"] },
  { tag: "주거급여", terms: ["주거급여", "임차급여", "수선유지급여"] },
  { tag: "장애인", terms: ["장애인", "발달장애", "중증장애", "장애아"] },
  { tag: "노인", terms: ["노인", "어르신", "고령", "기초연금"] },
  { tag: "한부모", terms: ["한부모", "미혼모", "미혼부", "조손가족"] },
  { tag: "아동청소년", terms: ["아동", "청소년", "아동청소년", "학교밖청소년", "보육", "양육"] },
  { tag: "농기계", terms: ["농기계", "농업기계", "기계화", "임대사업"] },
  { tag: "영농", terms: ["영농", "농업", "농가", "농작물", "농산물", "농업인"] },
  { tag: "귀농", terms: ["귀농", "귀촌", "청년농", "후계농"] },
  { tag: "축산", terms: ["축산", "가축", "한우", "양돈", "낙농", "양계"] },
  { tag: "어업", terms: ["어업", "어촌", "수산", "어선", "양식"] }
];

function tagText(policy: Policy) {
  return [
    policy.title,
    policy.summary,
    policy.category,
    policy.source,
    sourceLabel(policy.source),
    policy.agency,
    policy.lifeStage,
    policy.targetGroup,
    policy.audience,
    policy.amount,
    policy.apply,
    policy.benefits.join(" "),
    policy.documents.join(" "),
    policy.tags.join(" "),
    policy.apiDetails?.target,
    policy.apiDetails?.criteria,
    policy.apiDetails?.benefit,
    policy.apiDetails?.application
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function derivePolicyTags(policy: Policy): string[] {
  const text = tagText(policy);
  const tags = new Set<string>();

  for (const rule of tagRules) {
    if (rule.terms.some((term) => text.includes(term.toLowerCase()))) {
      tags.add(rule.tag);
    }
  }

  return supportedPolicyTags.filter((tag) => tags.has(tag));
}
