import React from "react";
import { render, screen } from "@testing-library/react";
import StudyTool from "./StudyTool";
import TasksTool from "../Study Comps/Tasks/TasksTool";
import PomodoroTool from "../Study Comps/Pomodoro/PomodoroTool";
import FlashCardsTool from "../Study Comps/Flash Cards/FlashCardsTool";

jest.mock("../study comps/tasks/TaskTool", () => {
  return jest.fn(() => <div>Mocked Task Tool</div>);
});

jest.mock("../study comps/pomodoro/PomodoroTool", () => {
  return jest.fn(() => <div>Mocked Pomodoro Tool</div>);
});

jest.mock("../study comps/flashcards/FlashCardsTool", () => {
  return jest.fn(() => <div>Mocked Flash Cards Tool</div>);
});

describe("StudyTool Component", () => {
  test("should render the main heading", () => {
    render(<StudyTool />);
    expect(screen.getByText(/Study Tool/i)).toBeInTheDocument();
  });

  // First test
  test("Should render the TaskTool component", () => {
    render(<TasksTool />);
    expect(screen.getByText(/Mocked Task Tool/i)).toBeInTheDocument();
  });

  // Second test
  test("Should render the PomodoroTool component", () => {
    render(<PomodoroTool />);
    expect(screen.getByText(/Mocked Pomodoro Tool/i)).toBeInTheDocument();
  });

  // Third test
  test("Should render the FlashCardsTool component", () => {
    render(<FlashCardsTool />);
    expect(screen.getByText(/Mocked Flash Cards Tool/i)).toBeInTheDocument();
  });
});
