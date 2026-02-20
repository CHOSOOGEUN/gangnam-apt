"use client";

import { useState, useRef, useEffect } from "react";
import ResultCard from "@/components/ResultCard";
import Confetti from "@/components/Confetti";
import KakaoAd from "@/components/KakaoAd";

export const REGIONS = [
  { name: "강남", emoji: "👑", price: 3_000_000_000 },
  { name: "서초", emoji: "🎓", price: 2_500_000_000 },
  { name: "마용성", emoji: "🏙️", price: 1_500_000_000 },
  { name: "송파", emoji: "🏢", price: 1_800_000_000 },
  { name: "판교", emoji: "💼", price: 800_000_000 },
  { name: "지방", emoji: "🏡", price: 300_000_000 },
];

const COMPARISONS_BY_REGION = [
  { emoji: "🏠", label: "제주도 아파트", price: 300_000_000, unit: "채" },
  { emoji: "🚗", label: "포르쉐 카이엔", price: 150_000_000, unit: "대" },
  { emoji: "📱", label: "아이폰 16 Pro", price: 1_800_000, unit: "대" },
  { emoji: "☕", label: "스타벅스 아메리카노", price: 4_500, unit: "잔" },
  { emoji: "🍺", label: "편의점 맥주", price: 2_500, unit: "캔" },
  { emoji: "✈️", label: "유럽 왕복 비행기", price: 2_000_000, unit: "번" },
];

export function formatYears(months: number) {
  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  if (years === 0) return `${remainMonths}개월`;
  if (remainMonths === 0) return `${years.toLocaleString()}년`;
  return `${years.toLocaleString()}년 ${remainMonths}개월`;
}

export function formatCount(count: number) {
  if (count >= 100_000_000) return `${(count / 100_000_000).toFixed(1)}억`;
  if (count >= 10_000) return `${Math.floor(count / 10_000).toLocaleString()}만`;
  return count.toLocaleString();
}

export default function Home() {
  const [salary, setSalary] = useState("");
  const [regionIdx, setRegionIdx] = useState(0);
  const [savingsRate, setSavingsRate] = useState(100);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [result, setResult] = useState<null | {
    months: number;
    regionName: string;
    regionPrice: number;
    savingsRate: number;
    comparisons: { emoji: string; label: string; count: number; unit: string }[];
  }>(null);

  const resultRef = useRef<HTMLDivElement>(null);

  // URL params에서 초기 salary 읽기
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("s");
    const num = Number(s);
    if (s && !isNaN(num) && num > 0 && num <= 100_000) {
      setSalary(num.toLocaleString());
    }
  }, []);

  const calculate = () => {
    const raw = Number(salary.replace(/,/g, ""));
    if (!raw || raw <= 0) return;

    const region = REGIONS[regionIdx];
    const monthlySaving = raw * 10_000 * (savingsRate / 100);
    const months = Math.ceil(region.price / monthlySaving);
    const comparisons = COMPARISONS_BY_REGION.map((c) => ({
      emoji: c.emoji,
      label: c.label,
      count: Math.floor(region.price / c.price),
      unit: c.unit,
    }));

    setResult({ months, regionName: region.name, regionPrice: region.price, savingsRate, comparisons });
    setConfettiTrigger((n) => n + 1);

    // URL 업데이트 (공유용)
    const url = new URL(window.location.href);
    url.searchParams.set("s", String(raw));
    window.history.replaceState(null, "", url.toString());

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setSalary(raw ? Number(raw).toLocaleString() : "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") calculate();
  };

  const region = REGIONS[regionIdx];

  return (
    <main
      className="min-h-screen text-white overflow-x-hidden"
      style={{
        background:
          "radial-gradient(ellipse 100% 55% at 50% -5%, #3b0764 0%, #0d0d1a 55%, #05050F 100%)",
      }}
    >
      <Confetti trigger={confettiTrigger} />

      {/* 상단 장식선 */}
      <div className="glow-line w-full" />

      <div className="flex flex-col items-center px-4 pt-20 pb-12">
        {/* 뱃지 */}
        <div
          className="mb-8 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(124, 58, 237, 0.15)",
            border: "1px solid rgba(124, 58, 237, 0.35)",
            color: "#c4b5fd",
          }}
        >
          2026 현실 자각 계산기
        </div>

        {/* 제목 */}
        <h1 className="text-4xl md:text-6xl font-black text-center leading-tight mb-4">
          내 월급으로
          <br />
          {region.emoji} <span className="gradient-text">{region.name} 아파트</span> 사려면?
        </h1>
        <p className="text-gray-400 text-center text-sm mb-10">
          밥도 안 먹고 &nbsp;·&nbsp; 여행도 포기 &nbsp;·&nbsp; 커피도 끊고 &nbsp;·&nbsp; 오직 저축만 한다면...
        </p>

        {/* 입력 카드 */}
        <div
          className="w-full max-w-md rounded-2xl p-6"
          style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          {/* 지역 탭 */}
          <p className="text-xs text-gray-400 mb-2 tracking-widest uppercase font-semibold">지역 선택</p>
          <div className="grid grid-cols-3 gap-1.5 mb-5">
            {REGIONS.map((r, i) => (
              <button
                key={r.name}
                onClick={() => setRegionIdx(i)}
                className="py-2 rounded-xl text-xs font-semibold transition cursor-pointer flex flex-col items-center gap-0.5"
                style={{
                  background: regionIdx === i ? "rgba(124,58,237,0.25)" : "rgba(255,255,255,0.04)",
                  border: regionIdx === i ? "1px solid rgba(124,58,237,0.6)" : "1px solid rgba(255,255,255,0.07)",
                  color: regionIdx === i ? "#c4b5fd" : "#6b7280",
                }}
              >
                <span>{r.emoji}</span>
                <span>{r.name}</span>
              </button>
            ))}
          </div>

          {/* 가격 표시 */}
          <p className="text-gray-500 text-xs mb-4 text-center">
            {region.name} 기준가: <span className="text-gray-300 font-semibold">{(region.price / 100_000_000).toFixed(0)}억원</span>
          </p>

          {/* 월급 입력 */}
          <label className="block text-xs text-gray-400 mb-2 tracking-widest uppercase font-semibold">
            월 세후 급여
          </label>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                inputMode="numeric"
                value={salary}
                onChange={handleSalary}
                onKeyDown={handleKeyDown}
                placeholder="300"
                className="input-focus w-full rounded-xl px-4 py-3 text-lg text-white placeholder-gray-600 transition"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">만원</span>
            </div>
            <button onClick={calculate} className="btn-primary text-white font-bold px-5 py-3 rounded-xl cursor-pointer whitespace-nowrap">
              계산하기
            </button>
          </div>

          {/* 빠른 선택 */}
          <div className="flex gap-2 flex-wrap mb-5">
            {[200, 300, 400, 500].map((v) => (
              <button
                key={v}
                onClick={() => setSalary(v.toLocaleString())}
                className="text-xs text-gray-400 hover:text-white px-3 py-1 rounded-full transition cursor-pointer"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {v}만원
              </button>
            ))}
          </div>

          {/* 저축률 슬라이더 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs text-gray-400 tracking-widest uppercase font-semibold">저축률</label>
              <span
                className="text-sm font-black"
                style={{ color: savingsRate === 100 ? "#fbbf24" : "#c4b5fd" }}
              >
                {savingsRate}%
                {savingsRate === 100 && <span className="text-xs text-gray-500 ml-1">(풀 저축 😤)</span>}
                {savingsRate <= 30 && <span className="text-xs text-gray-500 ml-1">(현실적 👍)</span>}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={savingsRate}
              onChange={(e) => setSavingsRate(Number(e.target.value))}
            />
            <div className="flex justify-between text-gray-600 text-xs mt-1">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 결과 */}
      {result && (
        <div ref={resultRef} className="px-4 pb-24 flex flex-col items-center">
          <ResultCard
            salary={Number(salary.replace(/,/g, ""))}
            months={result.months}
            regionName={result.regionName}
            regionPrice={result.regionPrice}
            savingsRate={result.savingsRate}
            comparisons={result.comparisons}
            confettiTrigger={confettiTrigger}
            formatYears={formatYears}
            formatCount={formatCount}
          />
        </div>
      )}

      {result && (
        <KakaoAd adUnit="DAN-MrHcRNVMy2bQlG6t" width={320} height={50} />
      )}

      {result && (
        <KakaoAd adUnit="DAN-M0niQMYer1DWHOUH" width={300} height={250} />
      )}

      <footer className="text-center text-gray-600 text-xs pb-20">
        현실 자각용 사이트입니다 😇 &nbsp;·&nbsp; 가격은 2026년 평균 기준
      </footer>

      <KakaoAd adUnit="DAN-TkltDIU8Q3h51GuJ" width={320} height={50} />
    </main>
  );
}
