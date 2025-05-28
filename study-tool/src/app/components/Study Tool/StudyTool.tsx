import React from "react";
import TasksTool from "../Study Comps/Tasks/TasksTool";
import PomodoroTool from "../Study Comps/Pomodoro/PomodoroTool";
import FlashCardsTool from "../Study Comps/Flash Cards/FlashCardsTool";

const StudyTool = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-8 w-full h-full p-4">
      <h1 className="font-bold text-5xl md:text-6xl bg-gradient-to-r from-[#eecda3] to-[#ef629f] bg-clip-text text-transparent text-center">
        Study Tools
      </h1>

      <div className="flex flex-col lg:flex-row gap-8 justify-center items-center ">
        <section className="w-full max-w-[20rem] h-[30rem]">
          <TasksTool />
        </section>

        <section className="w-full max-w-[20rem] h-[30rem]">
          <PomodoroTool />
        </section>

        <section className="w-full max-w-[20rem] h-[30rem]">
          <FlashCardsTool />
        </section>
      </div>
    </div>
  );
};

export default StudyTool;
