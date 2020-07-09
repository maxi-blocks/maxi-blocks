/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    SelectControl,
    TextControl
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
    __experimentalMarginPaddingControl
} from '../../components';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
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
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            zIndex,
            breakpoints
        },
        deviceType,
        setAttributes,
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
                                                    <__experimentalMarginPaddingControl
                                                        value={padding}
                                                        onChange={padding => setAttributes({ padding })}
                                                        breakpoint={deviceType}
                                                    />
                                                    <__experimentalMarginPaddingControl
                                                        value={margin}
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
                            </div>
                        )
                    }
                ]}
            />
        </InspectorControls>
    )
}

export default Inspector;