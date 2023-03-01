interface Props {
  text: string;
  type: 'success' | 'error';
  handleClick: () => void;
}

const Cta = ({ type, text, handleClick }: Props) => {
  return (
    <button
      className={`rounded-md ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } px-4 py-2 hover:opacity-80`}
      onClick={handleClick}
    >
      {text}
    </button>
  );
};

export default Cta;
