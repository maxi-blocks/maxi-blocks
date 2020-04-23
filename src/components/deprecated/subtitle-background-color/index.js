const {
  __
} = wp.i18n;

const {
  PanelColorSettings,
} = wp.blockEditor;
import ColorControl from "../../components/color-control";

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
    <ColorControl
      className={'gx-subtitle-background-color'}
      label={__("Subtitle Background", "gutenberg-extra")}
      color={subtitleBackgroundColor}
      gradient={props.attributes.backgroundGradient}
      onColorChange={(value) => {
        setAttributes({
          subtitleBackgroundColor: value,
        });
      }}
      disableGradient
    />
  )
}
