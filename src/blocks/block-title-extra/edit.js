/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    PanelBody,
    SelectControl,
    BaseControl
} = wp.components;
const {
    InspectorControls,
    RichText,
} = wp.blockEditor;

/**
 * Icons
 */

import GxTypographyTab from '../../icons/block-icons/typography-tab/icon';
import GxDividerTab from '../../icons/block-icons/divider-tab/icon';
import GxBoxSettingsTab from '../../icons/block-icons/box-settings-tab/icon';
import GxWithTab from '../../icons/block-icons/width-tab/icon';
import GxPaddingTab from '../../icons/block-icons/padding-tab/icon';

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

    let classes = classnames('gx-block gx-title-extra', blockStyle, extraClassName, className);
    if (className.indexOf(uniqueID) === -1) {
        classes = classnames(classes, uniqueID);
    }

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
                    defaultBlockStyle={defaultBlockStyle}
                    onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
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
                <hr style={{ marginTop: "28px" }} />
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
            </PanelBody>
            <AccordionControl
                isPrimary
                items={[
                    {
                        label:  <span><GxTypographyTab/>{__('Typography / Colours')}</span>,
                        classNameItem: 'gx-typography-item',
                        classNameHeading: "gx-typography-tab",
                        //icon: typography,
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
                                    // Is this class doing something? vvv
                                    className={'gx-subtitle-background-color'}
                                    label={__("Subtitle Background", "gutenberg-extra")}
                                    color={subtitleBackgroundColor}
                                    defaultColor={defaultSubtitleBackgroundColor}
                                    onColorChange={subtitleBackgroundColor => setAttributes({ subtitleBackgroundColor })}
                                    disableGradient
                                />
                            </PanelBody>
                        )
                    },
                    {
                        label:  <span><GxDividerTab />{__("Divider", "gutenberg-extra")}</span>,
                        classNameItem: 'gx-divider-item',
                        classNameHeading: "gx-divider-tab",
                        //icon: iconDivider,
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
                        label:<span><GxBoxSettingsTab />{ __('Box Settings', 'gutenberg-extra')}</span>,
                        classNameItem: 'gx-box-settings-item',
                        classNameHeading: 'gx-box-settings-tab',
                        //icon: boxSettings,
                        content: (
                            <Fragment>
                                <PanelBody className={'gx-panel gx-color-setting gx-style-tab-setting'}>
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
                        label: <span><GxWithTab />{ __('Width / Height', 'gutenberg-extra')}</span>,
                        classNameItem: 'gx-width-height-item',
                        classNameHeading: 'gx-width-height-tab',
                        //icon: width,
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
                        label: <span><GxPaddingTab />{ __('Padding & Margin', 'gutenberg-extra')}</span>,
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
                    placeholder={__("Get more out of now", "gutenberg-extra")}
                    value={subtitle}
                    onChange={subtitle => setAttributes({ subtitle })}
                    className="gx-title-extra-subtitle"
                    style={{ backgroundColor: subtitleBackgroundColor }}
                />
            }
            {
                !hideTitle &&
                <RichText
                    tagName={titleLevel}
                    placeholder={__("Empowered by innovation", "gutenberg-extra")}
                    value={title}
                    onChange={title => setAttributes({ title })}
                    className="gx-title-extra-title"
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
                        "gutenberg-extra"
                    )}
                    value={description}
                    onChange={description => setAttributes({ description })}
                    className="gx-title-extra-description"
                    style={{ columnCount: twoColumnDescription ? 2 : 1 }}
                />
            }
        </div>
    ];
};

export default edit;