"use client";

interface Props {
  adUnit: string;
  width: number;
  height: number;
}

export default function KakaoAd({ adUnit, width, height }: Props) {
  return (
    <ins
      className="kakao_ad_area"
      style={{ display: "block", width: `${width}px`, minHeight: `${height}px` }}
      data-ad-unit={adUnit}
      data-ad-width={String(width)}
      data-ad-height={String(height)}
    />
  );
}
