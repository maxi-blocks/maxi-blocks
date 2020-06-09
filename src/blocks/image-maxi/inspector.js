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
    CustomCSSControl,
    DimensionsControl,
    HoverAnimationControl,
    ImageCropControl,
    SettingTabsControl,
    TypographyControl
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
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
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
            extraClassName,
            extraStyles,
            mediaID,
        },
        imageData,
        clientId,
        setAttributes,
    } = props;

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
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Desktop', 'maxi-blocks'),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={alignmentDesktop}
                                                                    onChange={alignmentDesktop => setAttributes({ alignmentDesktop })}
                                                                    disableJustify
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Tablet', 'maxi-blocks'),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={alignmentTablet}
                                                                    onChange={alignmentTablet => setAttributes({ alignmentTablet })}
                                                                    disableJustify
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Mobile', 'maxi-blocks'),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={alignmentMobile}
                                                                    onChange={alignmentMobile => setAttributes({ alignmentMobile })}
                                                                    disableJustify
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
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
                                                    <SelectControl
                                                        label={__('Fullwidth', 'maxi-blocks')}
                                                        value={fullWidth}
                                                        options={[
                                                            { label: __('No', 'maxi-blocks'), value: 'normal' },
                                                            { label: __('Yes', 'maxi-blocks'), value: 'full' }
                                                        ]}
                                                        onChange={fullWidth => setAttributes({ fullWidth })}
                                                    />
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
                                                                    borderOptions={border}
                                                                    onChange={border => setAttributes({ border })}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    borderOptions={borderHover}
                                                                    onChange={borderHover => setAttributes({ borderHover })}
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
                                                                    boxShadowOptions={boxShadow}
                                                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadowOptions={boxShadowHover}
                                                                    onChange={boxShadowHover => setAttributes({ boxShadowHover })}
                                                                    target=':hover'
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
                                                    <DimensionsControl
                                                        value={padding}
                                                        onChange={padding => setAttributes({ padding })}
                                                    />
                                                    <DimensionsControl
                                                        value={margin}
                                                        onChange={margin => setAttributes({ margin })}
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