/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    TextControl,
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
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    SizeControl,
    TypographyControl,
    __experimentalResponsiveSelector,
    __experimentalZIndexControl,
    __experimentalAxisControl,
    __experimentalResponsiveControl,
    __experimentalOpacityControl,
    __experimentalShapeDividerControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
    __experimentalMotionControl,
} from '../../components';

/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            sizeContainer,
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
            extraClassName,
            breakpoints,
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
            position,
            display,
            motion,
        },
        deviceType,
        setAttributes,
    } = props;

    let value = !isObject(sizeContainer) ?
        JSON.parse(sizeContainer) :
        sizeContainer;
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
                                    isPrimary
                                    items={[
                                        function () {
                                            if (isFirstOnHierarchy && fullWidth) {
                                                return {
                                                    label: __('Container', 'maxi-blocks'),
                                                    content: (
                                                        <Fragment>
                                                            <SizeControl
                                                                label={__('Max Width', 'maxi-blocks')}
                                                                unit={value[deviceType]['max-widthUnit']}
                                                                onChangeUnit={val => {
                                                                    value[deviceType]['max-widthUnit'] = val;
                                                                    setAttributes({ sizeContainer: JSON.stringify(value) })
                                                                }}
                                                                value={value[deviceType]['max-width']}
                                                                onChangeValue={val => {
                                                                    value[deviceType]['max-width'] = val;
                                                                    setAttributes({ sizeContainer: JSON.stringify(value) })
                                                                }}
                                                            />
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
                                                        size={size}
                                                        onChange={size => setAttributes({ size })}
                                                        breakpoint={deviceType}
                                                    />
                                                </Fragment>
                                            ),
                                        },
                                        function () {
                                            if (deviceType === 'general')
                                                return {
                                                    label: __('Background', 'maxi-blocks'),
                                                    disablePadding: true,
                                                    content: (
                                                        <SettingTabsControl
                                                            items={[
                                                                {
                                                                    label: __('Normal', 'maxi-blocks'),
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
                                                                            />
                                                                        </Fragment>
                                                                    )
                                                                },
                                                                {
                                                                    label: __('Hover', 'maxi-blocks'),
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
                                                                                disableVideo
                                                                            />
                                                                        </Fragment>
                                                                    )
                                                                },
                                                            ]}
                                                        />
                                                    )
                                                }
                                        }(),
                                        {
                                            label: __('Border', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'maxi-blocks'),
                                                            content: (
                                                                <BorderControl
                                                                    border={border}
                                                                    onChange={border => setAttributes({ border })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'maxi-blocks'),
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
                                            label: __('Box Shadow', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'maxi-blocks'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadow}
                                                                    onChange={boxShadow => setAttributes({ boxShadow })}
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'maxi-blocks'),
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
                                            label: __('Padding & Margin', 'maxi-blocks'),
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
                                        <TextControl
                                            label={__('Additional CSS Classes', 'maxi-blocks')}
                                            className='maxi-additional__css-classes'
                                            value={extraClassName}
                                            onChange={extraClassName => setAttributes({ extraClassName })}
                                        />
                                    }
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
                                        hoverAnimation === 'text' &&
                                        hoverCustomTextTitle === 'yes' &&
                                        <TypographyControl
                                            typography={hoverAnimationTitleTypography}
                                            onChange={hoverAnimationTitleTypography => setAttributes({ hoverAnimationTitleTypography })}
                                            hideAlignment
                                            breakpoint={deviceType}
                                        />}
                                    {
                                        hoverAnimation === 'text' &&
                                        hoverCustomTextContent === 'yes' &&
                                        <TypographyControl
                                            typography={hoverAnimationContentTypography}
                                            onChange={hoverAnimationContentTypography => setAttributes({ hoverAnimationContentTypography })}
                                            hideAlignment
                                            breakpoint={deviceType}
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
                                        hoverAnimationCustomBorder === 'yes' &&
                                        hoverAnimation === 'text' &&
                                        <BorderControl
                                            borderOptions={hoverBorder}
                                            onChange={hoverBorder => setAttributes({ hoverBorder })}
                                        />
                                    }
                                    {
                                        hoverAnimation === 'text' &&
                                        <Fragment>
                                            <__experimentalAxisControl
                                                values={hoverPadding}
                                                onChange={hoverPadding => setAttributes({ hoverPadding })}
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
                                    <__experimentalZIndexControl
                                        zindex={zIndex}
                                        onChange={zIndex => setAttributes({ zIndex })}
                                        breakpoint={deviceType}
                                    />
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
                                        },
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
        </InspectorControls>
    )
}

export default Inspector;