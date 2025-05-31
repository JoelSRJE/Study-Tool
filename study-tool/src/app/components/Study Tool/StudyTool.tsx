"use client";
import React, { useEffect, useRef } from "react";
import TasksTool from "../Study Comps/Tasks/TasksTool";
import PomodoroTool from "../Study Comps/Pomodoro/PomodoroTool";
import FlashCardsTool from "../Study Comps/Flash Cards/FlashCardsTool";
import { gsap } from "gsap";

const StudyTool = () => {
  // GSAP refs.
  const pageTitleRef = useRef(null);
  const tasksRef = useRef(null);
  const pomodoroRef = useRef(null);
  const cardsRef = useRef(null);

  // GSAP anims.
  useEffect(() => {
    // The breakpoint for rows vs cols.
    const isLargerScreen = window.matchMedia("(min-width:1024px)");

    // Conditionally changes anims depending on isLargerScreen variable.
    let context = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        pageTitleRef.current,
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1 }
      );

      if (isLargerScreen.matches) {
        tl.fromTo(
          tasksRef.current,
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: 0.8 },
          "<0.4"
        );
        tl.fromTo(
          pomodoroRef.current,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 0.8 },
          "<0.4"
        );
        tl.fromTo(
          cardsRef.current,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 0.8 },
          "<0.4"
        );
      } else {
        tl.fromTo(
          tasksRef.current,
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: 0.8 },
          "<0.4"
        );
        tl.fromTo(
          pomodoroRef.current,
          { opacity: 0, x: 100 },
          { opacity: 1, x: 0, duration: 0.8 },
          "<0.4"
        );
        tl.fromTo(
          cardsRef.current,
          { opacity: 0, x: -100 },
          { opacity: 1, x: 0, duration: 0.8 },
          "<0.4"
        );
      }
    }, [pageTitleRef, tasksRef, pomodoroRef, cardsRef]);

    return () => context.revert();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full h-full p-4">
      <h1
        ref={pageTitleRef}
        className="font-bold text-5xl md:text-6xl bg-gradient-to-r from-[#eecda3] to-[#ef629f] bg-clip-text text-transparent text-center opacity-0"
      >
        Study Tools
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center ">
        <section
          ref={tasksRef}
          className="w-full max-w-[20rem] h-[30rem] opacity-0 shadow-xl"
        >
          <TasksTool />
        </section>

        <section
          ref={pomodoroRef}
          className="w-full max-w-[20rem] h-[30rem] opacity-0 shadow-xl"
        >
          <PomodoroTool />
        </section>

        <section
          ref={cardsRef}
          className="w-full max-w-[20rem] h-[30rem] opacity-0 shadow-xl"
        >
          <FlashCardsTool />
        </section>
      </div>
    </div>
  );
};

export default StudyTool;
