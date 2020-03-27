const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

export const iconHoverSizeAttributes = {
  iconHoverSizeUnit:{
    type: 'string',
    default: 'px'
  },
  iconSize:{
    type: 'number',
    default: 40
  },
}

export const IconHoverSize = ( props ) => {
  const {
    iconHoverSizeUnit = props.attributes.iconHoverSizeUnit,
    iconHoverSize = props.attributes.iconHoverSize,
    setAttributes,
  } = props;

  return (
    <div>
      <RadioControl
        className={'gx-unit-control icon-size-unit-control'}
        selected={ iconHoverSizeUnit }
        options={ [
            { label: 'PX', value: 'px' },
            { label: 'EM', value: 'em' },
            { label: 'VW', value: 'vw' },
            { label: '%', value: '%' },
        ] }
        onChange={ value => setAttributes({ iconHoverSizeUnit: value }) }
      />
      <RangeControl
        label={__('Icon Size', 'gutenberg-extra')}
        className={'gx-with-unit-control divider-range-control'}
        value={iconHoverSize}
        onChange={ value => setAttributes({ iconHoverSize: value }) }
        min={ 0 }
        allowReset = {true}
        initialPosition = { 0 }
      />
    </div>
  )
}
