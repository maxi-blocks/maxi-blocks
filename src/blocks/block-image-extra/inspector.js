/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment, Component } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
    SelectControl,
    TextControl
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

        const { selector } = this.state;

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
                                    label: __("Image", "gutenberg-extra"),
                                    classNameItem: 'gx-image-item"',
                                    classNameHeading: "gx-image-tab",
                                    content: (
                                        <Fragment>
                                            <SelectControl
                                                label={__('Image Size', 'gutenberg-extra')}
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
                                            <AlignmentControl
                                                value={alignment}
                                                onChange={alignment => setAttributes({ alignment })}
                                                disableJustify
                                            />
                                            <SelectControl
                                                label={__('Caption', 'gutenberg-extra')}
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
                                                <TextControl
                                                    label={__('Custom Caption', 'gutenberg-extra')}
                                                    className="custom-caption"
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
                                            <SizeControl
                                                label={__('Max Width', 'gutenberg-extra')}
                                                unit={maxWidthUnit}
                                                onChangeUnit={maxWidthUnit => setAttributes({ maxWidthUnit })}
                                                value={maxWidth}
                                                onChangeValue={maxWidth => setAttributes({ maxWidth })}
                                            />
                                            <SizeControl
                                                label={__('Width', 'gutenberg-extra')}
                                                unit={widthUnit}
                                                onChangeUnit={widthUnit => setAttributes({ widthUnit })}
                                                value={width}
                                                onChangeValue={width => setAttributes({ width })}
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __("Background", "gutenberg-extra"),
                                    classNameItem: 'gx-background-item',
                                    classNameHeading: "gx-background-tab",
                                    content: (
                                        <Fragment>
                                            <NormalHoverControl
                                                selector={selector}
                                                onChange={selector => {
                                                    this.setState({ selector });
                                                }}
                                            />
                                            <ColorControl
                                                label={__('Background Colour', 'gutenberg-extra')}
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
                                                label={__("Opacity", "gutenberg-extra")}
                                                className={"gx-opacity-control"}
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
                                            <BoxShadowControl
                                                boxShadowOptions={
                                                    getNormalHoverValue(
                                                        selector,
                                                        boxShadow,
                                                        boxShadowHover
                                                    )
                                                }
                                                onChange={value =>
                                                    normalHoverSaver(
                                                        selector,
                                                        'boxShadow',
                                                        'boxShadowHover',
                                                        value
                                                    )
                                                }
                                                target={
                                                    selector != 'hover' ?
                                                        undefined :
                                                        ':hover'
                                                }
                                            />
                                        </Fragment>
                                    )
                                },
                                {
                                    label: __("Border", "gutenberg-extra"),
                                    classNameItem: 'gx-border-item',
                                    classNameHeading: "gx-border-tab",
                                    content: (
                                        <BorderControl
                                            borderOptions={border}
                                            onChange={border => setAttributes({ border })}
                                        />
                                    )
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
}

export default Inspector;