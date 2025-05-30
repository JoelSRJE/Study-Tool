import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import TaskTool from "./TasksTool";
import { toast } from "react-toastify";

const localStorageMock = (() => {
  let store: { [key: string]: string } = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

jest.useFakeTimers();

describe("TaskTool Component", () => {
  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  // First test
  test('should display "Searching for stored tasks..." initially and then "Looks empty here.." if no tasks.', async () => {
    // 1. Render the component.
    render(<TaskTool />);

    // 2. Checks that this text displays on render.
    expect(
      screen.getByText(/Searching for stored tasks.../i)
    ).toBeInTheDocument();

    // 3. Let all timers run
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 4. Wait for looks empty..
    const emptyMessageElement = await screen.findByText(
      /Looks empty here../i,
      {},
      { timeout: 3000 }
    );
    expect(emptyMessageElement).toBeInTheDocument();

    // 5. Verify that "Searching" doesn't exist anymore..
    expect(
      screen.queryByText(/Searching for stored tasks.../i)
    ).not.toBeInTheDocument();
  });

  // Second test
  test("Should add a new task when the form is submitted.", async () => {
    // 1. Render the component.
    render(<TaskTool />);

    // 2. Let everything load up properly.
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 3. Confirms that everything has fully rendered.
    await screen.findByText(/Looks empty here../i, {}, { timeout: 3000 });

    // 4. Find the input and fill in info.
    const taskInput = screen.getByPlaceholderText(/Write your tasks../i);
    fireEvent.change(taskInput, { target: { value: "Buy groceries" } });
    expect(taskInput).toHaveValue("Buy groceries");

    // 5. Find the create button and click on it to create a new task.
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // 6. Verifies that the new task exists.
    await waitFor(() => {
      expect(screen.getByText(/Buy groceries/i)).toBeInTheDocument();
    });

    // 7. Verifies that the input is cleared/empty.
    expect(taskInput).toHaveValue("");

    // 8. Verifies that toast has been called.
    expect(toast.success).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(
      "Task created!",
      expect.any(Object)
    );

    // 9. Verifies that localstorage updated.
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
      "Tasks",
      JSON.stringify([{ id: 1, task: "Buy groceries", completed: false }])
    );
  });

  // Third test
  test("Should delete a task", async () => {
    // 1. Render the component.
    render(<TaskTool />);

    // 2. Let everything load up properly.
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 3. Finds the text Looks empty, after everything renders properly.
    await screen.findByText(/Looks empty here../i, {}, { timeout: 3000 });

    // 4. Finds the input and fills it with  info.
    const taskInput = screen.getByPlaceholderText(/Write your tasks../i);
    fireEvent.change(taskInput, { target: { value: "Task to delete" } });

    // 5. Find the create button and click on it.
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // 6. Verifies that the new task exists.
    await waitFor(() => {
      expect(screen.getByText(/Task to delete/i)).toBeInTheDocument();
    });

    // 7. Find the delete button and click on it.
    const deleteButton = screen.getByRole("button", { name: /Delete task/i });
    fireEvent.click(deleteButton);

    // 8. Verifies that the task has been deleted.
    await waitFor(() => {
      expect(screen.queryByText(/Task to delete/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId("task-item-1")).not.toBeInTheDocument();
    });

    // 9. Verifies that localstorage updated.
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "Tasks",
      JSON.stringify([])
    );

    // 10. Verifies that toast was called properly.
    expect(toast.success).toHaveBeenLastCalledWith(
      "Task deleted!",
      expect.any(Object)
    );
  });

  test("Should update a tasks completed status.", async () => {
    // 1. Render the component.
    render(<TaskTool />);

    // 2. Let everything load up properly.
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 3. Verifies that the text "Looks empty here" displays.
    await screen.findByText(/Looks empty here../i, {}, { timeout: 3000 });

    // 4. Finds the input and fills it with info.
    const taskInput = screen.getByPlaceholderText(/Write your tasks../i);
    fireEvent.change(taskInput, { target: { value: "Task to update" } });

    // 5. Find the create button and clicks on it.
    const createButton = screen.getByRole("button", { name: /Create/i });
    fireEvent.click(createButton);

    // 6. Verifies that the new task exists.
    await waitFor(() => {
      expect(screen.getByText(/Task to update/i)).toBeInTheDocument();
    });

    // 7. Finds the input to update the tasks status and clicks on it.
    const updateCheckbox = screen.getByRole("checkbox", {
      name: /Updates task/i,
    });
    fireEvent.click(updateCheckbox);

    // 8. Verifies that the task has been updated.
    await waitFor(() => {
      const taskTextElement = screen.getByText(/Task to update/i);

      expect(taskTextElement).toHaveClass("line-through");

      // 9. Verifies that localstorage updated.
      expect(localStorageMock.setItem).toHaveBeenLastCalledWith(
        "Tasks",
        JSON.stringify([{ id: 1, task: "Task to update", completed: true }])
      );

      // 10. Verifies that toast was called properly.
      expect(toast.success).toHaveBeenLastCalledWith(
        "Task Completed!",
        expect.any(Object)
      );
    });
  });
});
