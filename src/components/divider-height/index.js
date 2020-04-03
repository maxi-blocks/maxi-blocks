const {
  __
} = wp.i18n;

const {
  RangeControl,
  RadioControl
} = wp.components;

export const dividerHeightAttributes = {
  dividerHeight:{
    type: 'number',
    default: 0
  },
  dividerHeightUnit:{
    type: 'string',
    default: 'px'
  },
}

export const DividerHeight = ( props ) => {
  const {
    dividerHeightUnit = props.attributes.dividerHeightUnit,
    dividerHeight = props.attributes.dividerHeight,
    isVertical = props.attributes.isVertical,
    dividerThickness = props.attributes.dividerThickness,
    setAttributes,
  } = props;

  const onChangeDividerHeightValue = (value) => {
    setAttributes({dividerHeightUnit : value});
    this.dividerHeightUnitValue = value;
    props.buildDivider(undefined,undefined,undefined,undefined,undefined,undefined,undefined, undefined, value);
  }

  const onChangeDividerHeight = ( value ) => {
    if(isVertical){
     setAttributes({ dividerHeight: value, dividerWidth: 1 });
     this.dividerHeightValue = value;
     this.dividerWidthValue = 1;
     props.buildDivider(undefined,undefined,undefined,undefined,1,undefined,undefined, value, undefined);
    }else{
     this.dividerThicknessValue = value;
     setAttributes({dividerThickness: value})
     props.buildDivider(undefined,undefined,undefined,undefined,undefined,value,undefined, undefined, undefined);
    }
  }

  const handleClick = (e) => {

    if(e.target.previousSibling.style.display == '' || e.target.previousSibling.style.display == 'none'){
      e.target.previousSibling.style.display = 'block';
    }else{
      e.target.previousSibling.style.display = '';
    }
  }

  return (
    <div className={'divider-dimension'}>
      <RadioControl
        className={'gx-unit-control divider-unit-control'}
        selected={ dividerHeightUnit }
        options={ [
          { label: 'PX', value: 'px' },
          { label: 'EM', value: 'em' },
          { label: 'VW', value: 'vw' },
          { label: '%', value: '%' },
        ] }
        onChange={ onChangeDividerHeightValue }
      />
      <RangeControl
        label={__('Height', 'gutenberg-extra')}
        className={'gx-with-unit-control divider-range-control'}
        value={isVertical ? dividerHeight : dividerThickness}
        onClick={handleClick}
        onChange={ onChangeDividerHeight }
        min={ 0 }
        allowReset = {true}
        initialPosition = { 0 }
      />
    </div>
  )
}
