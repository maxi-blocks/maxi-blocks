/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    PanelBody,
    Button,
    IconButton,
    BaseControl,
} = wp.components;
const {
    InspectorControls,
    PanelColorSettings,
    URLInput,
    RichText,
    MediaUpload,
    __experimentalLinkControl
} = wp.blockEditor;

/**
 * External dependencies
 */
import classnames from 'classnames';
import React from 'react';
import DimensionsControl from '../../components/dimensions-control/index';
import { BlockStyles } from '../../components/block-styles/index';
import { ButtonStyles } from '../../components/button-styles/index';
import { ImagePosition } from '../../components/image-position/index';
import { FontLevel } from '../../components/font-level/index';
import { LinkOptions } from '../../components/link-options/index';
import { BlockBorder } from '../../components/block-border/index';
import { SizeControl } from '../../components/size-control/index';
import GradientPickerPopover from '../../components/gradient-picker/';
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
import Typography from '../../components/typography/';
import ImageSettings from '../../components/image-settings/';
import iconsSettings from '../../components/icons/icons-settings.js';
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import ExternalLink from '../../components/external-link';

/**
 * Content
 */
const edit = props => {
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
            uniqueID,
            padding,
            margin,
            titlePopUpisVisible,
            isGradient,
            backgroundImage,
            defaultPalette,
            fontOptions,
            linkOptions,
            imageSettings,
            readMoreLinkTest
        },
        setAttributes,
    } = props;

    let classes = classnames(className);
    if (className.indexOf(uniqueID) === -1) {
        classes = classnames(classes, uniqueID)
    }

    // const linkOptions = JSON.parse(props.attributes.linkOptions);

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


    let backgroundImageWithGradient = backgroundGradient.length
        ? `linear-gradient(to left, ${backgroundGradient[0]},${backgroundGradient[1]})`
        : '';

    if (backgroundImage) {
        backgroundImageWithGradient += backgroundGradient.length
            ? `, url(${backgroundImage})`
            : `url(${backgroundImage})`
    }

    blockStyles.backgroundColor = backgroundColor ? backgroundColor : undefined;
    blockStyles.backgroundImage = backgroundImageWithGradient ? backgroundImageWithGradient : undefined;

    return [
        <InspectorControls>
            <PanelBody
                className="gx-panel gx-image-setting gx-content-tab-setting"
                initialOpen={true}
                title={__('Image Settings', 'gutenberg-extra')}
            >
                <BlockStyles
                    {...props}
                />
                <ImagePosition
                    {...props}
                />
                <FontLevel
                    label={__('Title level', 'gutenberg-extra')}
                    value={titleLevel}
                    onChange={value => setAttributes({ titleLevel: value })}
                />
            </PanelBody>
            <PanelBody
                className="gx-panel gx-link-setting gx-content-tab-setting" 
                initialOpen={true} 
                title={__('Link Settings', 'gutenberg-extra')}
            >
                <LinkOptions
                    label={__("Link's Title", 'gutenberg-extra')}
                    value={linkTitle}
                    onChangeLink={value => setAttributes({ linkTitle: value })}
                    linkOptions={linkOptions}
                    onChangeOptions={value => { setAttributes({ linkOptions: value }); }}
                />
            </PanelBody>
            <Accordion
                className={'gx-style-tab-setting gx-accordion'}
                allowMultipleExpanded={true}
                allowZeroExpanded={true}
            >
                <AccordionItem>
                    <AccordionItemHeading 
                        className={'gx-accordion-tab gx-typography-tab'}
                    >
                        <AccordionItemButton 
                            className='components-base-control__label'
                        >
                            {__('Typography & Colours', 'gutenberg-extra')}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody 
                            className="gx-panel gx-color-setting gx-style-tab-setting" 
                            initialOpen={true} 
                            title={__('Colour settings', 'gutenberg-extra')}
                        >
                            <Typography
                                fontOptions={fontOptions}
                                onChange={value => { setAttributes({ fontOptions: value }) }}
                                target="gx-image-box-title"
                            />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading 
                        className={'gx-accordion-tab gx-imagesettings-tab'}
                    >
                        <AccordionItemButton 
                            className='components-base-control__label'
                        >
                            {__('Image', 'gutenberg-extra')}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody 
                            className="gx-panel gx-color-setting gx-style-tab-setting" 
                            initialOpen={true} 
                            title={__('Immage settings', 'gutenberg-extra')}
                        >
                            <ImageSettings
                                imageSettings={imageSettings}
                                onChange={value => setAttributes({ imageSettings: value })}
                                target="gx-image-box-image"
                                {...props}
                            />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading 
                        className={'gx-accordion-tab gx-button-tab'}
                    >
                        <AccordionItemButton 
                            className="components-base-control__label"
                        >
                            {__('Button', 'gutenberg-extra')}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody>
                            <ButtonStyles 
                                {...props} 
                            />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading 
                        className={'gx-accordion-tab gx-box-settings-tab'}
                    >
                        <AccordionItemButton 
                            className="components-base-control__label"
                        >
                            {__('Box Settings', 'gutenberg-extra')}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <BaseControl
                            className={"bg-color-parent gx-settings-button background-gradient "}
                        >
                            <PanelColorSettings
                                title={__('Background Colour', "gutenberg-extra")}
                                colorSettings={[
                                    {
                                        onChange: value => {
                                            if (!value) {
                                                props.setAttributes({ backgroundColor: undefined });
                                                props.setAttributes({ backgroundGradient: [] });
                                                return;
                                            }
                                            props.setAttributes({ backgroundColor: value });
                                            props.setAttributes({ backgroundImage: null });
                                        },
                                        label: __('Background Colour', "gutenberg-extra"),
                                        value: backgroundColor
                                    },
                                ]}
                            />
                            <div className={'gradient'}>
                                <GradientPickerPopover
                                    palette={defaultPalette}
                                    onPaletteChange={value => {
                                        props.setAttributes({ defaultPalette: value });

                                        let colors = [];
                                        Object.valuesvalue.map(key => {
                                            const { color } = key;
                                            return colors.push(color)
                                        });

                                        props.setAttributes({ backgroundGradient: colors });

                                    }}
                                />
                            </div>
                        </BaseControl>
                        <BaseControl
                            className={"gx-settings-button background-image"}
                        >
                            <BaseControl.VisualLabel>
                                {__("Background Image", "gutenberg-extra")}
                            </BaseControl.VisualLabel>
                            <div className={"image-form-and-reset"}>
                                {backgroundImage ?
                                    (<Button 
                                        className={'background-custom-reset-option reset-background-image'}
                                        onClick={() => {
                                            props.setAttributes({ backgroundImage: null })
                                        }}>
                                    </Button>) : ''
                                }
                                <MediaUpload
                                    className={"background-image-form"}
                                    label={__("Upload", "gutenberg-extra")}
                                    type="image/*"
                                    render={({ open }) => (
                                        <Button
                                            onClick={open}
                                            className={"dashicons dashicons-format-image"}
                                        >
                                        </Button>
                                    )}
                                    onSelect={(file) => {
                                        props.setAttributes({ backgroundColor: undefined });
                                        props.setAttributes({ backgroundImage: file.sizes.thumbnail.url })
                                    }}
                                />
                            </div>
                        </BaseControl>
                        <PanelBody 
                            className="gx-panel gx-border-setting gx-style-tab-setting" 
                            initialOpen={true} 
                            title={__('Border settings', 'gutenberg-extra')}
                        >
                            <BlockBorder 
                                {...props} 
                            />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading 
                        className={'gx-accordion-tab gx-width-tab'}
                    >
                        <AccordionItemButton 
                            className="components-base-control__label"
                        >
                            {__(' Width & Height', 'gutenberg-extra')}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody 
                            className="gx-panel gx-size-setting gx-style-tab-setting" 
                            initialOpen={true} 
                            title={__('Size Settings', 'gutenberg-extra')}
                        >
                            <SizeControl 
                                {...props} 
                            />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionItemHeading 
                        className={'gx-accordion-tab gx-padding-tab'}
                    >
                        <AccordionItemButton 
                            className="components-base-control__label"
                        >
                            {__('Padding & Margin', 'gutenberg-extra')}
                        </AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                        <PanelBody 
                            className="gx-panel gx-space-setting gx-style-tab-setting" 
                            initialOpen={true} 
                            title={__('Space Settings', 'gutenberg-extra')}
                        >
                            <DimensionsControl
                                value={padding}
                                onChange={value => setAttributes({ padding: value })}
                            />
                            <DimensionsControl
                                value={margin}
                                onChange={value => setAttributes({ margin: value })}
                            />
                        </PanelBody>
                    </AccordionItemPanel>
                </AccordionItem>
            </Accordion>
            <PanelBody 
                initialOpen={true} 
                className="gx-panel gx-advanced-setting gx-advanced-tab-setting" 
                title={__('Advanced Settings', 'gutenberg-extra')}
            >
                <HoverAnimation {...props} />
                <CustomCSS {...props} />
            </PanelBody>
        </InspectorControls>,
        <div
            className={'gx-block ' + blockStyle + ' gx-image-box ' + classes}
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
                                className={mediaID + ' gx-upload-button'}
                                showTooltip="true"
                                onClick={open}>
                                {!mediaID ? iconsSettings.placeholderImage : <img src={mediaURL} alt={__('Upload Image', 'gutenberg-extra')} />}
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
                        onChange={value => setAttributes({ title: value })}
                        className="gx-image-box-title"
                    />
                    <RichText
                        tagName="p"
                        style={subTitleStyles}
                        placeholder={__('Write sub-title…', 'gutenberg-extra')}
                        value={additionalText}
                        onChange={value => setAttributes({ additionalText: value })}
                        className="gx-image-box-subtitle"
                    />
                    <RichText
                        tagName="p"
                        style={descriptionStyles}
                        multiline="br"
                        placeholder={__('Write some text…', 'gutenberg-extra')}
                        value={description}
                        onChange={value => setAttributes({ description: value })}
                        className="gx-image-box-description"
                    />
                    <RichText
                        tagName="span"
                        style={buttonStyles}
                        placeholder={__('Read more text…', 'gutenberg-extra')}
                        value={readMoreText}
                        onChange={value => setAttributes({ readMoreText: value })}
                        className="gx-image-box-read-more-text"
                    />
                    <URLInput
                        value={readMoreLink}
                        placeholder={__('Read more link…', 'gutenberg-extra')}
                        onChange={value => setAttributes({ readMoreLink: value })}
                        className="gx-image-box-read-more-link"
                    />
                    {/* <__experimentalLinkControl
                        className="gx-image-box-read-more-link"
                        value={JSON.parse(readMoreLinkTest)}
                        onChange={value => setAttributes({readMoreLinkTest: JSON.stringify(value)})}
                        // settings={
                        //     [
                        //         {
                        //             id: 'opensInNewTab',
                        //             title: 'Open in new tab',
                        //         },
                        //         {
                        //             id: 'Can add as much options as we want',
                        //             title: 'lerele'
                        //         }
                        //     ]
                        // }
                        settings={[]}
                    /> */}
                    <ExternalLink 
                        label={                    
                            <RichText
                                tagName="span"
                                style={buttonStyles}
                                placeholder={__('Read more text…', 'gutenberg-extra')}
                                value={readMoreText}
                                onChange={value => setAttributes({ readMoreText: value })}
                                className="gx-image-box-read-more-text"
                            />
                        }
                        externalLink={readMoreLinkTest}
                        onChange={value => setAttributes({readMoreLinkTest: JSON.stringify(value)})}
                        settings={
                            [
                                {
                                    id: 'opensInNewTab',
                                    title: 'Open in new tab',
                                },
                                {
                                    id: 'We can add as much options as we want',
                                    title: 'lerele'
                                }
                            ]
                        }
                    />
                    <ExternalLink 
                        label={__('Read more link…', 'gutenberg-extra')}
                        externalLink={readMoreLinkTest}
                        onChange={value => setAttributes({readMoreLinkTest: JSON.stringify(value)})}
                        settings={
                            [
                                {
                                    id: 'opensInNewTab',
                                    title: 'Open in new tab',
                                },
                                {
                                    id: 'We can add as much options as we want',
                                    title: 'lerele'
                                }
                            ]
                        }
                    />
                </div>
            </div>
        </div>
    ];
}

export default edit;