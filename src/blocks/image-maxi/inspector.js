/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const {
    Fragment,
    useState
} = wp.element;
const {
    RangeControl,
    SelectControl,
    TextareaControl,
    TextControl
} = wp.components;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../extensions/styles/utils'
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    HoverAnimationControl,
    ImageCropControl,
    SettingTabsControl,
    TypographyControl,
    __experimentalResponsiveSelector,
    __experimentalZIndexControl,
    __experimentalMarginPaddingControl,
    __experimentalResponsiveControl
} from '../../components';

/**
 * External dependencies
 */
import {
    capitalize,
    isEmpty,
    isNil
} from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            size,
            cropOptions,
            fullWidth,
            alignment,
            captionType,
            captionContent,
            captionTypography,
            width,
            background,
            opacity,
            boxShadow,
            border,
            padding,
            margin,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
            hoverAnimation,
            hoverAnimationDuration,
            mediaID,
            extraClassName,
            zIndex,
            breakpoints
        },
        imageData,
        clientId,
        setAttributes,
    } = props;

    const [breakpoint, setBreakpoint] = useState('general')

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

    return (
        <InspectorControls>
            <__experimentalResponsiveSelector
                selected={breakpoint}
                onChange={breakpoint => setBreakpoint(breakpoint)}
            />
            <SettingTabsControl
                disablePadding
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
                                                <AlignmentControl
                                                    alignment={alignment}
                                                    onChange={alignment => setAttributes({ alignment })}
                                                    disableJustify
                                                    breakpoint={breakpoint}
                                                />
                                            )
                                        },
                                        function () {
                                            if (breakpoint === 'general') {
                                                return {
                                                    label: __('Width / Height', 'maxi-blocks'),
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
                                                            {
                                                                isFirstOnHierarchy &&
                                                                <SelectControl
                                                                    label={__('Full Width', 'maxi-blocks')}
                                                                    value={fullWidth}
                                                                    options={[
                                                                        { label: __('No', 'maxi-blocks'), value: 'normal' },
                                                                        { label: __('Yes', 'maxi-blocks'), value: 'full' }
                                                                    ]}
                                                                    onChange={fullWidth => setAttributes({ fullWidth })}
                                                                />
                                                            }
                                                            <RangeControl
                                                                label={__('Width', 'maxi-blocks')}
                                                                value={width}
                                                                onChange={width => {
                                                                    if (isNil(width))
                                                                        setAttributes({ width: getDefaultProp(clientId, 'width') })
                                                                    else
                                                                        setAttributes({ width })
                                                                }}
                                                                allowReset
                                                            />
                                                        </Fragment>
                                                    )
                                                }
                                            }
                                        }(),
                                        function () {
                                            if (breakpoint === 'general') {
                                                return {
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
                                                }
                                            }
                                        }(),
                                        {
                                            label: __('Background', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <Fragment>
                                                                    <RangeControl
                                                                        label={__('Opacity', 'maxi-blocks')}
                                                                        className='maxi-opacity-control'
                                                                        value={opacity * 100}
                                                                        onChange={value => setAttributes({ opacity: value / 100 })}
                                                                        min={0}
                                                                        max={100}
                                                                        allowReset={true}
                                                                        initialPosition={0}
                                                                    />
                                                                    <BackgroundControl
                                                                        backgroundOptions={background}
                                                                        onChange={background => setAttributes({ background })}
                                                                        disableImage
                                                                    />
                                                                </Fragment>
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <Fragment>
                                                                    <RangeControl
                                                                        label={__('Opacity', 'maxi-blocks')}
                                                                        className='maxi-opacity-control'
                                                                        value={opacityHover * 100}
                                                                        onChange={value => setAttributes({ opacityHover: value / 100 })}
                                                                        min={0}
                                                                        max={100}
                                                                        allowReset={true}
                                                                        initialPosition={0}
                                                                    />
                                                                    <BackgroundControl
                                                                        backgroundOptions={backgroundHover}
                                                                        onChange={backgroundHover => setAttributes({ backgroundHover })}
                                                                        disableImage
                                                                    />
                                                                </Fragment>
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Border', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={border}
                                                                    onChange={border => setAttributes({ border })}
                                                                    breakpoint={breakpoint}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={borderHover}
                                                                    onChange={borderHover => setAttributes({ borderHover })}
                                                                    breakpoint={breakpoint}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Box Shadow', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadow}
                                                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                                                    breakpoint={breakpoint}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadowHover}
                                                                    onChange={boxShadowHover => setAttributes({ boxShadowHover })}
                                                                    breakpoint={breakpoint}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Padding / Margin', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <__experimentalMarginPaddingControl
                                                        value={padding}
                                                        onChange={padding => setAttributes({ padding })}
                                                        breakpoint={breakpoint}
                                                    />
                                                    <__experimentalMarginPaddingControl
                                                        value={margin}
                                                        onChange={margin => setAttributes({ margin })}
                                                        breakpoint={breakpoint}
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
                                {
                                    breakpoint === 'general' &&
                                    <Fragment>
                                        <HoverAnimationControl
                                            hoverAnimation={hoverAnimation}
                                            onChangeHoverAnimation={hoverAnimation => setAttributes({ hoverAnimation })}
                                            hoverAnimationDuration={hoverAnimationDuration}
                                            onChangeHoverAnimationDuration={hoverAnimationDuration => setAttributes({ hoverAnimationDuration })}
                                        />
                                        <TextControl
                                            label={__('Additional CSS Classes', 'maxi-blocks')}
                                            className='maxi-additional__css-classes'
                                            value={extraClassName}
                                            onChange={extraClassName => setAttributes({ extraClassName })}
                                        />
                                    </Fragment>
                                }
                                <__experimentalZIndexControl
                                    zindex={zIndex}
                                    onChange={zIndex => setAttributes({ zIndex })}
                                    breakpoint={breakpoint}
                                />
                                {
                                    breakpoint != 'general' &&
                                    <__experimentalResponsiveControl
                                        breakpoints={breakpoints}
                                        onChange={breakpoints => setAttributes({ breakpoints })}
                                        breakpoint={breakpoint}
                                    />
                                }
                            </div>
                        )
                    }
                ]}
            />
        </InspectorControls >
    )
}

export default Inspector;