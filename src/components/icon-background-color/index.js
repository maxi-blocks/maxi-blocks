const {
  __
} = wp.i18n;

const {
  PanelColorSettings
} = wp.blockEditor;

export const iconBackgroundColorAttributes = {
  iconBackgroundColor:{
    type: 'string',
    default: '#00b2ff'
  },
}

export const IconBackgroundColor = ( props ) => {
  const {
    iconBackgroundColor = props.attributes.iconBackgroundColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Background Colour', 'gutenberg-extra')}
      colorSettings={[
        {
          value: iconBackgroundColor,
          onChange: (value) => setAttributes({ iconBackgroundColor: value }),
          label: __('Background Colour', 'gutenberg-extra'),
        },
      ]}
    />
  )
}
