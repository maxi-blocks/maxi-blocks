/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, Component } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    RangeControl,
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    CustomCSSControl,
    DimensionsControl,
    FullSizeControl,
    HoverAnimationControl,
    NormalHoverControl,
    SettingTabsControl,
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
                background,
                boxShadow,
                typography,
                border,
                size,
                margin,
                padding,
                opacity,
                backgroundHover,
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
                                        isPrimary
                                        items={[
                                            {
                                                label: __("Alignment", "maxi-blocks"),
                                                content: (
                                                    <Fragment>
                                                        <AlignmentControl
                                                            value={alignment}
                                                            onChange={alignment => setAttributes({ alignment })}
                                                        />
                                                    </Fragment>
                                                )
                                            },
                                            {
                                                label: __('Typography & Colors', 'maxi-blocks'),
                                                content: (
                                                    <Fragment>
                                                        <NormalHoverControl
                                                            selector={selectorTypographyColors}
                                                            onChange={selectorTypographyColors => {
                                                                this.setState({ selectorTypographyColors });
                                                            }}
                                                        />
                                                        <BackgroundControl
                                                            backgroundOptions={
                                                                getNormalHoverValue(
                                                                    selectorTypographyColors,
                                                                    background,
                                                                    backgroundHover
                                                                )
                                                            }
                                                            onChange={value =>
                                                                normalHoverSaver(
                                                                    selectorTypographyColors,
                                                                    'background',
                                                                    'backgroundHover',
                                                                    value
                                                                )
                                                            }
                                                            disableImage
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
                                                content: (
                                                    <Fragment>
                                                        <NormalHoverControl
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
                                                content: (
                                                    <Fragment>
                                                        <NormalHoverControl
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
                                                content: (
                                                    <Fragment>
                                                        <NormalHoverControl
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
}

export default Inspector;