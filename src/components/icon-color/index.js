const {
  __
} = wp.i18n;

const {
  PanelColorSettings
} = wp.blockEditor;

export const iconColorAttributes = {
  iconColor:{
    type: 'string',
    default: '#00b2ff'
  },
}

export const IconColor = ( props ) => {
  const {
    iconColor = props.attributes.iconColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Icon Colour', 'gutenberg-extra')}
      colorSettings={[
        {
          value: iconColor,
          onChange: (value) => setAttributes({ iconColor: value }),
          label: __('Icon Colour', 'gutenberg-extra'),
        },
      ]}
    />
  )
}
