import React from "react"

export interface Props extends React.ComponentPropsWithoutRef<"form"> {
  specialProp?: string;
}

export const Form = (props: Props) => {
  const { specialProp, ...rest } = props;
  return <form className="space-y-6"  {...rest} />
}
