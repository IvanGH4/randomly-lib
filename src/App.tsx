import { ChangeEvent, useReducer } from 'react';

import Cta from './components/Cta';
import FormInput from './components/FormInput';

type Result = {
  name: string;
  task: Task;
};

type Task = {
  name: string;
  difficulty: number;
};

type State = {
  tasks: Task[];
  participants: string[];
  task: Task;
  participant: string;
  results: Result[];
};

type Action = {
  type:
    | 'SET_PARTICIPANT'
    | 'SET_TASK'
    | 'ON_CHANGE'
    | 'CLEAR_ALL'
    | 'RESET_WITH_PARTICIPANTS'
    | 'RESET_WITH_TASKS'
    | 'GET_RESULTS';
  payload?:
    | string
    | {
        key: 'task' | 'participant';
        value: string | Task;
      }
    | Task;
};

// const shuffle = (array: string[]): string[] => {
//   return array.sort(() => Math.random() - 0.5);
// };

const assignTasks = (participants: string[], tasks: Task[]): Result[] => {
  // const tasksAux = [...tasks];
  // const results: Result[] = [];
  // // TODO: niveles de dificultad a las tareas
  // while (tasks.length > results.length) {
  //   participants.forEach((name) => {
  //     const task =
  //       shuffle(tasksAux)[Math.floor(Math.random() * tasksAux.length)];
  //     results.push({
  //       name,
  //       task: task || 'Zafaste!',
  //     });
  //     tasksAux.splice(tasksAux.indexOf(task), 1);
  //   });
  // }

  // return results as Result[];
  const taskDifficulties = Array.from(
    new Set(tasks.map((task) => task.difficulty))
  );
  const tasksByDifficulty: { [difficulty: number]: Task[] } = {};
  taskDifficulties.forEach((difficulty) => {
    tasksByDifficulty[difficulty] = tasks.filter(
      (task) => task.difficulty === difficulty
    );
  });

  const taskCountsByDifficulty: { [difficulty: number]: number } = {};
  taskDifficulties.forEach((difficulty) => {
    taskCountsByDifficulty[difficulty] = tasksByDifficulty[difficulty].length;
  });

  const participantTasks: { [name: string]: Task[] } = {};
  participants.forEach((name) => {
    participantTasks[name] = [];
  });

  const results: Result[] = [];
  for (
    let difficultyIndex = 0;
    difficultyIndex < taskDifficulties.length;
    difficultyIndex++
  ) {
    const difficulty = taskDifficulties[difficultyIndex];
    for (
      let participantIndex = 0;
      participantIndex < participants.length;
      participantIndex++
    ) {
      const currentParticipant = participants[participantIndex];
      const availableTasks = tasksByDifficulty[difficulty].filter(
        (task) => !participantTasks[currentParticipant].includes(task)
      );
      const task =
        availableTasks[Math.floor(Math.random() * availableTasks.length)];
      participantTasks[currentParticipant].push(task);
      results.push({
        name: currentParticipant,
        task,
      });
    }
  }

  return results;
};

const initialState: State = {
  tasks: [],
  participants: [],
  task: {} as Task,
  participant: '',
  results: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_PARTICIPANT':
      return {
        ...state,
        participant: '',
        participants: [...state.participants, action.payload as string],
      };
    case 'SET_TASK':
      if (typeof action.payload === 'object' && 'name' in action.payload) {
        return {
          ...state,
          task: { name: '', difficulty: 0 },
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
    case 'ON_CHANGE':
      if (typeof action.payload === 'object' && 'key' in action.payload) {
        return { ...state, [action.payload?.key]: action.payload?.value };
      }
      return state;
    case 'CLEAR_ALL':
      return initialState;
    case 'RESET_WITH_PARTICIPANTS':
      return { ...initialState, participants: state.participants };
    case 'RESET_WITH_TASKS':
      return { ...initialState, tasks: state.tasks };
    case 'GET_RESULTS':
      const results: Result[] = assignTasks(state.participants, state.tasks);
      return { ...state, results };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <main className='px-5 py-5 md:px-20 bg-[#333333] min-h-screen'>
      <h1 className='text-4xl font-semibold text-white'>Randomly!</h1>

      <section className='mt-20 grid grid-cols-1 lg:grid-cols-2'>
        <article>
          {!state.results.length && (
            <>
              <form
                onSubmit={(e) => e.preventDefault()}
                className='col-span-1 flex flex-col gap-10 mb-10'
              >
                <FormInput
                  value={state.participant}
                  type='participant'
                  handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                    dispatch({
                      type: 'ON_CHANGE',
                      payload: {
                        key: 'participant',
                        value: e.target.value,
                      },
                    })
                  }
                  handleClick={() => {
                    if (
                      state.participant !== '' &&
                      /^[a-zA-Z0-9\s-?]+$/.test(state.participant)
                    ) {
                      dispatch({
                        type: 'SET_PARTICIPANT',
                        payload: state.participant,
                      });
                    }
                  }}
                />
              </form>

              <form
                onSubmit={(e) => e.preventDefault()}
                className='col-span-1 flex flex-col gap-x-10'
              >
                <p className='text-sm text-gray-400 mb-3'>
                  To add a difficulty to a task you have to use the following
                  syntax:
                  <br />
                  <code>`task name - difficulty`</code>
                </p>
                <FormInput
                  value={state.task.name}
                  type='task'
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: 'ON_CHANGE',
                      payload: {
                        key: 'task',
                        value: {
                          name: e.target.value,
                          difficulty:
                            Number(e.target.value?.split('-').pop()) ||
                            Math.floor(Math.random() * 6),
                        },
                      },
                    });
                  }}
                  handleClick={() => {
                    if (
                      state.task.name !== '' &&
                      /^[a-zA-Z0-9\s-]+$/.test(state.task.name)
                    ) {
                      dispatch({
                        type: 'SET_TASK',
                        payload: state.task,
                      });
                    }
                  }}
                />
              </form>
            </>
          )}

          <div className='mt-20 grid grid-cols-2 max-w-xl gap-5'>
            <Cta
              text='Get results'
              type='success'
              handleClick={() => dispatch({ type: 'GET_RESULTS' })}
              btnDisabled={state.results.length > 0}
            />
            <Cta
              text='Clear all'
              type='error'
              handleClick={() => dispatch({ type: 'CLEAR_ALL' })}
            />
            <Cta
              text='Clear tasks'
              type='error'
              handleClick={() => dispatch({ type: 'RESET_WITH_PARTICIPANTS' })}
            />
            <Cta
              text='Clear participants'
              type='error'
              handleClick={() => dispatch({ type: 'RESET_WITH_TASKS' })}
            />
          </div>
        </article>

        <div className='col-span-1'>
          <h2 className='text-white text-2xl font-medium mb-4'>
            {!state.results.length
              ? 'Add some participants and tasks and then click the Get results button!'
              : 'Results are here! Now get to work!'}
          </h2>
          <div className='text-gray-400'>
            {state.results.length ? (
              state.results.map((result, i) => (
                <div key={i}>
                  <p>
                    {result.name}: {result.task?.name}
                  </p>
                </div>
              ))
            ) : (
              <>
                <h3 className='mt-10 text-xl text-white'>Participants</h3>
                <ul>
                  {state.participants.map((p, idx) => (
                    <div className='flex items-center gap-1'>
                      {/* onClick={() => handleEditParticipant(p, idx)} */}
                      {/* <button>
                        <img src="/edit.png" alt="Edit icon" className='max-w-[20px]' />
                      </button> */}
                      <li key={p}>{p}</li>
                    </div>
                  ))}
                </ul>
                <h3 className='mt-10 text-xl text-white'>Tasks</h3>
                <ul>
                  {state.tasks.map((t) => (
                    <li key={t.name}>
                      {t.name.slice(0, t.name.lastIndexOf('-'))} - Difficulty:{' '}
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
