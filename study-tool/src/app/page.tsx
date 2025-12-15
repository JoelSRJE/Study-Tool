import React from "react";
import StudyTool from "./components/Study Tool/StudyTool";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-full min-h-screen overflow-auto">
      <StudyTool />
      <ToastContainer />
    </main>
  );
}
