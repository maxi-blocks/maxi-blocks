const {
  __
} = wp.i18n;

const {
  SelectControl,
} = wp.components;

export const titleAlignAttributes = {
  titleTextAlign:{
    type: 'string',
    default: 'center'
  },
}

export const TitleAlign = ( props ) => {
  const {
    titleTextAlign = props.attributes.titleTextAlign,
    setAttributes,
  } = props;

  return (
    <SelectControl
      label={__('Title Align', 'maxi-blocks')}
      className="maxi-block-style"
      value={titleTextAlign}
      options={[
        { label: __('Left'), value: 'left' },
        { label: __('Center'), value: 'center' },
        { label: __('Right'), value: 'right' },
      ]}
      onChange={(value) => setAttributes({ titleTextAlign: value })}
    />
  )
}
