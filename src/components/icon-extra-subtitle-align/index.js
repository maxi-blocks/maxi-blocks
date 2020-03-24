const {
  __
} = wp.i18n;

const {
  SelectControl,
} = wp.components;

export const subtitleAlignAttributes = {
  subtitleAlign:{
    type: 'string',
    default: '5px auto'
  },
}

export const SubtitleAlign = ( props ) => {
  const {
    subtitleAlign = props.attributes.subtitleAlign,
    setAttributes,
  } = props;

  const onChangeSubtitleAlign = (value) => {
    setAttributes({ subtitleAlign: value });
  }

  return (
    <SelectControl
      label={__('Subtitle Align', 'gutenberg-extra')}
      className="gx-block-style"
      value={subtitleAlign}
      options={[
        { label: __('Left'), value: 'left' },
        { label: __('Center'), value: 'center' },
        { label: __('Right'), value: 'right' },
      ]}
      onChange={ onChangeSubtitleAlign }
    />
  )
}
