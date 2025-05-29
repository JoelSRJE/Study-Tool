import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";

export interface FlashCard {
  id: number;
  question: string;
  answer: string;
  flipCard: boolean;
}

const FlashCardsTool = () => {
  const [flashCards, setFlashCards] = useState<FlashCard[]>([]);
  const [flashCardId, setFlashCardId] = useState<number>(1);

  const [questionInput, setQuestionInput] = useState<string>("");
  const [answerInput, setAnswerInput] = useState<string>("");

  const [loadCards, setLoadCards] = useState<boolean>(true);

  const getCards = () => {
    const storedCards = localStorage.getItem("FlashCards");

    if (storedCards) {
      try {
        const parsedCards: FlashCard[] = JSON.parse(storedCards);
        setFlashCards(parsedCards);

        const maxId = parsedCards.reduce(
          (max, card) => (card.id > max ? card.id : max),
          0
        );

        setFlashCardId(maxId + 1);
      } catch (error) {
        toast.error("Error Getting Flash Cards", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    }
    setLoadCards(false);
  };

  useEffect(() => {
    if (loadCards === true) {
      setTimeout(() => {
        getCards();
      }, 2000);
    }
  }, []);

  const handleQuestionInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionInput(event.target.value);
  };

  const handleAnswerInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAnswerInput(event.target.value);
  };

  const addFlashCard = (event: FormEvent) => {
    event.preventDefault();

    try {
      const newFlashCard: FlashCard = {
        id: flashCardId,
        question: questionInput,
        answer: answerInput,
        flipCard: false,
      };

      const updatedCards = [...flashCards, newFlashCard];

      setFlashCards(updatedCards);
      setQuestionInput("");
      setAnswerInput("");
      setFlashCardId((prevId) => prevId + 1);

      localStorage.setItem("FlashCards", JSON.stringify(updatedCards));

      toast.success("Flash Card Created!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error Creating Flash Card", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const handleToggleCard = (id: number) => {
    const updatedCards = flashCards.map((card) => {
      if (card.id === id) {
        return { ...card, flipCard: !card.flipCard };
      }

      return card;
    });

    setFlashCards(updatedCards);

    localStorage.setItem("FlashCards", JSON.stringify(updatedCards));
  };

  const deleteFlashCard = (id: number) => {
    const updatedCards = flashCards.filter((flashCard) => flashCard.id !== id);

    setFlashCards(updatedCards);

    localStorage.setItem("FlashCards", JSON.stringify(updatedCards));

    toast.warning("Deleted Flash Card!", {
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  return (
    <div className="flex flex-col items-center w-full h-full bg-[#131313] p-2 rounded-xl ">
      <h2 className="font-semibold text-lg text-textColor mb-2">Flash Cards</h2>

      <div className="flex flex-col justify-center items-center gap-4 ">
        {/* Inputs */}
        <form onSubmit={addFlashCard} className="flex flex-col gap-2">
          <label className="flex flex-col group">
            Question
            <input
              type="text"
              value={questionInput}
              onChange={handleQuestionInputChange}
              className="px-2 py-1 border-2 border-gray-700 rounded-md outline-none transition-all duration-300 group-hover:border-gray-500"
            />
          </label>

          <label className="flex flex-col group">
            Answer
            <input
              type="text"
              value={answerInput}
              onChange={handleAnswerInputChange}
              className="px-2 py-1 border-2 border-gray-700 rounded-md outline-none transition-all duration-300 group-hover:border-gray-500"
            />
          </label>
          <button
            type="submit"
            className="py-1 border-2 border-gray-600 rounded-md transition-all duration-300 hover:cursor-pointer hover:bg-[#6EE7B7] hover:border-[#6EE7B7] hover:text-black"
          >
            Create Card
          </button>
        </form>

        {/* Card Section */}
        <div className="border-t-2 border-gray-400 w-[18rem] min-h-[13rem] ">
          {/* Cards */}
          {loadCards ? (
            <div className="flex justify-center mt-4 text-textColor font-semibold">
              Searching for stored cards..
            </div>
          ) : flashCards.length <= 0 ? (
            <div className="flex justify-center mt-4 text-textColor font-semibold">
              No Flash Cards..
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-2 max-h-[13rem] overflow-auto">
              {flashCards.map((card) => (
                <div
                  key={card.id}
                  className="relative flex justify-center perspective-1000"
                >
                  <div>
                    <button
                      className={`absolute  top-5 opacity-100 transition-all duration-300  hover:scale-105 hover:cursor-pointer hover:text-red-600 ${
                        flashCards.length >= 4 ? "right-2" : "right-1"
                      }`}
                      onClick={() => deleteFlashCard(card.id)}
                      aria-label={`Delete button ${card.id}`}
                    >
                      <FiTrash2 size={24} />
                    </button>
                  </div>
                  <div>
                    {card.flipCard ? (
                      <button
                        className={`relative flex justify-center items-center h-[4rem] max-w-[13rem] min-w-[13rem] bg-gray-600 rounded-md transition-all duration-500  ease-in-out transform-3d  hover:cursor-pointer ${
                          card.flipCard ? "rotate-y-180" : ""
                        } ${flashCards.length >= 4 ? "mr-5" : ""}`}
                        onClick={() => handleToggleCard(card.id)}
                        aria-label={`Answer Side ${card.id}`}
                      >
                        <span className="absolute top-0 left-1 text-gray-800 rotate-y-180">
                          #{card.id}
                        </span>
                        <span className="mt-3 mb-3 text-textColor font-medium text-lg tracking-wide rotate-y-180">
                          {card.answer}
                        </span>
                        <span className="absolute -bottom-0 right-1 italic text-gray-800 text-sm rotate-y-180">
                          Answer
                        </span>
                      </button>
                    ) : (
                      <button
                        className={`relative flex justify-center items-center min-h-[4rem] max-w-[13rem] min-w-[13rem] bg-gray-800 rounded-md transition-all duration-500  ease-in-out transform-3d hover:cursor-pointer ${
                          card.flipCard ? "rotate-y-180" : ""
                        } ${flashCards.length >= 4 ? "mr-5" : ""}`}
                        onClick={() => handleToggleCard(card.id)}
                        aria-label={`Question Side ${card.id}`}
                      >
                        <span className="absolute top-0 left-1 text-gray-600">
                          #{card.id}
                        </span>
                        <span className="mt-3 mb-3 text-textColor font-medium tracking-wide">
                          {card.question}
                        </span>
                        <span className="absolute bottom-0 right-1 italic text-gray-600 text-sm">
                          Question
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default FlashCardsTool;
