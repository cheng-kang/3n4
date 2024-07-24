"use client";
import React from "react";
import Image from "next/image";
import { FlipContainer } from "./components/FlipContainer";
import BusinessCardFront from "./components/BusinessCardFront";
import BusinessCardBack from "./components/BusinessCardBack";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center md:p-24">
      <FlipContainer
        className="w-[368px] h-[596px] md:w-[596px] md:h-[368px]"
        front={<BusinessCardFront />}
        back={<BusinessCardBack />}
      />
      {/* <div>
        <div className="btn-96">
          <span className="relative">
            <Image
              src="/white-paper-texture.jpg"
              alt="card background"
              fill
              className="absolute inset-0 opacity-50 z-0"
            />
            <div className="z-10">Flip</div>
          </span>
        </div>
      </div> */}
    </main>
  );
}
