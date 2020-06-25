const {
  __
} = wp.i18n;

const {
  SelectControl,
} = wp.components;

export const subtitleAlignAttributes = {
  subtitleTextAlign:{
    type: 'string',
    default: '5px auto'
  },
}

export const SubtitleAlign = ( props ) => {
  const {
    subtitleTextAlign = props.attributes.subtitleTextAlign,
    setAttributes,
  } = props;

  const onChangeSubtitleAlign = (value) => {
    setAttributes({ subtitleTextAlign: value });
  }

  return (
    <SelectControl
      label={__('Subtitle Align', 'maxi-blocks')}
      className="maxi-block-style"
      value={subtitleTextAlign}
      options={[
        { label: __('Left'), value: '5px auto 5px 0' },
        { label: __('Center'), value: '5px auto' },
        { label: __('Right'), value: '5px 0 5px auto' },
      ]}
      onChange={ onChangeSubtitleAlign }
    />
  )
}
