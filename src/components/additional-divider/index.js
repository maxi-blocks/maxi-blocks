const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;
import Checkbox from '../checkbox/index';

export const additionalDividerAttributes = {
  // isMultiple:{
  //   type: 'boolean',
  //   default: false
  // },
}

export const AdditionalDivider = ( props ) => {
  const {
    isMultiple = props.attributes.isMultiple,
    setAttributes
  } = props;

  const onChangeAdditional = (value) => {
   setAttributes({isMultiple: value});
   if(value){
    props.buildDivider(value);
   }else{
    setAttributes({additionalDivider: ''});
   }
  }

  return (
    <Checkbox
      label={__('Additional Divider', 'gutenberg-extra')}
      id='gx-new-window'
      checked={isMultiple}
      onChange={onChangeAdditional}
    />
  )
}
