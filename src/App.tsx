import { ChangeEvent, useReducer } from 'react';

import Cta from './components/Cta';
import FormInput from './components/FormInput';

type Result = {
  name: string;
  task: string;
};

type State = {
  tasks: string[];
  participants: string[];
  task: string;
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
        value: string;
      };
};

const shuffle = (array: string[]): string[] => {
  return array.sort(() => Math.random() - 0.5);
};

const assignTasks = (participants: string[], tasks: string[]): Result[] => {
  const tasksAux = [...tasks];
  const results: Result[] = [];
  // TODO: niveles de dificultad a las tareas
  while (tasks.length > results.length) {
    participants.forEach((name) => {
      const task =
        shuffle(tasksAux)[Math.floor(Math.random() * tasksAux.length)];
      results.push({
        name,
        task: task || 'Zafaste!',
      });
      tasksAux.splice(tasksAux.indexOf(task), 1);
    });
  }

  return results as Result[];
};

const initialState: State = {
  tasks: [],
  participants: [],
  task: '',
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
      return {
        ...state,
        task: '',
        tasks: [...state.tasks, action.payload as string],
      };
    case 'ON_CHANGE':
      if (typeof action.payload === 'object') {
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
                    if (state.participant !== '') {
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
                className='col-span-1 flex flex-col gap-10'
              >
                <FormInput
                  value={state.task}
                  type='task'
                  handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                    dispatch({
                      type: 'ON_CHANGE',
                      payload: {
                        key: 'task',
                        value: e.target.value,
                      },
                    });
                  }}
                  handleClick={() => {
                    if (state.task !== '') {
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
              text='Clear all but keep participants'
              type='error'
              handleClick={() => dispatch({ type: 'RESET_WITH_PARTICIPANTS' })}
            />
            <Cta
              text='Clear all but keep tasks'
              type='error'
              handleClick={() => dispatch({ type: 'RESET_WITH_TASKS' })}
            />
          </div>
        </article>

        <div className='col-span-1'>
          <h2 className='text-white text-2xl font-medium mb-4'>
            {!state.results.length
              ? 'Input some data to see the results!'
              : 'Results are here! Now get to work!'}
          </h2>
          <div className='text-gray-400'>
            {state.results.length ? (
              state.results.map((result, i) => (
                <div key={i}>
                  <p>
                    {result.name}: {result.task}
                  </p>
                </div>
              ))
            ) : (
              <>
                <h3 className='mt-10 text-xl text-white'>Participants</h3>
                <ul>
                  {state.participants.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <h3 className='mt-10 text-xl text-white'>Tasks</h3>
                <ul>
                  {state.tasks.map((t) => (
                    <li key={t}>{t}</li>
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
