/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    InspectorControls,
    RichText,
} = wp.blockEditor;
const { 
    PanelBody,
    BaseControl
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    ButtonSettings,
    ButtonEditor,
    CustomCSSControl,
    DimensionsControl,
    FontLevelControl,
    HoverAnimationControl,
    ImagePositionControl,
    ImageSettings,
    ImageUpload,
    LinkOptionsControl,
    FullSizeControl,
    TypographyControl
} from '../../components';
import { setLinkStyles } from './utils';
import {
    typography,
    image,
    button,
    boxSettings,
    width,
    padding as iconPadding
} from '../../icons';

import GxButtonTab from '../../icons/block-icons/button-tab/icon.js';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
            imagePosition,
            titleLevel,
            linkTitle,
            linkOptions,
            titleFontOptions,
            subtitleFontOptions,
            descriptionFontOptions,
            imageSettings,
            buttonSettings,
            background,
            boxShadow,
            border,
            size,
            margin,
            padding,
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            extraStyles,
            mediaID,
            title,
            additionalText,
            description,
        },
        setAttributes,
    } = props;

    let classes = classnames('maxi-block maxi-image-box', blockStyle, extraClassName, className);
    if (className.indexOf(uniqueID) === -1)
        classes = classnames(classes, uniqueID);

    const linkStyles = setLinkStyles(props);

    return [
        <InspectorControls>
            <PanelBody
                className="maxi-panel maxi-image-setting maxi-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Image Settings', 'maxi-blocks')}
            >
                <BlockStylesControl
                    blockStyle={blockStyle}
                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                    defaultBlockStyle={defaultBlockStyle}
                    onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                />
                <ImagePositionControl
                    value={imagePosition}
                    onChange={imagePosition => setAttributes({ imagePosition })}
                />
                <FontLevelControl
                    label={__('Title level', 'maxi-blocks')}
                    value={titleLevel}
                    fontOptions={titleFontOptions}
                    onChange={
                        (titleLevel, titleFontOptions) =>
                            setAttributes({
                                titleLevel,
                                titleFontOptions
                            })
                    }
                    target='maxi-image-box-title'
                    disableP
                />
            </PanelBody>
            <PanelBody
                className="maxi-panel maxi-link-setting maxi-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Link Settings', 'maxi-blocks')}
            >
                <LinkOptionsControl
                    label={__("Link's Title", 'maxi-blocks')}
                    link={linkTitle}
                    onChangeLink={linkTitle => setAttributes({ linkTitle })}
                    linkOptions={linkOptions}
                    onChangeOptions={linkOptions => setAttributes({ linkOptions })}
                />
            </PanelBody>
            <AccordionControl
                isPrimary
                items={[
                    {
                        label: __('Typography & Colours'),
                        classNameHeading: 'maxi-typography-tab',
                        icon: typography,
                        content: (
                            <PanelBody
                                className="maxi-panel maxi-color-setting maxi-style-tab-setting"
                                initialOpen={true}
                                // why this vvvv title?
                                title={__('Colour settings', 'maxi-blocks')}
                            >
                                <TypographyControl
                                    fontOptions={titleFontOptions}
                                    onChange={titleFontOptions => { setAttributes({ titleFontOptions }) }}
                                    target="maxi-image-box-title"
                                    defaultColor="#000000"
                                />
                                <TypographyControl
                                    fontOptions={subtitleFontOptions}
                                    onChange={subtitleFontOptions => { setAttributes({ subtitleFontOptions }) }}
                                    target="maxi-image-box-subtitle"
                                />
                                <TypographyControl
                                    fontOptions={descriptionFontOptions}
                                    onChange={descriptionFontOptions => { setAttributes({ descriptionFontOptions }) }}
                                    target="maxi-image-box-description"
                                />
                            </PanelBody>
                        ),
                    },
                    {
                        label: __('Image', 'maxi-blocks'),
                        classNameItem: 'maxi-image-item',
                        classNameHeading: 'maxi-image-tab',
                        icon: image,
                        content: (
                            <Fragment>
                                <PanelBody
                                    className="maxi-panel maxi-color-setting maxi-style-tab-setting"
                                    initialOpen={true}
                                    title={__("Immage settings", "maxi-blocks")}
                                >
                                    <ImageSettings
                                        imageSettings={imageSettings}
                                        onChange={imageSettings => setAttributes({ imageSettings })}
                                        mediaID={mediaID}
                                    />
                                </PanelBody>
                            </Fragment>
                        ),
                    },
                    {
                        label: __('Button', 'maxi-blocks'),
                        classNameItem: 'maxi-button-item',
                        classNameHeading: 'maxi-button-tab',
                        icon: <GxButtonTab />,
                        content: (
                            <PanelBody
                                className={'maxi-panel maxi-color-setting maxi-style-tab-setting'}
                            >
                                <ButtonSettings
                                    buttonSettings={buttonSettings}
                                    onChange={buttonSettings => setAttributes({ buttonSettings })}
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label: __('Background Image', 'maxi-blocks'),
                        classNameHeading: 'maxi-backgroundsettings-tab',
                        icon: image,
                        content: (
                            <BackgroundControl
                                backgroundOptions={background}
                                onChange={background => setAttributes({ background })}
                            />
                        ),
                    },
                    {
                        label: __('Box Settings', 'maxi-blocks'),
                        classNameItem: 'maxi-box-settings-item',
                        classNameHeading: 'maxi-box-settings-tab',
                        icon: boxSettings,
                        content: (
                            <Fragment>
                                <PanelBody
                                    className={'maxi-panel maxi-color-setting maxi-style-tab-setting'}
                                >
                                    <BaseControl
                                        className={"bg-color-parent maxi-reset-button background-gradient"}
                                    >
                                        <BoxShadowControl
                                            boxShadowOptions={boxShadow}
                                            onChange={boxShadow => setAttributes({ boxShadow })}
                                        />
                                    </BaseControl>
                                    <hr style={{ marginTop: "28px" }} />
                                    <BorderControl
                                        borderOptions={border}
                                        onChange={border => setAttributes({ border })}
                                    />
                                </PanelBody>
                            </Fragment>
                        ),
                    },
                    {
                        label: __('Width / Height', 'maxi-blocks'),
                        classNameItem: 'maxi-width-height-item',
                        classNameHeading: 'maxi-width-height-tab',
                        icon: width,
                        content: (
                            // Is this vvv PanelBody element necessary?
                            <PanelBody
                                className="maxi-panel maxi-size-setting maxi-style-tab-setting"
                                initialOpen={true}
                                title={__('Size Settings', 'maxi-blocks')}
                            >
                                <FullSizeControl
                                    sizeSettings={size}
                                    onChange={size => setAttributes({ size })}
                                />
                            </PanelBody>
                        ),
                    },
                    {
                        label: __('Padding & Margin', 'maxi-blocks'),
                        classNameItem: 'maxi-padding-margin-item',
                        classNameHeading: 'maxi-padding-tab',
                        icon: iconPadding,
                        content: (
                            <PanelBody
                                className="maxi-panel maxi-space-setting maxi-style-tab-setting"
                                initialOpen={true}
                                // why this vvvv title?
                                title={__('Space Settings', 'maxi-blocks')}
                            >
                                <DimensionsControl
                                    value={padding}
                                    onChange={padding => setAttributes({ padding })}
                                />
                                <DimensionsControl
                                    value={margin}
                                    onChange={margin => setAttributes({ margin })}
                                />
                            </PanelBody>
                        ),
                    }
                ]}
            />
            <PanelBody
                initialOpen={true}
                className="maxi-panel maxi-advanced-setting maxi-advanced-tab-setting"
                title={__('Advanced Settings', 'maxi-blocks')}
            >
                <HoverAnimationControl
                    hoverAnimation={hoverAnimation}
                    onChangeHoverAnimation={hoverAnimation => setAttributes({ hoverAnimation })}
                    hoverAnimationDuration={hoverAnimationDuration}
                    onChangeHoverAnimationDuration={hoverAnimationDuration => setAttributes({ hoverAnimationDuration })}
                />
                <CustomCSSControl
                    extraClassName={extraClassName}
                    onChangeExtraClassName={extraClassName => setAttributes({ extraClassName })}
                    extraStyles={extraStyles}
                    onChangeExtraStyles={extraStyles => setAttributes({ extraStyles })}
                />
            </PanelBody>
        </InspectorControls >,
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <div
                className="maxi-image-box-link"
                style={linkStyles}
            >
                <ImageUpload
                    className="maxi-image-box-image"
                    imageSettings={imageSettings}
                    mediaID={mediaID}
                    onSelect={media => setAttributes({ mediaID: media.id })}
                />
                <div className='maxi-image-box-text'>
                    <RichText
                        tagName={titleLevel}
                        placeholder={__('This is your awesome title here', 'maxi-blocks')}
                        value={title}
                        onChange={title => setAttributes({ title })}
                        className="maxi-image-box-title"
                    />
                    <RichText
                        tagName="p"
                        placeholder={__('Add a snappy sub heading', 'maxi-blocks')}
                        value={additionalText}
                        onChange={additionalText => setAttributes({ additionalText })}
                        className="maxi-image-box-subtitle"
                    />
                    <RichText
                        tagName="p"
                        multiline="br"
                        placeholder={__('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis architect beatae unde omnis iste natus.', 'maxi-blocks')}
                        value={description}
                        onChange={description => setAttributes({ description })}
                        className="maxi-image-box-description"
                    />
                    <ButtonEditor
                        buttonSettings={buttonSettings}
                        onChange={buttonSettings => setAttributes({ buttonSettings })}
                        placeholder={__('Click me', 'maxi-blocks')}
                    />
                </div>
            </div>
        </div>
    ];
};

export default edit;