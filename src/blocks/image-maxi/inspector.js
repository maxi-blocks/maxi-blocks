/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const {
    Fragment,
    Component
} = wp.element;
const {
    RangeControl,
    SelectControl,
    TextareaControl
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
    HoverAnimationControl,
    ImageCropControl,
    NormalHoverControl,
    SettingTabsControl,
    SizeControl,
    TypographyControl
} from '../../components';

/**
 * External dependencies
 */
import {
    capitalize,
    isEmpty,
} from 'lodash';

/**
 * Inspector
 */
class Inspector extends Component {

    target = this.props.attributes.uniqueID;

    state = {
        selector: 'normal',
        boxShadowSelector: 'normal',
    }

    render() {
        const {
            attributes: {
                isFirstOnHierarchy,
                blockStyle,
                defaultBlockStyle,
                size,
                cropOptions,
                alignment,
                captionType,
                captionContent,
                captionTypography,
                maxWidthUnit,
                maxWidth,
                widthUnit,
                width,
                backgroundColor,
                backgroundDefaultColor,
                backgroundGradient,
                backgroundGradientDefault,
                opacity,
                boxShadow,
                border,
                padding,
                margin,
                backgroundColorHover,
                backgroundDefaultColorHover,
                backgroundGradientHover,
                backgroundGradientDefaultHover,
                opacityHover,
                boxShadowHover,
                hoverAnimation,
                hoverAnimationDuration,
                extraClassName,
                extraStyles,
                mediaID,
            },
            imageData,
            setAttributes,
        } = this.props;

        const {
            selector,
            boxShadowSelector,
        } = this.state;

        const getSizeOptions = () => {
            let response = [];
            if (imageData) {
                let sizes = imageData.media_details.sizes;
                sizes = Object.entries(sizes).sort((a, b) => {
                    return a[1].width - b[1].width;
                })
                sizes.map(size => {
                    const name = capitalize(size[0]);
                    const val = size[1];
                    response.push({
                        label: `${name} - ${val.width}x${val.height}`,
                        value: size[0]
                    })
                })
            }
            response.push({
                label: 'Custom', value: 'custom'
            });
            return response;
        }

        const getCaptionOptions = () => {
            let response = [
                { label: 'None', value: 'none' },
                { label: 'Custom Caption', value: 'custom' },
            ];
            if (imageData && !isEmpty(imageData.caption.rendered)) {
                const newCaption = { label: 'Attachment Caption', value: 'attachment' };
                response.splice(1, 0, newCaption)
            }
            return response;
        }

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
                                        isSecondary
                                        items={[
                                            {
                                                label: __('Alignment', 'maxi-blocks'),
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
                                                label: __('Sizing', 'maxi-blocks'),
                                                content: (
                                                    <Fragment>
                                                        <SelectControl
                                                            label={__('Image Size', 'maxi-blocks')}
                                                            value={size || size == 'custom' ? size : 'full'} // is still necessary?
                                                            options={getSizeOptions()}
                                                            onChange={size => setAttributes({ size })}
                                                        />
                                                        {
                                                            size === 'custom' &&
                                                            <ImageCropControl
                                                                mediaID={mediaID}
                                                                cropOptions={JSON.parse(cropOptions)}
                                                                onChange={cropOptions => setAttributes({ cropOptions: JSON.stringify(cropOptions) })}
                                                            />
                                                        }
                                                        <SizeControl
                                                            label={__('Width', 'maxi-blocks')}
                                                            unit={widthUnit}
                                                            onChangeUnit={widthUnit => setAttributes({ widthUnit })}
                                                            value={width}
                                                            onChangeValue={width => setAttributes({ width })}
                                                        />
                                                        <SizeControl
                                                            label={__('Max Width', 'maxi-blocks')}
                                                            unit={maxWidthUnit}
                                                            onChangeUnit={maxWidthUnit => setAttributes({ maxWidthUnit })}
                                                            value={maxWidth}
                                                            onChangeValue={maxWidth => setAttributes({ maxWidth })}
                                                        />
                                                    </Fragment>
                                                )
                                            },
                                            {
                                                label: __('Caption', 'maxi-blocks'),
                                                content: (
                                                    <Fragment>
                                                        <SelectControl
                                                            value={captionType}
                                                            options={getCaptionOptions()}
                                                            onChange={captionType => {
                                                                setAttributes({ captionType });
                                                                if (imageData && captionType === 'attachment')
                                                                    setAttributes({ captionContent: imageData.caption.raw })
                                                            }}
                                                        />
                                                        {
                                                            captionType === 'custom' &&
                                                            <TextareaControl
                                                                className='custom-caption'
                                                                placeHolder={__('Add you Custom Caption here', 'maxi-blocks')}
                                                                value={captionContent}
                                                                onChange={captionContent => setAttributes({ captionContent })}
                                                            />
                                                        }
                                                        {
                                                            captionType != 'none' &&
                                                            <TypographyControl
                                                                fontOptions={captionTypography}
                                                                onChange={captionTypography => setAttributes({ captionTypography })}
                                                                target='>figcaption'
                                                            />
                                                        }
                                                    </Fragment>
                                                )
                                            },
                                            {
                                                label: __('Background', 'maxi-blocks'),
                                                content: (
                                                    <Fragment>
                                                        <NormalHoverControl
                                                            selector={selector}
                                                            onChange={selector => {
                                                                this.setState({ selector });
                                                            }}
                                                        />
                                                        <ColorControl
                                                            label={__('Background Colour', 'maxi-blocks')}
                                                            color={
                                                                getNormalHoverValue(
                                                                    selector,
                                                                    backgroundColor,
                                                                    backgroundColorHover
                                                                )
                                                            }
                                                            defaultcolor={
                                                                getNormalHoverValue(
                                                                    selector,
                                                                    backgroundDefaultColor,
                                                                    backgroundDefaultColorHover
                                                                )
                                                            }
                                                            onColorChange={value =>
                                                                normalHoverSaver(
                                                                    selector,
                                                                    'backgroundColor',
                                                                    'backgroundColorHover',
                                                                    value
                                                                )
                                                            }
                                                            gradient={
                                                                getNormalHoverValue(
                                                                    selector,
                                                                    backgroundGradient,
                                                                    backgroundGradientHover
                                                                )
                                                            }
                                                            defaultGradient={
                                                                getNormalHoverValue(
                                                                    selector,
                                                                    backgroundGradientDefault,
                                                                    backgroundGradientDefaultHover
                                                                )
                                                            }
                                                            onGradientChange={value =>
                                                                normalHoverSaver(
                                                                    selector,
                                                                    'background',
                                                                    'backgroundHover',
                                                                    value
                                                                )
                                                            }
                                                            disableGradientOverBackground
                                                        />
                                                        <RangeControl
                                                            label={__('Opacity', 'maxi-blocks')}
                                                            className='maxi-opacity-control'
                                                            value={
                                                                getNormalHoverValue(
                                                                    selector,
                                                                    opacity,
                                                                    opacityHover
                                                                ) * 100
                                                            }
                                                            onChange={value =>
                                                                normalHoverSaver(
                                                                    selector,
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
                                                    </Fragment>
                                                )
                                            },
                                            {
                                                label: __('Border', 'maxi-blocks'),
                                                content: (
                                                    <BorderControl
                                                        borderOptions={border}
                                                        onChange={border => setAttributes({ border })}
                                                    />
                                                )
                                            },
                                            {
                                                label: __('Box Shadow', 'maxi-blocks'),
                                                content: (
                                                    <Fragment>
                                                        <NormalHoverControl
                                                            selector={boxShadowSelector}
                                                            onChange={boxShadowSelector => {
                                                                this.setState({ boxShadowSelector });
                                                            }}
                                                        />
                                                        <BoxShadowControl
                                                            boxShadowOptions={
                                                                getNormalHoverValue(
                                                                    boxShadowSelector,
                                                                    boxShadow,
                                                                    boxShadowHover
                                                                )
                                                            }
                                                            onChange={value =>
                                                                normalHoverSaver(
                                                                    boxShadowSelector,
                                                                    'boxShadow',
                                                                    'boxShadowHover',
                                                                    value
                                                                )
                                                            }
                                                            target={
                                                                boxShadowSelector != 'hover' ?
                                                                    undefined :
                                                                    ':hover'
                                                            }
                                                        />
                                                    </Fragment>
                                                )
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
}

export default Inspector;