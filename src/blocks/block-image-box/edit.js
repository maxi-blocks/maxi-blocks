/**
 * Styles and icons
 */

import fonts from '../../../customizer/dist/fonts.json';

/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const {
    PanelBody,
    IconButton,
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

import { fontFamilyinit } from '../../includes/utils/utils';
import FontPopover from '../../components/font-popover/index';
import { BlockStyles } from '../../components/block-styles/index';
import { ImagePosition } from '../../components/image-position/index';
import { FontLevel } from '../../components/font-level/index';
import { LinkOptions, linkOptionsAttributes } from '../../components/link-options/index';
import { BlockBorder } from '../../components/block-border/index';
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
} from './data';
import { Icon } from '@wordpress/components';
import iconsSettings from '../../components/icons/icons-settings.js';
import React from 'react';

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
            title,
            mediaID,
            mediaURL,
            description,
            additionalText,
            readMoreText,
            readMoreLink,
            linkTitle,
            opensInNewWindow,
            addUgc,
            addSponsored,
            addNoreferrer,
            addNofollow,
            addNoopener,
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
            linkOptions
        },
        setAttributes,
    } = props;

    const linkStyles = setLinkStyles(props);
    const titleStyles = setTitleStyles(props);
    const subTitleStyles = setSubTitleStyles(props);
    const descriptionStyles = setDescriptionStyles(props);
    const buttonStyles = setButtonStyles(props);
    const blockStyles = setBlockStyles(props);

    const onSelectImage = (media) => {
        setAttributes({
            mediaURL: media.url,
            mediaID: media.id,
        });
    };

    const gradients = "";
    const disableCustomGradients = false;

    // Init the saved fonts
    const blockFonts = [
        titleFontFamily
    ];
    fontFamilyinit(blockFonts, fonts);

    return [
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
                    opensInNewWindow={opensInNewWindow}
                    onChangeOpensInNewWindow={value => setAttributes({ opensInNewWindow: value })}
                    addNofollow={addNofollow}
                    onChangeAddNofollow={value => setAttributes({ addNofollow: value })}
                    addNoopener={addNoopener}
                    onChangeAddNoopener={value => setAttributes({ addNoopener: value })}
                    addNoreferrer={addNoreferrer}
                    onChangeAddNoreferrer={value => setAttributes({ addNoreferrer: value })}
                    addSponsored={addSponsored}
                    onChangeAddSponsored={value => setAttributes({ addSponsored: value })}
                    addUgc={addUgc}
                    onChangeAddUgc={value => setAttributes({ addUgc: value })}
                    linkOptions={linkOptions}
                    onChangeOptions={value => { setAttributes({ linkOptions: value }); }}
                    {...props}
                />
            </PanelBody>
            <Accordion
                className = {'gx-style-tab-setting gx-accordion'}
                allowMultipleExpanded = {true}
                allowZeroExpanded = {true}
            >
                <AccordionItem>
                    <AccordionItemHeading className={'gx-accordion-tab gx-typography-tab'}>
                        <AccordionItemButton className='components-base-control__label'>
                            {__('Typography & Colours', 'gutenberg-extra' )}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
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

                        </PanelBody>

                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading className={'gx-accordion-tab gx-button-tab'}>
                        <AccordionItemButton className="components-base-control__label">
                           {__('Button', 'gutenberg-extra' )}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody>
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
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading className={'gx-accordion-tab gx-box-settings-tab'}>
                        <AccordionItemButton className="components-base-control__label">
                           {__('Box Settings', 'gutenberg-extra' )}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
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
                        <PanelBody className="gx-panel gx-border-setting gx-style-tab-setting" initialOpen={true} title={__('Border settings', 'gutenberg-extra' )}>
                            <BlockBorder {...props}/>
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading className={'gx-accordion-tab gx-width-tab'}>
                        <AccordionItemButton className="components-base-control__label">
                          {__(' Width & Height', 'gutenberg-extra' )}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody className="gx-panel gx-size-setting gx-style-tab-setting" initialOpen={true} title={__('Size Settings', 'gutenberg-extra')}>
                            <SizeControl {...props} />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading className={'gx-accordion-tab gx-padding-tab'}>
                        <AccordionItemButton className="components-base-control__label">
                           {__('Padding & Margin', 'gutenberg-extra' )}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody className="gx-panel gx-space-setting gx-style-tab-setting" initialOpen={true} title={__('Space Settings', 'gutenberg-extra')}>
                            <PaddingMarginControl {...props} />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
            </Accordion>
            <PanelBody initialOpen={true} className="gx-panel gx-advanced-setting gx-advanced-tab-setting" title={__('Advanced Settings', 'gutenberg-extra')}>
                <HoverAnimation {...props} />
                <CustomCSS {...props} />
            </PanelBody>

        </InspectorControls>,
        <div
            className={'gx-block ' + blockStyle + ' gx-image-box ' + className}
            data-gx_initial_block_class={defaultBlockStyle}
            style={blockStyles}
        >
            <div className="gx-image-box-link" style={linkStyles}>
                <div className="gx-image-box-image">
                    <MediaUpload
                        onSelect={onSelectImage}
                        allowedTypes="image"
                        value={mediaID}
                        render={({ open }) => (
                            <IconButton
                                className={ mediaID + ' gx-upload-button'}
                                showTooltip="true"
                                onClick={ open }>
                                { ! mediaID ? iconsSettings.placeholderImage : <img src={ mediaURL } alt={ __( 'Upload Image', 'gutenberg-extra' ) } /> }
                          </IconButton>
                        )}
                    />
                </div>
                <div class='gx-image-box-text'>
                    <RichText
                        tagName={titleLevel}
                        style={titleStyles}
                        placeholder={__('Write title…', 'gutenberg-extra')}
                        value={title}
                        onChange={(value) => setAttributes({ title: value })}
                        className="gx-image-box-title"
                    />
                    <RichText
                        tagName="p"
                        style={subTitleStyles}
                        placeholder={__('Write sub-title…', 'gutenberg-extra')}
                        value={additionalText}
                        onChange={(value) => setAttributes({ additionalText: value })}
                        className="gx-image-box-subtitle"
                    />
                    <RichText
                        tagName="p"
                        style={descriptionStyles}
                        multiline="br"
                        placeholder={__('Write some text…', 'gutenberg-extra')}
                        value={description}
                        onChange={(value) => setAttributes({ description: value })}
                        className="gx-image-box-description"
                    />
                    <RichText
                        tagName="span"
                        style={buttonStyles}
                        placeholder={__('Read more text…', 'gutenberg-extra')}
                        value={readMoreText}
                        onChange={(value) => setAttributes({ readMoreText: value })}
                        className="gx-image-box-read-more-text"
                    />
                    <URLInput
                        value={readMoreLink}
                        placeholder={__('Read more link…', 'gutenberg-extra')}
                        onChange={(value) => setAttributes({ readMoreLink: value })}
                        className="gx-image-box-read-more-link"
                    />
                </div>
            </div>
        </div>
    ];
}

export default edit;