import { RegisterOptions, useFormContext } from "react-hook-form";
import { InputHTMLAttributes } from "react";

type TProps = {
  name: string;
  label?: string;
  options?: RegisterOptions | undefined;
} & InputHTMLAttributes<HTMLInputElement>;

export const InputAddress = ({
  name,
  label,
  options,
  ...restProps
}: TProps) => {
  const { register } = useFormContext();

  return (
    <>
      {label ? (
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor={name}
        >
          {label} 
        </label>
      ) : null}
      <input 
        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        type="text"
        placeholder="0x..."
        {...register(name, options)}
        {...restProps}
      />
    </>
  );
};
