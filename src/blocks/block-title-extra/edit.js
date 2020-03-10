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
      subTitleColor,
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
      dividerPosition
    },
    setAttributes,
  } = props;

  const linkOptions = JSON.parse(props.attributes.linkOptions)

  const linkStyles = setLinkStyles(props);
  // const titleStyles = setTitleStyles(props);
  // const subTitleStyles = setSubTitleStyles(props);
  const descriptionStyles = setDescriptionStyles(props);
  const buttonStyles = setButtonStyles(props);
  const blockStyles = setBlockStyles(props);
  const onSelectImage = (media) => {
    setAttributes({
      mediaURL: media.url,
      mediaID: media.id,
    });
  };

  const subTitleStyles = {textAlign: 'center', fontFamily: 'roboto',fontSize:'12pt', color:subTitleColor};
  const titleStyles = {textAlign: 'center', fontFamily: 'roboto', color:titleColor};

  const textStyles = {textAlign: 'center', fontFamily: 'roboto',fontSize:'12pt', color:descriptionColor}

  const gradients = "";
  const disableCustomGradients = false;

  return (
    <div>
    <InspectorControls>
        <PanelBody className="gx-panel gx-image-setting gx-content-tab-setting" initialOpen={true} title={__('Image Settings', 'gutenberg-extra')}>
            <BlockStyles {...props} />
            <ImagePosition {...props} />
        </PanelBody>
        <PanelBody className="gx-panel gx-text-setting gx-content-tab-setting" initialOpen={true} title={__('Text settings', 'gutenberg-extra')}>
            <FontLevel
                label={__('Title level', 'gutenberg-extra')}
                value={titleLevel}
                onChange={value => setAttributes({ titleLevel: value })}
            />
        </PanelBody>
        <PanelBody className="gx-panel gx-link-setting gx-content-tab-setting" initialOpen={true} title={__('Link Settings', 'gutenberg-extra')}>
            <LinkOptions
                label={__("Link's Title", 'gutenberg-extra')}
                value={linkTitle}
                onChangeLink={value => setAttributes({ linkTitle: value })}
                linkOptions={linkOptions}
                onChangeOptions={value => { setAttributes({ linkOptions: value }); }}
            />
        </PanelBody>
        <PanelBody className="gx-panel gx-color-setting gx-style-tab-setting" initialOpen={true} title={__('Colour settings', 'gutenberg-extra')}>
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
                        value: subTitleColor,
                        onChange: (value) => setAttributes({ subTitleColor: value }),
                        label: __('Sub-title Colour', 'gutenberg-extra' ),
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
                label={__('Divider Position', 'gutenberg-extra')}
                className="gx-block-style"
                value={dividerPosition}
                options={[
                    { label: __('After Title'), value: 'gx-divider-after-title' },
                    { label: __('Before Title'), value: 'gx-divider-before-title' },
                    { label: __('After Subtitle'), value: 'gx-divider-after-subtitle' },
                    { label: __('Before Subtitle'), value: 'gx-divider-before-subtitle' },
                    { label: __('After Description'), value: 'gx-divider-after-description' },
                    { label: __('Before Description'), value: 'gx-divider-before-description' },
                ]}
                onChange={(value) => setAttributes({ dividerPosition: value })}
            />
              <RadioControl
  							className={'gx-unit-control'}
  			        selected={ dividerWidthUnit }
  			        options={ [
  			            { label: 'PX', value: 'px' },
  			            { label: 'EM', value: 'em' },
  			            { label: 'VW', value: 'vw' },
  			            { label: '%', value: '%' },
  			        ] }
  			        onChange={ ( value ) => props.setAttributes({ dividerWidthUnit: value }) }
					    />
					    <RangeControl
                label={__('Divider Width', 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={dividerWidth}
                onChange={ ( value ) => props.setAttributes({ dividerWidth: value, dividerHeight: 1 }) }
  							min={ 0 }
  							allowReset = {true}
  							initialPosition = { 0 }
            	/>
              <RadioControl
  							className={'gx-unit-control'}
  			        selected={ dividerHeightUnit }
  			        options={ [
  			            { label: 'PX', value: 'px' },
  			            { label: 'EM', value: 'em' },
  			            { label: 'VW', value: 'vw' },
  			            { label: '%', value: '%' },
  			        ] }
  			        onChange={ ( value ) => props.setAttributes({ dividerHeightUnit: value }) }
					    />
              <RangeControl
                label={__('Divider Height', 'gutenberg-extra')}
                className={'gx-with-unit-control'}
                value={dividerHeight}
                onChange={ ( value ) => props.setAttributes({ dividerHeight: value, dividerWidth: 1 }) }
  							min={ 0 }
  							allowReset = {true}
  							initialPosition = { 0 }
            	/>
            <PanelColorSettings
              title={__('Divider Colour', 'gutenberg-extra' )}
              colorSettings={[
                {
                  value: dividerColor,
                  onChange: (value) => setAttributes({ dividerColor: value }),
                  label: __('Divider Colour', 'gutenberg-extra' ),
                },
              ]}
            />

            <PanelColorSettings
              title={__('Button Settings', 'gutenberg-extra' )}
              colorSettings={[
                {
                  value: buttonColor,
                  onChange: (value) => setAttributes({ buttonColor: value }),
                  label: __('Button Text Colour', 'gutenberg-extra' ),
                },
              ]}
            />
            <PanelColorSettings
                title={__('Button Settings', 'gutenberg-extra' )}
                colorSettings={[
                    {
                        value: buttonBgColor,
                        onChange: (value) => setAttributes({ buttonBgColor: value }),
                        label: __('Button Background Colour', 'gutenberg-extra' ),
                    },
                ]}
            />
        </PanelBody>
        <PanelBody className="gx-panel gx-border-setting gx-style-tab-setting" initialOpen={true} title={__('Border settings', 'gutenberg-extra' )}>
            <BlockBorder {...props}/>
        </PanelBody>
        <PanelBody className="gx-panel gx-size-setting gx-style-tab-setting" initialOpen={true} title={__('Size Settings', 'gutenberg-extra')}>
            <SizeControl {...props} />
        </PanelBody>
        <PanelBody className="gx-panel gx-space-setting gx-style-tab-setting" initialOpen={true} title={__('Space Settings', 'gutenberg-extra')}>
            <PaddingMarginControl {...props} />
        </PanelBody>
        <PanelBody initialOpen={true} className="gx-panel gx-advanced-setting gx-advanced-tab-setting" title={__('Advanced Settings', 'gutenberg-extra')}>
            <HoverAnimation {...props} />
            <CustomCSS {...props} />
        </PanelBody>
    </InspectorControls>


    <div
      className={'gx-block gx-title-extra'}
      style={blockStyles}
      >
      <RichText
          tagName="p"
          style={ {textAlign: 'center'},subTitleStyles}
          placeholder={__('Write sub-title…', 'gutenberg-extra')}
          value={subtitle}
          onChange={(value) => setAttributes({ subtitle: value })}
          className="gx-title-extra-subtitle"
      />

      <RichText
        style={titleStyles}
        placeholder={__('Write title…', 'gutenberg-extra')}
        value={title}
        onChange={(value) => setAttributes({ title: value })}
        className="gx-title-extra-title"
      />
        <Divider
        {...props}
        />
      <RichText
        style={textStyles}
        placeholder={__('Write text…', 'gutenberg-extra')}
        value={text}
        onChange={(value) => setAttributes({ text: value })}
        className="gx-title-extra-text"
      />
      </div>
    </div>
  )
}

export default edit;
