/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
} = wp.components;
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
    BlockStylesControl,
    BorderControl,
    BoxShadowControl,
    CheckBoxControl,
    ColorControl,
    CustomCSSControl,
    DimensionsControl,
    FontLevelControl,
    FullSizeControl,
    HoverAnimationControl,
    TypographyControl,
    DividerSettings,
    Divider
} from '../../components';

/**
 * External dependencies
 */
import classnames from "classnames";

/**
 * Edit
 */
const edit = (props) => {
    const {
        className,
        attributes: {
            subtitle,
            title,
            text,
            titleLevel,
            subtitleLevel,
            border,
            size,
            background,
            blockStyle,
            defaultBlockStyle,
            subtitleTextAlign,
            titleTextAlign,
            additionalDivider,
            descriptionTextAlign,
            subtitleBackgroundColor,
            hideTitle,
            hideSubtitle,
            hideDescription,
            twoColumnDescription,
            contentDirection,
            uniqueID,
            extraClassName,
            boxShadow,
            extraStyles,
            titleFontOptions,
            subtitleFontOptions,
            descriptionFontOptions,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            divider,
        },
        setAttributes,
    } = props;

    let classes = classnames('gx-block gx-title-extra', blockStyle, extraClassName, className);
    if (className.indexOf(uniqueID) === -1) {
        classes = classnames(classes, uniqueID);
    }
    const Line = () => <hr style={{ marginTop: "28px" }} />;

    return [
        <InspectorControls>
            <PanelBody
                className="gx-panel gx-image-setting gx-content-tab-setting"
                initialOpen={true}
                title={__("Image Settings", "gutenberg-extra")}
            >
                <BlockStylesControl
                    blockStyle={blockStyle}
                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                    defaultBlockStyle={defaultStatus}
                    onChangeBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                />
                <FontLevelControl
                    label={__("Title level", "gutenberg-extra")}
                    value={titleLevel}
                    fontOptions={titleFontOptions}
                    onChange={(titleLevel, titleFontOptions) =>
                        setAttributes({
                            titleLevel,
                            titleFontOptions
                        })}
                />
                <FontLevelControl
                    label={__("Subtitle level", "gutenberg-extra")}
                    value={subtitleLevel}
                    fontOptions={subtitleFontOptions}
                    onChange={(subtitleLevel, subtitleFontOptions) =>
                        setAttributes({
                            subtitleLevel,
                            subtitleFontOptions
                        })}
                />
            </PanelBody>
            <PanelBody
                className="gx-panel gx-image-setting gx-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__("Image Settings", "gutenberg-extra")}
            >
                <CheckBoxControl
                    label={__('Hide Title', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={hideTitle}
                    onChange={hideTitle => setAttributes({ hideTitle })}
                />
                <CheckBoxControl
                    label={__('Hide Subtitle', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={hideSubtitle}
                    onChange={hideSubtitle => setAttributes({ hideSubtitle })}
                />
                <CheckBoxControl
                    label={__('Hide Description', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={hideDescription}
                    onChange={hideDescription => setAttributes({ hideDescription })}
                />
                <CheckBoxControl
                    label={__('Two Column Description Layout', 'gutenberg-extra')}
                    id='gx-new-window'
                    checked={twoColumnDescription}
                    onChange={twoColumnDescription => setAttributes({ twoColumnDescription })}
                />
                <Line />
                <SelectControl
                    label={__('Content Direction', 'gutenberg-extra')}
                    className="gx-block-style content-direction"
                    value={contentDirection}
                    options={[
                        { label: __('From Left To Right'), value: 'row' },
                        { label: __('From Right To Left'), value: 'row-reverse' },
                        { label: __('From Top To Bottom'), value: 'column' },
                        { label: __('From Bottom To Top'), value: 'column-reverse' },
                    ]}
                    onChange={contentDirection => setAttributes({ contentDirection })}
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
                    onChange={subtitleTextAlign => setAttributes({ subtitleTextAlign })}
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
                    onChange={titleTextAlign => setAttributes({ titleTextAlign })}
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
                    onChange={descriptionTextAlign => setAttributes({ descriptionTextAlign })}
                />
            </PanelBody>
            <AccordionControl
                isPrimary
                items={[
                    {
                        label: __("Typography / Colours", "gutenberg-extra"),
                        className: "gx-typography-tab gx-typography-item",
                        content: (
                            <PanelBody
                                className="gx-panel gx-color-setting gx-style-tab-setting"
                                initialOpen={true}
                                // why this vvvv title?
                                title={__("Colour settings", "gutenberg-extra")}
                            >
                                <TypographyControl
                                    fontOptions={titleFontOptions}
                                    onChange={value => {
                                        setAttributes({ titleFontOptions: value });
                                    }}
                                    target="gx-title-extra-title"
                                />
                                <TypographyControl
                                    fontOptions={subtitleFontOptions}
                                    onChange={value => {
                                        setAttributes({ subtitleFontOptions: value });
                                    }}
                                    target="gx-title-extra-subtitle"
                                />
                                <TypographyControl
                                    fontOptions={descriptionFontOptions}
                                    onChange={value => {
                                        setAttributes({ descriptionFontOptions: value });
                                    }}
                                    target="gx-title-extra-text"
                                />
                                <ColorControl
                                    className={'gx-subtitle-background-color'}
                                    label={__("Subtitle Background", "gutenberg-extra")}
                                    color={subtitleBackgroundColor}
                                    onColorChange={(value) => {
                                        setAttributes({
                                            subtitleBackgroundColor: value,
                                        });
                                    }}
                                    disableGradient
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label: __("Divider", "gutenberg-extra"),
                        className: "gx-divider-tab gx-divider-item",
                        content: (
                            <PanelBody>
                                <DividerSettings
                                    dividerSettings={divider}
                                    onChange={divider => setAttributes({ divider })}
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
                    },
                    {
                        label: __('Box Settings', 'gutenberg-extra'),
                        className: 'gx-box-settings-tab gx-box-settings-item',
                        content: (
                            <Fragment>
                                <BoxShadowControl
                                    boxShadowOptions={boxShadow}
                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                />
                                <Line />
                                <BorderControl
                                    borderOptions={border}
                                    onChange={border => setAttributes({ border })}
                                />
                            </Fragment>
                        ),
                    },
                    {
                        label: __(' Width / Height', 'gutenberg-extra'),
                        className: 'gx-width-height-tab gx-width-height-items',
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
                        className: 'gx-padding-tab gx-padding-margin-item',
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
                title={__("Advanced Settings", "gutenberg-extra")}
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
        </InspectorControls>,
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <div
                style={{
                    order: 0,
                }}
            >
                <RichText
                    tagName={subtitleLevel}
                    placeholder={__("Get more out of now", "gutenberg-extra")}
                    value={subtitle}
                    onChange={value => setAttributes({ subtitle: value })}
                    className="gx-title-extra-subtitle"
                />
            </div>
            <div
                style={{
                    order: 3,
                }}
                dangerouslySetInnerHTML={{
                    __html: additionalDivider,
                }}
            />
            <div
                style={{
                    order: 1,
                }}
            >
                <RichText
                    tagName={titleLevel}
                    placeholder={__("Empowered by innovation", "gutenberg-extra")}
                    value={title}
                    onChange={value => setAttributes({ title: value })}
                    className="gx-title-extra-title"
                />
            </div>
            <Divider 
                dividerSettings={divider}
            />
            <div
                style={{
                    order: 3,
                }}
            >
                <RichText
                    tagName="h6"
                    placeholder={__(
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque malesuada volutpat mattis eros.",
                        "gutenberg-extra"
                    )}
                    value={text}
                    onChange={value => setAttributes({ text: value })}
                    className="gx-title-extra-text"
                />
            </div>
        </div>
    ];
};

export default edit;
