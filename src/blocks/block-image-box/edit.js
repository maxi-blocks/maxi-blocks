/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { PanelBody } = wp.components;
const { Fragment } = wp.element;
const {
    InspectorControls,
    RichText,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import { BlockStyles } from '../../components/block-styles/index';
import { ImagePosition } from '../../components/image-position/index';
import { FontLevel } from '../../components/font-level/index';
import { LinkOptions } from '../../components/link-options/index';
import Typography from '../../components/typography/';
import {
    ImageSettings,
    ImageUpload
} from '../../components/image-settings/';
import {
    ButtonStyles,
    ButtonEditor
} from '../../components/button-styles/index';
import { PopoverControl } from '../../components/popover';
import { BoxShadow } from '../../components/box-shadow';
import DimensionsControl from '../../components/dimensions-control/index';
import { HoverAnimation } from '../../components/hover-animation/index';
import { CustomCSS } from '../../components/custom-css/index';
import { setLinkStyles } from './data';
import iconsSettings from '../../components/icons/icons-settings';

/**
 * External dependencies
 */
import classnames from 'classnames';

// Testing
import SizeControlTest from '../../components/size-control/test';
import BlockBorderTest from '../../components/block-border/test';
import TypographyTest from '../../components/typography/test';
import BackgroundControlTest from '../../components/background-control/test';
import AccordionControl from '../../components/accordion-control';
import FontLevelTest from '../../components/font-level/test';

/**
 * Content
 */
const edit = props => {
    const {
        className,
        attributes: {
            uniqueID,
            blockStyle,
            defaultBlockStyle,
            titleLevel,
            linkTitle,
            linkOptions,
            titleFontOptions,
            subtitleFontOptions,
            descriptionFontOptions,
            imageSettings,
            buttonStyles,
            backgroundOptions,
            boxShadow,
            margin,
            padding,
            mediaID,
            title,
            additionalText,
            description,
            // Test
            sizeTest,
            borderTest,
            backgroundOptionsTest
        },
        setAttributes,
    } = props;

    let classes = classnames(className);
    if (className.indexOf(uniqueID) === -1)
        classes = classnames(classes, uniqueID);

    const linkStyles = setLinkStyles(props);

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
                {/* <FontLevel
                    label={__('Title level', 'gutenberg-extra')}
                    value={titleLevel}
                    onChange={value => setAttributes({ titleLevel: value })}
                /> */}
                <FontLevelTest
                    label={__('Title level', 'gutenberg-extra')}
                    value={titleLevel}
                    onChange={
                        (level, fontOptions) => 
                            setAttributes({ 
                                titleLevel: level,
                                titleFontOptions: fontOptions
                            })
                    }
                    fontOptions={titleFontOptions}
                    target='gx-image-box-title'
                />
            </PanelBody>
            <PanelBody
                className="gx-panel gx-link-setting gx-content-tab-setting"
                initialOpen={true}
                title={__('Link Settings', 'gutenberg-extra')}
            >
                <LinkOptions
                    label={__("Link's Title", 'gutenberg-extra')}
                    link={linkTitle}
                    onChangeLink={value => setAttributes({ linkTitle: value })}
                    linkOptions={linkOptions}
                    onChangeOptions={value => { setAttributes({ linkOptions: value }); }}
                />
            </PanelBody>
            <AccordionControl
                isPrimary
                items={[
                    {
                        label: __('Typography & Colours', 'gutenberg-extra'),
                        className: 'gx-typography-tab',
                        content: (
                            <PanelBody
                                className="gx-panel gx-color-setting gx-style-tab-setting"
                                initialOpen={true}
                                title={__('Colour settings', 'gutenberg-extra')}
                            >
                                <TypographyTest
                                    fontOptions={titleFontOptions}
                                    onChange={value => { setAttributes({ titleFontOptions: value }) }}
                                    target="gx-image-box-title"
                                    defaultColor="#000000"
                                />
                                <Typography
                                    fontOptions={subtitleFontOptions}
                                    onChange={value => { setAttributes({ subtitleFontOptions: value }) }}
                                    target="gx-image-box-subtitle"
                                />
                                <Typography
                                    fontOptions={descriptionFontOptions}
                                    onChange={value => { setAttributes({ descriptionFontOptions: value }) }}
                                    target="gx-image-box-description"
                                />
                            </PanelBody>
                        ),
                    },
                    {
                        label: __('Image', 'gutenberg-extra'),
                        className: 'gx-imagesettings-tab',
                        content: (
                            <ImageSettings
                                target="gx-image-box-image"
                                imageSettings={imageSettings}
                                onChange={value => setAttributes({ imageSettings: value })}
                                mediaID={mediaID}
                            />
                        ),
                    },
                    {
                        label: __('Button', 'gutenberg-extra'),
                        className: 'gx-button-tab',
                        content: (
                            <PanelBody>
                                <ButtonStyles
                                    buttonSettings={buttonStyles}
                                    onChange={value => setAttributes({ buttonStyles: value })}
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label: __('Background Image', 'gutenberg-extra'),
                        className: 'gx-backgroundsettings-tab',
                        content: (
                            <BackgroundControlTest
                                backgroundOptions={backgroundOptionsTest}
                                onChange={value => setAttributes({ backgroundOptionsTest: value })}
                            />
                        ),
                        icon: iconsSettings.box
                    },
                    {
                        label: __('Box Settings', 'gutenberg-extra'),
                        className: 'gx-box-settings-tab',
                        content: (
                            <Fragment>
                                <PopoverControl
                                    label={__('Box shadow', 'gutenberg-extra')}
                                    popovers={[
                                        {
                                            content: (
                                                <BoxShadow
                                                    boxShadowOptions={boxShadow}
                                                    onChange={value => setAttributes({ boxShadow: value })}
                                                />
                                            )
                                        }
                                    ]}
                                />
                                <PanelBody
                                    className="gx-panel gx-border-setting gx-style-tab-setting"
                                    initialOpen={true}
                                    title={__('Border settings', 'gutenberg-extra')}
                                >
                                    <BlockBorderTest
                                        borderOptions={borderTest}
                                        onChange={value => setAttributes({ borderTest: value })}
                                    />
                                </PanelBody>
                            </Fragment>
                        ),
                    },
                    {
                        label: __(' Width / Height', 'gutenberg-extra'),
                        className: 'gx-width-tab',
                        content: (
                            <PanelBody
                                className="gx-panel gx-size-setting gx-style-tab-setting"
                                initialOpen={true}
                                title={__('Size Settings', 'gutenberg-extra')}
                            >
                                <SizeControlTest
                                    sizeSettings={sizeTest}
                                    onChange={value => setAttributes({ sizeTest: value })}
                                />
                            </PanelBody>
                        ),
                    },
                    {
                        label: __('Padding & Margin', 'gutenberg-extra'),
                        className: 'gx-padding-tab',
                        content: (
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
                        ),
                    }
                ]}
            />
            <PanelBody
                initialOpen={true}
                className="gx-panel gx-advanced-setting gx-advanced-tab-setting"
                title={__('Advanced Settings', 'gutenberg-extra')}
            >
                <HoverAnimation
                    {...props}
                />
                <CustomCSS
                    {...props}
                />
            </PanelBody>
        </InspectorControls >,
        <div
            className={'gx-block ' + blockStyle + ' gx-image-box ' + classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <div
                className="gx-image-box-link"
                style={linkStyles}
            >
                <ImageUpload
                    className="gx-image-box-image"
                    imageSettings={imageSettings}
                    mediaID={mediaID}
                    // onSelect={media => setAttributes({ mediaID: media.id })}
                    onSelect={
                        (media, imageSettings) => setAttributes({ 
                            mediaID: media.id,
                            // imageSettings
                        })
                    }
                />
                <div className='gx-image-box-text'>
                    <RichText
                        tagName={titleLevel}
                        placeholder={__('This is your awesome title here', 'gutenberg-extra')}
                        value={title}
                        onChange={value => setAttributes({ title: value })}
                        className="gx-image-box-title"
                    />
                    <RichText
                        tagName="p"
                        placeholder={__('Add a snappy sub heading', 'gutenberg-extra')}
                        value={additionalText}
                        onChange={value => setAttributes({ additionalText: value })}
                        className="gx-image-box-subtitle"
                    />
                    <RichText
                        tagName="p"
                        multiline="br"
                        placeholder={__('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis architect beatae unde omnis iste natus.', 'gutenberg-extra')}
                        value={description}
                        onChange={value => setAttributes({ description: value })}
                        className="gx-image-box-description"
                    />
                    <ButtonEditor
                        buttonSettings={buttonStyles}
                        onChange={value => setAttributes({ buttonStyles: value })}
                        placeholder={__('Click me', 'gutenberg-extra')}
                    />
                </div>
            </div>
        </div>
    ];
}

export default edit;