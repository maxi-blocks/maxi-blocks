const { __ } = wp.i18n;

const { RangeControl, RadioControl } = wp.components;
const { Component, Fragment } = wp.element;

import { buildDivider } from "../divider/index";

export const dividerWidthAttributes = {
  dividerWidthUnit: {
    type: "string",
    default: "px"
  },
  dividerWidth: {
    type: "number",
    default: 60
  }
};

export class DividerWidth extends Component {
  
  
  componentDidMount() {
    document.body.addEventListener("click", window.gutenberg_extra_hideAll);
  }

  render() {
    const {
      dividerWidthUnit = this.props.attributes.dividerWidthUnit,
      dividerWidth = this.props.attributes.dividerWidth,
      isVertical = this.props.attributes.isVertical,
      dividerThickness = this.props.attributes.dividerThickness,
      setAttributes
    } = this.props;

    const onChangeDividerWidthUnit = value => {
      setAttributes({ dividerWidthUnit: value });
      this.dividerWidthUnitValue = value;
      this.props.buildDivider(undefined, undefined, undefined, value);
    };

    
    const handleClick = (e) => {

      if(e.target.previousSibling.style.display == '' || e.target.previousSibling.style.display == 'none'){
        e.target.previousSibling.style.display = 'block';
      }else{
        e.target.previousSibling.style.display = '';
      }
    }

    const onChangeDividerWidth = value => {
      if (isVertical) {
        setAttributes({ dividerThickness: value });
        this.dividerThicknessValue = value;
        this.props.buildDivider(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          value
        );
      } else {
        setAttributes({ dividerWidth: value, dividerHeight: 0 });
        this.dividerWidthValue = value;
        this.dividerHeightValue = 0;
        this.props.buildDivider(
          undefined,
          undefined,
          undefined,
          undefined,
          value,
          undefined,
          undefined,
          0
        );
      }
    };

    return (
      <div className={"divider-dimension components-base-control"}>
        <RadioControl
          className={"gx-unit-control divider-unit-control"}
          selected={dividerWidthUnit}
          options={[
            { label: "PX", value: "px" },
            { label: "EM", value: "em" },
            { label: "VW", value: "vw" },
            { label: "%", value: "%" }
          ]}
          onChange={onChangeDividerWidthUnit}
        />
        <RangeControl
          label={__("Width", "gutenberg-extra")}
          className={"gx-with-unit-control divider-range-control"}
          value={isVertical ? dividerThickness : dividerWidth}
          onChange={onChangeDividerWidth}
          onClick={handleClick}
          min={0}
          allowReset={true}
          initialPosition={0}
        />
      </div>
    );
  }
}
