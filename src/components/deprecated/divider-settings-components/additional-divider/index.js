const {
  __
} = wp.i18n;

const {
  ToggleControl
} = wp.components;

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
    <ToggleControl
      label={__('Additional Divider', 'maxi-blocks')}
      id='maxi-block-style'
      checked={isMultiple}
      onChange={ onChangeAdditional }
    />
  )
}
