const {
  __
} = wp.i18n;

const {
  PanelColorSettings,
} = wp.blockEditor;

export const titleColorAttributes = {
  titleColor:{
    type: 'string',
    default: 'rgb(152,152,152)'
  },
}

export const TitleColor = ( props ) => {
  const {
    titleColor = props.attributes.titleColor,
      setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Title Colour Settings', 'gutenberg-extra' )}
      colorSettings={[
        {
          value: titleColor,
          onChange: (value) => setAttributes({ titleColor: value }),
          label: __('Title Colour', 'gutenberg-extra' ),
        },
      ]}
    />
  )
}
