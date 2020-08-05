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
    BoxShadowControl,
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    __experimentalDividerControl,
    __experimentalResponsiveSelector,
    __experimentalZIndexControl,
    __experimentalAxisControl,
    __experimentalResponsiveControl,
    __experimentalOpacityControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
    __experimentalMotionControl,
    __experimentalTransformControl,
    __experimentalEntranceAnimationControl
} from '../../components';

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
            showLine,
            lineVertical,
            lineHorizontal,
            lineOrientation,
            divider,
            fullWidth,
            size,
            opacity,
            opacityHover,
            background,
            backgroundHover,
            boxShadow,
            boxShadowHover,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            zIndex,
            breakpoints,
            position,
            display,
            motion,
            transform
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
                                    isSecondary
                                    items={[
                                        function () {
                                            if (deviceType === 'general')
                                                return {
                                                    label: __('Line', 'maxi-blocks'),
                                                    content: (
                                                        <Fragment>
                                                            <SelectControl
                                                                label={__('Show Line', 'maxi-blocks')}
                                                                options={[
                                                                    { label: __('No', 'maxi-blocks'), value: 0 },
                                                                    { label: __('Yes', 'maxi-blocks'), value: 1 },
                                                                ]}
                                                                value={showLine}
                                                                onChange={val => setAttributes({ showLine: Number(val) })}
                                                            />
                                                            {
                                                                !!showLine &&
                                                                <Fragment>
                                                                    <SelectControl
                                                                        label={__('Line Orientation', 'maxi-blocks')}
                                                                        options={[
                                                                            { label: __('Horizontal', 'maxi-blocks'), value: 'horizontal' },
                                                                            { label: __('Vertical', 'maxi-blocks'), value: 'vertical' },
                                                                        ]}
                                                                        value={lineOrientation}
                                                                        onChange={lineOrientation => setAttributes({ lineOrientation })}
                                                                    />
                                                                    <SelectControl
                                                                        label={__('Line Vertical Position', 'maxi-blocks')}
                                                                        options={
                                                                            [
                                                                                { label: __('Top', 'maxi-blocks'), value: 'flex-start' },
                                                                                { label: __('Center', 'maxi-blocks'), value: 'center' },
                                                                                { label: __('Bottom', 'maxi-blocks'), value: 'flex-end' },
                                                                            ]
                                                                        }
                                                                        value={lineVertical}
                                                                        onChange={lineVertical => setAttributes({ lineVertical })}
                                                                    />
                                                                    <SelectControl
                                                                        label={__('Line Horizontal Position', 'maxi-blocks')}
                                                                        options={
                                                                            [
                                                                                { label: __('Left', 'maxi-blocks'), value: 'flex-start' },
                                                                                { label: __('Center', 'maxi-blocks'), value: 'center' },
                                                                                { label: __('Right', 'maxi-blocks'), value: 'flex-end' },
                                                                            ]
                                                                        }
                                                                        value={lineHorizontal}
                                                                        onChange={lineHorizontal => setAttributes({ lineHorizontal })}
                                                                    />
                                                                    <__experimentalDividerControl
                                                                        dividerOptions={divider}
                                                                        onChange={divider => setAttributes({ divider })}
                                                                        lineOrientation={lineOrientation}
                                                                    />
                                                                </Fragment>
                                                            }
                                                        </Fragment>
                                                    )
                                                }
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
                                                                                disableVideo
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
                                        defaultDisplay='flex'
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
                                            label: __('Entrance Animation', 'maxi-blocks'),
                                            content: (
                                                <__experimentalEntranceAnimationControl
                                                    motionOptions={motion}
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