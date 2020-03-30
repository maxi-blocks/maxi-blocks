const {
  __
} = wp.i18n;

const {
  SelectControl
} = wp.components;

export const iconHoverAnimtaionsAttributes = {
  iconHoverAnimation:{
    type: 'string',
    default: 'grow'
  },
}

export const IconHoverAnimation = ( props ) => {
  const {
    iconHoverAnimation = props.attributes.iconHoverAnimation,
    options = [
      { label: __('Grow', 'gutenberg-extra'), value: 'grow' },
    ],
    setAttributes,
  } = props;

  return (
    <SelectControl
        label={__('Hover Animation', 'gutenberg-extra')}
        className={'hover-animation'}
        value={iconHoverAnimation}
        options = {options}
        onChange={(value) => setAttributes({ iconHoverAnimation: value })}
    />
  )
}
