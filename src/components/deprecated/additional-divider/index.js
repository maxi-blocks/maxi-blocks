const {
  __
} = wp.i18n;

import CheckBoxControl from '../../checkbox-control';

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
    <CheckBoxControl
      label={__('Additional Divider', 'gutenberg-extra')}
      id='gx-new-window'
      checked={isMultiple}
      onChange={onChangeAdditional}
    />
  )
}
