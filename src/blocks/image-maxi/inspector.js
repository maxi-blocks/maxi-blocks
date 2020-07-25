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
    RadioControl,
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
    FullSizeControl,
    HoverAnimationControl,
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
    __experimentalClipPath,
    __experimentalMotionControl
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
            hoverAnimation,
            hoverAnimationType,
            hoverAnimationTypeText,
            hoverAnimationDuration,
            mediaID,
            extraClassName,
            zIndex,
            mediaALT,
            altSelector,
            breakpoints,
            hoverAnimationTitle,
            hoverAnimationContent,
            hoverOpacity,
            hoverBackground,
            hoverAnimationCustomBorder,
            hoverAnimationContentTypography,
            hoverAnimationTitleTypography,
            hoverCustomTextContent,
            hoverCustomTextTitle,
            hoverBorder,
            hoverPadding,
            hoverAnimationTypeOpacity,
            onChangeHoverAnimationTypeOpacity,
            hoverAnimationTypeColor,
            hoverAnimationTypeOpacityColor,
            onChangeHoverAnimationTypeOpacityColor,
            hoverAnimationTypeOpacityColorBackground,
            position,
            display,
            clipPath,
            motion
        },
        imageData,
        clientId,
        deviceType,
        setAttributes,
    } = props;

    const sizeValue = !isObject(size) ?
        JSON.parse(size) :
        size;
    const hoverAnimationCustomOptions = [
        { label: __('Yes', 'maxi-blocks'), value: 'yes' },
        { label: __('No', 'maxi-blocks'), value: 'no' },
    ]
    const hoverCustomTextOptions = [
        { label: __('Yes', 'maxi-blocks'), value: 'yes' },
        { label: __('No', 'maxi-blocks'), value: 'no' },
    ]

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
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacity}
                                                                        onChange={opacity => setAttributes({ opacity })}
                                                                        breakpoint={deviceType}
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
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacityHover}
                                                                        onChange={opacityHover => setAttributes({ opacityHover })}
                                                                        breakpoint={deviceType}
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
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={borderHover}
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
                                                        onChange={padding => setAttributes({ padding })}
                                                        breakpoint={deviceType}
                                                        disableAuto
                                                    />
                                                    <__experimentalAxisControl
                                                        values={margin}
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
                                            <HoverAnimationControl
                                                hoverAnimation={hoverAnimation}
                                                onChangeHoverAnimation={hoverAnimation => setAttributes({ hoverAnimation })}

                                                hoverAnimationType={hoverAnimationType}
                                                onChangeHoverAnimationType={hoverAnimationType => setAttributes({ hoverAnimationType })}

                                                hoverAnimationTypeText={hoverAnimationTypeText}
                                                onChangeHoverAnimationTypeText={hoverAnimationTypeText => setAttributes({ hoverAnimationTypeText })}

                                                hoverAnimationDuration={hoverAnimationDuration}
                                                onChangeHoverAnimationDuration={hoverAnimationDuration => setAttributes({ hoverAnimationDuration })}

                                                hoverAnimationTitle={hoverAnimationTitle}
                                                onChangeHoverAnimationTitle={hoverAnimationTitle => setAttributes({ hoverAnimationTitle })}
                                                hoverAnimationContent={hoverAnimationContent}
                                                onChangeHoverAnimationContent={hoverAnimationContent => setAttributes({ hoverAnimationContent })}

                                                hoverCustomTextContent={hoverCustomTextContent}
                                                onChangeHoverAnimationCustomContent={hoverCustomTextContent => setAttributes({ hoverCustomTextContent })}

                                                hoverCustomTextTitle={hoverCustomTextTitle}
                                                onChangeHoverAnimationCustomTitle={hoverCustomTextTitle => setAttributes({ hoverCustomTextTitle })}

                                                hoverAnimationTypeOpacity={hoverAnimationTypeOpacity}
                                                onChangeHoverAnimationTypeOpacity={hoverAnimationTypeOpacity => setAttributes({ hoverAnimationTypeOpacity })}

                                                hoverAnimationTypeOpacityColor={hoverAnimationTypeOpacityColor}
                                                onChangeHoverAnimationTypeOpacityColor={hoverAnimationTypeOpacityColor => setAttributes({ hoverAnimationTypeOpacityColor })}

                                            />
                                            {
                                                hoverAnimation === 'text' && hoverCustomTextTitle === 'yes' &&
                                                <TypographyControl
                                                    fontOptions={hoverAnimationTitleTypography}
                                                    onChange={hoverAnimationTitleTypography => setAttributes({ hoverAnimationTitleTypography })}
                                                    target='>.maxi-block-text-hover .maxi-block-text-hover__title'
                                                />}
                                            {
                                                hoverAnimation === 'text' && hoverCustomTextContent === 'yes' &&
                                                <TypographyControl
                                                    fontOptions={hoverAnimationContentTypography}
                                                    onChange={hoverAnimationContentTypography => setAttributes({ hoverAnimationContentTypography })}
                                                    target='>.maxi-block-text-hover .maxi-block-text-hover__content'
                                                />}
                                            {
                                                hoverAnimation === 'text' &&
                                                <Fragment>
                                                    <__experimentalOpacityControl
                                                        opacity={hoverOpacity}
                                                        onChange={hoverOpacity => setAttributes({ hoverOpacity })}
                                                    />
                                                    <BackgroundControl
                                                        backgroundOptions={hoverBackground}
                                                        onChange={hoverBackground => setAttributes({ hoverBackground })}
                                                        disableImage
                                                        target='.maxi-block-text-hover'
                                                    />

                                                    <RadioControl
                                                        label={__('Custom Border', 'maxi-blocks')}
                                                        className={'maxi-hover-animation-custom-border'}
                                                        selected={hoverAnimationCustomBorder}
                                                        options={hoverAnimationCustomOptions}
                                                        onChange={hoverAnimationCustomBorder => setAttributes({ hoverAnimationCustomBorder })}
                                                    />
                                                </Fragment>
                                            }
                                            {
                                                hoverAnimationCustomBorder === 'yes' && hoverAnimation === 'text' &&
                                                <BorderControl
                                                    border={hoverBorder}
                                                    onChange={hoverBorder => setAttributes({ hoverBorder })}
                                                    breakpoint={deviceType}
                                                />
                                            }
                                            {
                                                hoverAnimation === 'text' &&
                                                <Fragment>
                                                    <__experimentalAxisControl
                                                        values={hoverPadding}
                                                        onChange={hoverPadding => setAttributes({ hoverPadding })}
                                                        disableAuto
                                                    />
                                                </Fragment>
                                            }
                                            {
                                                hoverAnimationType === 'opacity-with-colour' &&
                                                <BackgroundControl
                                                    backgroundOptions={hoverAnimationTypeOpacityColorBackground}
                                                    onChange={hoverAnimationTypeOpacityColorBackground => setAttributes({ hoverAnimationTypeOpacityColorBackground })}
                                                    disableImage
                                                />
                                            }
                                        </Fragment>
                                    }
                                    <__experimentalZIndexControl
                                        zindex={zIndex}
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
                                            onChange={breakpoints => setAttributes({ breakpoints })}
                                            breakpoint={deviceType}
                                        />
                                    }
                                    <__experimentalPositionControl
                                        position={position}
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