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
 * Inspector
 */
const Inspector = props => {
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

    return (
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
            </PanelBody>
            <div className="block-button-extra">
                <PanelBody
                    className={'gx-panel gx-color-setting gx-style-tab-setting'}
                >
                    <ButtonSettings
                        buttonSettings={buttonSettings}
                        onChange={buttonSettings => setAttributes({ buttonSettings })}
                    />
                </PanelBody>
            </div>
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
        </InspectorControls >
    )
}

export default Inspector;