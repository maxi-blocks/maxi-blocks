const {
  __
} = wp.i18n;

const {
  PanelColorSettings
} = wp.blockEditor;

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
    this.buildDivider;
   }

  return (
    <PanelColorSettings
    title={__('Divider Colour', 'gutenberg-extra' )}
    colorSettings={[
      {
        value: dividerColor,
        onChange: onChangeDividerColor,
        label: __('Divider Colour', 'gutenberg-extra' ),
      },
    ]}
    />
  )
}
