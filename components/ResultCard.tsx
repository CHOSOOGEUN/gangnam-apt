"use client";

import { useRef, useEffect, useState } from "react";
import { toPng } from "html-to-image";

interface Props {
  salary: number;
  months: number;
  regionName: string;
  regionPrice: number;
  savingsRate: number;
  comparisons: { emoji: string; label: string; count: number; unit: string }[];
  confettiTrigger: number;
  formatYears: (months: number) => string;
  formatCount: (count: number) => string;
}

interface Level {
  emoji: string;
  label: string;
  color: string;
  bg: string;
  comment: string;
}

function getLevel(months: number): Level {
  const years = months / 12;
  if (years < 15)  return { emoji: "💪", label: "희망 레벨",  color: "#4ade80", bg: "rgba(74,222,128,0.12)",  comment: "열심히 하면 가능해요!" };
  if (years < 30)  return { emoji: "😤", label: "노력 레벨",  color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  comment: "열심히 사세요 ^^" };
  if (years < 50)  return { emoji: "😢", label: "절망 레벨",  color: "#f97316", bg: "rgba(249,115,22,0.12)",  comment: "지방이 살기 좋습니다 🏡" };
  if (years < 80)  return { emoji: "😱", label: "공포 레벨",  color: "#ef4444", bg: "rgba(239,68,68,0.12)",   comment: "포기가 답입니다" };
  return             { emoji: "💀", label: "지옥 레벨",  color: "#a855f7", bg: "rgba(168,85,247,0.12)",  comment: "다음 생을 기약하세요 🙏" };
}

function useCountUp(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    setValue(0);
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function ResultCard({
  salary,
  months,
  regionName,
  regionPrice,
  savingsRate,
  comparisons,
  confettiTrigger,
  formatYears,
  formatCount,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const animatedMonths = useCountUp(months);
  const level = getLevel(months);
  const comment = level.comment;

  // 흔들림 + 진입 애니메이션
  useEffect(() => {
    if (confettiTrigger === 0) return;
    wrapRef.current?.classList.remove("shake");
    void wrapRef.current?.offsetWidth; // reflow
    wrapRef.current?.classList.add("shake");
  }, [confettiTrigger]);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#0d0d1a",
      });
      const link = document.createElement("a");
      link.download = "강남아파트_계산결과.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}?s=${salary}`;
    const text = `월급 ${salary.toLocaleString()}만원으로 ${regionName} 아파트 사려면 ${formatYears(months)} 걸린다고?! ${level.emoji}\n👉 내 월급도 계산해보기: ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "내 월급으로 아파트 사려면?", text, url });
      } catch {
        // 사용자가 공유 취소한 경우 무시
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert("클립보드에 복사됐어요! 카톡이나 인스타에 공유해보세요 😄");
      } catch {
        alert("복사 실패. 직접 URL을 복사해주세요: " + url);
      }
    }
  };

  const progressPct = Math.min((animatedMonths / months) * 100, 100);
  const priceLabel = `${(regionPrice / 100_000_000).toFixed(0)}억`;

  return (
    <div ref={wrapRef} className="w-full max-w-md fade-in-up">
      {/* 공유/저장용 카드 */}
      <div
        ref={cardRef}
        className="rounded-2xl p-6 mb-4"
        style={{ background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* 레벨 뱃지 */}
        <div className="flex justify-center mb-4">
          <div
            className="pulse-badge px-4 py-1.5 rounded-full text-sm font-black flex items-center gap-1.5"
            style={{ background: level.bg, border: `1px solid ${level.color}40`, color: level.color }}
          >
            {level.emoji} {level.label}
          </div>
        </div>

        {/* 헤더 라벨 */}
        <p className="text-gray-400 text-xs text-center mb-1 tracking-wider">
          월급 {salary.toLocaleString()}만원 · {savingsRate}% 저축 · {regionName} 아파트 ({priceLabel})
        </p>

        {/* 메인 숫자 */}
        <div className="text-center py-5">
          <div className="gradient-text-yellow glow-text text-6xl md:text-7xl font-black leading-tight">
            {formatYears(animatedMonths)}
          </div>
          <p className="text-gray-400 text-sm mt-3">{comment}</p>
        </div>

        {/* 프로그레스 바 */}
        <div
          className="w-full rounded-full h-1 mb-6 overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
              transition: "width 0.1s ease",
            }}
          />
        </div>

        {/* 구분선 */}
        <div className="mb-5" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

        {/* Bento Grid */}
        <p className="text-gray-500 text-xs mb-3 tracking-widest uppercase text-center">
          {priceLabel}으로 대신 살 수 있는 것들
        </p>
        <div className="grid grid-cols-2 gap-2">
          {comparisons.slice(0, 2).map((c) => (
            <div
              key={c.label}
              className="rounded-2xl p-4 flex flex-col gap-1"
              style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-2xl">{c.emoji}</span>
              <div className="text-white font-black text-2xl mt-1">
                {formatCount(c.count)}
                <span className="text-sm font-normal text-gray-400 ml-1">{c.unit}</span>
              </div>
              <div className="text-gray-400 text-xs">{c.label}</div>
            </div>
          ))}
          {comparisons.slice(2).map((c) => (
            <div
              key={c.label}
              className="rounded-xl px-3 py-2.5 flex items-center gap-2"
              style={{ background: "#161628", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span className="text-lg">{c.emoji}</span>
              <div>
                <div className="text-white font-bold text-sm">
                  {formatCount(c.count)}
                  <span className="text-xs font-normal text-gray-400 ml-1">{c.unit}</span>
                </div>
                <div className="text-gray-500 text-xs">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 워터마크 */}
        <p className="text-gray-700 text-xs text-center mt-5">gangnam-apt.vercel.app</p>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2">
        <button onClick={handleShare} className="btn-primary flex-1 text-white font-bold py-3 rounded-xl cursor-pointer">
          공유하기 📤
        </button>
        <button
          onClick={handleDownload}
          className="flex-1 text-white font-bold py-3 rounded-xl transition cursor-pointer hover:brightness-125"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          이미지 저장 🖼️
        </button>
      </div>
    </div>
  );
}
