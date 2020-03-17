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
    // isMultiple = props.attributes.isMultiple,
    setAttributes,
  } = props;

  const onChangeAdditional = (value) => {
    console.log('from AdditionalDivider', props);
    console.log(value);
    props.isMultipleValue = value;
   setAttributes({isMultiple: value});
   if(value){
     console.log('calling buildDivider');
   }else{
    setAttributes({additionalDivider: ''});
   }
   props.buildDivider();
  }

  return (
    <ToggleControl
      label={__('Additional Divider', 'gutenberg-extra')}
      id='gx-block-style'
      checked={props.attributes.isMultiple}
      onChange={ onChangeAdditional }
    />
  )
}
