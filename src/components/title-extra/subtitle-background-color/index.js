const {
  __
} = wp.i18n;

const {
  PanelColorSettings,
} = wp.blockEditor;

export const subtitleBackgroundColorAttributes = {
  subtitleBackgroundColor:{
    type: 'string',
  },
}

export const SubtitleBackgroundColor = ( props ) => {
  const {
    subtitleBackgroundColor = props.attributes.subtitleBackgroundColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Sub-title Background Colour Settings', 'gutenberg-extra' )}
      colorSettings={[
        {
          value: subtitleBackgroundColor,
          onChange: (value) => setAttributes({ subtitleBackgroundColor: value }),
          label: __('Sub-title Background Colour', 'gutenberg-extra' ),
        },
      ]}
    />
  )
}
