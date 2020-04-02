/**
 * External dependencies
 */
import classnames from "classnames";
import { omit, pick } from "lodash";
import { withState } from "@wordpress/compose";
import { RangeControl } from "@wordpress/components";
import { DimensionControl } from "@wordpress/components";

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { RichText, getColorClassName } = wp.blockEditor;

//  Import CSS.

import "./style.scss";
import "./editor.scss";

import edit from "./edit";

const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

const blockAttributes = {
  url: {
    type: "string",
    source: "attribute",
    selector: "a",
    attribute: "href"
  },
  title: {
    type: "string",
    source: "attribute",
    selector: "a",
    attribute: "title"
  },
  text: {
    type: "array",
    source: "children",
    selector: "a"
  },
  backgroundColor: {
    type: "string"
  },
  textColor: {
    type: "string"
  },
  borderColor: {
    type: "string"
  },
  borderHoverColor: {
    type: "string"
  },
  borderWidth: {
    type: "number"
  },
  borderRadius: {
    type: "number"
  },
  backgroundHoverColor: {
    type: "string"
  },
  textHoverColor: {
    type: "string"
  },
  customBackgroundColor: {
    type: "string"
  },
  customBorderColor: {
    type: "string"
  },
  customTextColor: {
    type: "string"
  },
  animation: {
    type: "string"
  },
  transition: {
    type: "string"
  },
  linkTitle: {
    type: "string"
  },
  extraClassName: {
    type: "string"
  },
  extraStyles: {
    type: "string"
  },
  extraHoverStyles: {
    type: "string"
  },
  extraBeforeStyles: {
    type: "string"
  },
  extraAfterStyles: {
    type: "string"
  },
  extraHoverBeforeStyles: {
    type: "string"
  },
  extraHoverAfterStyles: {
    type: "string"
  },
  opensInNewWindow: {
    type: "boolean",
    default: false
  },
  addNofollow: {
    type: "boolean",
    default: false
  },
  addNoopener: {
    type: "boolean",
    default: false
  },
  addNoreferrer: {
    type: "boolean",
    default: false
  },
  addSponsored: {
    type: "boolean",
    default: false
  },
  addUgc: {
    type: "boolean",
    default: false
  },
  buttonShape: {
    type: "string",
    default: "gx-square"
  },
  buttonSize: {
    type: "string",
    default: "gx-normal"
  },
  fontSize: {
    type: "number",
    default: 16
  },
  lineHeight: {
    type: "number"
  },
  letterSpacing: {
    type: "number"
  },
  paddingSize: {
    type: "string",
    default: "0"
  },
  maxWidth: {
    type: "number"
  },
  buttonWidth: {
    type: "number"
  },
  minWidth: {
    type: "number"
  },
  maxHeight: {
    type: "number"
  },
  buttonHeight: {
    type: "number"
  },
  minHeight: {
    type: "number"
  },
  paddingTop: {
    type: "number"
  },
  paddingLeft: {
    type: "number"
  },
  paddingRight: {
    type: "number"
  },
  paddingBottom: {
    type: "number"
  },
  marginTop: {
    type: "number"
  },
  marginLeft: {
    type: "number"
  },
  marginRight: {
    type: "number"
  },
  marginBottom: {
    type: "number"
  },
  textTransform: {
    type: "string"
  },
  borderStyle: {
    type: "string",
    default: "none"
  }
};

export const name = "gutenberg-extra/block-button";

const settings = {
  title: __("GX Button"),

  description: __(""),

  icon: (
    <svg
      preserveAspectRatio="none"
      x="0px"
      y="0px"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
    >
      <defs>
        <path
          id="a"
          stroke="#0CF"
          strokeWidth={1}
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
          d="M2.45 12.5V2.45H21.6v10.1m-6.1.9q-.25 0-.5.1-.1-.35-.4-.6-.3-.2-.65-.2-.3 0-.6.15-.1-.3-.4-.5-.3-.15-.65-.15-.2 0-.4.05v-1.35q0-.5-.35-.85-.35-.4-.85-.4t-.85.4q-.35.35-.35.85v4.85l-.9-1q-.2-.2-.4-.3-.2-.1-.45-.1t-.5.1q-.2.1-.35.25-.35.3-.35.75-.05.4.25.9.35.55.75 1.2.2.35.65 1.1.65 1 .9 1.35.2.35.75 1.45.05.15.1.15.15.1.25.1h5.2q.1 0 .25-.1.1-.05.15-.2.3-.85.5-1.7.4-1.65.4-2.3v-2.8q0-.5-.35-.85-.3-.35-.85-.35zm-13.05-.5l4.15-.1m11.35.15l3.65-.05"
        />
      </defs>
      <use href="#a" />
    </svg>
  ),
  category: "gutenberg-extra-blocks",

  attributes: blockAttributes,

  supports: {
    align: true,
    alignWide: false,
    customClassName: false
  },

  edit,

  save({ attributes }) {
    const {
      url,
      text,
      title,
      backgroundColor,
      textColor,
      backgroundHoverColor,
      borderColor,
      borderHoverColor,
      textHoverColor,
      customBackgroundColor,
      customBorderColor,
      customTextColor,
      customfontSize,
      animation,
      transition,
      transitionType,
      extraClassName,
      linkTitle,
      extraStyles,
      extraHoverStyles,
      extraBeforeStyles,
      extraAfterStyles,
      extraHoverBeforeStyles,
      extraHoverAfterStyles,
      opensInNewWindow,
      addNofollow,
      addNoopener,
      addNoreferrer,
      addSponsored,
      addUgc,
      buttonShape,
      buttonSize,
      fontSize,
      lineHeight,
      letterSpacing,
      paddingSize,
      maxWidth,
      minWidth,
      buttonWidth,
      maxHeight,
      minHeight,
      paddingTop,
      paddingLeft,
      paddingRight,
      paddingBottom,
      marginTop,
      marginLeft,
      marginRight,
      marginBottom,
      buttonHeight,
      textTransform,
      borderWidth,
      borderRadius,
      borderStyle
    } = attributes;

    const textClass = getColorClassName("color", textColor);
    const backgroundClass = getColorClassName(
      "background-color",
      backgroundColor
    );
    const borderClass = getColorClassName("border-color", borderColor);
    //const fontClass = getColorClassName( 'font-size', fontSize );
    const hoverClass =
      (borderHoverColor ? borderHoverColor.replace("#", "") + "-" : "") +
      (backgroundHoverColor
        ? backgroundHoverColor.replace("#", "") + "-"
        : "") +
      (textHoverColor ? textHoverColor.replace("#", "") : "");
    const hoverStyles =
      (borderHoverColor
        ? `border-color: #${borderHoverColor.replace("#", "")}!important;`
        : "") +
      (backgroundHoverColor
        ? `background-color: #${backgroundHoverColor.replace(
            "#",
            ""
          )}!important;`
        : "") +
      (textHoverColor
        ? `color: #${textHoverColor.replace("#", "")}!important;`
        : "");
    const uniqueClass = extraStyles
      ? extraStyles.replace(/[^a-z0-9]/gi, "")
      : "";
    const uniqueHoverClass = extraHoverStyles
      ? extraHoverStyles.replace(/[^a-z0-9]/gi, "")
      : "";

    const buttonClasses = classnames(
      "wp-block-button__link",
      animation,
      `hover-${hoverClass}`,
      {
        "has-text-color": textColor || customTextColor,
        [textClass]: textClass,
        "has-background": backgroundColor || customBackgroundColor,
        [backgroundClass]: backgroundClass,
        "has-border": borderColor || customBorderColor,
        [borderClass]: borderClass
      },
      extraClassName,
      uniqueClass,
      uniqueHoverClass,
      buttonSize,
      buttonShape
    );

    const buttonStyles = {
      backgroundColor: backgroundClass ? undefined : customBackgroundColor,
      color: textClass ? undefined : customTextColor,
      borderColor: borderClass ? undefined : customBorderColor,
      borderWidth: borderWidth + "px",
      borderRadius: borderRadius + "px",
      borderStyle: borderStyle,
      fontSize: fontSize + "px",
      lineHeight: lineHeight + "%",
      letterSpacing: letterSpacing + "px",
      width: buttonWidth + "%",
      maxWidth: maxWidth + "px",
      minWidth: minWidth + "px",
      height: buttonHeight + "px",
      maxHeight: maxHeight + "px",
      minHeight: minHeight + "px",
      textTransform: textTransform,
      paddingTop: paddingTop + "px",
      paddingLeft: paddingLeft + "px",
      paddingRight: paddingRight + "px",
      paddingBottom: paddingBottom + "px",
      marginTop: marginTop + "px",
      marginLeft: marginLeft + "px",
      marginRight: marginRight + "px",
      marginBottom: marginBottom + "px"
    };

    if (transition) {
      buttonStyles.transition = `${transition}s ${
        transitionType ? transitionType : ""
      }`;
    }

    return (
      <div>
        {hoverClass && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.hover-${hoverClass}:hover{${hoverStyles}}`
            }}
          />
        )}
        {uniqueClass && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.${uniqueClass}{${extraStyles}}`
            }}
          />
        )}
        {uniqueHoverClass && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.${uniqueHoverClass} .wp-block-button__link:hover{${extraHoverStyles}}
					 .wp-block-button__link:after{${extraAfterStyles}}`
            }}
          />
        )}
        {extraBeforeStyles && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.wp-block-button__link:before{${extraBeforeStyles}}`
            }}
          />
        )}
        {extraAfterStyles && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.wp-block-button__link:after{${extraAfterStyles}}`
            }}
          />
        )}
        {extraHoverBeforeStyles && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.wp-block-button__link:hover:before{${extraHoverBeforeStyles}}`
            }}
          />
        )}
        {extraHoverAfterStyles && (
          <style
            dangerouslySetInnerHTML={{
              __html: `.wp-block-button__link:hover:after{${extraHoverAfterStyles}}`
            }}
          />
        )}

        <RichText.Content
          tagName="a"
          className={buttonClasses}
          href={url}
          title={title}
          style={buttonStyles}
          value={text}
          title={linkTitle}
          target={opensInNewWindow ? "_blank" : "_self"}
          rel={
            (addNofollow ? "nofollow " : "") +
            (addNoreferrer ? "noreferrer " : "") +
            (addNoopener ? "noopener " : "") +
            (addSponsored ? "sponsored " : "") +
            (addUgc ? "ugc" : "")
          }
        />
      </div>
    );
  }
};

registerBlockType(name, settings);
