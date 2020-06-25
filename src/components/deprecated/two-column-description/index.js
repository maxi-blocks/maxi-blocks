const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import CheckBoxControl from '../../checkbox-control';

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
    <CheckBoxControl
      label={__('Two Column Description Layout', 'maxi-blocks')}
      id='maxi-new-window'
      checked={twoColumnDesc}
      onChange={(newValue) => setAttributes({twoColumnDesc: newValue})}
    />
  )
}
