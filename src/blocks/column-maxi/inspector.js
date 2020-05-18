/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
    BaseControl,
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    BackgroundControl,
    BlockStylesControl,
    BorderControl,
    BoxShadowControl,
    DimensionsControl,
    CustomCSSControl,
    FullSizeControl,
    HoverAnimationControl,
} from '../../components';


/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            columnSize,
            background,
            boxShadow,
            border,
            size,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            extraStyles
        },
        syncSize,
        getMaxRangeSize,
        redistributeColumnsSize,
        setAttributes
    } = props;

    return (
        <InspectorControls>
            <PanelBody
                className="maxi-panel maxi-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Image Settings', 'maxi-blocks')}
            >
                <BlockStylesControl
                    blockStyle={blockStyle}
                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                    defaultBlockStyle={defaultBlockStyle}
                    onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                    isFirstOnHierarchy={isFirstOnHierarchy}
                />
                {
                    !syncSize &&
                    <RangeControl
                        label={__('Column Size', 'maxi-blocks')}
                        value={columnSize}
                        onChange={columnSize => {
                            redistributeColumnsSize(columnSize);
                            setAttributes({ columnSize })
                        }}
                        min={0}
                        max={100}
                        step={.1}
                    />
                }
            </PanelBody>
            <PanelBody
                className="maxi-panel maxi-image-setting maxi-style-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Image Settings', 'maxi-blocks')}
            >
                <AccordionControl
                    isPrimary
                    items={[
                        {
                            label: __('Background Image', 'maxi-blocks'),
                            classNameHeading: 'maxi-backgroundsettings-tab',
                            //icon: image,
                            content: (
                                <BackgroundControl
                                    backgroundOptions={background}
                                    onChange={background => setAttributes({ background })}
                                    target=">.maxi-column-block-content"
                                />
                            ),
                        },
                        {
                            label: __('Box Settings', 'maxi-blocks'),
                            classNameItem: 'maxi-box-settings-item',
                            classNameHeading: 'maxi-box-settings-tab',
                            //icon: boxSettings,
                            content: (
                                <Fragment>
                                    <PanelBody
                                        className={'maxi-panel maxi-color-setting maxi-style-tab-setting'}
                                    >
                                        {/* This BaseControl has no sense.... */}
                                        <BaseControl
                                            className={"bg-color-parent maxi-reset-button background-gradient"}
                                        >
                                            <BoxShadowControl
                                                boxShadowOptions={boxShadow}
                                                onChange={boxShadow => setAttributes({ boxShadow })}
                                                target=">.maxi-column-block-content"
                                            />
                                        </BaseControl>
                                        <hr style={{ marginTop: "28px" }} />
                                        <BorderControl
                                            borderOptions={border}
                                            onChange={border => setAttributes({ border })}
                                            target=">.maxi-column-block-content"
                                        />
                                    </PanelBody>
                                </Fragment>
                            ),
                        },
                        {
                            label: __(' Width / Height', 'maxi-blocks'),
                            classNameItem: 'maxi-width-height-item',
                            classNameHeading: 'maxi-width-height-tab',
                            //icon: width,
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
                                        target=">.maxi-column-block-content"
                                    />
                                </PanelBody>
                            ),
                        },
                        {
                            label: __('Padding & Margin', 'maxi-blocks'),
                            classNameItem: 'maxi-padding-margin-item',
                            classNameHeading: 'maxi-padding-tab',
                            //icon: iconPadding,
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
                                        target=">.maxi-column-block-content"
                                        avoidZero
                                    />
                                    <DimensionsControl
                                        value={margin}
                                        onChange={margin => setAttributes({ margin })}
                                        target=">.maxi-column-block-content"
                                        avoidZero
                                    />
                                </PanelBody>
                            ),
                        }
                    ]}
                />
            </PanelBody>
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
        </InspectorControls>
    )
}

export default Inspector;