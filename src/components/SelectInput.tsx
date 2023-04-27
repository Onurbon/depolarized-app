import ReactSelect from "react-select"

const style = `
  * { 
    --tw-ring-color: none !important;   
  }
  .select__placeholder  {
    color: rgb(156 163 177) !important;
  }
`

export const SelectInput = ({ value, label, reactLabel, options, onChange, placeholder }: any) => {
  return <div>
    <label
      htmlFor={label}
      className="block text-sm font-medium text-gray-700"
    >
      {reactLabel || label}
    </label>
    <style scoped>{style}</style>
    <ReactSelect
      placeholder={placeholder}
      isMulti
      styles={{
        control: s => ({
          ...s,
          fontSize: "0.875rem",
          fontFamily: 'ui-sans-serif, system-ui, -apple-system, Roboto'
        })
      }}
      value={value}
      options={options}
      onChange={onChange}
      className="basic-multi-select"
      classNamePrefix="select" />
  </div>
}
