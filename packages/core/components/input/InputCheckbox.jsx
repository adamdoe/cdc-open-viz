import React, { useState, useEffect, memo, useRef } from 'react'
import PropTypes from 'prop-types'

// Hooks
import { useVisConfig } from '../../hooks/store/useVisConfig'

// Helpers
import { getConfigKeyValue } from '../../helpers/configHelpers'

// Components
import Icon from '../ui/Icon'
import Label from '../element/Label'

// Styles
import '../../styles/v2/components/input/index.scss'

const InputCheckbox = memo((
  {
    label,
    labelPosition = 'right',
    tooltip,
    size = 'small',
    activeColor = null,
    activeCheckColor = null,
    required,

    configField,
    value: inlineValue,
    className, onClick, ...attributes
  }
) => {
  const { config, updateVisConfigField } = useVisConfig()

  const [ value, setValue ] = useState(false)

  const inputRef = useRef(null)

  // Get initial value
  const configFieldValue = configField && getConfigKeyValue(configField, config)

  // Check initial value
  // Valid value of 'false' could be returned, so checking undefined
  const valueExistsOnConfig = Boolean(configFieldValue && typeof configFieldValue !== undefined)

  // Set initial value
  useEffect(() => {
    if (valueExistsOnConfig) {
      configFieldValue !== value && setValue(configFieldValue)
    } else {
      setValue(inlineValue)
    }
  }, [ valueExistsOnConfig ])

  useEffect(() => {
    if (configField && value !== configFieldValue) updateVisConfigField(configField, value)
  }, [ configField, value, updateVisConfigField ])

  const onClickHandler = () => inputRef.current.click()

  const onChangeHandler = (e) => {
    setValue(value => !value)
    onClick && onClick(e)
  }

  const TooltipLabel = () => (
    <Label tooltip={tooltip} onClick={onClickHandler}>{label}</Label>
  )

  return (
    <div className={'cove-input__checkbox-group' + (className ? ' ' + className : '')} flow={labelPosition}>
      {label && labelPosition === 'left' && <TooltipLabel/>}
      <div className={`cove-input__checkbox${size === 'small' ? '--small' : size === 'large' ? '--large' : ''}${required && (value === undefined) ? ' cove-input--error' : ''}${value ? ' active' : ''}`}
        tabIndex={0}
        onClick={onClickHandler}
        onKeyUp={(e) => {
          if (e.code === 'Enter' || e.code === 'NumpadEnter' || e.code === 'Space') onClickHandler()
        }}
      >
        <div className={`cove-input__checkbox-box${activeColor ? ' custom-color' : ''}`}
             style={value && activeColor ? { backgroundColor: activeColor } : null}>
          <Icon display="check" className="cove-input__checkbox-check" color={activeCheckColor || '#025eaa'}/>
        </div>
        <input className="cove-input--hidden" type="checkbox" defaultChecked={value} onChange={(e) => onChangeHandler(e)} ref={inputRef} tabIndex={-1} readOnly/>
      </div>
      {label && labelPosition === 'right' && <TooltipLabel/>}
    </div>
  )
})

InputCheckbox.propTypes = {
  label: PropTypes.string,
  labelPosition: PropTypes.oneOf([ 'left', 'right' ]),
  size: PropTypes.oneOf([ 'small', 'medium', 'large' ]),
  activeColor: PropTypes.string,
  activeCheckColor: PropTypes.string,
  tooltip: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string
  ]),
  value: PropTypes.bool
}

export default InputCheckbox
