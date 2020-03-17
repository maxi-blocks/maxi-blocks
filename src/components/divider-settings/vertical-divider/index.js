const {__} = wp.i18n;
import {Component} from '@wordpress/element';

const {ToggleControl} = wp.components;

export const verticalDividerAttributes = {
  isVertical: {
    type: 'boolean',
    default: false
  }
}

export const VerticalDivider = ( props ) => {
    const {
      isVertical = props.attributes.isVertical,
      dividerWidth = props.attributes.dividerWidth,
      dividerHeight = props.attributes.dividerHeight,
      setAttributes
    } = props;

    const onChangeDirection = (value) => {
      setAttributes({isVertical: value});
      if (value) {
        setAttributes({dividerHeight: dividerWidth, dividerWidth: 1});
      } else {
        setAttributes({dividerWidth: dividerHeight, dividerHeight: 0});
      }
      this.buildDivider;
    }

    return (<ToggleControl label={__('Vertical Divider', 'gutenberg-extra')} id='gx-block-style' checked={isVertical} onChange={onChangeDirection}/>)
}
