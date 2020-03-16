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
  SelectControl,
  ToggleControl
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

import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';

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
      contentDirection
    },
    setAttributes,
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

  const onChangeSubtitleAlign = (value) => {
    setAttributes({ subtitleTextAlign: value });
  }

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

  const onChangeContentDirection = (value) => {
    setAttributes({contentDirection: value});
  }

  return (
    <div>
    <InspectorControls>
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
            <ToggleControl
              label={__('Hide Title', 'gutenberg-extra')}
              id='gx-block-style'
              checked={hideTitle}
              onChange={(value) => {setAttributes({hideTitle: value})}}
            />
            <ToggleControl
              label={__('Hide Subtitle', 'gutenberg-extra')}
              id='gx-block-style'
              checked={hideSubtitle}
              onChange={(value) => {setAttributes({hideSubtitle: value})}}
            />
            <ToggleControl
              label={__('Hide Description', 'gutenberg-extra')}
              id='gx-block-style'
              checked={hideDescription}
              onChange={(value) => {setAttributes({hideDescription: value})}}
            />
            <ToggleControl
              label={__('Two Column Description Layout', 'gutenberg-extra')}
              id='gx-block-style'
              checked={twoColumnDesc}
              onChange={(value) => {setAttributes({twoColumnDesc: value})}}
            />
            <FontPopover
              title={__('Title Typography', 'gutenberg-extra')}
              font={titleFontFamily}
              onFontFamilyChange={value => { setAttributes({ titleFontFamily: value }); }}
              fontSizeUnit={fontSizeTitleUnit}
              onFontSizeUnitChange={value => setAttributes({ fontSizeTitleUnit: value })}
              fontSize={fontSizeTitle}
              onFontSizeChange={value => setAttributes({ fontSizeTitle: value })}
              classNamePopover={'gx-font-family-selector-popover'}
            />
            <PanelColorSettings
              title={__('Background Colour Settings', 'gutenberg-extra' )}
              colorSettings={[
                {
                  value: backgroundColor,
                  onChange: (value) => setAttributes({ backgroundColor: value }),
                  label: __('Background Colour', 'gutenberg-extra' ),
                },
              ]}
            />
            <SelectControl
                label={__('Content Direction', 'gutenberg-extra')}
                className="gx-block-style"
                value={contentDirection}
                options={[
                    { label: __('From Left To Right'), value: 'row' },
                    { label: __('From Right To Left'), value: 'row-reverse' },
                    { label: __('From Top To Bottom'), value: 'column' },
                    { label: __('From Bottom To Top'), value: 'column-reverse' },
                ]}
                onChange={ onChangeContentDirection }
            />
            <PanelColorSettings
              title={__('Title Colour Settings', 'gutenberg-extra' )}
              colorSettings={[
                {
                  value: titleColor,
                  onChange: (value) => setAttributes({ titleColor: value }),
                  label: __('Title Colour', 'gutenberg-extra' ),
                },
              ]}
            />
            <PanelColorSettings
                title={__('Sub-title Colour Settings', 'gutenberg-extra' )}
                colorSettings={[
                    {
                        value: subtitleColor,
                        onChange: (value) => setAttributes({ subtitleColor: value }),
                        label: __('Sub-title Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
            <PanelColorSettings
                title={__('Sub-title Background Colour Settings', 'gutenberg-extra' )}
                colorSettings={[
                    {
                        value: subtitleBackgroundColor,
                        onChange: (value) => setAttributes({ subtitleBackgroundColor: value }),
                        label: __('Sub-title Background Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
            <PanelColorSettings
                title={__('Description Colour Settings', 'gutenberg-extra' )}
                colorSettings={[
                    {
                        value: descriptionColor,
                        onChange: (value) => setAttributes({ descriptionColor: value }),
                        label: __('Description  Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
            <SelectControl
                label={__('Subtitle Align', 'gutenberg-extra')}
                className="gx-block-style"
                value={subtitleTextAlign}
                options={[
                    { label: __('Left'), value: '5px auto 5px 0' },
                    { label: __('Center'), value: '5px auto' },
                    { label: __('Right'), value: '5px 0 5px auto' },
                ]}
                onChange={ onChangeSubtitleAlign }
            />

            <SelectControl
                label={__('Title Align', 'gutenberg-extra')}
                className="gx-block-style"
                value={titleTextAlign}
                options={[
                    { label: __('Left'), value: 'left' },
                    { label: __('Center'), value: 'center' },
                    { label: __('Right'), value: 'right' },
                ]}
                onChange={(value) => setAttributes({ titleTextAlign: value })}
            />

            <SelectControl
                label={__('Description Align', 'gutenberg-extra')}
                className="gx-block-style"
                value={descriptionTextAlign}
                options={[
                    { label: __('Left'), value: 'left' },
                    { label: __('Center'), value: 'center' },
                    { label: __('Right'), value: 'right' },
                ]}
                onChange={(value) => setAttributes({ descriptionTextAlign: value })}
            />
        </PanelBody>
        </AccordionItemPanel>
        </AccordionItem>
        </Accordion>
    </InspectorControls>


    <div
      className={'gx-block gx-title-extra'}
      style={containerStyles}
      >
      <div style={{order:0}}>
      <RichText
          tagName="p"
          style={subtitleStyles}
          placeholder={__('Write sub-title…', 'gutenberg-extra')}
          value={subtitle}
          onChange={(value) => setAttributes({ subtitle: value })}
          className="gx-title-extra-subtitle"
      />
      </div>
      <div style={{order:3}} dangerouslySetInnerHTML={{ __html: additionalDivider}}/>
      <div style={{order:1}}>
      <RichText
        tagName="p"
        style={titleStyles}
        placeholder={__('Write title…', 'gutenberg-extra')}
        value={title}
        onChange={(value) => setAttributes({ title: value })}
        className="gx-title-extra-title"
      />
      </div>
      <Divider
      {...props}
      />
        <div style={{order:3}}>
        <RichText
          tagName="p"
          style={textStyles}
          placeholder={__('Write text…', 'gutenberg-extra')}
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
