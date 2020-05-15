/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, Component } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    AlignmentControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    ColorControl,
    CustomCSSControl,
    DimensionsControl,
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
                isFirstOnHierarchy,
                blockStyle,
                defaultBlockStyle,
                alignment,
                backgroundColor,
                backgroundDefaultColor,
                backgroundGradient,
                backgroundGradientDefault,
                boxShadow,
                typography,
                border,
                size,
                margin,
                padding,
                opacity,
                backgroundColorHover,
                backgroundDefaultColorHover,
                backgroundGradientHover,
                backgroundGradientDefaultHover,
                boxShadowHover,
                typographyHover,
                borderHover,
                marginHover,
                paddingHover,
                opacityHover,
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
                    className="maxi-panel maxi-image-setting maxi-content-tab-setting"
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
                </PanelBody>
                <div className="button-maxi">
                    <PanelBody
                        className={'maxi-panel maxi-color-setting maxi-style-tab-setting'}
                    >
                        <AccordionControl
                            isPrimary
                            items={[
                                {
                                    label: __('Typography & Colors', 'maxi-blocks'),
                                    classNameItem: "maxi-typography-item",
                                    classNameHeading: "maxi-typography-tab",
                                    content: (
                                        <Fragment>
                                            {/** Should alignment be under this section? */}
                                            <AlignmentControl
                                                value={alignment}
                                                onChange={alignment => setAttributes({ alignment })}
                                                disableJustify
                                            />
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="maxi-buttonstyles-selector-control"
                                                selector={selectorTypographyColors}
                                                onChange={selectorTypographyColors => {
                                                    this.setState({ selectorTypographyColors });
                                                }}
                                            />
                                            <ColorControl
                                                label={__('Background Colour', 'maxi-blocks')}
                                                color={
                                                    getNormalHoverValue(
                                                        selectorTypographyColors,
                                                        backgroundColor,
                                                        backgroundColorHover)}
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
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __('Opacity / Shadow', 'maxi-blocks'),
                                    /** why maxi-typography-tab if is Opacity/shadow settings? */
                                    classNameItem: "maxi-box-settings-item",
                                    classNameHeading: "maxi-typography-tab",
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="maxi-buttonstyles-selector-control"
                                                selector={selectorOpacityShadow}
                                                onChange={selectorOpacityShadow => {
                                                    this.setState({ selectorOpacityShadow });
                                                }}
                                            />
                                            <RangeControl
                                                label={__("Opacity", "maxi-blocks")}
                                                className={"maxi-opacity-control"}
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
                                                    selectorBorder != 'hover' ?
                                                        `maxi-buttoneditor-button` :
                                                        `maxi-buttoneditor-button:hover`
                                                }
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __("Border", "maxi-blocks"),
                                    classNameItem: "maxi-border-item",
                                    classNameHeading: 'maxi-border-tab',
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="maxi-buttonstyles-selector-control"
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
                                                target={`maxi-buttoneditor-button`}
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __('Width / Height', 'maxi-blocks'),
                                    /** why maxi-typography-tab if its width/height? */
                                    classNameItem: "maxi-width-height-item",
                                    classNameHeading: "maxi-typography-tab",
                                    content: (
                                        <Fragment>
                                            <FullSizeControl
                                                sizeSettings={size}
                                                onChange={size => setAttributes({ size })}
                                                target={`maxi-buttoneditor-button`}
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __('Padding / Margin', 'maxi-blocks'),
                                    /** why maxi-typography-tab if its width/height? */
                                    classNameItem: "maxi-padding-margin-item",
                                    classNameHeading: "maxi-typography-tab",
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                /*not sure about vvv class => may should go on the component itself*/
                                                className="maxi-buttonstyles-selector-control"
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
                                                target={`maxi-buttoneditor-button`}
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
                                                target={`maxi-buttoneditor-button`}
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
            </InspectorControls >
        )
    }
}

export default Inspector;