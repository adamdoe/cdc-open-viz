import React, { useState, useEffect, memo } from 'react'
import { useDebounce } from 'use-debounce'

import '../../styles/v2/components/input/index.scss'

const InputText = memo((
  {
    label,
    section = null,
    subsection = null,
    fieldName,
    updateField,
    value: stateValue,
    type = 'input',
    i = null, min = null, max = null,
    ...attributes
  }
) => {

  const [ value, setValue ] = useState(stateValue)
  const [ debouncedValue ] = useDebounce(value, 500)

  useEffect(() => {
    if ('string' === typeof debouncedValue && stateValue !== debouncedValue && updateField) {
      updateField(section, subsection, fieldName, debouncedValue, i)
    }
  }, [ debouncedValue, section, subsection, fieldName, i, stateValue, updateField ])

  let name = subsection ? `${section}-${subsection}-${fieldName}` : `${section}-${subsection}-${fieldName}`

  const onChange = (e) => {
    if ('number' !== type || min === null) {
      setValue(e.target.value)
    } else {
      if (!e.target.value || (parseFloat(min) <= parseFloat(e.target.value) & parseFloat(max) >= parseFloat(e.target.value))) {
        setValue(e.target.value)
      } else {
        setValue(min.toString())
      }
    }
  }

  let formElement = <input className="cove-input" type="text" name={name} onChange={onChange} {...attributes} value={value}/>

  if ('textarea' === type) {
    formElement = (
      <textarea className="cove-input" name={name} onChange={onChange} {...attributes} value={value}/>
    )
  }

  if ('number' === type) {
    formElement = <input className="cove-input" type="number" name={name} onChange={onChange} {...attributes} value={value}/>
  }

  return (
    <>
      {label && <label className="cove-input__label">{label}</label>}
      {formElement}
    </>
  )
})

export default InputText
