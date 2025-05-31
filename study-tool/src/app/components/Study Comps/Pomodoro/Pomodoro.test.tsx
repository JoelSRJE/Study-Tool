import { render, screen, fireEvent, act } from "@testing-library/react";
import PomodoroTool from "./PomodoroTool";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  },
}));

// jest.useFakeTimers();

describe("PomodoroTool Component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });

    jest.useRealTimers();
  });

  // First test
  test("Verifies that the component and timer renders correct, while also checking each button and that the timer doesn't run from render.", async () => {
    // 1. Render the component.
    render(<PomodoroTool />);

    // 2. Checks to see if the 25:00 min display renders
    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();

    // 3. Verifies that the buttons "Start" and "Reset" displays.
    expect(screen.getByRole("button", { name: /Start/i }));
    expect(screen.getByRole("button", { name: /Reset/i }));

    // 4. Checks that the timers isn't running from start.
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();
  });

  // Second test
  test("Checking to see that the start/pause works as intended.", async () => {
    // 1. Render the component.
    render(<PomodoroTool />);

    // 2. Checks that the timer is at 25min.
    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();

    // 3. Find the Start button and click it.
    const startButton = screen.getByRole("button", { name: /Start/i });
    fireEvent.click(startButton);

    // 4. Verifies that isRunning toggled to true, also that the timer countsdown.
    await act(async () => {
      jest.advanceTimersByTime(1000);
      await Promise.resolve();
    });

    await screen.findByText(/24 : 59/i, {}, { timeout: 1000 });

    // 5. Checks to see that the "Start"-button has disappeared.
    expect(
      screen.queryByRole("button", { name: /Start/i })
    ).not.toBeInTheDocument();

    // 6. Checks to see that the pause button now shows.
    const pauseButton = await screen.findByRole("button", { name: /Pause/i });
    expect(pauseButton).toBeInTheDocument();

    // 7. Fast forward the time a bit more.
    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    // 8. Checks the time before paus.
    expect(screen.getByText(/24 : 54/i)).toBeInTheDocument();

    // 9. Clicks the pause button
    fireEvent.click(pauseButton);

    // 10. Checks the time before fast forward.

    expect(screen.getByText(/24 : 54/i)).toBeInTheDocument();

    // 11. Fast forwards the time again

    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    // 12. Checks the time again.
    expect(screen.getByText(/24 : 54/i)).toBeInTheDocument();

    // 14. Clicks the start button again.
    fireEvent.click(startButton);

    // 15. Verifies that toast.success has been called once timer har begun.
    expect(toast.success).toHaveBeenLastCalledWith(
      "Timer Started",
      expect.any(Object)
    );
  });

  // Third test
  test("Checking the reset timer", async () => {
    // 1. Render the component.
    render(<PomodoroTool />);

    await act(async () => {
      await Promise.resolve();
    });

    // 2. Checks the time before run.
    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();

    // 2. Finds the start button.
    const startButton = screen.getByRole("button", { name: /Start/i });
    fireEvent.click(startButton);

    // 3. Advances the time by 3 seconds
    await act(async () => {
      jest.advanceTimersByTime(3000);
      await Promise.resolve();
    });

    // 4. Verifies that the timer has in fact begun countdown and 3 seconds has passed.
    expect(screen.getByText(/24 : 57/i)).toBeInTheDocument();

    // 5. Finds the reset button and clicks on it.
    const resetButton = screen.getByRole("button", { name: /Reset/i });
    fireEvent.click(resetButton);

    // 6. Verifies that the timer has reset to 25:00min again.
    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();

    // 7. Verifies that the timer has in fact not begun again. (advance the time and verify the timer again).
    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });

    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();

    // 8. Verifies that toast has activated.
    expect(toast.warning).toHaveBeenLastCalledWith(
      "Timer Reset",
      expect.any(Object)
    );
  });

  // Fourth test
  test("Checks to see if timer stops when it reaches 0", async () => {
    // 1. Render the component
    render(<PomodoroTool />);

    await act(async () => {
      await Promise.resolve();
    });

    // 2. Checks to see if the timer is at 25min for our starting point.
    expect(screen.getByText(/25 : 0 0/i)).toBeInTheDocument();

    // 3. Finds the Start button and clicks on it.
    const startButton = screen.getByRole("button", { name: /Start/i });
    fireEvent.click(startButton);

    // 4. Let 25min pass.
    await act(async () => {
      jest.advanceTimersByTime(1500 * 1000);
      await Promise.resolve();
    });

    // 5. Verifies that the timer is not at 25min anymore
    expect(screen.queryByText(/25 : 00/i)).not.toBeInTheDocument();

    // 6. Verifies that the time has ended.
    await screen.findByText(/0 0 : 0 0/i, {}, { timeout: 1000 });
    expect(screen.getByText(/0 0 : 0 0/i)).toBeInTheDocument();

    // 7. Verifies that the timer has truly stopped at 00:00.
    await act(async () => {
      jest.advanceTimersByTime(5000);
      await Promise.resolve();
    });
    expect(screen.getByText(/0 0 : 0 0/i)).toBeInTheDocument();

    // 8. Verifies that toast.success has been called.
    expect(toast.warning).toHaveBeenLastCalledWith(
      "Time ended",
      expect.any(Object)
    );
  });
});
