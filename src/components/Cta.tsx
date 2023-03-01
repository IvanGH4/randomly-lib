interface Props {
  text: string;
  type: 'success' | 'error';
  handleClick: () => void;
  btnDisabled?: boolean
}

const Cta = ({ type, text, handleClick, btnDisabled }: Props) => {
  return (
    <button
      className={`rounded-md ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } px-4 py-2 hover:opacity-80 disabled:opacity-40`}
      onClick={handleClick}
      disabled={btnDisabled}
    >
      {text}
    </button>
  );
};

export default Cta;
