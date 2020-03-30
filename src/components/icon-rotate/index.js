const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

export const iconRotateAttributes = {
  iconRotationUnit:{
    type: 'string',
    default: 'px'
  },
  iconRotate:{
    type: 'number',
    default: 40
  },
}

export const IconRotate = ( props ) => {
  const {
    iconRotationUnit = props.attributes.iconRotationUnit,
    iconRotate = props.attributes.iconRotate,
    setAttributes,
  } = props;

  return (
    <div>
    <RadioControl
      className={'gx-unit-control icon-size-unit-control'}
      selected={ iconRotationUnit }
      options={ [
          { label: 'PX', value: 'px' },
          { label: 'EM', value: 'em' },
          { label: 'VW', value: 'vw' },
          { label: '%', value: '%' },
      ] }
      onChange={ value => setAttributes({ iconRotationUnit: value }) }
    />
    <RangeControl
      label={__('Rotate Icon', 'gutenberg-extra')}
      className={'gx-with-unit-control divider-range-control'}
      value={iconRotate}
      onChange={ value => setAttributes({ iconRotate: value }) }
      min={ 0 }
      allowReset = {true}
      initialPosition = { 0 }
    />
    </div>
  )
}
