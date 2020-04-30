const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

export const twoColumnAttributes = {
  twoColumnDesc:{
    type: 'boolean',
    default: false
  },
}

export const TwoColumn = ( props ) => {
  const {
      twoColumnDesc = props.attributes.twoColumnDesc,
      setAttributes,
  } = props;

  return (
    <ToggleControl
      label={__('Two Column Description Layout', 'gutenberg-extra')}
      id='gx-block-style'
      checked={twoColumnDesc}
      onChange={(value) => {setAttributes({twoColumnDesc: value})}}
    />
  )
}
