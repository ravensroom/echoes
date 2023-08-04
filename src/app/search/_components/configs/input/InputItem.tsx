interface InputItemProps {
  value: string;
  onDelete: () => void;
}

const InputItem: React.FC<InputItemProps> = ({ value, onDelete }) => {
  return (
    <div className="h-6 flex items-center gap-1 rounded-sm px-2 bg-gray-400 text-sm sm:text-base ">
      <div className="text-semibold pr-1">{value}</div>
      <button
        className="flex items-center justify-center text-xs w-3 h-3 rounded-sm text-white font-semibold hover:cursor-pointer  active:bg-gray-600 bg-gray-700 bg-opacity-70"
        onClick={(e) => {
          e.preventDefault();
          onDelete();
        }}
      >
        x
      </button>
    </div>
  );
};

export default InputItem;
