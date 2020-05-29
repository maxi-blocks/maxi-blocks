/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { RangeControl } = wp.components;

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
    SettingTabsControl
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
            <SettingTabsControl
                items={[
                    {
                        label: __('Style', 'maxi-blocks'),
                        content: (
                            <Fragment>
                                <div className='maxi-tab-content__box'>
                                    <BlockStylesControl
                                        blockStyle={blockStyle}
                                        onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                                        defaultBlockStyle={defaultBlockStyle}
                                        onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                                        isFirstOnHierarchy={isFirstOnHierarchy}
                                    />
                                </div>
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
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Background Image', 'maxi-blocks'),
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
                                            content: (
                                                <Fragment>
                                                    <BoxShadowControl
                                                        boxShadowOptions={boxShadow}
                                                        onChange={boxShadow => setAttributes({ boxShadow })}
                                                        target=">.maxi-column-block-content"
                                                    />
                                                    <hr style={{ marginTop: "28px" }} />
                                                    <BorderControl
                                                        borderOptions={border}
                                                        onChange={border => setAttributes({ border })}
                                                        target=">.maxi-column-block-content"
                                                    />
                                                </Fragment>
                                            ),
                                        },
                                        {
                                            label: __(' Width / Height', 'maxi-blocks'),
                                            content: (
                                                <FullSizeControl
                                                    sizeSettings={size}
                                                    onChange={size => setAttributes({ size })}
                                                    target=">.maxi-column-block-content"
                                                />
                                            ),
                                        },
                                        {
                                            label: __('Padding & Margin', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
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
                                                </Fragment>
                                            ),
                                        }
                                    ]}
                                />
                            </Fragment>
                        )
                    },
                    {
                        label: __('Advanced', 'maxi-blocks'),
                        content: (
                            <div className='maxi-tab-content__box'>
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
                            </div>
                        )
                    }
                ]}
            />
        </InspectorControls>
    )
}

export default Inspector;