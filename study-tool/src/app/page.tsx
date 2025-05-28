import React from "react";
import StudyTool from "./components/Study Tool/StudyTool";
import { ToastContainer } from "react-toastify";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center w-full min-h-full overflow-auto">
      <StudyTool />
      <ToastContainer />
    </main>
  );
}
