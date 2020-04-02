const {
  __
} = wp.i18n;

const {
  PanelColorSettings,
} = wp.blockEditor;

export const subtitleBackgroundColorAttributes = {
  subtitleBackgroundColor:{
    type: 'string',
    default: 'white'
  },
}

export const SubtitleBackgroundColor = ( props ) => {
  const {
    subtitleBackgroundColor = props.attributes.subtitleBackgroundColor,
    setAttributes,
  } = props;

  return (
    <PanelColorSettings
      title={__('Subtitle Background Settings', 'gutenberg-extra' )}
      colorSettings={[
        {
          value: subtitleBackgroundColor,
          onChange: (value) => setAttributes({ subtitleBackgroundColor: value }),
          label: __('Subtitle Background', 'gutenberg-extra' ),
        },
      ]}
    />
  )
}
