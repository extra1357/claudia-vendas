"use client";
import { useState, useEffect } from "react";
const IMAGES = [
  "/bg/bg1.webp",
  "/bg/bg2.webp",
  "/bg/bg3.webp",
  "/bg/bg4.webp",
];
export default function FundoAnimado() {
  const [atual, setAtual] = useState(0);
  const [prox, setProx] = useState(1);
  const [trocando, setTrocando] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setTrocando(true);
      setTimeout(() => {
        setAtual((i) => (i + 1) % IMAGES.length);
        setProx((i) => (i + 2) % IMAGES.length);
        setTrocando(false);
      }, 3000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes kenburns {
          0%   { transform: scale(1.08); }
          100% { transform: scale(1.0); }
        }
        @keyframes kenburns2 {
          0%   { transform: scale(1.0); }
          100% { transform: scale(1.08); }
        }
      `}
      </style>
      <img src={IMAGES[atual]} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover",
        opacity: trocando ? 0 : 0.75,
        transition: "opacity 3s ease-in-out",
        animation: "kenburns 10s ease-in-out forwards",
        transformOrigin: "center center",
      }} />
      <img src={IMAGES[prox]} alt="" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover",
        opacity: trocando ? 0.75 : 0,
        transition: "opacity 3s ease-in-out",
        animation: "kenburns2 10s ease-in-out forwards",
        transformOrigin: "center center",
      }} />
    </div>
  );
}
