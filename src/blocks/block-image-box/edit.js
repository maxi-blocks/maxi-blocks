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

    let classes = classnames('gx-block gx-image-box', blockStyle, extraClassName, className);
    if (className.indexOf(uniqueID) === -1)
        classes = classnames(classes, uniqueID);

    const linkStyles = setLinkStyles(props);
    const Line = () => <hr style={{ marginTop: "28px" }} />;

    return [
        <InspectorControls>
            <PanelBody
                className="gx-panel gx-image-setting gx-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Image Settings', 'gutenberg-extra')}
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
                    label={__('Title level', 'gutenberg-extra')}
                    value={titleLevel}
                    fontOptions={titleFontOptions}
                    onChange={
                        (titleLevel, titleFontOptions) =>
                            setAttributes({
                                titleLevel,
                                titleFontOptions
                            })
                    }
                    target='gx-image-box-title'
                    disableP
                />
            </PanelBody>
            <PanelBody
                className="gx-panel gx-link-setting gx-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Link Settings', 'gutenberg-extra')}
            >
                <LinkOptionsControl
                    label={__("Link's Title", 'gutenberg-extra')}
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
                        label: __('Typography & Colours', 'gutenberg-extra'),
                        classNameHeading: 'gx-typography-tab',
                        //icon: typography,
                        content: (
                            <PanelBody
                                className="gx-panel gx-color-setting gx-style-tab-setting"
                                initialOpen={true}
                                // why this vvvv title?
                                title={__('Colour settings', 'gutenberg-extra')}
                            >
                                <TypographyControl
                                    fontOptions={titleFontOptions}
                                    onChange={titleFontOptions => { setAttributes({ titleFontOptions }) }}
                                    target="gx-image-box-title"
                                    defaultColor="#000000"
                                />
                                <TypographyControl
                                    fontOptions={subtitleFontOptions}
                                    onChange={subtitleFontOptions => { setAttributes({ subtitleFontOptions }) }}
                                    target="gx-image-box-subtitle"
                                />
                                <TypographyControl
                                    fontOptions={descriptionFontOptions}
                                    onChange={descriptionFontOptions => { setAttributes({ descriptionFontOptions }) }}
                                    target="gx-image-box-description"
                                />
                            </PanelBody>
                        ),
                    },
                    {
                        label: __('Image', 'gutenberg-extra'),
                        classNameItem: 'gx-image-item',
                        classNameHeading: 'gx-image-tab',
                        //icon: image,
                        content: (
                            <Fragment>
                                <PanelBody
                                    className="gx-panel gx-color-setting gx-style-tab-setting"
                                    initialOpen={true}
                                    title={__("Immage settings", "gutenberg-extra")}
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
                        label: __('Button', 'gutenberg-extra'),
                        classNameItem: 'gx-button-item',
                        classNameHeading: 'gx-button-tab',
                        //icon: button,
                        content: (
                            <PanelBody
                                className={'gx-panel gx-color-setting gx-style-tab-setting'}
                            >
                                <ButtonSettings
                                    buttonSettings={buttonSettings}
                                    onChange={buttonSettings => setAttributes({ buttonSettings })}
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label: __('Background Image', 'gutenberg-extra'),
                        classNameHeading: 'gx-backgroundsettings-tab',
                        //icon: image,
                        content: (
                            <BackgroundControl
                                backgroundOptions={background}
                                onChange={background => setAttributes({ background })}
                            />
                        ),
                    },
                    {
                        label: __('Box Settings', 'gutenberg-extra'),
                        classNameItem: 'gx-box-settings-item',
                        classNameHeading: 'gx-box-settings-tab',
                        //icon: boxSettings,
                        content: (
                            <Fragment>
                                <PanelBody
                                    className={'gx-panel gx-color-setting gx-style-tab-setting'}
                                >
                                    <BaseControl
                                        className={"bg-color-parent gx-reset-button background-gradient"}
                                    >
                                        <BoxShadowControl
                                            boxShadowOptions={boxShadow}
                                            onChange={boxShadow => setAttributes({ boxShadow })}
                                        />
                                    </BaseControl>
                                    <Line />
                                    <BorderControl
                                        borderOptions={border}
                                        onChange={border => setAttributes({ border })}
                                    />
                                </PanelBody>
                            </Fragment>
                        ),
                    },
                    {
                        label: __(' Width / Height', 'gutenberg-extra'),
                        classNameItem: 'gx-width-height-item',
                        classNameHeading: 'gx-width-height-tab',
                        //icon: width,
                        content: (
                            // Is this vvv PanelBody element necessary?
                            <PanelBody
                                className="gx-panel gx-size-setting gx-style-tab-setting"
                                initialOpen={true}
                                title={__('Size Settings', 'gutenberg-extra')}
                            >
                                <FullSizeControl
                                    sizeSettings={size}
                                    onChange={size => setAttributes({ size })}
                                />
                            </PanelBody>
                        ),
                    },
                    {
                        label: __('Padding & Margin', 'gutenberg-extra'),
                        classNameItem: 'gx-padding-margin-item',
                        classNameHeading: 'gx-padding-tab',
                        //icon: iconPadding,
                        content: (
                            <PanelBody
                                className="gx-panel gx-space-setting gx-style-tab-setting"
                                initialOpen={true}
                                // why this vvvv title?
                                title={__('Space Settings', 'gutenberg-extra')}
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
                className="gx-panel gx-advanced-setting gx-advanced-tab-setting"
                title={__('Advanced Settings', 'gutenberg-extra')}
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
                className="gx-image-box-link"
                style={linkStyles}
            >
                <ImageUpload
                    className="gx-image-box-image"
                    imageSettings={imageSettings}
                    mediaID={mediaID}
                    onSelect={media => setAttributes({ mediaID: media.id })}
                />
                <div className='gx-image-box-text'>
                    <RichText
                        tagName={titleLevel}
                        placeholder={__('This is your awesome title here', 'gutenberg-extra')}
                        value={title}
                        onChange={title => setAttributes({ title })}
                        className="gx-image-box-title"
                    />
                    <RichText
                        tagName="p"
                        placeholder={__('Add a snappy sub heading', 'gutenberg-extra')}
                        value={additionalText}
                        onChange={additionalText => setAttributes({ additionalText })}
                        className="gx-image-box-subtitle"
                    />
                    <RichText
                        tagName="p"
                        multiline="br"
                        placeholder={__('Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis architect beatae unde omnis iste natus.', 'gutenberg-extra')}
                        value={description}
                        onChange={description => setAttributes({ description })}
                        className="gx-image-box-description"
                    />
                    <ButtonEditor
                        buttonSettings={buttonSettings}
                        onChange={buttonSettings => setAttributes({ buttonSettings })}
                        placeholder={__('Click me', 'gutenberg-extra')}
                    />
                </div>
            </div>
        </div>
    ];
};

export default edit;
