const audiences = ["개인", "가구", "사업자"];
const lifeStages = ["청년", "신혼부부", "임신·출산", "구직자", "소상공인", "어르신"];
const regions = ["전국", "서울", "경기", "인천", "부산", "대구", "광주", "대전"];
const applyTypes = [
  { label: "온라인 우선", value: "online" },
  { label: "오프라인 포함", value: "mixed" },
  { label: "공식처 확인", value: "check" }
];

export function QuickFinder() {
  return (
    <form action="/support" className="finder" id="quick-finder">
      <div className="grid grid-4">
        <label className="field">대상
          <select name="audience" className="select">{audiences.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="field">생애주기
          <select name="lifeStage" className="select"><option value="">전체</option>{lifeStages.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="field">지역
          <select name="region" className="select">{regions.map((item) => <option key={item}>{item}</option>)}</select>
        </label>
        <label className="field">신청 방식
          <select name="applyType" className="select"><option value="">전체</option>{applyTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
        </label>
      </div>
      <div className="grid grid-4">
        <input className="input" name="q" style={{ gridColumn: "span 3" }} placeholder="근로장려금, 청년월세, 환급금, 소상공인 정책자금 검색" />
        <button className="button" type="submit">조건으로 찾기</button>
      </div>
      <p className="muted">최종 자격 및 신청은 공식 기관에서 확인합니다.</p>
    </form>
  );
}
