"use client";

import { useEffect, useRef } from "react";

interface Props {
  adUnit: string;
  width: number;
  height: number;
}

declare global {
  interface Window {
    kakaoAdfit?: { display: (unit: string) => void };
  }
}

export default function KakaoAd({ adUnit, width, height }: Props) {
  const ref = useRef<HTMLInsElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.kakaoAdfit) {
      window.kakaoAdfit.display(adUnit);
    }
  }, [adUnit]);

  return (
    <ins
      ref={ref}
      className="kakao_ad_area"
      style={{ display: "none" }}
      data-ad-unit={adUnit}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
    />
  );
}
