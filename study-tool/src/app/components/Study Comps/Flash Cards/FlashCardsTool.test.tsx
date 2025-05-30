import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
  within,
} from "@testing-library/react";
import FlashCardsTool, { FlashCard } from "./FlashCardsTool";
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
  test("Testing to see that everything renders correct.", async () => {
    // 1. Render the component
    render(<FlashCardsTool />);

    // 2. Check that the text displays before it runs the check.
    expect(
      screen.getByText(/Searching for stored cards../i)
    ).toBeInTheDocument();

    // 3. Fast forward time a bit
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 4. Checks to see that the previous text disappeared AND that a new one displays.
    expect(
      screen.queryByText(/Searching for stored cards../i)
    ).not.toBeInTheDocument();

    expect(screen.getByText(/No Flash Cards../i)).toBeInTheDocument();
  });

  // Second test
  test("Testing to see that you can add a card.", async () => {
    // 1. Render the component.
    render(<FlashCardsTool />);

    // 2. Let every timer / useeffect run its course.
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 3. Finds the inputs
    const questionInput = screen.getByLabelText(/Question/i);
    const answerInput = screen.getByLabelText(/Answer/i);

    // 4. Writes a task inside them.

    const testQuestion = "Did test go through?";
    const testAnswer = "Yes";

    fireEvent.change(questionInput, {
      target: { value: testQuestion },
    });
    fireEvent.change(answerInput, { target: { value: testAnswer } });

    // 5. Find the create button and click it.
    const createButton = screen.getByRole("button", { name: /Create Card/i });
    fireEvent.click(createButton);

    // 6. Verifies that the new card exists.
    await screen.findByText(testQuestion);

    // 7. Verifies that localStorage has it.
    expect(localStorageMock.setItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "FlashCards",
      expect.any(String)
    );

    const storedCardsString = localStorageMock.setItem.mock.calls[0][1];
    const storedCards = JSON.parse(storedCardsString);

    expect(storedCards).toHaveLength(1);

    // 8. Verifies that the inputs returned to an empty string.
    expect(questionInput).toHaveValue("");
    expect(answerInput).toHaveValue("");

    // 9. Verifies that toast has been called.
    expect(toast.success).toHaveBeenLastCalledWith(
      "Flash Card Created!",
      expect.any(Object)
    );
  });

  // Third test
  test("Testing to see that u can 'turn' a card", async () => {
    // 1. Render the component.
    render(<FlashCardsTool />);

    // 2. Let every timer / useeffect run its course.
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // -- Creates a new card --
    // 3. Finds the inputs
    const questionInput = screen.getByLabelText(/Question/i);
    const answerInput = screen.getByLabelText(/Answer/i);

    // 4. Writes a task inside them.
    const testQuestion = "Did test go through?";
    const testAnswer = "Yes";

    fireEvent.change(questionInput, {
      target: { value: testQuestion },
    });
    fireEvent.change(answerInput, { target: { value: testAnswer } });

    // 5. Find the create button and click it.
    const createButton = screen.getByRole("button", { name: /Create Card/i });
    fireEvent.click(createButton);

    // 6. Verifies that the new card exists.
    await screen.findByText(testQuestion);
    // -- Creates a new card --

    // 7. Find the card and click on it.
    const questionButton = screen.getByRole("button", {
      name: /Question Side/i,
    });
    fireEvent.click(questionButton);

    // 8. Verify that the previous side, with the question is no longer rendered

    expect(screen.queryByText(/Did test go through?/i)).not.toBeInTheDocument();

    // 9. Verifies that a new side is shown with the answer.
    expect(screen.getByText(/Yes/i)).toBeInTheDocument();

    // 10. Clicks on the answer side to return to the previous side.
    const answerButton = screen.getByRole("button", { name: /Answer Side/i });
    fireEvent.click(answerButton);

    // 11. Checks to see that the previous side now exists again, and that the answer side is gone.
    expect(screen.getByText(/Did test go through?/i)).toBeInTheDocument();
    expect(screen.queryByText(/Yes/i)).not.toBeInTheDocument();
  });

  // Fourth test
  test("Testing to see that you can delete a card.", async () => {
    // 1. Render the component.
    render(<FlashCardsTool />);

    // 2. Let every timer / useeffect run its course.
    await act(async () => {
      jest.runAllTimers();
      await Promise.resolve();
    });

    // 3. -- Creates new cards --
    // 3.1. Finds the inputs
    const questionInput = screen.getByLabelText(/Question/i);
    const answerInput = screen.getByLabelText(/Answer/i);
    const createButton = screen.getByRole("button", { name: /Create Card/i });

    // 3.2. Writes the tasks inside the input fields.
    const testQuestion1 = "Question for Card 1";
    const testAnswer1 = "Answer for Card 1";
    const testQuestion2 = "Question for Card 2";
    const testAnswer2 = "Answer for Card 2";
    const testQuestion3 = "Question for Card 3";
    const testAnswer3 = "Answer for Card 3";

    // 3.3. Creates the first card and verifies that it exists.
    fireEvent.change(questionInput, { target: { value: testQuestion1 } });
    fireEvent.change(answerInput, { target: { value: testAnswer1 } });
    fireEvent.click(createButton);
    await screen.findByRole("button", { name: `Question Side 1` });

    // 3.4. Creates the second card and verifies that it exists.
    fireEvent.change(questionInput, { target: { value: testQuestion2 } });
    fireEvent.change(answerInput, { target: { value: testAnswer2 } });
    fireEvent.click(createButton);
    await screen.findByRole("button", { name: `Question Side 2` });

    // 3.5. Creates the third card and verifies that it exists.
    fireEvent.change(questionInput, { target: { value: testQuestion3 } });
    fireEvent.change(answerInput, { target: { value: testAnswer3 } });
    fireEvent.click(createButton);
    await screen.findByRole("button", { name: `Question Side 3` });

    // -- Creates new cards --

    // 4. Find the card to delete (Card nr 2).
    const card2 = screen.getByRole("button", { name: `Delete button 2` });

    // 5. Finds the delete button witin the card.
    const deleteButtonForCard2 = within(card2.parentElement!).getByRole(
      "button",
      { name: /Delete button/i }
    );

    // 6. Delete the card.
    fireEvent.click(deleteButtonForCard2);

    // 7. Verifies that the card is gone from the UI.
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: testQuestion2 })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: testAnswer2 })
      ).not.toBeInTheDocument();
    });

    // 8. Verifies that the other two cards 1 and 3 is still there.
    expect(screen.getByText(testQuestion1)).toBeInTheDocument();
    expect(screen.getByText(testQuestion3)).toBeInTheDocument();

    // 9. Verify that localStorage has updated.
    expect(localStorageMock.setItem).toHaveBeenCalled();

    const storedCardsStringAfterDelete =
      localStorageMock.setItem.mock.calls[
        localStorageMock.setItem.mock.calls.length - 1
      ][1];
    const storedCardsAfterDelete = JSON.parse(storedCardsStringAfterDelete);

    expect(storedCardsAfterDelete).toHaveLength(2); //
    expect(
      storedCardsAfterDelete.some(
        (card: FlashCard) => card.question === testQuestion2
      )
    ).toBeFalsy();

    expect(
      storedCardsAfterDelete.some(
        (card: FlashCard) => card.question === testQuestion1
      )
    ).toBeTruthy();
    expect(
      storedCardsAfterDelete.some(
        (card: FlashCard) => card.question === testQuestion3
      )
    ).toBeTruthy();

    // 10. Verify that toast has been called.
    expect(toast.warning).toHaveBeenLastCalledWith(
      "Deleted Flash Card!",
      expect.any(Object)
    );
  });
});
