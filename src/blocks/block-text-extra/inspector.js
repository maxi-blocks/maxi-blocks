/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
} = wp.components;
const { 
    Fragment, 
    Component 
} = wp.element;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    ColorControl,
    CustomCSSControl,
    DimensionsControl,
    FontLevelControl,
    FullSizeControl,
    HoverAnimationControl,
    NormalHoverControl,
    TypographyControl
} from '../../components';

/**
 * Inspector
 */
class Inspector extends Component {

    target = this.props.attributes.uniqueID;

    state = {
        selectorTypographyColors: 'normal',
        selectorOpacityShadow: 'normal',
        selectorPaddingMargin: 'normal',
        selectorBorder: 'normal'
    }

    render() {
        const {
            attributes: {
                blockStyle,
                defaultBlockStyle,
                textLevel,
                typography,
                backgroundColor,
                backgroundDefaultColor,
                backgroundGradient,
                backgroundGradientDefault,
                opacity,
                boxShadow,
                border,
                size,
                margin,
                padding,
                typographyHover,
                backgroundColorHover,
                backgroundDefaultColorHover,
                backgroundGradientHover,
                backgroundGradientDefaultHover,
                opacityHover,
                boxShadowHover,
                borderHover,
                marginHover,
                paddingHover,
                hoverAnimation,
                hoverAnimationDuration,
                extraClassName,
                extraStyles,
            },
            setAttributes,
        } = this.props;

        const {
            selectorTypographyColors,
            selectorOpacityShadow,
            selectorPaddingMargin,
            selectorBorder,
        } = this.state;

        const getNormalHoverValue = (selector, normalValue, hoverValue) => {
            switch (selector) {
                case 'normal':
                    return normalValue;
                case 'hover':
                    return hoverValue;
            }
        }

        const normalHoverSaver = (selector, normalProp, hoverProp, value) => {
            switch (selector) {
                case 'normal':
                    setAttributes({ [normalProp]: value })
                    break;
                case 'hover':
                    setAttributes({ [hoverProp]: value })
                    break;
            }
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
                    />
                    <FontLevelControl
                        label={__('Level', 'gutenberg-extra')}
                        value={textLevel}
                        onChange={textLevel => setAttributes({ textLevel })}
                        fontOptions={typography} // It may need to send typographyHover too
                    />
                </PanelBody>
                <div className="block-button-extra">
                    <PanelBody
                        className={'gx-panel gx-color-setting gx-style-tab-setting'}
                    >
                        <AccordionControl
                            isPrimary
                            items={[
                                {
                                    label: __('Typography & Colors', 'gutenberg-extra'),
                                    classNameItem: "gx-typography-item",
                                    classNameHeading: "gx-typography-tab",
                                    content: (
                                        <Fragment>
                                            {/** Should alignment be under this section? */}
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="gx-buttonstyles-selector-control"
                                                selector={selectorTypographyColors}
                                                onChange={selectorTypographyColors => this.setState({ selectorTypographyColors })}
                                            />
                                            <TypographyControl
                                                fontOptions={
                                                    getNormalHoverValue(
                                                        selectorTypographyColors,
                                                        typography,
                                                        typographyHover
                                                    )
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selectorTypographyColors,
                                                        'typography',
                                                        'typographyHover',
                                                        value
                                                    )
                                                }
                                                target={
                                                    selectorTypographyColors != 'hover' ?
                                                        undefined :
                                                        ':hover'
                                                }
                                            />
                                            <ColorControl
                                                label={__('Background Colour', 'gutenberg-extra')}
                                                color={
                                                    getNormalHoverValue(
                                                        selectorTypographyColors,
                                                        backgroundColor,
                                                        backgroundColorHover
                                                    )
                                                }
                                                defaultcolor={
                                                    getNormalHoverValue(
                                                        selectorTypographyColors,
                                                        backgroundDefaultColor,
                                                        backgroundDefaultColorHover
                                                    )
                                                }
                                                onColorChange={value =>
                                                    normalHoverSaver(
                                                        selectorTypographyColors,
                                                        'backgroundColor',
                                                        'backgroundColorHover',
                                                        value
                                                    )
                                                }
                                                gradient={
                                                    getNormalHoverValue(
                                                        selectorTypographyColors,
                                                        backgroundGradient,
                                                        backgroundGradientHover
                                                    )
                                                }
                                                defaultGradient={
                                                    getNormalHoverValue(
                                                        selectorTypographyColors,
                                                        backgroundGradientDefault,
                                                        backgroundGradientDefaultHover
                                                    )
                                                }
                                                onGradientChange={value =>
                                                    normalHoverSaver(
                                                        selectorTypographyColors,
                                                        'backgroundGradient',
                                                        'backgroundGradientHover',
                                                        value
                                                    )
                                                }
                                                disableGradientOverBackground
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __('Opacity / Shadow', 'gutenberg-extra'),
                                    /** why gx-typography-tab if is Opacity/shadow settings? */
                                    classNameItem: "gx-box-settings-item",
                                    classNameHeading: "gx-typography-tab",
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="gx-buttonstyles-selector-control"
                                                selector={selectorOpacityShadow}
                                                onChange={selectorOpacityShadow => this.setState({ selectorOpacityShadow })}
                                            />
                                            <RangeControl
                                                label={__("Opacity", "gutenberg-extra")}
                                                className={"gx-opacity-control"}
                                                value={
                                                    getNormalHoverValue(
                                                        selectorOpacityShadow,
                                                        opacity,
                                                        opacityHover
                                                    ) * 100
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selectorOpacityShadow,
                                                        'opacity',
                                                        'opacityHover',
                                                        value / 100
                                                    )
                                                }
                                                min={0}
                                                max={100}
                                                allowReset={true}
                                                initialPosition={0}
                                            />
                                            <BoxShadowControl
                                                boxShadowOptions={
                                                    getNormalHoverValue(
                                                        selectorOpacityShadow,
                                                        boxShadow,
                                                        boxShadowHover
                                                    )
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selectorOpacityShadow,
                                                        'boxShadow',
                                                        'boxShadowHover',
                                                        value
                                                    )
                                                }
                                                target={
                                                    selectorOpacityShadow != 'hover' ?
                                                        undefined :
                                                        ':hover'
                                                }
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __("Border", "gutenberg-extra"),
                                    classNameItem: "gx-border-item",
                                    classNameHeading: 'gx-border-tab',
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="gx-buttonstyles-selector-control"
                                                selector={selectorBorder}
                                                onChange={selectorBorder => {
                                                    this.setState({ selectorBorder });
                                                }}
                                            />
                                            <BorderControl
                                                borderOptions={
                                                    getNormalHoverValue(
                                                        selectorBorder,
                                                        border,
                                                        borderHover
                                                    )
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selectorBorder,
                                                        'border',
                                                        'borderHover',
                                                        value
                                                    )
                                                }
                                                target={
                                                    selectorBorder != 'hover' ?
                                                        undefined :
                                                        ':hover'
                                                }
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __('Width / Height', 'gutenberg-extra'),
                                    /** why gx-typography-tab if its width/height? */
                                    classNameItem: "gx-width-height-item",
                                    classNameHeading: "gx-typography-tab",
                                    content: (
                                        <Fragment>
                                            <FullSizeControl
                                                sizeSettings={size}
                                                onChange={size => setAttributes({ size })}
                                                avoidZero
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __('Padding / Margin', 'gutenberg-extra'),
                                    /** why gx-typography-tab if its width/height? */
                                    classNameItem: "gx-padding-margin-item",
                                    classNameHeading: "gx-typography-tab",
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="gx-buttonstyles-selector-control"
                                                selector={selectorPaddingMargin}
                                                onChange={selectorPaddingMargin => {
                                                    this.setState({ selectorPaddingMargin });
                                                }}
                                            />
                                            <DimensionsControl
                                                value={
                                                    getNormalHoverValue(
                                                        selectorPaddingMargin,
                                                        padding,
                                                        paddingHover
                                                    )
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selectorPaddingMargin,
                                                        'padding',
                                                        'paddingHover',
                                                        value
                                                    )
                                                }
                                                target={
                                                    selectorPaddingMargin != 'hover' ?
                                                        undefined :
                                                        ':hover'
                                                }
                                                avoidZero
                                            />
                                            <DimensionsControl
                                                value={
                                                    getNormalHoverValue(
                                                        selectorPaddingMargin,
                                                        margin,
                                                        marginHover
                                                    )
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selectorPaddingMargin,
                                                        'margin',
                                                        'marginHover',
                                                        value
                                                    )
                                                }
                                                target={
                                                    selectorPaddingMargin != 'hover' ?
                                                        undefined :
                                                        ':hover'
                                                }
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
}

export default Inspector;