const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

export const iconSizeAttributes = {
  iconSizeUnit:{
    type: 'string',
    default: 'px'
  },
  iconSize:{
    type: 'number',
    default: 40
  },
}

export const IconSize = ( props ) => {
  const {
    iconSizeUnit = props.attributes.iconSizeUnit,
    iconSize = props.attributes.iconSize,
    setAttributes,
  } = props;

  return (
    <div>
      <RadioControl
        className={'gx-unit-control icon-size-unit-control'}
        selected={ iconSizeUnit }
        options={ [
            { label: 'PX', value: 'px' },
            { label: 'EM', value: 'em' },
            { label: 'VW', value: 'vw' },
            { label: '%', value: '%' },
        ] }
        onChange={ value => setAttributes({ iconSizeUnit: value }) }
      />
      <RangeControl
        label={__('Icon Size', 'gutenberg-extra')}
        className={'gx-with-unit-control divider-range-control'}
        value={iconSize}
        onChange={ value => setAttributes({ iconSize: value }) }
        min={ 0 }
        allowReset = {true}
        initialPosition = { 0 }
      />
    </div>
  )
}
