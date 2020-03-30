const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

export const iconHoverRotateAttributes = {
  iconHoverRotationUnit:{
    type: 'string',
    default: 'px'
  },
  iconHoverRotate:{
    type: 'number',
    default: 40
  },
}

export const IconHoverRotate = ( props ) => {
  const {
    iconHoverRotationUnit = props.attributes.iconHoverRotationUnit,
    iconHoverRotate = props.attributes.iconHoverRotate,
    setAttributes,
  } = props;

  return (
    <div>
    <RadioControl
      className={'gx-unit-control icon-size-unit-control'}
      selected={ iconHoverRotationUnit }
      options={ [
          { label: 'PX', value: 'px' },
          { label: 'EM', value: 'em' },
          { label: 'VW', value: 'vw' },
          { label: '%', value: '%' },
      ] }
      onChange={ value => setAttributes({ iconHoverRotationUnit: value }) }
    />
    <RangeControl
      label={__('Rotate Icon', 'gutenberg-extra')}
      className={'gx-with-unit-control divider-range-control'}
      value={iconHoverRotate}
      onChange={ value => setAttributes({ iconHoverRotate: value }) }
      min={ 0 }
      allowReset = {true}
      initialPosition = { 0 }
    />
    </div>
  )
}
