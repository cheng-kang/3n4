"use client";
import type {
  CSSProperties,
  MouseEventHandler,
  PointerEventHandler,
} from "react";
import { motion, useMotionTemplate, useSpring } from "motion/react";
import React, { useState, useRef } from "react";
import { isMobile } from "react-device-detect";

// Learn more: https://www.framer.com/docs/guides/overrides/

//Spring animation parameters
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 40,
} as const;

const noFlipSelector =
  "a, button, input, textarea, select, label, [data-no-flip]";
const clickDragThreshold = 6;
const tiltFactor = 20;

const defaultWrapperStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  width: "100vw",
  height: "100dvh",
  overflow: "hidden",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const closestElement = (target: EventTarget | null) => {
  if (target instanceof Element) return target;
  if (target instanceof Text) return target.parentElement;
  return null;
};

const shouldIgnoreFlip = (event: React.SyntheticEvent<HTMLDivElement>) => {
  const target = closestElement(event.target);
  if (target?.closest(noFlipSelector)) return true;

  return event
    .nativeEvent
    .composedPath()
    .some((item) => item instanceof Element && item.matches(noFlipSelector));
};

const hasSelectedText = () => window.getSelection()?.type === "Range";

/**
 * 3D Flip
 * Created By Joshua Guo
 *
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */

export const FlipContainer: React.FC<
  React.PropsWithChildren<{
    front: React.ReactElement;
    back: React.ReactElement;
    className?: string;
    wrapperClassName?: string;
    wrapperStyle?: CSSProperties;
  }>
> = ({ className, front, back, wrapperClassName, wrapperStyle }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const pointerStartRef = useRef<{
    x: number;
    y: number;
    ignoreFlip: boolean;
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const scale = useSpring(1, spring);
  const dx = useSpring(0, spring);
  const dy = useSpring(0, spring);
  const cardTransform = useMotionTemplate`scale(${scale}) rotateX(${dx}deg) rotateY(${dy}deg)`;

  const handlePointerUp: PointerEventHandler<HTMLDivElement> = (event) => {
    const pointerStart = pointerStartRef.current;

    const movedTooFar =
      pointerStart !== null &&
      Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) >
        clickDragThreshold;

    pointerStartRef.current = null;

    if (
      !pointerStart ||
      shouldIgnoreFlip(event) ||
      pointerStart?.ignoreFlip ||
      movedTooFar ||
      hasSelectedText()
    ) {
      return;
    }

    const nextIsFlipped = !isFlipped;
    setIsFlipping(true);
    setIsFlipped(nextIsFlipped);
  };

  const resetTilt = () => {
    scale.set(1);
    dx.set(0);
    dy.set(0);
  };

  const flattenCardForInteraction = () => {
    scale.set(1.1);
    dx.set(0);
    dy.set(0);
  };

  const handlePointerDown: PointerEventHandler<HTMLDivElement> = (event) => {
    const ignoreFlip = shouldIgnoreFlip(event);
    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      ignoreFlip,
    };
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
  };

  const handleWrapperMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const card = rootRef.current;
    if (!card) return;

    const cardRect = card.getBoundingClientRect();
    const isInsideCard =
      event.clientX >= cardRect.left &&
      event.clientX <= cardRect.right &&
      event.clientY >= cardRect.top &&
      event.clientY <= cardRect.bottom;

    if (isInsideCard) {
      flattenCardForInteraction();
      return;
    }

    scale.set(1);

    const wrapperRect = event.currentTarget.getBoundingClientRect();
    const virtualX =
      ((event.clientX - wrapperRect.left) / wrapperRect.width) * cardRect.width;
    const virtualY =
      ((event.clientY - wrapperRect.top) / wrapperRect.height) *
      cardRect.height;
    const cardCenterX = cardRect.width / 2;
    const cardCenterY = cardRect.height / 2;
    const mouseX = virtualY - cardCenterY;
    const mouseY = virtualX - cardCenterX;
    const degreeX = (mouseX / cardRect.width) * tiltFactor;
    const degreeY = (mouseY / cardRect.height) * tiltFactor;

    dx.set(-degreeX);
    dy.set(degreeY);
  };

  const handleWrapperMouseLeave = () => {
    resetTilt();
    pointerStartRef.current = null;
  };

  return (
    <div
      data-testid="flip-wrapper"
      className={wrapperClassName}
      onMouseMove={isMobile ? undefined : handleWrapperMouseMove}
      onMouseLeave={isMobile ? undefined : handleWrapperMouseLeave}
      style={{ ...defaultWrapperStyle, ...wrapperStyle }}
    >
      <div
        data-testid="flip-root"
        ref={rootRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onMouseEnter={isMobile ? undefined : flattenCardForInteraction}
        className={className}
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          data-testid="flip-transform"
          transition={isMobile ? undefined : spring}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transform: cardTransform,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
        >
          <motion.div
            data-testid="flip-card"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            onAnimationComplete={() => {
              setIsFlipping(false);
            }}
            transition={spring}
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            <div
              data-testid="front-face"
              style={{
                width: "100%",
                height: "100%",
                zIndex: isFlipped ? 0 : 1,
                pointerEvents: isFlipping || isFlipped ? "none" : "auto",
                backfaceVisibility: "hidden",
                position: "absolute",
                inset: 0,
              }}
            >
              {front}
            </div>
            <div
              data-testid="back-face"
              style={{
                width: "100%",
                height: "100%",
                zIndex: isFlipped ? 1 : 0,
                pointerEvents: isFlipping || !isFlipped ? "none" : "auto",
                backfaceVisibility: "hidden",
                position: "absolute",
                inset: 0,
                transform: "rotateY(180deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {back}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
