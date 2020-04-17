/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const { RadioControl, Button, RangeControl, PanelBody } = wp.components;
const { dispatch, select } = wp.data;

/**
 * External dependencies
 */
import { capitalize, isEmpty, isNil, isNumber } from "lodash";
import AlignmentControl from "../alignment-control/";
import SizeControlTest from "../size-control/test/";
import ColorControl from "../color-control/";
import { PopoverControl } from "../popover/";
import { BoxShadow } from "../box-shadow/index";
import Typography from "../typography/";
import { BlockBorder } from "../block-border/";
import DimensionsControl from "../dimensions-control/index";
import LinkedButton from "../linked-button";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

/**
 * Styles
 */
import "./editor.scss";

/**
 * Attributes
 */

export const buttonStyleAttributes = {
  buttonStyles: {
    type: "string",
    default: `{
      "label": "Button Styles",
      "buttonText": "",
      "linkOptions": {},
      "alignment": "",
      "size": {
        "label": "Size",
        "general": {
          "max-widthUnit": "px",
          "max-width": "",
          "widthUnit": "px",
          "width": "",
          "min-widthUnit": "px",
          "min-width": "",
          "max-heightUnit": "px",
          "max-height": "",
          "heightUnit": "px",
          "height": "",
          "minHeightUnit": "px",
          "minHeight": ""
        }
      },
      "normal": {
        "color": "",
        "background": "",
        "backgroundColor": "",
        "opacity": "",
        "boxShadow": {
          "label": "Box Shadow",
          "shadowColor": "",
          "shadowGradient": "",
          "shadowHorizontal": "0",
          "shadowVertical": "0",
          "shadowBlur": "0",
          "shadowSpread": "0"
        },
        "typography": {
          "label": "Button Text",
          "font": "Roboto",
          "options": {
            "100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf",
            "300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf",
            "400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
            "500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf",
            "700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
            "900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf",
            "100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf",
            "300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf",
            "italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf",
            "500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf",
            "700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf",
            "900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"
          },
          "general": {
            "color": "#9b9b9b"
          },
          "desktop": {
            "font-sizeUnit": "px",
            "font-size": 16,
            "line-heightUnit": "px",
            "line-height": 26,
            "letter-spacingUnit": "px",
            "letter-spacing": 0,
            "font-weight": 400,
            "text-transform": "none",
            "font-style": "normal",
            "text-decoration": "none"
          },
          "tablet": {
            "font-sizeUnit": "px",
            "font-size": 16,
            "line-heightUnit": "px",
            "line-height": 26,
            "letter-spacingUnit": "px",
            "letter-spacing": 0,
            "font-weight": 400,
            "text-transform": "none",
            "font-style": "normal",
            "text-decoration": "none"
          },
          "mobile": {
            "font-sizeUnit": "px",
            "font-size": 26,
            "line-heightUnit": "px",
            "line-height": 26,
            "letter-spacingUnit": "px",
            "letter-spacing": 0,
            "font-weight": 400,
            "text-transform": "none",
            "font-style": "normal",
            "text-decoration": "none"
          }
        },
        "borderSettings": {
          "borderColor": "",
          "borderType": "solid",
          "borderRadius": {
            "label": "Border radius",
            "unit": "px",
            "max": "1000",
            "desktop": {
              "border-top-left-radius": 0,
              "border-top-right-radius": 0,
              "border-bottom-right-radius": 0,
              "border-bottom-left-radius": 0,
              "sync": true
            },
            "tablet": {
              "border-top-left-radius": 0,
              "border-top-right-radius": 0,
              "border-bottom-right-radius": 0,
              "border-bottom-left-radius": 0,
              "sync": true
            },
            "mobile": {
              "border-top-left-radius": 0,
              "border-top-right-radius": 0,
              "border-bottom-right-radius": 0,
              "border-bottom-left-radius": 0,
              "sync": true
            }
          },
          "borderWidth": {
            "label": "Border width",
            "unit": "px",
            "max": "1000",
            "desktop": {
              "border-top-width": 0,
              "border-right-width": 0,
              "border-bottom-width": 0,
              "border-left-width": 0,
              "sync": true
            },
            "tablet": {
              "border-top-width": 0,
              "border-right-width": 0,
              "border-bottom-width": 0,
              "border-left-width": 0,
              "sync": true
            },
            "mobile": {
              "border-top-width": 0,
              "border-right-width": 0,
              "border-bottom-width": 0,
              "border-left-width": 0,
              "sync": true
            }
          }
        },
        "padding": {
          "label": "Padding",
          "unit": "px",
          "desktop": {
            "padding-top": 0,
            "padding-right": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "sync": true
          },
          "tablet": {
            "padding-top": 0,
            "padding-right": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "sync": true
          },
          "mobile": {
            "padding-top": 0,
            "padding-right": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "sync": true
          }
        },
        "margin": {
          "label": "Margin",
          "min": "none",
          "unit": "px",
          "desktop": {
            "margin-top": 0,
            "margin-right": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "sync": true
          },
          "tablet": {
            "margin-top": 0,
            "margin-right": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "sync": true
          },
          "mobile": {
            "margin-top": 0,
            "margin-right": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "sync": true
          }
        }
      },
      "hover": {
        "color": "",
        "background": "",
        "opacity": "",
        "backgroundColor": "",
        "boxShadow": {
          "label": "Box Shadow",
          "shadowColor": "",
          "shadowGradient": "",
          "shadowHorizontal": "0",
          "shadowVertical": "0",
          "shadowBlur": "0",
          "shadowSpread": "0"
        },
        "typography": {
          "label": "Typography",
          "font": "Roboto",
          "options": {
            "100": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf",
            "300": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf",
            "400": "http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf",
            "500": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf",
            "700": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf",
            "900": "http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf",
            "100italic": "http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf",
            "300italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf",
            "italic": "http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf",
            "500italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf",
            "700italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf",
            "900italic": "http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf"
          },
          "general": {
            "color": "#9b9b9b"
          },
          "desktop": {
            "font-sizeUnit": "px",
            "font-size": 16,
            "line-heightUnit": "px",
            "line-height": 26,
            "letter-spacingUnit": "px",
            "letter-spacing": 0,
            "font-weight": 400,
            "text-transform": "none",
            "font-style": "normal",
            "text-decoration": "none"
          },
          "tablet": {
            "font-sizeUnit": "px",
            "font-size": 16,
            "line-heightUnit": "px",
            "line-height": 26,
            "letter-spacingUnit": "px",
            "letter-spacing": 0,
            "font-weight": 400,
            "text-transform": "none",
            "font-style": "normal",
            "text-decoration": "none"
          },
          "mobile": {
            "font-sizeUnit": "px",
            "font-size": 26,
            "line-heightUnit": "px",
            "line-height": 26,
            "letter-spacingUnit": "px",
            "letter-spacing": 0,
            "font-weight": 400,
            "text-transform": "none",
            "font-style": "normal",
            "text-decoration": "none"
          }
        },
        "borderSettings": {
          "borderColor": "",
          "borderType": "solid",
          "borderRadius": {
            "label": "Border radius",
            "unit": "px",
            "max": "1000",
            "desktop": {
              "border-top-left-radius": 0,
              "border-top-right-radius": 0,
              "border-bottom-right-radius": 0,
              "border-bottom-left-radius": 0,
              "sync": true
            },
            "tablet": {
              "border-top-left-radius": 0,
              "border-top-right-radius": 0,
              "border-bottom-right-radius": 0,
              "border-bottom-left-radius": 0,
              "sync": true
            },
            "mobile": {
              "border-top-left-radius": 0,
              "border-top-right-radius": 0,
              "border-bottom-right-radius": 0,
              "border-bottom-left-radius": 0,
              "sync": true
            }
          },
          "borderWidth": {
            "label": "Border width",
            "unit": "px",
            "max": "1000",
            "desktop": {
              "border-top-width": 0,
              "border-right-width": 0,
              "border-bottom-width": 0,
              "border-left-width": 0,
              "sync": true
            },
            "tablet": {
              "border-top-width": 0,
              "border-right-width": 0,
              "border-bottom-width": 0,
              "border-left-width": 0,
              "sync": true
            },
            "mobile": {
              "border-top-width": 0,
              "border-right-width": 0,
              "border-bottom-width": 0,
              "border-left-width": 0,
              "sync": true
            }
          }
        },
        "padding": {
          "label": "Padding",
          "unit": "px",
          "desktop": {
            "padding-top": 0,
            "padding-right": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "sync": true
          },
          "tablet": {
            "padding-top": 0,
            "padding-right": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "sync": true
          },
          "mobile": {
            "padding-top": 0,
            "padding-right": 0,
            "padding-bottom": 0,
            "padding-left": 0,
            "sync": true
          }
        },
        "margin": {
          "label": "Margin",
          "min": "none",
          "unit": "px",
          "desktop": {
            "margin-top": 0,
            "margin-right": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "sync": true
          },
          "tablet": {
            "margin-top": 0,
            "margin-right": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "sync": true
          },
          "mobile": {
            "margin-top": 0,
            "margin-right": 0,
            "margin-bottom": 0,
            "margin-left": 0,
            "sync": true
          }
        }
      }
    }`,
  },
};

/**
 * Block
 */
export class ButtonStyles extends Component {
  state = {
    selector1: "normal",
    selector2: "normal",
    selector3: "normal",
  };

  render() {
    const {
      className = "gx-buttonstyles-control",
      buttonSettings,
      onChange,
      target = "gx-buttoneditor-button",
    } = this.props;

    const { selector1, selector2, selector3 } = this.state;

    const value =
      typeof buttonSettings === "object"
        ? buttonSettings
        : JSON.parse(buttonSettings);

    /**
     * Retrieves the old meta data
     */
    const getMeta = () => {
      let meta = select("core/editor").getEditedPostAttribute("meta")
        ._gutenberg_extra_responsive_styles;
      return meta ? JSON.parse(meta) : {};
    };

    /**
     * Retrieve the target for responsive CSS
     */
    const getTarget = (adition = "") => {
      let styleTarget = select("core/block-editor").getBlockAttributes(
        select("core/block-editor").getSelectedBlockClientId()
      ).uniqueID;
      styleTarget = `${styleTarget}${
        target.length > 0 || adition.length > 0 ? `__$${target}${adition}` : ""
      }`;
      return styleTarget;
    };

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    const getNormalStylesObject = () => {
      const response = {
        label: value.label,
        general: {},
      };
      if (!isNil(value.alignment)) {
        switch (value.alignment) {
          case "left":
            response.general["margin-right"] = "auto";
            break;
          case "center":
          case "justify":
            response.general["margin-right"] = "auto";
            response.general["margin-left"] = "auto";
            break;
          case "right":
            response.general["margin-left"] = "auto";
            break;
        }
      }
      if (!isEmpty(value.normal.color)) {
        response.general["color"] = value.normal.color;
      }
      if (!isEmpty(value.normal.backgroundColor)) {
        response.general["background-color"] = value.normal.backgroundColor;
      }
      if (!isEmpty(value.normal.background)) {
        response.general["background"] = value.normal.background;
      }
      if (isNumber(value.normal.opacity)) {
        response.general["opacity"] = value.normal.opacity;
      }
      if (!isEmpty(value.normal.borderSettings.borderColor)) {
        response.general["border-color"] =
          value.normal.borderSettings.borderColor;
      }
      if (!isEmpty(value.normal.borderSettings.borderType)) {
        response.general["border-style"] =
          value.normal.borderSettings.borderType;
      }
      return response;
    };

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    const getHoverStylesObject = () => {
      const response = {
        label: value.label,
        general: {},
      };
      if (!isEmpty(value.hover.color)) {
        response.general["color"] = value.hover.color;
      }
      if (!isEmpty(value.hover.backgroundColor)) {
        response.general["background-color"] = value.hover.backgroundColor;
      }
      if (!isEmpty(value.hover.background)) {
        response.general["background"] = value.hover.background;
      }
      if (isNumber(value.hover.opacity)) {
        response.general["opacity"] = value.hover.opacity;
      }
      if (!isEmpty(value.hover.borderSettings.borderColor)) {
        response.general["border-color"] =
          value.hover.borderSettings.borderColor;
      }
      if (!isEmpty(value.hover.borderSettings.borderType)) {
        response.general["border-style"] =
          value.hover.borderSettings.borderType;
      }
      return response;
    };

    /**
     * Creates a new object that
     *
     * @param {string} target	Block attribute: uniqueID
     * @param {obj} meta		Old and saved metadate
     * @param {obj} value	New values to add
     */
    const metaValue = (type) => {
      const meta = getMeta();
      let styleTarget = "";
      switch (type) {
        case "normal":
          styleTarget = getTarget();
          break;
        case "hover":
          styleTarget = getTarget(":hover");
          break;
      }
      let obj = {};
      switch (type) {
        case "normal":
          obj = getNormalStylesObject();
          break;
        case "hover":
          obj = getHoverStylesObject();
          break;
      }
      const responsiveStyle = new ResponsiveStylesResolver(
        styleTarget,
        meta,
        obj
      );
      const response = JSON.stringify(responsiveStyle.getNewValue);
      return response;
    };

    /**
     * Saves and send the data. Also refresh the styles on Editor
     */
    const saveAndSend = () => {
      save();
      saveMeta("normal");
      saveMeta("hover");
      new BackEndResponsiveStyles(getMeta());
    };

    const save = () => {
      onChange(JSON.stringify(value));
    };

    const saveMeta = (type) => {
      dispatch("core/editor").editPost({
        meta: {
          _gutenberg_extra_responsive_styles: metaValue(type),
        },
      });
    };

    return (
      <div className={className}>
        <Accordion
          className={"gx-style-tab-setting gx-accordion"}
          allowZeroExpanded={true}
        >
          <AccordionItem className={"gx-typography-item"}>
            <AccordionItemHeading
              className={"gx-accordion-tab gx-typography-tab"}
            >
              <AccordionItemButton className="components-base-control__label">
                {__("Typography / Colors", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <PanelBody className={"gx-panel"}>
                <RadioControl
                  className="gx-buttonstyles-selector-control"
                  selected={selector1}
                  options={[
                    { label: "Normal", value: "normal" },
                    { label: "Hover", value: "hover" },
                  ]}
                  onChange={(selector1) => {
                    this.setState({ selector1 });
                  }}
                />
                <ColorControl
                  className={"components-base-control"}
                  label={__("Background Colour", "gutenberg-extra")}
                  color={value[selector1].backgroundColor}
                  gradient={value[selector1].background}
                  onGradientChange={(val) => {
                    value[selector1].background = val;
                    saveAndSend();
                  }}
                  onColorChange={(val) => {
                    value[selector1].background = val;
                    saveAndSend();
                  }}
                />
                <Typography
                  className={"components-base-control"}
                  fontOptions={value[selector1].typography}
                  onChange={(val) => {
                    value[selector1].typography = val;
                    saveAndSend();
                  }}
                  target={target}
                />
                <AlignmentControl
                  className={"components-base-control"}
                  value={value.alignment}
                  onChange={(val) => {
                    value.alignment = val;
                    saveAndSend();
                  }}
                  disableJustify
                />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-box-settings-item"}>
            <AccordionItemHeading
              className={"gx-accordion-tab gx-typography-tab"}
            >
              <AccordionItemButton className="components-base-control__label">
                {__("Opacity / Shadow", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <RadioControl
                className="gx-buttonstyles-selector-control"
                selected={selector2}
                options={[
                  { label: "Normal", value: "normal" },
                  { label: "Hover", value: "hover" },
                ]}
                onChange={(selector2) => {
                  this.setState({ selector2 });
                }}
              />
              <RangeControl
                label={__("Opacity", "gutenberg-extra")}
                className={"gx-opacity-control"}
                value={value[selector2].opacity}
                onChange={(val) => {
                  value[selector2].opacity = val;
                  saveAndSend();
                }}
                min={0}
                max={1}
                step={0.1}
                allowReset={true}
                initialPosition={0}
              />
              <PopoverControl
                label={__("Box shadow", "gutenberg-extra")}
                popovers={[
                  {
                    content: (
                      <div className={"gx-box-shadow"}>
                        <BoxShadow
                          boxShadowOptions={value[selector2].boxShadow}
                          onChange={(val) => {
                            value[selector2].boxShadow = JSON.parse(val);
                            saveAndSend();
                          }}
                          target={
                            selector2 != "hover"
                              ? `${target}`
                              : `${target}:hover`
                          }
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-border-item"}>
            <AccordionItemHeading className={"gx-accordion-tab gx-border-tab"}>
              <AccordionItemButton className="components-base-control__label">
                {__("Border", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <RadioControl
                className="gx-buttonstyles-selector-control"
                selected={selector2}
                options={[
                  { label: "Normal", value: "normal" },
                  { label: "Hover", value: "hover" },
                ]}
                onChange={(selector2) => {
                  this.setState({ selector2 });
                }}
              />
              <BlockBorder
                borderColor={value[selector2].borderSettings.borderColor}
                onChangeBorderColor={(val) => {
                  value[selector2].borderSettings.borderColor = val;
                  saveAndSend();
                }}
                borderType={value[selector2].borderSettings.borderType}
                onChangeBorderType={(val) => {
                  value[selector2].borderSettings.borderType = val;
                  saveAndSend();
                }}
                borderRadius={value[selector2].borderSettings.borderRadius}
                onChangeBorderRadius={(val) => {
                  value[selector2].borderSettings.borderRadius = val;
                  saveAndSend();
                }}
                borderWidth={value[selector2].borderSettings.borderWidth}
                onChangeBorderWidth={(val) => {
                  value[selector2].borderSettings.borderWidth = val;
                  saveAndSend();
                }}
                borderRadiusTarget={target}
                borderWidthTarget={target}
              />
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-width-height-item"}>
            <AccordionItemHeading
              className={"gx-accordion-tab gx-typography-tab"}
            >
              <AccordionItemButton className="components-base-control__label">
                {__("Width and Height", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <SizeControlTest
                sizeSettings={value.size}
                onChange={(val) => {
                  value.size = val;
                  saveAndSend();
                }}
                target={target}
              />
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-padding-margin-item"}>
            <AccordionItemHeading
              className={"gx-accordion-tab gx-typography-tab"}
            >
              <AccordionItemButton className="components-base-control__label">
                {__("Padding and Margin", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <RadioControl
                className="gx-buttonstyles-selector-control"
                selected={selector3}
                options={[
                  { label: "Normal", value: "normal" },
                  { label: "Hover", value: "hover" },
                ]}
                onChange={(selector3) => {
                  this.setState({ selector3 });
                }}
              />
              <DimensionsControl
                className={"components-base-control"}
                value={value[selector3].padding}
                onChange={(val) => {
                  value[selector3].padding = val;
                  saveAndSend();
                }}
                target={target}
              />
              <DimensionsControl
                className={"components-base-control"}
                value={value[selector3].margin}
                onChange={(val) => {
                  value[selector3].margin = val;
                  saveAndSend();
                }}
                target={target}
              />
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }
}

/**
 * Backend editor
 */
export const ButtonEditor = (props) => {
  const {
    className = "gx-buttoneditor-button",
    buttonSettings,
    onChange,
  } = props;

  const value =
    typeof buttonSettings === "object"
      ? buttonSettings
      : JSON.parse(buttonSettings);

  return (
    <LinkedButton
      className={className}
      placeholder={__("Read more text...", "gutenberg-extra")}
      buttonText={value.buttonText}
      onTextChange={(val) => {
        value.buttonText = val;
        onChange(JSON.stringify(value));
      }}
      externalLink={value.linkOptions}
      onLinkChange={(val) => {
        value.linkOptions = val;
        onChange(JSON.stringify(value));
      }}
    />
  );
};

/**
 * FrontEnd
 */
export const ButtonSaver = (props) => {
  const { className = "gx-buttoneditor-button", buttonSettings } = props;

  const value =
    typeof buttonSettings === "object"
      ? buttonSettings
      : JSON.parse(buttonSettings);

  return (
    <Fragment>
      {value.buttonText && (
        <Button className={className} href={value.linkOptions.url}>
          {value.buttonText}
        </Button>
      )}
    </Fragment>
  );
};
