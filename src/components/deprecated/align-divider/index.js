const {
  __
} = wp.i18n;

const {
  SelectControl
} = wp.components;

export const alignDividerAttributes = {
  dividerAlignment:{
    type: 'string',
    default: 'auto'
  },
}

export const AlignDivider = ( props ) => {
  const {
    dividerAlignment = props.attributes.dividerAlignment,
    setAttributes,
  } = props;

  const onChangeDividerAlignment = (value) => {
     setAttributes({ dividerAlignment: value });
     this.dividerAlignmentValue = value;
     props.buildDivider(undefined, value);
  }

  return (
    <SelectControl
        label={__('Divider Alignment', 'gutenberg-extra')}
        className="gx-block-style components-base-control divider-alignment"
        value={dividerAlignment}
        options={[
            { label: __('Left'), value: '0 auto 0 0' },
            { label: __('Center'), value: 'auto' },
            { label: __('Right'), value: '0 0 0 auto' },
        ]}
        onChange={ onChangeDividerAlignment }
    />
  )
}
