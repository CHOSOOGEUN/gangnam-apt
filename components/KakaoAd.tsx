"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adfit?: {
      destroy: (unit: string) => void;
    };
  }
}

interface Props {
  adUnit: string;
  width: number;
  height: number;
  disabled?: boolean;
}

export default function KakaoAd({ adUnit, width, height, disabled = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    // Clean up if it already has children (React 18 Strict Mode handling)
    if (container.children.length > 0) {
      container.innerHTML = "";
    }

    const ins = document.createElement("ins");
    ins.className = "kakao_ad_area";
    ins.style.display = "none";
    ins.setAttribute("data-ad-width", String(width));
    ins.setAttribute("data-ad-height", String(height));
    ins.setAttribute("data-ad-unit", adUnit);
    container.appendChild(ins);

    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/kas/static/ba.min.js";
    script.async = true;
    script.type = "text/javascript";
    container.appendChild(script);

    return () => {
      if (container) {
        const globalAdfit = window.adfit;
        if (globalAdfit) {
          globalAdfit.destroy(adUnit);
        }
        container.innerHTML = "";
      }
    };
  }, [adUnit, width, height, disabled]);

  return <div ref={containerRef} />;
}
