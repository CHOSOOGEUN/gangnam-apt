"use client";

import { useEffect, useRef } from "react";

interface Props {
  adUnit: string;
  width: number;
  height: number;
}

declare global {
  interface Window {
    adfit?: { destroy: (unit: string) => void };
  }
}

export default function KakaoAd({ adUnit, width, height }: Props) {
  const scriptElementWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scriptElementWrapper.current) {
      const script = document.createElement("script");
      script.setAttribute("src", "https://t1.daumcdn.net/kas/static/ba.min.js");
      script.setAttribute("async", "true");
      scriptElementWrapper.current.appendChild(script);

      return () => {
        const globalAdfit = window.adfit;
        if (globalAdfit) globalAdfit.destroy(adUnit);
      };
    }
  }, [adUnit]);

  return (
    <div ref={scriptElementWrapper}>
      <ins
        className="kakao_ad_area"
        style={{ display: "none" }}
        data-ad-unit={adUnit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  );
}
