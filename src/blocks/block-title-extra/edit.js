/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const {
  PanelBody,
  Button,
  BaseControl,
  __experimentalGradientPicker,
} = wp.components;
const { Fragment } = wp.element;
const {
  InspectorControls,
  PanelColorSettings,
  URLInput,
  RichText,
  MediaUpload,
} = wp.blockEditor;
/**
 * External dependencies
 */
import { GradientPickerPopover } from "react-linear-gradient-picker";
import { BoxShadow } from "../../components/box-shadow";
import classnames from "classnames";
import typographyIcon from "./icon";
import { BlockStyles } from "../../components/block-styles/index";
import { FontLevel } from "../../components/font-level/index";
import { BlockBorder } from "../../components/block-border/index";
import DimensionsControl from "../../components/dimensions-control/index";
import Divider from "../../components/divider/index";
import { SizeControl } from "../../components/size-control/index";
import { PaddingMarginControl } from "../../components/padding-margin-control/index";
import { HoverAnimation } from "../../components/hover-animation/index";
import { CustomCSS } from "../../components/custom-css/index";
import { PopoverControl } from "../../components/popover";
import {
  setLinkStyles,
  setTitleStyles,
  setSubTitleStyles,
  setDescriptionStyles,
  setButtonStyles,
  setBlockStyles,
} from "../block-title-extra/data";

import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";

import { HideTitle } from "../../components/hide-title/index";
import { HideSubtitle } from "../../components/hide-subtitle/index";
import { HideDescription } from "../../components/hide-description/index";
import { TwoColumn } from "../../components/two-column-description/index";
import { ContentDirection } from "../../components/content-direction/index";
import { SubtitleBackgroundColor } from "../../components/subtitle-background-color/index";
import { SubtitleAlign } from "../../components/subtitle-align/index";
import { TitleAlign } from "../../components/title-align/index";
import { DescriptionAlign } from "../../components/description-align/index";
import Typography from "../../components/typography/index";
import iconsSettings from "../../components/icons/icons-settings.js";

import { HideDivider } from "../../components/hide-divider/index";
import { VerticalDivider } from "../../components/vertical-divider/index";
import { RoundedDivider } from "../../components/rounded-divider/index";
import { AdditionalDivider } from "../../components/additional-divider/index";
import { AlignDivider } from "../../components/align-divider/index";
import { DividerPosition } from "../../components/divider-position/index";
import ColorControl from "../../components/color-control";
import { DividerWidth } from "../../components/divider-width/index";
import { DividerHeight } from "../../components/divider-height/index";
import { DividerColor } from "../../components/divider-color/index";

let dividerColorValue;
let dividerAlignmentValue;
let dividerHeightValue;
let dividerWidthValue;
let dividerHeightUnitValue;
let dividerWidthUnitValue;
let dividerThicknessValue;
let dividerThicknessUnitValue;
let isMultipleValue;

const edit = (props) => {
  const {
    className,
    attributes: {
      subtitle,
      title,
      text,
      mediaID,
      defaultPalette,
      gradientIcon = iconsSettings.gradient,
      backgroundImage,
      mediaURL,
      description,
      additionalText,
      readMoreText,
      readMoreLink,
      linkTitle,
      fontSizeTitle,
      fontSizeTitleUnit,
      titleColor,
      subtitleColor,
      descriptionColor,
      buttonColor,
      buttonBgColor,
      titleLevel,
      subtitleLevel,
      backgroundColor,
      backgroundGradient,
      blockStyle,
      defaultBlockStyle,
      titleFontFamily,
      dividerColor,
      dividerHeight,
      dividerWidth,
      dividerWidthUnit,
      dividerHeightUnit,
      dividerOrder,
      dividerPosition,
      subtitleTextAlign,
      titleTextAlign,
      additionalDivider,
      descriptionTextAlign,
      subtitleBackgroundColor,
      hideTitle,
      hideSubtitle,
      hideDescription,
      isBehindTheSubtitle,
      isPreappendedToSubtitle,
      isAppendedToSubtitle,
      twoColumnDesc,
      contentDirection,
      uniqueID,
      fontOptions,
      extraClassName,
      boxShadow,
      extraStyles,
      dividerAlignment,
      isMultiple,
      padding,
      margin,
      isHidden,
      isRounded,
      dividerThickness,
      dividerThicknessUnit,
    },
    setAttributes,
  } = props;

  let classes = classnames(className);
  if (className.indexOf(uniqueID) === -1) {
    classes = classnames(classes, uniqueID);
  }

  const linkOptions = JSON.parse(props.attributes.linkOptions);
  const linkStyles = setLinkStyles(props);
  const descriptionStyles = setDescriptionStyles(props);
  const buttonStyles = setButtonStyles(props);
  const blockStyles = setBlockStyles(props);
  const onSelectImage = (media) => {
    setAttributes({ mediaURL: media.url, mediaID: media.id });
  };

  const subtitleStyles = {
    display: hideSubtitle ? "none" : undefined,
    borderRadius: "5px",
    margin: isPreappendedToSubtitle
      ? "5px auto 5px " + dividerWidth + dividerWidthUnit
      : isAppendedToSubtitle
      ? "5px " + dividerWidth + dividerWidthUnit + " 5px auto"
      : subtitleTextAlign,
    fontWeight: "400",
    color: subtitleColor,
    backgroundColor: subtitleBackgroundColor,
    width: "max-content",
    padding: "5px",
    fontSize: 'unset',
  };

  const titleStyles = {
    display: hideTitle ? "none" : undefined,
    textAlign: titleTextAlign,
    fontWeight: "400",
    margin: '5px auto 30px',
    color: titleColor,
    fontSize: 'inherit',
    minWidth:
      contentDirection == "row" || contentDirection == "row-reverse"
        ? "290px"
        : undefined,
  };

  const textStyles = {
    display: hideDescription ? "none" : undefined,
    textAlign: descriptionTextAlign,
    fontSize: "12pt",
    fontWeight: "400",
    columnCount: twoColumnDesc ? "2" : undefined,
    color: descriptionColor,
    marginTop: contentDirection == "row" ? "48px" : "20px",
    marginLeft: contentDirection == "row" ? "20px" : undefined,
    textTransform: 'none',
    letterSpacing: 'initial'
  };

  const handleClick = (e) => {
    if (
      e.target.previousSibling.style.display == "" ||
      e.target.previousSibling.style.display == "none"
    ) {
      e.target.previousSibling.style.display = "block";
    } else {
      e.target.previousSibling.style.display = "";
    }
  };

  const hideAll = (e) => {
    let sliders = document.querySelectorAll(
      ".components-range-control__slider",
    );
    let isClickInside;
      console.log(e);
    for (var i = 0, len = sliders.length; i < len; i++) {
      isClickInside = sliders[i].contains(e.target);
      if (isClickInside === true) {
        break;
      }
    }

    if (!isClickInside) {
      for (var i = 0, len = sliders.length; i < len; i++) {
        sliders[i].style.display = "none";
      }
    }
  };

  const gradients = "";
  const disableCustomGradients = false;

  const Line = () => <hr style={{ marginTop: "28px" }} />;

  // let backgroundImageWithGradient = backgroundGradient.length
  //   ? `linear-gradient(to left, ${backgroundGradient[0]},${backgroundGradient[1]})`
  //   : "";

  // if (backgroundImage) {
  //   backgroundImageWithGradient += backgroundGradient.length
  //     ? `, url(${backgroundImage})`
  //     : `url(${backgroundImage})`;
  // }

  blockStyles.display = "flex";
  blockStyles.flexDirection = contentDirection;
  blockStyles.backgroundColor = backgroundColor ? backgroundColor : undefined;
  // blockStyles.backgroundImage = backgroundImageWithGradient
  //   ? backgroundImageWithGradient
  //   : undefined;

  dividerColorValue = props.attributes.dividerColor;
  dividerAlignmentValue = props.attributes.dividerAlignment;
  dividerHeightValue = props.attributes.dividerHeight;
  dividerWidthValue = props.attributes.dividerWidth;
  dividerHeightUnitValue = props.attributes.dividerHeightUnit;
  dividerWidthUnitValue = props.attributes.dividerWidthUnit;
  dividerThicknessValue = props.attributes.dividerThickness;
  dividerThicknessUnitValue = props.attributes.dividerThicknessUnit;
  const buildDivider = (
    /*1*/ a = isMultiple,
    /*2*/ align = dividerAlignment,
    /*3*/ rounded = isRounded,
    /*4*/ widthUnit = dividerWidthUnit,
    /*5*/ width = dividerWidth,
    /*6*/ thickness = dividerThickness,
    /*7*/ thicknessUnit = dividerThicknessUnit,
    /*8*/ height = dividerHeight,
    /*9*/ heightUnit = dividerHeightUnit,
    /*10*/ colour = dividerColor
  ) => {
    if (a) {
      let div = `<div class="test"
          style="border:${
            colour ? "1px solid " + colour : "1px solid rgb(152,152,152)"
          };
          margin:${align};
          border-color:${colour};
          height:${height ? height + dividerHeightUnitValue : ""};
          width:${widthUnit ? (width != 0 ? width + widthUnit : "") : ""};
          border-width:${
            thickness ? thickness + dividerThicknessUnitValue : ""
          };
          border-radius:${rounded ? "2rem" : ""};
          display:${isHidden ? "none" : ""};
          ">`;
      setAttributes({ additionalDivider: div });
      return div;
    } else {
      setAttributes({ additionalDivider: "" });
    }
  };

  return (
    <div>
      <InspectorControls>
        <PanelBody
          className="gx-panel gx-image-setting gx-content-tab-setting"
          initialOpen={true}
          title={__("Image Settings", "gutenberg-extra")}
        >
          <BlockStyles {...props} />
          <FontLevel
            label={__("Title level", "gutenberg-extra")}
            value={titleLevel}
            onChange={(value) => setAttributes({ titleLevel: value })}
          />
          <FontLevel
            label={__("Subtitle level", "gutenberg-extra")}
            value={subtitleLevel}
            onChange={(value) => setAttributes({ subtitleLevel: value })}
          />
        </PanelBody>

        <PanelBody
          className="gx-panel gx-image-setting gx-content-tab-setting"
          initialOpen={true}
          title={__("Image Settings", "gutenberg-extra")}
        >
          <HideTitle {...props} />
          <HideSubtitle {...props} />
          <HideDescription {...props} />
          <TwoColumn {...props} />
          <Line />
          <ContentDirection {...props} />
          <SubtitleAlign {...props} />
          <TitleAlign {...props} />
          <DescriptionAlign {...props} />
        </PanelBody>
        <Accordion
          className={"gx-style-tab-setting gx-accordion"}
          allowZeroExpanded={true}
        >
          <AccordionItem className={"accordion-item gx-typography-item"}>
            <AccordionItemHeading
              className={"gx-accordion-tab gx-typography-tab"}
            >
              <AccordionItemButton className="components-base-control__label">
                {__("Typography & Colours", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <PanelBody
                className="gx-panel gx-color-setting gx-style-tab-setting"
                initialOpen={true}
                title={__("Colour settings", "gutenberg-extra")}
              >
                <Typography
                  fontOptions={props.attributes.fontOptions}
                  onChange={(value) => {
                    setAttributes({ fontOptions: value });
                  }}
                  label={__("Title", "gutenberg-extra")}
                  className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened typography"
                  target="gx-title-extra-title"
                />
                <Typography
                  fontOptions={props.attributes.fontOptions}
                  onChange={(value) => {
                    setAttributes({ fontOptions: value });
                  }}
                  label={__("Subtitle", "gutenberg-extra")}
                  className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened typography"
                  target="gx-title-extra-subtitle"
                />
                <Typography
                  fontOptions={props.attributes.fontOptions}
                  onChange={(value) => {
                    setAttributes({ fontOptions: value });
                  }}
                  label={__("Description", "gutenberg-extra")}
                  className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened typography"
                  target="gx-title-extra-text"
                />
                <SubtitleBackgroundColor {...props} />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"accordion-item gx-divider-item"}>
            <AccordionItemHeading className={"gx-accordion-tab gx-divider-tab"}>
              <AccordionItemButton className="components-base-control__label divider-accordion-tab">
                {__("Divider", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <PanelBody>
                <HideDivider {...props} />
                <VerticalDivider {...props} buildDivider={buildDivider} />
                <RoundedDivider {...props} buildDivider={buildDivider} />
                <AdditionalDivider {...props} buildDivider={buildDivider} />
                <Line />
                <AlignDivider {...props} buildDivider={buildDivider} />
                <DividerPosition {...props} />
                <DividerColor {...props} buildDivider={buildDivider} />
                <Line />
                <DividerWidth
                  {...props}
                  buildDivider={buildDivider}
                  hideAll={hideAll}
                />
                <DividerHeight
                  {...props}
                  buildDivider={buildDivider}
                  hideAll={hideAll}
                />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-box-settings-item"}>
            <AccordionItemHeading
              className={"gx-accordion-tab gx-box-settings-tab"}
            >
              <AccordionItemButton className="components-base-control__label">
                {__("Box Settings", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <BaseControl
                className={
                  "bg-color-parent gx-reset-button background-gradient "
                }
              >
                <ColorControl
                  label={__("Background Color", "gutenberg-extra")}
                  color={backgroundColor}
                  gradient={props.attributes.backgroundGradient}
                  onGradientChange={(value) => {
                    props.setAttributes({
                      backgroundGradient: value,
                      backgroundColor: value,
                    });
                    setBlockStyles(props);
                  }}
                  // onColorChange={}
                  // disableGradient
                />
                {/* <PanelColorSettings
                  title={__("Background Colour", "gutenberg-extra")}
                  colorSettings={[
                    {
                      onChange: (value) => {
                        if (!value) {
                          props.setAttributes({ backgroundColor: undefined });
                          props.setAttributes({ backgroundGradient: [] });
                          return;
                        }
                        props.setAttributes({ backgroundColor: value });
                        props.setAttributes({ backgroundImage: null });
                      },
                      label: __("Background Colour", "gutenberg-extra"),
                      value: backgroundColor,
                    },
                  ]}
                /> */}
                {/* <GradientPickerPopover
                    palette={defaultPalette}
                    onPaletteChange={(value) => {
                      props.setAttributes({ defaultPalette: value });

                      let colors = [];
                      Object.valuesvalue.map((key) => {
                        const { color } = key;
                        return colors.push(color);
                      });

                      props.setAttributes({ backgroundGradient: colors });
                    }}
                  /> */}
              </BaseControl>
              <BaseControl className={"gx-settings-button background-image"}>
                <BaseControl.VisualLabel>
                  {__("Background Image", "gutenberg-extra")}
                </BaseControl.VisualLabel>
                <div className={"image-form-and-reset"}>
                  {backgroundImage ? (
                    <Button
                      className={
                        "background-custom-reset-option reset-background-image"
                      }
                      onClick={() => {
                        props.setAttributes({ backgroundImage: null });
                      }}
                    ></Button>
                  ) : (
                    ""
                  )}
                  <MediaUpload
                    className={"background-image-form"}
                    label={__("Upload", "gutenberg-extra")}
                    type="image/*"
                    render={({ open }) => (
                      <Button
                        onClick={open}
                        className={"dashicons dashicons-format-image"}
                      ></Button>
                    )}
                    onSelect={(file) => {
                      props.setAttributes({ backgroundColor: undefined });
                      props.setAttributes({
                        backgroundImage: file.sizes.thumbnail.url,
                      });
                    }}
                  />
                </div>
              </BaseControl>
              <PopoverControl
                className={"box-shadow"}
                label={__("Box shadow", "gutenberg-extra")}
                popovers={[
                  {
                    content: (
                      <div className={"gx-box-shadow"}>
                        <BoxShadow
                          boxShadowOptions={boxShadow}
                          onChange={(value) =>
                            setAttributes({ boxShadow: value })
                          }
                        />
                      </div>
                    ),
                  },
                ]}
              />
              <PanelBody
                className="gx-panel gx-border-setting gx-style-tab-setting"
                initialOpen={true}
                title={__("Border settings", "gutenberg-extra")}
              >
                <Line />
                <BlockBorder {...props} />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-width-item"}>
            <AccordionItemHeading className={"gx-accordion-tab gx-width-tab"}>
              <AccordionItemButton className="components-base-control__label">
                {__(" Width & Height", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <PanelBody
                className="gx-panel gx-size-setting gx-style-tab-setting"
                initialOpen={true}
                title={__("Size Settings", "gutenberg-extra")}
              >
                <SizeControl {...props} />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
          <AccordionItem className={"gx-padding-margin-item"}>
            <AccordionItemHeading className={"gx-accordion-tab gx-padding-tab"}>
              <AccordionItemButton className="components-base-control__label">
                {__("Padding & Margin", "gutenberg-extra")}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <PanelBody
                className="gx-panel gx-space-setting gx-style-tab-setting"
                initialOpen={true}
                title={__("Space Settings", "gutenberg-extra")}
              >
                <DimensionsControl
                  value={padding}
                  onChange={(value) => setAttributes({ padding: value })}
                />
                <DimensionsControl
                  value={margin}
                  onChange={(value) => setAttributes({ margin: value })}
                />
              </PanelBody>
            </AccordionItemPanel>
          </AccordionItem>
        </Accordion>
        <PanelBody
          initialOpen={true}
          className="gx-panel gx-advanced-setting gx-advanced-tab-setting"
          title={__("Advanced Settings", "gutenberg-extra")}
        >
          <HoverAnimation {...props} />
          <CustomCSS {...props} />
        </PanelBody>
      </InspectorControls>
      <div
        style={blockStyles}
        className={
          blockStyle +
          " gx-block gx-title-extra " +
          classes +
          " " +
          extraClassName
        }
        data-gx_initial_block_class={defaultBlockStyle}
      >
        <div
          style={{
            order: 0,
          }}
        >
          <RichText
            tagName={subtitleLevel}
            style={subtitleStyles}
            placeholder={__("Get more out of now", "gutenberg-extra")}
            value={subtitle}
            onChange={(value) => setAttributes({ subtitle: value })}
            className="gx-title-extra-subtitle"
          />
        </div>

        <div
          style={{
            order: 3,
          }}
          dangerouslySetInnerHTML={{
            __html: additionalDivider,
          }}
        />

        <div
          style={{
            order: 1,
          }}
        >
          <RichText
            tagName={titleLevel}
            style={titleStyles}
            placeholder={__(
              "Empowered by innovation",
              "gutenberg-extra"
            )}
            value={title}
            onChange={(value) => setAttributes({ title: value })}
            className="gx-title-extra-title"
          />
        </div>

        <Divider {...props} />

        <div
          style={{
            order: 3,
          }}
        >
          <RichText
            tagName="h6"
            style={textStyles}
            placeholder={__(
              "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque malesuada volutpat mattis eros.",
              "gutenberg-extra"
            )}
            value={text}
            onChange={(value) => setAttributes({ text: value })}
            className="gx-title-extra-text"
          />
        </div>
      </div>
    </div>
  );
};

export default edit;
