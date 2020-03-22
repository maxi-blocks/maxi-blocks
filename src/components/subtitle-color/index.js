const {
  __
} = wp.i18n;

const {
  PanelColorSettings,
} = wp.blockEditor;

export const subtitleColorAttributes = {
  subtitleColor:{
    type: 'string',
    default: 'rgb(152,152,152)'
  },
}

export const SubtitleColor = ( props ) => {
  const {
    subtitleColor = props.attributes.subtitleColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Sub-title Colour Settings', 'gutenberg-extra' )}
      colorSettings={[
        {
          value: subtitleColor,
          onChange: (value) => setAttributes({ subtitleColor: value }),
          label: __('Sub-title Colour', 'gutenberg-extra' ),
        },
      ]}
    />
  )
}
