const {
  __
} = wp.i18n;

const {
  SelectControl,
} = wp.components;

export const descriptionAlignAttributes = {
  descriptionTextAlign:{
    type: 'string',
    default: 'center'
  },
}

export const DescriptionAlign = ( props ) => {
  const {
    descriptionTextAlign = props.attributes.descriptionTextAlign,
    setAttributes,
  } = props;

  return (
    <SelectControl
      label={__('Description Align', 'gutenberg-extra')}
      className="gx-block-style"
      value={descriptionTextAlign}
      options={[
        { label: __('Left'), value: 'left' },
        { label: __('Center'), value: 'center' },
        { label: __('Right'), value: 'right' },
      ]}
      onChange={(value) => setAttributes({ descriptionTextAlign: value })}
    />
  )
}
