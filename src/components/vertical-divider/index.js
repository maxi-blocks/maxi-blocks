const { __ } = wp.i18n;
import { Component } from "@wordpress/element";

import CheckBoxControl from '../checkbox-control';

export const verticalDividerAttributes = {
  isVertical: {
    type: "boolean",
    default: false,
  },
};

export const VerticalDivider = (props) => {
  const {
    isVertical = props.attributes.isVertical,
    dividerWidth = props.attributes.dividerWidth,
    dividerHeight = props.attributes.dividerHeight,
    setAttributes,
  } = props;

  const onChangeDirection = (value) => {
    setAttributes({ isVertical: value });
    if (value) {
      setAttributes({ dividerHeight: dividerWidth, dividerWidth: 1 });
      props.buildDivider(
        undefined,
        undefined,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        dividerWidth
      );
    } else {
      setAttributes({ dividerWidth: dividerHeight, dividerHeight: 0 });
      props.buildDivider(
        undefined,
        undefined,
        undefined,
        undefined,
        dividerHeight,
        undefined,
        undefined,
        0
      );
    }
  };

  return (
    <CheckBoxControl
      label={__('Vertical Divider', 'gutenberg-extra')}
      id='gx-new-window'
      checked={isVertical}
      onChange={onChangeDirection}
    />
  );
};
