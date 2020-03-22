/**
 * WordPress dependencies
 */

const {
  __
} = wp.i18n;
const {
  PanelBody,
  Button,
} = wp.components;
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
import classnames from 'classnames';
import typographyIcon from './icon';
import {
  BlockStyles
} from '../../components/block-styles/index';
import { ImagePosition } from '../../components/image-position/index';
import { FontLevel } from '../../components/font-level/index';
import { LinkOptions } from '../../components/link-options/index';
import { BlockBorder } from '../../components/block-border/index';
import Divider from '../../components/divider/index';
import { SizeControl } from '../../components/size-control/index';
import { PaddingMarginControl } from '../../components/padding-margin-control/index';
import { HoverAnimation } from '../../components/hover-animation/index';
import { CustomCSS } from '../../components/custom-css/index';
import {
  setLinkStyles,
  setTitleStyles,
  setSubTitleStyles,
  setDescriptionStyles,
  setButtonStyles,
  setBlockStyles,
} from '../block-title-extra/data';

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

import { HideTitle } from '../../components/hide-title/index';
import { HideSubtitle } from '../../components/hide-subtitle/index';
import { HideDescription } from '../../components/hide-description/index';
import { TwoColumn } from '../../components/two-column-description/index';
import { ContentDirection } from '../../components/content-direction/index';
import { TitleColor } from '../../components/title-color/index';
import { SubtitleColor } from '../../components/subtitle-color/index';
import { SubtitleBackgroundColor } from '../../components/subtitle-background-color/index';
import { DescriptionColor } from '../../components/description-color/index';
import { SubtitleAlign } from '../../components/subtitle-align/index';
import { TitleAlign } from '../../components/title-align/index';
import { DescriptionAlign } from '../../components/description-align/index';
import Typography from '../../components/typography/index';

const edit = (props) => {

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
      fontOptions
    },
    setAttributes,
  } = props;

  let classes = classnames(className);
  if (className.indexOf(uniqueID) === -1) {
      classes = classnames(classes, uniqueID)
  }

  const linkOptions = JSON.parse(props.attributes.linkOptions)
  const linkStyles = setLinkStyles(props);
  const descriptionStyles = setDescriptionStyles(props);
  const buttonStyles = setButtonStyles(props);

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
    fontWeight: '400',
    color:subtitleColor,
    backgroundColor: subtitleBackgroundColor,
    width:'max-content',
    padding:'5px',
  };

  const titleStyles = {
    display: hideTitle ? 'none' : undefined,
    textAlign: titleTextAlign,
    fontFamily: 'roboto',
    fontWeight: '400',
    color:titleColor,
    minWidth: contentDirection == 'row' || contentDirection == 'row-reverse' ? '290px' : undefined
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
    fontWeight: '400',
    columnCount: twoColumnDesc ? '2' : undefined,
    color:descriptionColor,
    marginTop: contentDirection == 'row' ? '48px' : '0px',
    marginLeft: contentDirection == 'row' ? '20px' : undefined,
  }

  const gradients = "";
  const disableCustomGradients = false;

  const Line = () => (
    <hr/>
);

  return (
    <div>
    <InspectorControls>
      <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={true} title={__('Image Settings', 'gutenberg-extra')}>
          <BlockStyles {...props} />
          <FontLevel
              label={__('Title level', 'gutenberg-extra')}
              value={titleLevel}
              onChange={value => setAttributes({ titleLevel: value })}
          />
          <FontLevel
              label={__('Subtitle level', 'gutenberg-extra')}
              value={subtitleLevel}
              onChange={value => setAttributes({ subtitleLevel: value })}
          />
      </PanelBody>

      <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={true} title={__('Image Settings', 'gutenberg-extra')}>
        <HideTitle {...props}/>
        <HideSubtitle {...props}/>
        <HideDescription {...props}/>
        <TwoColumn {...props}/>
        <Line/>
        <ContentDirection {...props}/>
        <SubtitleAlign {...props}/>
        <TitleAlign {...props}/>
        <DescriptionAlign {...props}/>
      </PanelBody>
      <Accordion
          className = {'gx-style-tab-setting gx-accordion'}
          allowMultipleExpanded = {true}
          allowZeroExpanded = {true}
      >
      <AccordionItem>
        <AccordionItemHeading className={'gx-accordion-tab gx-typography-tab'}>
          <AccordionItemButton className='components-base-control__label'>
           {__('Typography', 'gutenberg-extra' )}
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
            <PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={true} title={__('Colour settings', 'gutenberg-extra')}>
              <Typography
                fontOptions={props.attributes.fontOptions}
                onChange={value => { setAttributes({ fontOptions: value})}}
                label={__('Title', 'gutenberg-extra')}
                className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened"
                target="gx-title-extra-title"
                  />
              <Typography
                fontOptions={props.attributes.fontOptions}
                onChange={value => { setAttributes({ fontOptions: value})}}
                label={__('Subtitle', 'gutenberg-extra')}
                className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened"
                target="gx-title-extra-subtitle"
                  />
              <Typography
                fontOptions={props.attributes.fontOptions}
                onChange={value => { setAttributes({ fontOptions: value})}}
                label={__('Description', 'gutenberg-extra')}
                className="components-panel__body editor-panel-color-settings block-editor-panel-color-settings is-opened"
                target="gx-title-extra-text"
                  />
              <TitleColor {...props}/>
              <SubtitleColor {...props}/>
              <SubtitleBackgroundColor {...props}/>
              <DescriptionColor {...props}/>
            </PanelBody>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </InspectorControls>
    <div
      className={blockStyle + ' gx-block gx-title-extra ' + classes}
      style={containerStyles}
      >
      <div style={{order:0}}>
      <RichText
        tagName={subtitleLevel}
        style={subtitleStyles}
        placeholder={__('Add a snappy sub heading', 'gutenberg-extra')}
        value={subtitle}
        onChange={(value) => setAttributes({ subtitle: value })}
        className="gx-title-extra-subtitle"
      />
      </div>
      <div style={{order:3}} dangerouslySetInnerHTML={{ __html: additionalDivider}}/>
      <div style={{order:1}}>
      <RichText
        tagName={titleLevel}
        style={titleStyles}
        placeholder={__('This is your awesome title here...', 'gutenberg-extra')}
        value={title}
        onChange={(value) => setAttributes({ title: value })}
        className="gx-title-extra-title"
      />
      </div>
      <Divider {...props}/>
      <div style={{order:3}}>
        <RichText
          tagName="p"
          style={textStyles}
          placeholder={__('Excepteur sint occaecat cupidatat non proident, sunt in culpa q...', 'gutenberg-extra')}
          value={text}
          onChange={(value) => setAttributes({ text: value })}
          className="gx-title-extra-text"
        />
      </div>
    </div>
  </div>
  )
}

export default edit;
