/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    BaseControl,
    RangeControl,
    SelectControl,
    RadioControl,
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    BackgroundControl,
    BlockStylesControl,
    BorderControl,
    BoxShadowControl,
    DimensionsControl,
    CustomCSSControl,
    FullSizeControl,
    SizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    TypographyControl,
    __experimentalShapeDividerControl ,
    __experimentalZIndexControl
} from '../../components';

/**
 * External dependencies
 */
import { isNumber } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            containerXl,
            maxWidthXl,
            containerLg,
            maxWidthLg,
            containerMd,
            maxWidthMd,
            containerSm,
            maxWidthSm,
            containerPadding,
            fullWidth,
            size,
            opacity,
            opacityHover,
            background,
            backgroundHover,
            border,
            borderHover,
            boxShadow,
            boxShadowHover,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            hoverAnimationType,
            hoverAnimationTypeText,
            zIndex,
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
            shapeDivider,
        },
        setAttributes,
    } = props;

    const hoverAnimationCustomOptions = [
            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
            { label: __('No', 'maxi-blocks'), value: 'no' },
        ]
    const hoverCustomTextOptions = [
            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
            { label: __('No', 'maxi-blocks'), value: 'no' },
        ]

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
                                    isPrimary
                                    items={[
                                        function () {
                                            if (isFirstOnHierarchy && fullWidth) {
                                                return {
                                                    label: __('Container', 'maxi-blocks'),
                                                    content: (
                                                        <Fragment>
                                                            <BaseControl
                                                                label={__('Xl', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={containerXl}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            containerXl: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Xl - Max width', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={maxWidthXl}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            maxWidthXl: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Lg', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={containerLg}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            containerLg: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Lg - Max width', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={maxWidthLg}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            maxWidthLg: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Md', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={containerMd}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            containerMd: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Md - Max width', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={maxWidthMd}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            maxWidthMd: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Sm', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={containerSm}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            containerSm: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Sm - Max width', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={maxWidthSm}
                                                                    onChange={e => setAttributes(
                                                                        {
                                                                            maxWidthSm: isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                        }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                            <BaseControl
                                                                label={__('Padding', 'max-width')}
                                                            >
                                                                <input
                                                                    type='number'
                                                                    placeholder={__('auto', 'maxi-blocks')}
                                                                    value={containerPadding}
                                                                    onChange={e => setAttributes({
                                                                        containerPadding:
                                                                            isNumber(e.target.value) ?
                                                                                Number(e.target.value) :
                                                                                null
                                                                    }
                                                                    )}
                                                                />
                                                            </BaseControl>
                                                        </Fragment>
                                                    )
                                                }
                                            }

                                            return null;
                                        }(),
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
                                                        sizeSettings={size}
                                                        onChange={size => setAttributes({ size })}
                                                    />
                                                </Fragment>
                                            ),
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
                                                                        disableVideo
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
                                            label: __('Padding & Margin', 'maxi-blocks'),
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
                            <Fragment>
                                <div className='maxi-tab-content__box'>
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
                                            onChangeHoverAnimationTypeOpacity={hoverAnimationTypeOpacity => setAttributes({ hoverAnimationTypeOpacity})}

                                            hoverAnimationTypeOpacityColor={hoverAnimationTypeOpacityColor}
                                            onChangeHoverAnimationTypeOpacityColor={hoverAnimationTypeOpacityColor => setAttributes({ hoverAnimationTypeOpacityColor})}

                                        />
                                        {hoverAnimation === 'text' && hoverCustomTextTitle === 'yes' &&
                                        <TypographyControl
                                            fontOptions={hoverAnimationTitleTypography}
                                            onChange={hoverAnimationTitleTypography=> setAttributes({ hoverAnimationTitleTypography })}
                                            target='>.maxi-block-text-hover .maxi-block-text-hover__title'
                                        />}
                                        {hoverAnimation === 'text' && hoverCustomTextContent === 'yes' &&
                                        <TypographyControl
                                            fontOptions={hoverAnimationContentTypography}
                                            onChange={hoverAnimationContentTypography=> setAttributes({ hoverAnimationContentTypography })}
                                            target='>.maxi-block-text-hover .maxi-block-text-hover__content'
                                        />}
                                        { hoverAnimation === 'text' &&
                                        <Fragment>
                                        <RangeControl
                                            label={__('Opacity', 'maxi-blocks')}
                                            className='maxi-opacity-control'
                                            value={hoverOpacity * 100}
                                            onChange={value => setAttributes({ hoverOpacity: value / 100 })}
                                            min={0}
                                            max={100}
                                            allowReset={true}
                                            initialPosition={0}
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
                                        {  hoverAnimationCustomBorder === 'yes' && hoverAnimation === 'text' &&
                                            <BorderControl
                                                borderOptions={hoverBorder}
                                                onChange={hoverBorder => setAttributes({ hoverBorder })}
                                                target='.maxi-block-text-hover'
                                            />
                                        }
                                        { hoverAnimation === 'text' &&
                                            <Fragment>
                                                <DimensionsControl
                                                    label= {__('Padding', 'maxi-blocks')}
                                                    value={hoverPadding}
                                                    onChange={hoverPadding => setAttributes({ hoverPadding })}
                                                />
                                            </Fragment>
                                        }
                                        { hoverAnimationType === 'opacity-with-colour' &&
                                        <BackgroundControl
                                        backgroundOptions={hoverAnimationTypeOpacityColorBackground}
                                        onChange={hoverAnimationTypeOpacityColorBackground => setAttributes({ hoverAnimationTypeOpacityColorBackground })}
                                        disableImage
                                    />
                                        }
                                    <__experimentalZIndexControl
                                        value={zIndex}
                                        onChange={zIndex => setAttributes({ zIndex })}
                                    />
                                </div>
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Shape Divider', 'maxi-blocks'),
                                            content: (
                                                <__experimentalShapeDividerControl
                                                    shapeDividerOptions={shapeDivider}
                                                    onChange={shapeDivider => setAttributes({ shapeDivider })}
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
        </InspectorControls>
    )
}

export default Inspector;