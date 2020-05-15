const { __ } = wp.i18n;
import { Component } from '@wordpress/element';

const Line = () => (
  <hr className={'divider-line'} />
);

export const dividerAttributes = {
  dividerThicknessUnit: {
    type: 'string',
    default: 'px'
  },
  dividerThickness: {
    type: 'number',
    default: 1
  },
  isMultiple: {
    type: 'boolean',
    default: false
  },
}

class Divider extends Component {
  constructor(props) {
    super(...arguments);
  }

  render() {
    // Declaring placeholder variables
    let dividerColorValue;
    let dividerAlignmentValue;
    let dividerHeightValue;
    let dividerWidthValue;
    let dividerHeightUnitValue;
    let dividerWidthUnitValue;
    let dividerThicknessValue;
    let dividerThicknessUnitValue;
    let isMultipleValue;
    const {
      help,
      instanceId,
      label = __('Margin', 'gx'),
      type = 'margin',
      setAttributes,
    } = this.props;
    const {
      dividerColor,
      dividerWidth,
      dividerHeight,
      dividerWidthUnit,
      dividerHeightUnit,
      dividerOrder,
      dividerAlignment,
      dividerThickness,
      dividerThicknessUnit,
      isVertical,
      isHidden,
      isRounded,
      isBehindTheSubtitle,
      contentDirection
    } = this.props.attributes;
    dividerColorValue = this.props.attributes.dividerColor;
    dividerAlignmentValue = this.props.attributes.dividerAlignment;
    dividerHeightValue = this.props.attributes.dividerHeight;
    dividerWidthValue = this.props.attributes.dividerWidth;
    dividerHeightUnitValue = this.props.attributes.dividerHeightUnit;
    dividerWidthUnitValue = this.props.attributes.dividerWidthUnit;
    dividerThicknessValue = this.props.attributes.dividerThickness;
    dividerThicknessUnitValue = this.props.attributes.dividerThicknessUnit;

    const dividerStyles = {
      border: dividerColor ? dividerThickness ? dividerThickness + dividerThicknessUnit + ' solid ' + dividerColor : '1px solid ' + dividerColor : '1px solid rgb(152, 152, 152)',
      margin: dividerAlignment,
      borderColor: dividerColor,
      height: dividerHeight ? dividerHeight + dividerHeightUnit : undefined,
      width: dividerWidth ? dividerWidth + dividerWidthUnit : undefined,
      borderWidth: dividerThickness ? dividerThickness + dividerThicknessUnit : '1px',
      display: isHidden ? 'none' : undefined,
      borderRadius: isRounded ? '2rem' : undefined,
      position: isBehindTheSubtitle || contentDirection == 'row' ? 'absolute' : undefined,
      top: isBehindTheSubtitle ? '1.5rem' : undefined,
      left: isBehindTheSubtitle ? dividerAlignment == 'auto' ? '0' : dividerAlignment == '0 auto 0 0' ? '0' : undefined : undefined,
      right: isBehindTheSubtitle ? dividerAlignment == 'auto' ? '0' : dividerAlignment == '0 0 0 auto' ? '0' : undefined : undefined,
      bottom: contentDirection == 'row' || contentDirection == 'row-reverse' ? '10px' : undefined,
      left: contentDirection == 'row' ? isVertical ? '300px' : undefined : undefined,
      zIndex: isBehindTheSubtitle ? -1 : undefined,
    };

    const dividerWrapperStyles = {
      order: dividerOrder,
      position: contentDirection == 'row' || contentDirection == 'row-reverse' ? 'relative' : undefined
    }



    return (
      <div
        style={dividerWrapperStyles}
      >
        <div
          className={'maxi-divider'}
          style={dividerStyles}
        />
      </div>
    )
  }
}
export default Divider;
