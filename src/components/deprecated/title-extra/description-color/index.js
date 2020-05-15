const {
  __
} = wp.i18n;

const {
  PanelColorSettings,
} = wp.blockEditor;

export const descriptionColorAttributes = {
  descriptionColor:{
    type: 'string',
    default: 'rgb(152,152,152)'
  },
}

export const DescriptionColor = ( props ) => {
  const {
    descriptionColor = props.attributes.descriptionColor,
      setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Description Colour Settings', 'maxi-blocks' )}
      colorSettings={[
        {
          value: descriptionColor,
          onChange: (value) => setAttributes({ descriptionColor: value }),
          label: __('Description  Colour', 'maxi-blocks' ),
        },
      ]}
    />
  )
}
