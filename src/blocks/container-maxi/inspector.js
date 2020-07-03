/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    BaseControl,
    RangeControl,
    SelectControl
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
    HoverAnimationControl,
    SettingTabsControl,
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
            extraClassName,
            extraStyles,
            zIndex
        },
        setAttributes,
    } = props;

    console.log(isFirstOnHierarchy && fullWidth)

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
                                <__experimentalZIndexControl
                                    value={zIndex}
                                    onChange={zIndex => setAttributes({ zIndex })}
                                />
                            </div>
                        )
                    }
                ]}
            />
        </InspectorControls>
    )
}

export default Inspector;