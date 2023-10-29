import { ChangeEvent, useReducer } from "react";

import Cta from "./components/Cta";
import FormInput from "./components/FormInput";

// type Result = {
//   name: string;
//   task: Task;
// };

type Task = {
  name: string;
  difficulty: number;
};

type State = {
  tasks: Task[];
  participants: string[];
  task: Task;
  participant: string;
  // results: Result[];
  results: { [key: string]: Task[] };
};

type Action = {
  type:
    | "SET_PARTICIPANT"
    | "SET_TASK"
    | "ON_CHANGE"
    | "CLEAR_ALL"
    | "RESET_WITH_PARTICIPANTS"
    | "RESET_WITH_TASKS"
    | "GET_RESULTS";
  payload?:
    | string
    | {
        key: "task" | "participant";
        value: string | Task;
      }
    | Task;
};

const shuffle = (array: string[]): string[] => {
  return array.sort(() => Math.random() - 0.5);
};

// function divideSkills(
//   names: string[],
//   skills: Task[]
// ): { [key: string]: string[] } {
//   const result = {};
//   const numNames = names.length;
//   const numSkills = skills.length;

//   // Sort skills in ascending order of level
//   skills.sort((a, b) => a.difficulty - b.difficulty);

//   let skillIndex = 0;
//   let personIndex = 0;
//   while (skillIndex < numSkills) {
//     const personName = names[personIndex];
//     // @ts-ignore
//     const personSkills = result[personName] || [];

//     if (
//       !personSkills.some(
//         // eslint-disable-next-line no-loop-func
//         (skill: { difficulty: number }) =>
//           skill.difficulty === skills[skillIndex].difficulty
//       ) ||
//       numSkills - skillIndex <= numNames - personIndex
//     ) {
//       personSkills.push(skills[skillIndex]);
//       skillIndex++;
//     }
//     // @ts-ignore
//     result[personName] = personSkills;
//     personIndex = (personIndex + 1) % numNames;
//   }

//   // Convert skills to skill names only
//   for (const personName in result) {
//     // @ts-ignore
//     result[personName] = result[personName].map((skill) => skill.name);
//   }

//   return result;
// }

function divideSkills(members: string[], tasks: Task[]) {
  // Sort tasks by difficulty in descending order
  tasks.sort((a, b) => b.difficulty - a.difficulty);

  // Create an object to store the assigned tasks for each member
  const assignedTasks = {};

  // Initialize an empty array for each member
  shuffle(members).forEach(member => {
    // @ts-ignore
    assignedTasks[member] = [];
  });

  // Loop through each task and assign it to the member with the lowest total difficulty
  tasks.forEach(task => {
    // Find the member with the lowest total difficulty
    let minDifficultyMember = members[0];
    // @ts-ignore
    let minTotalDifficulty = getTotalDifficulty(assignedTasks[minDifficultyMember]);

    for (const member of members) {
      // @ts-ignore
      const totalDifficulty = getTotalDifficulty(assignedTasks[member]);

      if (totalDifficulty < minTotalDifficulty) {
        minTotalDifficulty = totalDifficulty;
        minDifficultyMember = member;
      }
    }

    // Assign the task to the member
    // @ts-ignore
    assignedTasks[minDifficultyMember].push(task);
  });

  return assignedTasks;
}

function getTotalDifficulty(tasks: Task[]) {
  return tasks.reduce((total, task) => total + task.difficulty, 0);
}

// Example usage
// const members = ['john', 'maria', 'joaco'];
// const tasks = [
//   { name: 'code', difficulty: 100 },
//   { name: 'write', difficulty: 12 },
//   { name: 'speak', difficulty: 6 },
//   { name: 'read', difficulty: 23 },
// ];

// const result = distributeTasks(members, tasks);
// console.log('Result', result);


// const assignTasks = (participants: string[], tasks: Task[]): Result[] => {
//   const tasksAux = [...tasks];
//   const results: Result[] = [];

//   while (tasks.length > results.length) {
//     shuffle(participants).forEach((name) => {
//       const task = tasksAux[Math.floor(Math.random() * tasksAux.length)];
//       results.push({
//         name,
//         task: task || { name: "Zafaste!", difficulty: 0 },
//       });
//       tasksAux.splice(tasksAux.indexOf(task), 1);
//     });
//   }

//   return results as Result[];
// };

const initialState: State = {
  tasks: [],
  participants: [],
  task: {} as Task,
  participant: "",
  results: {},
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PARTICIPANT":
      return {
        ...state,
        participant: "",
        participants: [...state.participants, action.payload as string],
      };
    case "SET_TASK":
      if (typeof action.payload === "object" && "name" in action.payload) {
        return {
          ...state,
          task: { name: "", difficulty: 0 },
          // tasks: [...state.tasks, action.payload as string],
          tasks: [
            ...state.tasks,
            {
              name: action.payload?.name,
              difficulty: action.payload?.difficulty,
            },
          ],
        };
      }
      return state;
    case "ON_CHANGE":
      if (typeof action.payload === "object" && "key" in action.payload) {
        return { ...state, [action.payload?.key]: action.payload?.value };
      }
      return state;
    case "CLEAR_ALL":
      return initialState;
    case "RESET_WITH_PARTICIPANTS":
      return { ...initialState, participants: state.participants };
    case "RESET_WITH_TASKS":
      return { ...initialState, tasks: state.tasks };
    case "GET_RESULTS":
      // const results: Result[] = assignTasks(state.participants, state.tasks);
      const results: { [key: string]: Task[] } = divideSkills(
        state.participants,
        state.tasks
      );
      return { ...state, results };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <main className="px-5 py-5 md:px-20 bg-[#333333] min-h-screen">
      <h1 className="text-4xl font-semibold text-white">Randomly!</h1>

      <section className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <article>
          {!state.results.length && (
            <>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="col-span-1 flex flex-col gap-10 mb-10"
              >
                <FormInput
                  value={state.participant}
                  type="participant"
                  handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                    dispatch({
                      type: "ON_CHANGE",
                      payload: {
                        key: "participant",
                        value: e.target.value,
                      },
                    })
                  }
                  handleClick={() => {
                    if (
                      state.participant !== "" &&
                      /^[a-zA-Z0-9\s-?]+$/.test(state.participant)
                    ) {
                      dispatch({
                        type: "SET_PARTICIPANT",
                        payload: state.participant,
                      });
                    }
                  }}
                />
              </form>

              <form
                onSubmit={(e) => e.preventDefault()}
                className="col-span-1 flex flex-col gap-x-10"
              >
                <p className="text-sm text-gray-400 mb-3">
                  Tasks must have a level of difficulty. To give a difficulty to a task do as the following example:
                  <br />
                  Buy Coke - 1
                </p>
                <FormInput
                  value={state.task.name}
                  type="task"
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: "ON_CHANGE",
                      payload: {
                        key: "task",
                        value: {
                          name: e.target.value,
                          difficulty:
                            Number(e.target.value?.split("-").pop()) ||
                            Math.floor(Math.random() * 6),
                        },
                      },
                    });
                  }}
                  handleClick={() => {
                    if (
                      state.task.name !== "" &&
                      /^[a-zA-Z0-9\s-]+$/.test(state.task.name)
                    ) {
                      dispatch({
                        type: "SET_TASK",
                        payload: state.task,
                      });
                    }
                  }}
                />
              </form>
            </>
          )}

          <div className="mt-20 grid grid-cols-2 max-w-xl gap-5">
            <Cta
              text="Get results"
              type="success"
              handleClick={() => dispatch({ type: "GET_RESULTS" })}
              btnDisabled={Object.keys(state.results).length > 0}
            />
            <Cta
              text="Clear all"
              type="error"
              handleClick={() => dispatch({ type: "CLEAR_ALL" })}
            />
            <Cta
              text="Clear tasks"
              type="error"
              handleClick={() => dispatch({ type: "RESET_WITH_PARTICIPANTS" })}
            />
            <Cta
              text="Clear participants"
              type="error"
              handleClick={() => dispatch({ type: "RESET_WITH_TASKS" })}
            />
          </div>
        </article>

        <div className="col-span-1">
          {Object.keys(state.results).length > 0 ? (
            <h2 className="text-white text-2xl font-medium mb-4">
              Results are here! Now get to work!
            </h2>
          ) : (
            <h2 className="text-white text-2xl font-medium mb-4">
              Random the sh*t out of it!
            </h2>
          )}
          <div className="text-gray-400">
            {Object.keys(state.results).length > 0 ? (
              Object.keys(state.results).map((item, i) => (
                <div key={i}>
                  <p className="font-semibold text-orange-500">{item}</p>
                  <ul className="pl-4">
                    {state.results[item].map((t) => (
                      <li key={t.name}>{t.name}</li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <>
                <h3 className="mt-10 text-xl text-white">Participants</h3>
                <ul>
                  {state.participants.map((p, idx) => (
                    <div className="flex items-center gap-1">
                      {/* onClick={() => handleEditParticipant(p, idx)} */}
                      {/* <button>
                        <img src="/edit.png" alt="Edit icon" className='max-w-[20px]' />
                      </button> */}
                      <li key={p}>{p}</li>
                    </div>
                  ))}
                </ul>
                <h3 className="mt-10 text-xl text-white">Tasks</h3>
                <ul>
                  {state.tasks.map((t) => (
                    <li key={t.name}>
                      {t.name.slice(0, t.name.lastIndexOf("-"))} - Difficulty:{" "}
                      {t.difficulty}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
