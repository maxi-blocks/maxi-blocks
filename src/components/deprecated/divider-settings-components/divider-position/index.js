const {
  __
} = wp.i18n;

const {
  SelectControl
} = wp.components;

export const dividerPositionAttributes = {
  dividerOrder:{
    type: 'string',
  },
}

export const DividerPosition = ( props ) => {
  const {
    dividerOrder = props.attributes.dividerOrder,
    setAttributes,
  } = props;

  const onChangeDividerPosition = (value) => {
    setAttributes({ dividerOrder: value });
    if(value !== 'behind-subtitle'){
      setAttributes({ isBehindTheSubtitle: false });
      setAttributes({isAppendedToSubtitle: false});
      setAttributes({isPreappendedToSubtitle: false});
    }
    if(value == 'preappend-subtitle'){
      setAttributes({ dividerAlignment: '0 auto 0 0' });
      setAttributes({ isBehindTheSubtitle: true });
      setAttributes({isAppendedToSubtitle: false});
      setAttributes({isPreappendedToSubtitle: true});
      setAttributes({subtitleBackgroundColor: 'white'});
    }
    if(value == 'appended-subtitle'){
      setAttributes({ dividerAlignment: '0 0 0 auto' });
      setAttributes({ isBehindTheSubtitle: true });
      setAttributes({isPreappendedToSubtitle: false});
      setAttributes({isAppendedToSubtitle: true});
      setAttributes({subtitleBackgroundColor: 'white'});
    }

    if(value == 'behind-subtitle'){
      setAttributes({ isBehindTheSubtitle: true });
      setAttributes({subtitleBackgroundColor: 'white'});
    }
  }

  return (
    <SelectControl
        label={__('Divider Position', 'gutenberg-extra')}
        className="gx-block-style"
        value={dividerOrder}
        options={[
          { label: __('After Title'), value: 1 },
          { label: __('Before Title'), value: 0 },
          { label: __('Before Subtitle'), value: -1 },
          { label: __('After Description'), value: 4 },
          { label: __('Behind Subtitle'), value: 'behind-subtitle' },
          { label: __('Preappended to Subtitle'), value: 'preappend-subtitle' },
          { label: __('Appended to Subtitle'), value: 'appended-subtitle' },
        ]}
        onChange={ onChangeDividerPosition }
    />
  )
}
