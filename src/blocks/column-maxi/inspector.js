/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    RangeControl,
    SelectControl,
    TextControl,
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
    __experimentalZIndexControl,
    __experimentalResponsiveSelector,
    __experimentalResponsiveControl,
    __experimentalNumberControl,
    __experimentalOpacityControl,
    __experimentalAxisControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
    __experimentalTransformControl
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
            uniqueID,
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            columnSize,
            verticalAlign,
            opacity,
            opacityHover,
            background,
            backgroundHover,
            border,
            borderHover,
            size,
            boxShadow,
            boxShadowHover,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationType,
            hoverAnimationTypeText,
            hoverAnimationDuration,
            extraClassName,
            zIndex,
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
            transform
        },
        deviceType,
        setAttributes
    } = props;

    const columnSizeValue = !isObject(columnSize) ?
        JSON.parse(columnSize) :
        columnSize;
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
                                        {
                                            label: __('Column Settings', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <RangeControl
                                                        label={__('Column Size', 'maxi-blocks')}
                                                        value={columnSizeValue[deviceType].size}
                                                        onChange={val => {
                                                            columnSizeValue[deviceType].size = val;
                                                            document.querySelector(`.maxi-column-block__resizer__${uniqueID}`)
                                                                .style.width = `${val}%`;
                                                            setAttributes({ columnSize: JSON.stringify(columnSizeValue) })
                                                        }}
                                                        min='0'
                                                        // max={getColumnMaxWidth()}
                                                        max='100'
                                                        step={.1}
                                                    />
                                                    <SelectControl
                                                        label={__('Vertical align', 'maxi-blocks')}
                                                        value={verticalAlign}
                                                        options={
                                                            [
                                                                { label: __('Top', 'maxi-blocks'), value: 'flex-start' },
                                                                { label: __('Center', 'maxi-blocks'), value: 'center' },
                                                                { label: __('Bottom', 'maxi-blocks'), value: 'flex-end' },
                                                                { label: __('Space between', 'maxi-blocks'), value: 'space-between' },
                                                                { label: __('Space around', 'maxi-blocks'), value: 'space-around' },
                                                            ]
                                                        }
                                                        onChange={verticalAlign => setAttributes({ verticalAlign })}
                                                    />
                                                </Fragment>
                                            )
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
                                            label: __('Width / Height', 'maxi-blocks'),
                                            content: (
                                                <FullSizeControl
                                                    size={size}
                                                    onChange={size => setAttributes({ size })}
                                                    breakpoint={deviceType}
                                                    hideWidth
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
                            <div className='maxi-tab-content__box'>
                                {
                                    deviceType === 'general' &&
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
                                    defaultDisplay='inline-flex'
                                />
                                <__experimentalTransformControl
                                    transform={transform}
                                    onChange={transform => setAttributes({ transform })}
                                    uniqueID={uniqueID}
                                    breakpoint={deviceType}
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