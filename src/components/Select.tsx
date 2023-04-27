import React from "react"

export interface Props extends React.ComponentPropsWithoutRef<"select"> {
  label: string;
  value: any;
  setter: any;
  options: any;
}


export const Select = (props: Props) => {
  const { label, value, setter, options, ...rest } = props;
  return <div>
    <label
      htmlFor={label}
      className="block text-sm font-medium text-gray-700"
    >
      {label}
    </label>
    <select
      id={label}
      value={value}
      onChange={(e: any) => { setter(e.target.value) }}
      className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
      {...rest}>
      {Object.keys(options).map(key => <option key={key} value={key}>{options[key]}</option>)}
    </select>
  </div >

}
