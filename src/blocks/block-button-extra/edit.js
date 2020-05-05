import './style.css';
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

    let classes = classnames('gx-block gx-button-box', blockStyle, extraClassName, className);
    if (className.indexOf(uniqueID) === -1)
        classes = classnames(classes, uniqueID);

    const linkStyles = setLinkStyles(props);

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
        </InspectorControls >,
        <div
            className={classes}
            data-gx_initial_block_class={defaultBlockStyle}
        >
            <div
                className="gx-block-button-link"
                style={linkStyles}
            >
                    <ButtonEditor
                       
                        buttonSettings={buttonSettings}
                        onChange={buttonSettings => setAttributes({ buttonSettings })}
                        data-gx_initial_block_class={defaultBlockStyle}
                        placeholder={__('Click me', 'gutenberg-extra')}
                    />
            </div>
        </div>
    ];
};

export default edit;
