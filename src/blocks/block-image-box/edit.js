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
import { box } from '../../icons';

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
                <BlockStylesControl
                    blockStyle={blockStyle}
                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                    defaultBlockStyle={defaultStatus}
                    onChangeBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                />
                <ImagePositionControl
                    value={imagePosition}
                    onChange={imagePosition => setAttributes({ imagePosition })}
                />
                <FontLevelControl
                    label={__('Title level', 'gutenberg-extra')}
                    value={titleLevel}
                    onChange={
                        (titleLevel, titleFontOptions) =>
                            setAttributes({
                                titleLevel,
                                titleFontOptions
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
                <LinkOptionsControl
                    label={__("Link's Title", 'gutenberg-extra')}
                    link={linkTitle}
                    onChangeLink={linkTitle => setAttributes({ linkTitle })}
                    linkOptions={linkOptions}
                    onChangeOptions={linkOptions=> setAttributes({ linkOptions })}
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
                        className: 'gx-imagesettings-tab',
                        content: (
                            <ImageSettings
                                imageSettings={imageSettings}
                                onChange={imageSettings => setAttributes({ imageSettings })}
                                mediaID={mediaID}
                            />
                        ),
                    },
                    {
                        label: __('Button', 'gutenberg-extra'),
                        className: 'gx-button-tab',
                        content: (
                            <PanelBody>
                                <ButtonSettings
                                    buttonSettings={buttonSettings}
                                    onChange={buttonSettings => setAttributes({ buttonSettings })}
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label: __('Background Image', 'gutenberg-extra'),
                        className: 'gx-backgroundsettings-tab',
                        content: (
                            <BackgroundControl
                                backgroundOptions={background}
                                onChange={background => setAttributes({ background })}
                            />
                        ),
                        icon: box
                    },
                    {
                        label: __('Box Settings', 'gutenberg-extra'),
                        className: 'gx-box-settings-tab',
                        content: (
                            <Fragment>
                                <BoxShadowControl
                                    boxShadowOptions={boxShadow}
                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                />
                                <PanelBody
                                    className="gx-panel gx-border-setting gx-style-tab-setting"
                                    initialOpen={true}
                                    title={__('Border settings', 'gutenberg-extra')}
                                >
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
                        className: 'gx-width-tab',
                        content: (
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
                        className: 'gx-padding-tab',
                        content: (
                            <PanelBody
                                className="gx-panel gx-space-setting gx-style-tab-setting"
                                initialOpen={true}
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
}

export default edit;