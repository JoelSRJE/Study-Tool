"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

const PomodoroTool = () => {
  const [timeInput, setTimeInput] = useState<number>(25);
  const [timerDuration, setTimerDuration] = useState<number>(timeInput * 60);
  const [timeLeft, setTimeLeft] = useState<number>(timerDuration);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const newDuration = timeInput * 60;
    setTimerDuration(newDuration);
    setTimeLeft(newDuration);
    setIsRunning(false);
  }, [timeInput]);

  // Countdown
  useEffect(() => {
    let interval: number | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000) as unknown as number;
    } else if (timeLeft === 0) {
      setIsRunning(false);
      toast.warning("Time ended", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft]);

  const progressPercentage = ((timerDuration - timeLeft) / timerDuration) * 100;

  const strokeDashoffset =
    circumference - (progressPercentage / 100) * circumference;

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes < 10 ? "0" : ""} ${minutes} : ${
      seconds < 10 ? "0" : ""
    } ${seconds}`;
  };

  const handleTimeInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(event.target.value);
    if (!isNaN(newTime) && newTime >= 0) {
      setTimeInput(newTime);
    }
  };

  const handleStartPause = () => {
    if (timeLeft === 0) {
      setTimeLeft(timerDuration);
      setIsRunning(true);
      toast.success("Timer Started", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      if (isRunning === true) {
        setIsRunning(!isRunning);
        setIsRunning(false);
        toast.warning("Timer Paused", {
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        setIsRunning(!isRunning);
        setIsRunning(true);
        toast.success("Timer Started", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(timerDuration);
    toast.warning("Timer Reset", { position: "bottom-right", autoClose: 2000 });
  };

  return (
    <div className="flex flex-col justify-between items-center w-full h-full bg-[#131313] p-2 rounded-xl ">
      {/* Info section */}
      <div className="flex flex-col justify-center items-center">
        <h2 className="font-semibold text-lg text-textColor mb-2">Pomodoro</h2>

        <div className="flex flex-col justify-center items-center w-full">
          <label className="text-textColor">Time:</label>
          <input
            type="number"
            value={timeInput}
            onChange={handleTimeInputChange}
            className="px-2 py-1 border-2 border-gray-700 rounded-md outline-none transition-all duration-300 group-hover:border-gray-500"
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Progress bar section*/}
      <div className="relative w-[20rem] h-[16rem]">
        <svg
          className="w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Bakgrundscirkeln */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#444"
            strokeWidth="8"
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={isRunning ? "#6EE7B7" : "#333"}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-textColor font-semibold text-2xl">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* button section */}
      <div className="flex gap-4 p-2">
        <button
          className={`px-4 p-1 border-2 rounded-md transition-all duration-300 hover:cursor-pointer hover:bg-gray-400 hover:border-gray-400 hover:text-black ${
            isRunning
              ? "bg-red-500 border-red-500"
              : "bg-green-500 border-green-500"
          }`}
          onClick={handleStartPause}
        >
          {isRunning ? "Pause" : timeLeft === 0 ? "Start" : "Start"}
        </button>

        <button
          className="px-4 p-1 border-2 border-gray-600 rounded-md transition-all duration-300 hover:cursor-pointer hover:bg-[#6EE7B7] hover:border-[#6EE7B7] hover:text-black"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTool;
