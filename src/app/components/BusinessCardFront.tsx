import React from "react";
import Image from "next/image";

const stopPropagationOnClick = (e: React.MouseEvent) => {
  e.stopPropagation();
};

const BusinessCardFront: React.FC = () => {
  return (
    <section className="relative bg-card w-[368px] h-[596px] md:w-[596px] md:h-[368px] shadow-[2px_4px_4px_0px_rgba(0,_0,_0,_0.25)] p-[32px] box-border">
      <Image
        src="/white-paper-texture.jpg"
        alt="card background"
        fill
        className="absolute inset-0 opacity-50 z-0"
      />
      <div className="h-full grid gap-0 grid-cols-7 grid-rows-12 md:grid-rows-6 relative z-10">
        <div className="col-span-7 md:col-span-3 md:col-start-5 md:row-start-1 flex flex-row justify-end items-start">
          <a
            target="_blank"
            href="https://chengkang.me/about"
            className="underline"
            onClick={stopPropagationOnClick}
          >
            About
          </a>
        </div>
        <div className="col-span-7 row-span-3 row-start-5 md:col-span-4 md:row-span-2 md:col-start-1 md:row-start-3">
          <div
            className="text-[28px] leading-none whitespace-pre text-right mr-[18px]"
            onClick={stopPropagationOnClick}
          >{`Ppl is
what
they like_`}</div>
        </div>
        <div className="col-span-7 row-start-9 md:col-span-3 md:col-start-5 md:row-start-3 flex flex-col relative">
          <div
            className="text-[20px] leading-none"
            onClick={stopPropagationOnClick}
          >
            Software Engineer
          </div>
          <div
            className="text-[16px] leading-none"
            onClick={stopPropagationOnClick}
          >
            (Frontend)
          </div>
        </div>
        <div className="col-span-7 row-start-11 md:col-span-3 md:col-start-5 md:row-start-5">
          <div
            className="text-[13px] opacity-60 leading-none whitespace-pre"
            onClick={stopPropagationOnClick}
          >{`Placeholder
for future improvement`}</div>
        </div>
        <div className="col-span-7 row-start-3 md:col-span-4 md:col-start-1 md:row-start-6 flex flex-row justify-start items-end">
          <div
            className="text-[40px] leading-none whitespace-nowrap"
            onClick={stopPropagationOnClick}
          >
            CHENG, KANG
            <sup className="text-[0.4em] top-[-1.5em]">
              <a
                href="https://translate.google.com/?sl=auto&tl=en&text=%E7%A8%8B%E5%BA%B7&op=translate"
                target="_blank"
                onClick={stopPropagationOnClick}
              >
                [1]
              </a>
            </sup>
          </div>
        </div>
        <div className="col-span-7 row-start-12 md:col-span-3 md:col-start-5 md:row-start-6 flex flex-row justify-end items-end space-x-1">
          <a
            href="https://github.com/cheng-kang"
            target="_blank"
            onClick={stopPropagationOnClick}
          >
            <Image
              src="/icons8-github.svg"
              width={28}
              height={28}
              alt="CHENGKANG GitHub Link"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/3n4"
            target="_blank"
            onClick={stopPropagationOnClick}
          >
            <Image
              src="/icons8-linkedin.svg"
              width={28}
              height={28}
              alt="CHENGKANG LinkedIn Link"
            />
          </a>
          <a
            href="https://www.instagram.com/ch3ngk4ng"
            target="_blank"
            onClick={stopPropagationOnClick}
          >
            <Image
              src="/icons8-instagram.svg"
              width={28}
              height={28}
              alt="CHENGKANG Instagram Link"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BusinessCardFront;
