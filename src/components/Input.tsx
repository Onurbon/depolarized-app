import React, { ReactNode } from "react"
import 'react-phone-number-input/style.css'
import Phone, { isValidPhoneNumber } from 'react-phone-number-input'
import TextareaAutosize from 'react-textarea-autosize';

export interface Props extends React.ComponentPropsWithoutRef<"input"> {
  label: string;
  reactLabel?: ReactNode;
  value: any;
  setter: any;
  setValid?: any;
  error?: string;
  errorSetter?: any;
  children?: any;
}

export const Input = (props: Props) => {
  const { label, reactLabel, value, setter, error, errorSetter, ...rest } = props;
  return <div>
    <label
      htmlFor={label}
      className="block text-sm font-medium text-gray-700"
    >
      {reactLabel || label}
    </label>
    <div className="mt-1">
      <input
        id={label}
        value={value}
        onChange={(e: any) => {
          setter(e.target.value)
          if (errorSetter) errorSetter('')
        }}
        className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
        {...rest} />
    </div>
    {error && error!.length > 0 && <p className="text-red-500 text-xs italic">{error}</p>}
  </div >
}

export const InputCheckBox = (props: Props) => {
  const { label, reactLabel, value, setter, ...rest } = props;
  return <div style={{ margin: 0 }}>
    <input
      id={label}
      value={value}
      type='checkbox'
      onChange={(e: any) => {
        console.log('InputCheckBox', { val: e.target.value })
        setter((x: any) => !x)
      }}
      className='inline ml-1'
      style={{ appearance: 'revert' }}
      {...rest} />
    <label
      htmlFor={label}
      className="inline ml-1 text-sm font-medium text-gray-700"
    >
      {reactLabel || label}
    </label>

  </div >
}


export const PhoneInput = (props: Props) => {
  const { label, reactLabel, value, setter, error, errorSetter, setValid, ...rest } = props;
  const isGB = Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/London"
  const isTestUser = (v: any) => v && v.startsWith('+11111')
  return <div>
    <label
      htmlFor={label}
      className="block text-sm font-medium text-gray-700"
    >
      {reactLabel || label}
    </label>
    <div className="mt-1">
      <style scoped>{`
          .PhoneInputInput {
            border-radius: 6px !important;
            border-color: rgb(209 213 219) !important;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            line-height: 20px;
            font-size: 14px;
          }
      `}
      </style>
      <Phone
        placeholder="Enter phone number"
        international={true}
        withCountryCallingCode
        defaultCountry={isGB ? "GB" : "US"}
        value={value}
        onChange={(v) => { setter(v); v && setValid(isTestUser(v) || isValidPhoneNumber(v)) }}
      />
    </div>
    {error && error!.length > 0 && <p className="text-red-500 text-xs italic">{error}</p>}
  </div >
}

export const SmallInput = (props: Props) => {
  const { label, reactLabel, value, setter, children, ...rest } = props;
  return <div>
    <label
      htmlFor={label}
      className="inline text-sm font-medium text-gray-700"
    >
      {reactLabel || label}:
    </label>
    <input
      id={label}
      value={value}
      onChange={(e: any) => { setter(e.target.value) }}
      className='inline ml-3 appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
      {...rest} />
    {children!}
  </div >
}

export interface TextAreaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  label: string;
  reactLabel?: ReactNode;
  value: any;
  minRows?: number;
  setter: any;
  error?: string;
  children?: any
}


export const TextAreaInput = (props: TextAreaProps) => {
  const { label, reactLabel, value, setter, ...rest } = props;
  return <div>
    <label
      htmlFor={label}
      className="inline text-sm font-medium text-gray-700"
    >
      {reactLabel || label}
    </label>
    {/* @ts-ignore */}
    <TextareaAutosize
      name="context"
      id="context"
      className="block w-full resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder-gray-400"
      value={value}
      onChange={(e: any) => setter(e.target.value)}
      {...rest}
    />
  </div>
}


export const TextAreaInputLarger = (props: TextAreaProps) => {
  const { label, reactLabel, value, setter, ...rest } = props;
  return <div>
    <label
      htmlFor={label}
      className="inline text-sm font-medium text-gray-700"
    >
      {reactLabel || label}
    </label>
    {/* @ts-ignore */}
    <TextareaAutosize
      name="context"
      id="context"
      className="block w-full text-lg resize-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500  placeholder-gray-400"
      value={value}
      onChange={(e: any) => setter(e.target.value)}
      {...rest}
    />
  </div>
}
