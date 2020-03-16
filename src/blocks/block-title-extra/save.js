/**
 * WordPress dependencies
 */

const {
  __
} = wp.i18n;
const {
  PanelBody,
  Button,
  RangeControl,
  RadioControl,
  SelectControl
} = wp.components;
const {
  URLInput,
  RichText,
  MediaUpload,
} = wp.blockEditor;

/**
 * External dependencies
 */

import FontPopover from '../../components/font-popover/index';
import {
  BlockStyles
} from '../../components/block-styles/index';
import { ImagePosition } from '../../components/image-position/index';
import { FontLevel } from '../../components/font-level/index';
import { LinkOptions } from '../../components/link-options/index';
import { BlockBorder } from '../../components/block-border/index';
import Divider from '../../components/divider/index';
import {
  SizeControl
} from '../../components/size-control/index';
import {
  PaddingMarginControl
} from '../../components/padding-margin-control/index';
import { HoverAnimation } from '../../components/hover-animation/index';
import { CustomCSS } from '../../components/custom-css/index';
import {
  setLinkStyles,
  setTitleStyles,
  setSubTitleStyles,
  setDescriptionStyles,
  setButtonStyles,
  setBlockStyles,
} from '../block-image-box/data';

const save = (props) => {

  const {
    className,
    attributes: {
      subtitle,
      title,
      text,
      mediaID,
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
      isPreappendedToSubtitle,
      isAppendedToSubtitle,
      twoColumnDesc,
      contentDirection
    },
  } = props;

  const linkOptions = JSON.parse(props.attributes.linkOptions)

  const linkStyles = setLinkStyles(props);
  const descriptionStyles = setDescriptionStyles(props);
  const buttonStyles = setButtonStyles(props);
  const blockStyles = setBlockStyles(props);
  const onSelectImage = (media) => {
    setAttributes({
      mediaURL: media.url,
      mediaID: media.id,
    });
  };

  const subtitleStyles = {
    display: hideSubtitle ? 'none' : undefined,
    borderRadius: '5px',
    margin: isPreappendedToSubtitle ? '5px auto 5px ' + dividerWidth + dividerWidthUnit : isAppendedToSubtitle ? '5px '+ dividerWidth + dividerWidthUnit +' 5px auto'  : subtitleTextAlign,
    fontFamily: 'roboto',
    fontSize:'12pt',
    color:subtitleColor,
    backgroundColor: subtitleBackgroundColor,
    width:'max-content',
    padding:'5px',
  };

  const titleStyles = {
    display: hideTitle ? 'none' : undefined,
    textAlign: titleTextAlign,
    fontFamily: 'roboto',
    color:titleColor
  };

  const containerStyles = {
    display: 'flex',
    flexDirection: contentDirection 
  };

  const textStyles = {
    display: hideDescription ? 'none' : undefined,
    textAlign: descriptionTextAlign,
    fontFamily: 'roboto',
    fontSize:'12pt',
    columnCount: twoColumnDesc ? '2' : undefined,
    color:descriptionColor
  }


  const gradients = "";
  const disableCustomGradients = false;
  return (
    <div
      className={'gx-block gx-title-extra'}
      style={containerStyles}
      >
      <div style={{order:0}}>
      <RichText.Content
          tagName="p"
          style={subtitleStyles}
          value={subtitle}
          className="gx-title-extra-subtitle"
      />
      </div>
      <div style={{order:3}} dangerouslySetInnerHTML={{ __html: additionalDivider}}/>
        <div style={{order:1}}>
          <RichText.Content
          tagName="p"
            style={titleStyles}
            value={title}
            className="gx-title-extra-title"
          />
        </div>
        <Divider
        {...props}
        />
      <div style={{order:3}}>
        <RichText.Content
        tagName="p"
          style={textStyles}
          value={text}
          className="gx-title-extra-text"
        />
      </div>
    </div>
  )
}

export default save;
