/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    SelectControl,
    TextControl,
    RangeControl,
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
import { getDefaultProp } from '../../utils';

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
            horizontalAlign,
            verticalAlign,
            opacity,
            opacityHover,
            background,
            backgroundHover,
            border,
            borderHover,
            fullWidth,
            size,
            boxShadow,
            boxShadowHover,
            padding,
            margin,
            extraClassName,
            zIndex,
            breakpoints,
            position,
            display,
            transform
        },
        deviceType,
        setAttributes,
        clientId
    } = props;

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
                                            label: __('Row Settings', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <SelectControl
                                                        label={__('Horizontal align', 'maxi-blocks')}
                                                        value={horizontalAlign}
                                                        options={
                                                            [
                                                                { label: __('Flex-start', 'maxi-blocks'), value: 'flex-start' },
                                                                { label: __('Flex-end', 'maxi-blocks'), value: 'flex-end' },
                                                                { label: __('Center', 'maxi-blocks'), value: 'center' },
                                                                { label: __('Space between', 'maxi-blocks'), value: 'space-between' },
                                                                { label: __('Space around', 'maxi-blocks'), value: 'space-around' },
                                                            ]
                                                        }
                                                        onChange={horizontalAlign => setAttributes({ horizontalAlign })}
                                                    />
                                                    <SelectControl
                                                        label={__('Vertical align', 'maxi-blocks')}
                                                        value={verticalAlign}
                                                        options={
                                                            [
                                                                { label: __('Stretch', 'maxi-blocks'), value: 'stretch' },
                                                                { label: __('Flex-start', 'maxi-blocks'), value: 'flex-start' },
                                                                { label: __('Flex-end', 'maxi-blocks'), value: 'flex-end' },
                                                                { label: __('Center', 'maxi-blocks'), value: 'center' },
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
                            <AccordionControl
                                isPrimary
                                items={[
                                    deviceType === 'general' &&
                                    {
                                        label: __('Custom classes', 'maxi-blocks'),
                                        content: (
                                            <TextControl
                                                label={__('Additional CSS Classes', 'maxi-blocks')}
                                                className='maxi-additional__css-classes'
                                                value={extraClassName}
                                                onChange={extraClassName => setAttributes({ extraClassName })}
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
                                    },
                                    {
                                        label: __('Display', 'maxi-blocks'),
                                        content: (
                                            <__experimentalDisplayControl
                                                display={display}
                                                onChange={display => setAttributes({ display })}
                                                breakpoint={deviceType}
                                            />
                                        )
                                    },
                                    {
                                        label: __('Position', 'maxi-blocks'),
                                        content: (
                                            <__experimentalPositionControl
                                                position={position}
                                                defaultPosition={getDefaultProp(clientId, 'position')}
                                                onChange={position => setAttributes({ position })}
                                                breakpoint={deviceType}
                                            />
                                        )
                                    },
                                    deviceType != 'general' &&
                                    {
                                        label: __('Breakpoint', 'maxi-blocks'),
                                        content: (
                                            <__experimentalResponsiveControl
                                                breakpoints={breakpoints}
                                                defaultBreakpoints={getDefaultProp(clientId, 'breakpoints')}
                                                onChange={breakpoints => setAttributes({ breakpoints })}
                                                breakpoint={deviceType}
                                            />
                                        )
                                    },
                                    {
                                        label: __('Z-index', 'maxi-blocks'),
                                        content: (
                                            <__experimentalZIndexControl
                                                zIndex={zIndex}
                                                defaultZIndex={getDefaultProp(clientId, 'zIndex')}
                                                onChange={zIndex => setAttributes({ zIndex })}
                                                breakpoint={deviceType}
                                            />
                                        )
                                    }
                                ]}
                            />
                        )
                    }
                ]}
            />
        </InspectorControls>
    )
}

export default Inspector;