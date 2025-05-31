"use client";
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import { gsap } from "gsap";

interface Task {
  id: number;
  task: string;
  completed: boolean;
}

const TasksTool = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskId, setTaskId] = useState<number>(1);
  const [taskInput, setTaskInput] = useState<string>("");
  const [loadTasks, setLoadTasks] = useState(true);
  const [lastAddedTaskId, setLastAddedTaskId] = useState<number | null>(null);

  // GSAP Refs.
  const taskRefs = useRef<Map<number, HTMLElement>>(new Map());

  const setNewTaskRef = (task: Task, element: HTMLElement | null) => {
    if (element) {
      taskRefs.current.set(task.id, element);
    } else {
      taskRefs.current.delete(task.id);
    }
  };

  const getTasks = () => {
    const storedTasks = localStorage.getItem("Tasks");

    if (storedTasks) {
      try {
        const parsedTasks: Task[] = JSON.parse(storedTasks);
        setTasks(parsedTasks);

        const maxId = parsedTasks.reduce(
          (max, task) => (task.id > max ? task.id : max),
          0
        );
        setTaskId(maxId + 1);
      } catch (error) {
        console.warn("Something went wrong fetching the cards: ", error);
        toast.error("Error getting stored tasks!", {
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    }
    setLoadTasks(false);
  };

  // Loads in tasks if they exist.
  useEffect(() => {
    if (loadTasks === true) {
      setTimeout(() => {
        getTasks();
      }, 2000);
    }
  }, [loadTasks]);

  // Anim for IF there are any tasks saved. Renders them.
  useEffect(() => {
    if (!loadTasks && tasks.length > 0) {
      const gsapContext = gsap.context(() => {
        tasks.forEach((task, idx) => {
          const taskElement = taskRefs.current.get(task.id);

          if (taskElement) {
            gsap.fromTo(
              taskElement,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: idx * 0.1,
                ease: "power2.out",
              }
            );
          }
        });
      }, [taskRefs]);
      return () => gsapContext.revert();
    }
  }, [loadTasks, tasks]);

  // Anim for a new task being added to the list.
  useEffect(() => {
    if (lastAddedTaskId !== null) {
      const gsapContext = gsap.context(() => {
        setTimeout(() => {
          const newTaskElement = taskRefs.current.get(lastAddedTaskId);

          if (newTaskElement) {
            gsap.fromTo(
              newTaskElement,
              { opacity: 0, scale: 0.8 },
              { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
            );
          }
        }, 0);
      }, [taskRefs]);

      setLastAddedTaskId(null);

      return () => gsapContext.revert();
    }
  }, [lastAddedTaskId]);

  const addTask = (event: FormEvent) => {
    event.preventDefault();

    try {
      const newTask: Task = { id: taskId, task: taskInput, completed: false };

      const updatedTasks = [...tasks, newTask];

      setTasks(updatedTasks);
      setTaskId((prevId) => prevId + 1);
      setTaskInput("");

      localStorage.setItem("Tasks", JSON.stringify(updatedTasks));

      setLastAddedTaskId(newTask.id);

      toast.success("Task created!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    } catch (error) {
      console.warn("Something went wrong adding a new card: ", error);
      toast.error("Error creating task", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const completeTask = (id: number) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        if (task.completed === true) {
          toast.warning("Task is not completed!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        } else {
          toast.success("Task Completed!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        }
        return { ...task, completed: !task.completed };
      }

      return task;
    });

    setTasks(updatedTasks);

    localStorage.setItem("Tasks", JSON.stringify(updatedTasks));
  };

  const deleteTask = (id: number) => {
    const taskToDelete = taskRefs.current.get(id);

    if (taskToDelete) {
      gsap.to(taskToDelete, {
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        onComplete: () => {
          const updatedTasks = tasks.filter((task) => task.id !== id);

          setTasks(updatedTasks);

          localStorage.setItem("Tasks", JSON.stringify(updatedTasks));

          toast.success("Task deleted!", {
            position: "bottom-right",
            autoClose: 2000,
          });
        },
      });
    } else {
      const updatedTasks = tasks.filter((task) => task.id !== id);

      setTasks(updatedTasks);

      localStorage.setItem("Tasks", JSON.stringify(updatedTasks));

      toast.success("Task deleted!", {
        position: "bottom-right",
        autoClose: 2000,
      });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskInput(event.target.value);
  };

  return (
    <div className="flex flex-col  w-auto h-full bg-[#131313] rounded-xl">
      {/* Create Task */}
      <form
        onSubmit={addTask}
        className="flex flex-col items-center w-full min-h-[7rem] max-h-[7rem] border-b-2 border-[#272727] p-2"
      >
        <h2 className="font-semibold text-lg text-textColor mb-2">
          Create Tasks{" "}
          <span>
            <span className="text-md"> {"("}</span>
            <span className="text-sm">{tasks.length}</span>
            <span className="text-md">{")"}</span>
          </span>
        </h2>
        <div className="flex justify-center group">
          <input
            type="text"
            value={taskInput}
            onChange={handleInputChange}
            placeholder="Write your tasks.."
            className="p-2 border-2 border-gray-700 rounded-bl-md rounded-tl-md outline-none transition-all duration-300 group-hover:border-gray-500"
          />
          <button
            type="submit"
            className="bg-gray-700 p-2 border-2 border-gray-700 rounded-tr-md rounded-br-md transition-all duration-300 hover:cursor-pointer group-hover:bg-gray-500 group-hover:border-gray-500"
          >
            Create
          </button>
        </div>
      </form>

      {/* Task list */}
      <div className="w-full min-h-[23rem] max-h-[23rem] rounded-b-xl overflow-y-auto">
        {loadTasks ? (
          <div className="flex justify-center h-[23rem] mt-4 text-textColor font-semibold">
            Searching for stored tasks...
          </div>
        ) : tasks.length <= 0 ? (
          <div className="flex justify-center h-[23rem] mt-4 text-textColor font-semibold">
            Looks empty here..
          </div>
        ) : (
          <div className="relative flex flex-col overflow-hidden">
            {tasks.map((task, idx) => (
              <div
                key={idx}
                ref={(el) => setNewTaskRef(task, el)}
                className={`flex justify-between gap-2 p-2 group opacity-0 transition-all duration-300 hover:bg-gray-500 ${
                  task.completed ? "bg-green-700" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-5 hover:cursor-pointer"
                    defaultChecked={task.completed}
                    onClick={() => completeTask(task.id)}
                    aria-label="Updates task"
                  />
                  <span className={`${task.completed ? "line-through" : ""}`}>
                    {task.task.length < 25
                      ? task.task
                      : `${task.task.substring(0, 20)}...`}
                  </span>
                </div>

                <span
                  className={`text-lg text-gray-500 group-hover:text-gray-700 ${
                    task.completed ? "text-gray-800" : ""
                  }`}
                >
                  #{task.id}
                </span>

                <div className="absolute opacity-0 group-hover:opacity-100 right-8">
                  <button
                    className="hover:cursor-pointer hover:text-red-500"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                  >
                    <FiTrash2 size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksTool;
