const {
  __
} = wp.i18n;

const {
  PanelColorSettings
} = wp.blockEditor;

export const iconHoverBackgroundColorAttributes = {
  iconHoverBackgroundColor:{
    type: 'string',
    default: '#00b2ff'
  },
}

export const IconHoverBackgroundColor = ( props ) => {
  const {
    iconHoverBackgroundColor = props.attributes.iconHoverBackgroundColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Background Colour', 'gutenberg-extra')}
      colorSettings={[
        {
          value: iconHoverBackgroundColor,
          onChange: (value) => setAttributes({ iconHoverBackgroundColor: value }),
          label: __('Background Colour', 'gutenberg-extra'),
        },
      ]}
    />
  )
}
