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
    AlignmentControl,
    BlockStylesControl,
    BoxShadowControl,
    CheckBoxControl,
    ColorControl,
    CustomCSSControl,
    DimensionsControl,
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    SizeControl,
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
            hideDivider,
            verticalDivider,
            roundedDivider,
            alignment,
            dividerWidthUnit,
            dividerWidth,
            dividerHeightUnit,
            dividerHeight,
            dividerColor,
            dividerColorDefault,
            boxShadow,
            opacity,
            size,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            extraStyles,
        },
        setAttributes,
    } = props;

    const onVerticalChange = verticalDivider => {
        const temp = {
            dividerWidthUnit,
            dividerWidth,
            dividerHeightUnit,
            dividerHeight,
        }

        setAttributes({
            verticalDivider,
            dividerWidthUnit: temp.dividerHeightUnit,
            dividerWidth: temp.dividerHeight,
            dividerHeightUnit: temp.dividerWidthUnit,
            dividerHeight: temp.dividerWidth,
        })
    }

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
                                <AccordionControl
                                    isSecondary
                                    items={[
                                        {
                                            label: __("Alignment", "maxi-blocks"),
                                            content: (
                                                <Fragment>
                                                <AlignmentControl
                                                        value={alignment}
                                                        onChange={alignment => setAttributes({ alignment })}
                                                        disableJustify
                                                    />
                                                </Fragment>
                                            )
                                        },
                                        {
                                            label: __('Divider', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <CheckBoxControl
                                                        label={__('Hide Divider', 'maxi-blocks')}
                                                        checked={hideDivider}
                                                        onChange={hideDivider => setAttributes({ hideDivider })}
                                                    />
                                                    {/* Is really necessary? vvvv */}
                                                    <CheckBoxControl
                                                        label={__('Vertical Divider', 'maxi-blocks')}
                                                        checked={verticalDivider}
                                                        onChange={verticalDivider => onVerticalChange(verticalDivider)}
                                                    />
                                                    <CheckBoxControl
                                                        label={__('Rounded Divider', 'maxi-blocks')}
                                                        checked={roundedDivider}
                                                        onChange={roundedDivider => setAttributes({ roundedDivider })}
                                                    />
                                                    <hr style={{ marginTop: "28px" }} />
                                                    <SizeControl
                                                        label={__('Width', 'maxi-blocks')}
                                                        unit={dividerWidthUnit}
                                                        onChangeUnit={dividerWidthUnit => setAttributes({ dividerWidthUnit })}
                                                        value={dividerWidth}
                                                        onChangeValue={dividerWidth => setAttributes({ dividerWidth })}
                                                    />
                                                    <SizeControl
                                                        label={__('Height', 'maxi-blocks')}
                                                        unit={dividerHeightUnit}
                                                        onChangeUnit={dividerHeightUnit => setAttributes({ dividerHeightUnit })}
                                                        value={dividerHeight}
                                                        onChangeValue={dividerHeight => setAttributes({ dividerHeight })}
                                                    />
                                                    <hr style={{ marginTop: "28px" }} />
                                                    <ColorControl
                                                        label={__('Color', 'maxi-blocks')}
                                                        color={dividerColor}
                                                        defaultColor={dividerColorDefault}
                                                        onColorChange={dividerColor => setAttributes({ dividerColor })}
                                                        disableGradient
                                                    />
                                                    <BoxShadowControl
                                                        boxShadowOptions={boxShadow}
                                                        onChange={boxShadow => setAttributes({ boxShadow })}
                                                        target='>hr'
                                                    />
                                                    <RangeControl
                                                        label={__("Opacity", "maxi-blocks")}
                                                        className={"maxi-opacity-control"}
                                                        value={opacity * 100}
                                                        onChange={opacity => setAttributes({ opacity: opacity / 100 })}
                                                        min={0}
                                                        max={100}
                                                        allowReset={true}
                                                        initialPosition={0}
                                                    />
                                                </Fragment>
                                            )
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
                                            label: __('Padding / Margin', 'maxi-blocks'),
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
                                            )
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
        </InspectorControls >
    )
}

export default Inspector;