/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    RangeControl,
    SelectControl,
    TextareaControl,
    TextControl,
} = wp.components;

/**
 * Internal dependencies
 */
import { getDefaultProp } from '../../utils'
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    FullSizeControl,
    ImageCropControl,
    SettingTabsControl,
    TypographyControl,
    __experimentalResponsiveSelector,
    __experimentalZIndexControl,
    __experimentalAxisControl,
    __experimentalResponsiveControl,
    __experimentalOpacityControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
    __experimentalMotionControl,
    __experimentalTransformControl,
    __experimentalClipPath,
    __experimentalEntranceAnimationControl,
    __experimentalHoverEffectControl,
} from '../../components';

/**
 * External dependencies
 */
import {
    capitalize,
    isEmpty,
    isNil,
    isObject
} from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            uniqueID,
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            imageSize,
            cropOptions,
            fullWidth,
            alignment,
            captionType,
            captionContent,
            captionTypography,
            background,
            opacity,
            boxShadow,
            border,
            size,
            padding,
            margin,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
            mediaID,
            extraClassName,
            zIndex,
            mediaALT,
            altSelector,
            breakpoints,
            position,
            display,
            motion,
            transform,
            clipPath,
            hover,
        },
        imageData,
        clientId,
        deviceType,
        setAttributes,
    } = props;

    const sizeValue = !isObject(size) ?
        JSON.parse(size) :
        size;

    const altSelectorOptions = [
        { label: __('WordPress ALT', 'maxi-blocks'), value: 'wordpress' },
        { label: __('Image Title', 'maxi-blocks'), value: 'title' },
        { label: __('Custom', 'maxi-blocks'), value: 'custom' },
        { label: __('None', 'maxi-blocks'), value: 'none' },
    ]

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
            <__experimentalResponsiveSelector />
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
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        function () {
                                            if (deviceType === 'general') {
                                                return {
                                                    label: __('Width / Height', 'maxi-blocks'),
                                                    content: (
                                                        <Fragment>
                                                            <SelectControl
                                                                label={__('Image Size', 'maxi-blocks')}
                                                                value={imageSize || imageSize == 'custom' ? imageSize : 'full'} // is still necessary?
                                                                options={getSizeOptions()}
                                                                onChange={imageSize => setAttributes({ imageSize })}
                                                            />
                                                            {
                                                                imageSize === 'custom' &&
                                                                <ImageCropControl
                                                                    mediaID={mediaID}
                                                                    cropOptions={JSON.parse(cropOptions)}
                                                                    onChange={cropOptions => setAttributes({ cropOptions: JSON.stringify(cropOptions) })}
                                                                />
                                                            }
                                                            <RangeControl
                                                                label={__('Width', 'maxi-blocks')}
                                                                value={sizeValue.general.width}
                                                                onChange={val => {
                                                                    if (isNil(val)) {
                                                                        const defaultSize = getDefaultProp(clientId, 'size');
                                                                        sizeValue.general.width = defaultSize.general.width;
                                                                    }
                                                                    else {
                                                                        sizeValue.general.width = val;
                                                                    }
                                                                    setAttributes({ size: JSON.stringify(sizeValue) })
                                                                }}
                                                                allowReset
                                                            />
                                                        </Fragment>
                                                    )
                                                }
                                            }
                                        }(),
                                        function () {
                                            if (deviceType === 'general') {
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
                                                                    typography={captionTypography}
                                                                    onChange={captionTypography => setAttributes({ captionTypography })}
                                                                    breakpoint={deviceType}
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
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacity}
                                                                        defaultOpacity={getDefaultProp(clientId, 'opacity')}
                                                                        onChange={opacity => setAttributes({ opacity })}
                                                                        breakpoint={deviceType}
                                                                    />
                                                                    <BackgroundControl
                                                                        background={background}
                                                                        defaultBackground={getDefaultProp(clientId, 'background')}
                                                                        onChange={background => setAttributes({ background })}
                                                                        disableImage
                                                                        disableVideo
                                                                        disableGradient
                                                                    />
                                                                </Fragment>
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <Fragment>
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacityHover}
                                                                        defaultOpacity={getDefaultProp(clientId, 'opacityHover')}
                                                                        onChange={opacityHover => setAttributes({ opacityHover })}
                                                                        breakpoint={deviceType}
                                                                    />
                                                                    <BackgroundControl
                                                                        background={backgroundHover}
                                                                        defaultBackground={getDefaultProp(clientId, 'backgroundHover')}
                                                                        onChange={backgroundHover => setAttributes({ backgroundHover })}
                                                                        disableImage
                                                                        disableVideo
                                                                        disableGradient
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
                                                                    defaultBorder={getDefaultProp(clientId, 'border')}
                                                                    onChange={border => setAttributes({ border })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={borderHover}
                                                                    defaultBorder={getDefaultProp(clientId, 'borderHover')}
                                                                    onChange={borderHover => setAttributes({ borderHover })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Width / Height', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
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
                                                    <FullSizeControl
                                                        size={size}
                                                        defaultSize={getDefaultProp(clientId, 'size')}
                                                        onChange={size => setAttributes({ size })}
                                                        breakpoint={deviceType}
                                                        hideWidth
                                                    />
                                                </Fragment>
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
                                                                    defaultBoxShadow={getDefaultProp(clientId, 'boxShadow')}
                                                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadowHover}
                                                                    defaultBoxShadow={getDefaultProp(clientId, 'boxShadowHover')}
                                                                    onChange={boxShadowHover => setAttributes({ boxShadowHover })}
                                                                    breakpoint={deviceType}
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
                                                    <__experimentalAxisControl
                                                        values={padding}
                                                        defaultValues={getDefaultProp(clientId, 'padding')}
                                                        onChange={padding => setAttributes({ padding })}
                                                        breakpoint={deviceType}
                                                        disableAuto
                                                    />
                                                    <__experimentalAxisControl
                                                        values={margin}
                                                        defaultValues={getDefaultProp(clientId, 'margin')}
                                                        onChange={margin => setAttributes({ margin })}
                                                        breakpoint={deviceType}
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
                            <Fragment>
                                <div className='maxi-tab-content__box'>
                                    {
                                        deviceType === 'general' &&
                                        <Fragment>
                                            <TextControl
                                                label={__('Additional CSS Classes', 'maxi-blocks')}
                                                className='maxi-additional__css-classes'
                                                value={extraClassName}
                                                onChange={extraClassName => setAttributes({ extraClassName })}
                                            />
                                        </Fragment>
                                    }
                                    <__experimentalZIndexControl
                                        zIndex={zIndex}
                                        defaultZIndex={getDefaultProp(clientId, 'zIndex')}
                                        onChange={zIndex => setAttributes({ zIndex })}
                                        breakpoint={deviceType}
                                    />
                                    <SelectControl
                                        label={__('Image ALT Tag', 'maxi-blocks')}
                                        value={altSelector}
                                        options={altSelectorOptions}
                                        onChange={altSelector => {
                                            setAttributes({ altSelector });
                                        }}
                                    />
                                    {
                                        altSelector == 'custom' &&
                                        <TextControl
                                            placeHolder={__('Add Your ALT Tag Here', 'maxi-blocks')}
                                            className='maxi-image__alt'
                                            value={mediaALT}
                                            onChange={mediaALT => setAttributes({ mediaALT })}
                                        />
                                    }
                                    {
                                        deviceType != 'general' &&
                                        <__experimentalResponsiveControl
                                            breakpoints={breakpoints}
                                            defaultBreakpoints={getDefaultProp(clientId, 'breakpoints')}
                                            onChange={breakpoints => setAttributes({ breakpoints })}
                                            breakpoint={deviceType}
                                        />
                                    }
                                    <__experimentalPositionControl
                                        position={position}
                                        defaultPosition={getDefaultProp(clientId, 'position')}
                                        onChange={position => setAttributes({ position })}
                                        breakpoint={deviceType}
                                    />
                                    <__experimentalDisplayControl
                                        display={display}
                                        onChange={display => setAttributes({ display })}
                                        breakpoint={deviceType}
                                        defaultDisplay='flex'
                                    />
                                    <__experimentalClipPath
                                        clipPath={clipPath}
                                        onChange={clipPath => setAttributes({ clipPath })}
                                    />
                                </div>
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Motion Effects', 'maxi-blocks'),
                                            content: (
                                                <__experimentalMotionControl
                                                    motionOptions={motion}
                                                    onChange={motion => setAttributes({ motion })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Hover Effects', 'maxi-blocks'),
                                            content: (
                                                <__experimentalHoverEffectControl
                                                    hover={hover}
                                                    defaultHover={getDefaultProp(clientId, 'hover')}
                                                    onChange={hover => setAttributes({ hover })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Entrance Animation', 'maxi-blocks'),
                                            content: (
                                                <__experimentalEntranceAnimationControl
                                                    motionOptions={motion}
                                                    defaultMotionOptions={getDefaultProp(clientId, 'motion')}
                                                    onChange={motion => setAttributes({ motion })}
                                                />
                                            )
                                        },
                                        {
                                            label: __('Transform', 'maxi-blocks'),
                                            content: (
                                                <__experimentalTransformControl
                                                    transform={transform}
                                                    onChange={transform => setAttributes({ transform })}
                                                    uniqueID={uniqueID}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        }
                                    ]}
                                />
                            </Fragment>
                        )
                    }
                ]}
            />
        </InspectorControls >
    )
}

export default Inspector;