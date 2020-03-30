const {
  __
} = wp.i18n;

const {
  PanelColorSettings
} = wp.blockEditor;

export const iconHoverColorAttributes = {
  iconHoverColor:{
    type: 'string',
    default: '#00b2ff'
  },
}

export const IconHoverColor = ( props ) => {
  const {
    iconHoverColor = props.attributes.iconHoverColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Icon Colour', 'gutenberg-extra')}
      colorSettings={[
        {
          value: iconHoverColor,
          onChange: (value) => setAttributes({ iconHoverColor: value }),
          label: __('Icon Colour', 'gutenberg-extra'),
        },
      ]}
    />
  )
}
