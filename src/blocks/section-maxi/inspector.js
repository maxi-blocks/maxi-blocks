/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;

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
            blockStyle,
            defaultBlockStyle,
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
        setAttributes,
    } = props;

    return (
        <InspectorControls>
            <SettingTabsControl
                items={[
                    {
                        label: __('Style', 'maxi-blocks'),
                        content: (
                            <Fragment>
                                <BlockStylesControl
                                    blockStyle={blockStyle}
                                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                                    defaultBlockStyle={defaultBlockStyle}
                                    onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                                />
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Background Image', 'maxi-blocks'), content: (
                                                <BackgroundControl
                                                    backgroundOptions={background}
                                                    onChange={background => setAttributes({ background })}
                                                />
                                            ),
                                        },
                                        {
                                            label: __('Box Settings', 'maxi-blocks'), content: (
                                                <Fragment>
                                                    <BoxShadowControl
                                                        boxShadowOptions={boxShadow}
                                                        onChange={boxShadow => setAttributes({ boxShadow })}
                                                    />
                                                    <hr style={{ marginTop: "28px" }} />
                                                    <BorderControl
                                                        borderOptions={border}
                                                        onChange={border => setAttributes({ border })}
                                                        avoidZero={false}
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
                                                        avoidZero
                                                    />
                                                    <DimensionsControl
                                                        value={margin}
                                                        onChange={margin => setAttributes({ margin })}
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
                            <Fragment>
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
                            </Fragment>
                        )
                    }
                ]}
            />
        </InspectorControls>
    )
}

export default Inspector;