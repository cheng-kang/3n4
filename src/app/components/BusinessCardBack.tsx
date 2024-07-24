import React from "react";
import Image from "next/image";

const BusinessCardBack: React.FC = () => {
  return (
    <section className="relative bg-card w-[368px] h-[596px] md:w-[596px] md:h-[368px] shadow-[2px_4px_4px_0px_rgba(0,_0,_0,_0.25)] p-[32px] box-border">
      <Image
        src="/white-paper-texture.jpg"
        alt="card background"
        fill
        className="absolute inset-0 opacity-50 z-0"
      />
      {/* <div className="h-full relative z-10 flex flex-row justify-center items-center">
      Under construction...
    </div> */}
      {/* <div className="break-all">
      CHENG, KANG aka 程康 aka 3n4 aka CHENGKANG aka Kang Cheng aka
      i_am_cheng_kang aka 程河西 aka ch3ngk4ng aka
      definitely_not_cheng_kang aka cheng-kang...
    </div> */}
      <div className="h-full flex flex-row justify-center items-center relative">
        <div className="flex flex-row items-center space-x-4 opacity">
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href="https://github.com/cheng-kang"
            target="_blank"
          >
            <Image
              src="/icons8-github.svg"
              width={32}
              height={32}
              alt="CHENGKANG GitHub Link"
            />
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href="https://www.linkedin.com/in/3n4"
            target="_blank"
          >
            <Image
              src="/icons8-linkedin.svg"
              width={32}
              height={32}
              alt="CHENGKANG LinkedIn Link"
            />
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href="https://twitter.com/i_am_cheng_kang"
            target="_blank"
          >
            <Image
              src="/icons8-twitter.svg"
              width={32}
              height={32}
              alt="CHENGKANG Twitter Link"
            />
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href="https://www.instagram.com/ch3ngk4ng"
            target="_blank"
          >
            <Image
              src="/icons8-instagram.svg"
              width={32}
              height={32}
              alt="CHENGKANG Instagram Link"
            />
          </a>
          <a
            onClick={(e) => {
              e.stopPropagation();
            }}
            href="mailto:cantchengkang@gmail.com"
            target="_blank"
          >
            <Image
              src="/icons8-email.svg"
              width={30}
              height={30}
              alt="CHENGKANG Email"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BusinessCardBack;
