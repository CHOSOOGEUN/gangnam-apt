"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    if (typeof window !== "undefined" && window.kakaoAdfit) {
      window.kakaoAdfit.display(adUnit);
    }
  }, [adUnit]);

  return (
    <ins
      className="kakao_ad_area"
      data-ad-unit={adUnit}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
    />
  );
}
