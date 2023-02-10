import { ChangeEvent } from 'react';

interface Props {
  value: string;
  type: 'task' | 'participant'
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleClick: () => void;
}

const FormInput = ({ value, type, handleChange, handleClick }: Props) => {
  return (
    <label htmlFor={type} className='flex items-center gap-2'>
      <input
        id={type}
        name={type}
        className='text-[#333333] shadow-md shadow-[rgba(255,255,255,0.5)] rounded-md p-2 w-full max-w-[450px]'
        type='text'
        placeholder={`Add new ${type}`}
        value={value}
        onChange={handleChange}
      />
      <button className='px-5 py-2 rounded-md bg-[#001cee]' onClick={handleClick}>
        Add
      </button>
    </label>
  );
};

export default FormInput;
