import React from "react"


export interface Props extends React.ComponentPropsWithoutRef<"button"> {
  specialProp?: string;
}

export const Button = (props: Props) => {
  const { specialProp, ...rest } = props;
  return <button
    className="flex w-full justify-center rounded-md border border-transparent bg-purple-600 disabled:bg-indigo-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    {...rest} />;
}

export const SmallButton = (props: Props) => {
  const { specialProp, ...rest } = props;
  return <button
    className="inline mr-2 rounded-md border border-transparent bg-indigo-600 disabled:bg-indigo-300 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    {...rest} />;
}

export const SmallButtonGrey = (props: Props) => {
  const { specialProp, ...rest } = props;
  return <button
    className="inline mr-2 rounded-md border border-transparent bg-gray-200 disabled:bg-gray-100 disabled:text-gray-200 py-2 px-4 text-sm font-medium  shadow-sm hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
    {...rest} />;
}

export const SmallButtonGreen = (props: Props) => {
  const { specialProp, ...rest } = props;
  return <button
    className="inline mr-2 rounded-md border border-transparent bg-green-600 text-white disabled:bg-gray-100 disabled:text-gray-200 py-2 px-4 text-sm font-medium  shadow-sm hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
    {...rest} />;
}

export const SmallButtonRed = (props: Props) => {
  const { specialProp, ...rest } = props;
  return <button
    className="inline mr-2 rounded-md border border-transparent bg-red-200 py-2 px-4 text-sm font-medium  shadow-sm hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-grey-500 focus:ring-offset-2"
    {...rest} />;
}
