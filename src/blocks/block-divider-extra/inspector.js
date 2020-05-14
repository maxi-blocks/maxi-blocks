/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
    SelectControl,
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    BlockStylesControl,
    BoxShadowControl,
    CheckBoxControl,
    ColorControl,
    CustomCSSControl,
    DimensionsControl,
    FullSizeControl,
    HoverAnimationControl,
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
                    isFirstOnHierarchy={isFirstOnHierarchy}
                />
            </PanelBody>
            <div className="block-button-extra">
                <PanelBody
                    className={'gx-panel gx-color-setting gx-style-tab-setting'}
                >
                    <AccordionControl
                        isSecondary
                        items={[
                            {
                                label: __('Divider', 'gutenberg-extra'),
                                className: 'gx-divider-tab',
                                content: (
                                    <Fragment>
                                        <CheckBoxControl
                                            label={__('Hide Divider', 'gutenberg-extra')}
                                            id='gx-new-window'
                                            checked={hideDivider}
                                            onChange={hideDivider => setAttributes({ hideDivider })}
                                        />
                                        {/* Is really necessary? vvvv */}
                                        <CheckBoxControl
                                            label={__('Vertical Divider', 'gutenberg-extra')}
                                            id='gx-new-window'
                                            checked={verticalDivider}
                                            onChange={verticalDivider => onVerticalChange( verticalDivider )}
                                        />
                                        <CheckBoxControl
                                            label={__('Rounded Divider', 'gutenberg-extra')}
                                            id='gx-new-window'
                                            checked={roundedDivider}
                                            onChange={roundedDivider => setAttributes({ roundedDivider })}
                                        />
                                        <hr style={{ marginTop: "28px" }} />
                                        {/** May an AligmentControl would be better vvvv */}
                                        <SelectControl
                                            label={__('Divider Alignment', 'gutenberg-extra')}
                                            className="gx-block-style components-base-control divider-alignment"
                                            value={alignment}
                                            options={[
                                                { label: __('Left'), value: 'left' },
                                                { label: __('Center'), value: 'center' },
                                                { label: __('Right'), value: 'right' },
                                            ]}
                                            onChange={alignment => setAttributes({ alignment })}
                                        />
                                        <hr style={{ marginTop: "28px" }} />
                                        <SizeControl
                                            label={__('Width', 'gutenberg-extra')}
                                            unit={dividerWidthUnit}
                                            onChangeUnit={dividerWidthUnit => setAttributes({ dividerWidthUnit })}
                                            value={dividerWidth}
                                            onChangeValue={dividerWidth => setAttributes({ dividerWidth })}
                                        />
                                        <SizeControl
                                            label={__('Height', 'gutenberg-extra')}
                                            unit={dividerHeightUnit}
                                            onChangeUnit={dividerHeightUnit => setAttributes({ dividerHeightUnit })}
                                            value={dividerHeight}
                                            onChangeValue={dividerHeight => setAttributes({ dividerHeight })}
                                        />
                                        <hr style={{ marginTop: "28px" }} />
                                        <ColorControl
                                            label={__('Color', 'gutenberg-extra')}
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
                                            label={__("Opacity", "gutenberg-extra")}
                                            className={"gx-opacity-control"}
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
                                label: __(' Width / Height', 'gutenberg-extra'),
                                classNameItem: 'gx-width-height-item',
                                classNameHeading: 'gx-width-height-tab',
                                //icon: width,
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
                                label: __('Padding / Margin', 'gutenberg-extra'),
                                /** why gx-typography-tab if its width/height? */
                                classNameItem: "gx-padding-margin-item",
                                classNameHeading: "gx-typography-tab",
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