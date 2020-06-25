/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    PanelBody,
    SelectControl
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
 * Icons
 */
import {
    typography,
    image,
    boxSettings,
    width,
    divider as iconDivider,
    padding as iconPadding
} from '../../icons';

import GxDividerTab from '../../icons/block-icons/divider-tab/icon.js';
import GxImageTab from '../../icons/block-icons/image-tab/icon.js';
/**
 * Edit
 */
const edit = (props) => {
    const {
        className,
        attributes: {
            uniqueID,
            blockStyle,
            defaultBlockStyle,
            titleLevel,
            subtitleLevel,
            hideTitle,
            hideSubtitle,
            hideDescription,
            twoColumnDescription,
            contentDirection,
            titleFontOptions,
            subtitleFontOptions,
            descriptionFontOptions,
            subtitleBackgroundColor,
            defaultSubtitleBackgroundColor,
            divider,
            background,
            boxShadow,
            border,
            size,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            extraStyles,
            subtitle,
            title,
            description,
        },
        setAttributes,
    } = props;

    let classes = classnames('maxi-block maxi-title-extra', blockStyle, extraClassName, className);
    if (className.indexOf(uniqueID) === -1) {
        classes = classnames(classes, uniqueID);
    }

    return [
        <InspectorControls>
            <PanelBody
                className="maxi-panel maxi-content-tab-setting"
                initialOpen={true}
                title={__("Image Settings", "maxi-blocks")}
            >
                <BlockStylesControl
                    blockStyle={blockStyle}
                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                    defaultBlockStyle={defaultBlockStyle}
                    onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                />
                <FontLevelControl
                    label={__("Title level", "maxi-blocks")}
                    value={titleLevel}
                    fontOptions={titleFontOptions}
                    onChange={(titleLevel, titleFontOptions) =>
                        setAttributes({
                            titleLevel,
                            titleFontOptions
                        })}
                />
                <FontLevelControl
                    label={__("Subtitle level", "maxi-blocks")}
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
                className="maxi-panel maxi-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__("Image Settings", "maxi-blocks")}
            >
                <CheckBoxControl
                    label={__('Hide Title', 'maxi-blocks')}
                    id='maxi-new-window'
                    checked={hideTitle}
                    onChange={hideTitle => setAttributes({ hideTitle })}
                />
                <CheckBoxControl
                    label={__('Hide Subtitle', 'maxi-blocks')}
                    id='maxi-new-window'
                    checked={hideSubtitle}
                    onChange={hideSubtitle => setAttributes({ hideSubtitle })}
                />
                <CheckBoxControl
                    label={__('Hide Description', 'maxi-blocks')}
                    id='maxi-new-window'
                    checked={hideDescription}
                    onChange={hideDescription => setAttributes({ hideDescription })}
                />
                <CheckBoxControl
                    label={__('Two Column Description Layout', 'maxi-blocks')}
                    id='maxi-new-window'
                    checked={twoColumnDescription}
                    onChange={twoColumnDescription => setAttributes({ twoColumnDescription })}
                />
                <hr style={{ marginTop: "28px" }} />
                <SelectControl
                    label={__('Content Direction', 'maxi-blocks')}
                    className="maxi-block-style content-direction"
                    value={contentDirection}
                    options={[
                        { label: __('From Left To Right'), value: 'row' },
                        { label: __('From Right To Left'), value: 'row-reverse' },
                        { label: __('From Top To Bottom'), value: 'column' },
                        { label: __('From Bottom To Top'), value: 'column-reverse' },
                    ]}
                    onChange={contentDirection => setAttributes({ contentDirection })}
                />
            </PanelBody>
            <AccordionControl
                isPrimary
                items={[
                    {
                        label: __('Typography / Colours'),
                        classNameItem: 'maxi-typography-item',
                        classNameHeading: "maxi-typography-tab",
                        icon: typography,
                        content: (
                            <PanelBody
                                className="maxi-panel maxi-color-setting maxi-style-tab-setting"
                                initialOpen={true}
                                // why this vvvv title?
                                title={__("Colour settings", "maxi-blocks")}
                            >
                                <TypographyControl
                                    fontOptions={titleFontOptions}
                                    onChange={value => {
                                        setAttributes({ titleFontOptions: value });
                                    }}
                                    target="maxi-title-extra-title"
                                />
                                <TypographyControl
                                    fontOptions={subtitleFontOptions}
                                    onChange={value => {
                                        setAttributes({ subtitleFontOptions: value });
                                    }}
                                    target="maxi-title-extra-subtitle"
                                />
                                <TypographyControl
                                    fontOptions={descriptionFontOptions}
                                    onChange={value => {
                                        setAttributes({ descriptionFontOptions: value });
                                    }}
                                    target="maxi-title-extra-text"
                                />
                                <ColorControl
                                    // Is this class doing something? vvv
                                    className={'maxi-subtitle-background-color'}
                                    label={__("Subtitle Background", "maxi-blocks")}
                                    color={subtitleBackgroundColor}
                                    defaultColor={defaultSubtitleBackgroundColor}
                                    onColorChange={subtitleBackgroundColor => setAttributes({ subtitleBackgroundColor })}
                                    disableGradient
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label: __("Divider", "maxi-blocks"),
                        classNameItem: 'maxi-divider-item',
                        classNameHeading: "maxi-divider-tab",
                        icon: <GxDividerTab />,
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
                        label: __('Background Image', 'maxi-blocks'),
                        classNameHeading: 'maxi-backgroundsettings-tab',
                        icon: <GxImageTab />,
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
                                <PanelBody className={'maxi-panel maxi-color-setting maxi-style-tab-setting'}>
                                    <BoxShadowControl
                                        boxShadowOptions={boxShadow}
                                        onChange={boxShadow => setAttributes({ boxShadow })}
                                    />
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
                        label:  __('Width / Height', 'maxi-blocks'),
                        classNameItem: 'maxi-width-height-item',
                        classNameHeading: 'maxi-width-height-tab',
                        icon: width,
                        content: (
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
                title={__("Advanced Settings", "maxi-blocks")}
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
            style={{
                display: 'flex',
                flexDirection: contentDirection
            }}
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            {
                !hideSubtitle &&
                <RichText
                    tagName={subtitleLevel}
                    placeholder={__("Get more out of now", "maxi-blocks")}
                    value={subtitle}
                    onChange={subtitle => setAttributes({ subtitle })}
                    className="maxi-title-extra-subtitle"
                    style={{ backgroundColor: subtitleBackgroundColor }}
                />
            }
            {
                !hideTitle &&
                <RichText
                    tagName={titleLevel}
                    placeholder={__("Empowered by innovation", "maxi-blocks")}
                    value={title}
                    onChange={title => setAttributes({ title })}
                    className="maxi-title-extra-title"
                />
            }
            <Divider
                dividerSettings={divider}
            />
            {
                !hideDescription &&
                <RichText
                    tagName="h6"
                    placeholder={__(
                        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque malesuada volutpat mattis eros.",
                        "maxi-blocks"
                    )}
                    value={description}
                    onChange={description => setAttributes({ description })}
                    className="maxi-title-extra-description"
                    style={{ columnCount: twoColumnDescription ? 2 : 1 }}
                />
            }
        </div>
    ];
};

export default edit;