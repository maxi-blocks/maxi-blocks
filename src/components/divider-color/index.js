const {
  __
} = wp.i18n;

const {
  PanelColorSettings
} = wp.blockEditor;
import ColorControl from "../../components/color-control";

export const dividerColorAttributes = {
  dividerColor:{
    type: 'string',
    default: '#00b2ff'
  },
}

export const DividerColor = ( props ) => {
  const {
    dividerColor = props.attributes.dividerColor,
    setAttributes,
  } = props;

   const onChangeDividerColor = (value) => {
    setAttributes({ dividerColor: value });
    this.dividerColorValue = value;
    props.buildDivider(undefined,undefined,undefined,undefined,undefined,undefined,undefined, undefined, undefined,value);
   }

  return (
    <ColorControl
      label={__("Divider Colour", "gutenberg-extra")}
      className={'components-base-control'}
      color={dividerColor}
      gradient={props.attributes.backgroundGradient}
      onColorChange={(value) => {onChangeDividerColor}}
      disableGradient
    />
    // <PanelColorSettings
    // title={__('Divider Colour', 'gutenberg-extra' )}
    // className={'divider-color'}
    // colorSettings={[
    //   {
    //     value: dividerColor,
    //     onChange: onChangeDividerColor,
    //     label: __('Divider Colour', 'gutenberg-extra' ),
    //   },
    // ]}
    // />
  )
}
