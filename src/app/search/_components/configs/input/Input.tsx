import { useState, KeyboardEvent } from 'react';
import IconTip from './IconTip';
import InputItem from './InputItem';
import { toast } from 'react-hot-toast';

interface InputProps {
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  name: string;
  data: Array<string> | string | Record<string, number>;
  placeholder?: string;
  tip?: string;
  classname?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onAdd?: (name: string, value: string) => void;
  onDelete?: (name: string, value: string) => void;
}

const inputBaseStyle =
  'pl-8 h-8 w-full pr-2 bg-opacity-60 bg-white text-sm sm:text-base outline-none';

const Input: React.FC<InputProps> = ({
  icon: Icon,
  name,
  data,
  tip,
  placeholder,
  classname,
  onChange,
  onAdd,
  onDelete,
}) => {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (value.trim()) {
      if (name === 'priorityList') {
        const isValid = /^[a-zA-Z]+:\d+$/.test(value);
        if (!isValid) {
          toast.error('Invalid input');
          return;
        }
      }
      onAdd!(name, value.trim());
      setValue('');
    }
  };

  const handleKeyEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <label className="flex flex-wrap gap-1 items-center">
      <div className="w-full relative sm:max-w-[250px] mr-1">
        <span className="absolute left-[2px] top-[3px] rounded-full bg-zinc-100">
          {(tip && (
            <IconTip content={tip}>
              <Icon height={25} width={25} />
            </IconTip>
          )) || <Icon height={25} width={25} />}
        </span>

        {name === 'timeRange' ? (
          <select
            className={`${inputBaseStyle} w-full`}
            name="timeRange"
            value={data as string}
            onChange={onChange}
          >
            <option value="DAY" className="hover:bg-black border-none">
              Day
            </option>
            <option value="WEEK">Week</option>
            <option value="MONTH">Month</option>
          </select>
        ) : (
          <input
            className={`${inputBaseStyle} ${classname} ${
              name === 'location' ? 'w-full' : ''
            }`}
            name={name}
            placeholder={placeholder}
            value={value}
            onKeyDown={name === 'location' ? () => {} : handleKeyEnter}
            onChange={
              name === 'location'
                ? onChange
                : (e) => {
                    setValue(e.target.value);
                  }
            }
          />
        )}
        {name !== 'location' && name !== 'timeRange' ? (
          <button
            className="absolute right-[5px] top-[9px] flex items-center justify-center w-3 h-3 rounded-sm text-white font-extrabold hover:cursor-pointer active:bg-gray-600 bg-gray-700 bg-opacity-70"
            onClick={(e) => {
              e.preventDefault();
              handleAdd();
            }}
          >
            +
          </button>
        ) : null}
      </div>

      {name !== 'location' && name !== 'timeRange'
        ? Array.isArray(data)
          ? data.map((content) => (
              <InputItem
                key={content}
                value={content}
                onDelete={() => {
                  onDelete!(name, content);
                }}
              />
            ))
          : Object.entries(data).map(([key, value]) => (
              <InputItem
                key={key}
                value={`${key}:${value}`}
                onDelete={() => onDelete!(name, `${key}:${value}`)}
              />
            ))
        : null}
    </label>
  );
};

export default Input;
