const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import CheckBoxControl from '../../checkbox-control';

export const roudnedDividerAttributes = {
  isRounded:{
    type: 'boolean',
    default: false
  },
}

export const RoundedDivider = ( props ) => {
  const {
      isRounded = props.attributes.isRounded,
      setAttributes,
  } = props;

  const onChangeRounded = (value) => {
    setAttributes({isRounded: value});
    props.buildDivider(undefined,undefined,value);
  }
  return (
    <CheckBoxControl
      label={__('Rounded Divider', 'gutenberg-extra')}
      id='gx-new-window'
      checked={isRounded}
      onChange={onChangeRounded}
    />
  )
}
