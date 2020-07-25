/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const { useSelect } = wp.data;
const {
    TextControl,
    SelectControl,
    RadioControl
} = wp.components;

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    AlignmentControl,
    BackgroundControl,
    BorderControl,
    BlockStylesControl,
    BoxShadowControl,
    FontLevelControl,
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    TypographyControl,
    __experimentalZIndexControl,
    __experimentalResponsiveSelector,
    __experimentalResponsiveControl,
    __experimentalNumberControl,
    __experimentalOpacityControl,
    __experimentalAxisControl,
    __experimentalPositionControl,
    __experimentalDisplayControl,
    __experimentalMotionControl,
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
            alignment,
            textLevel,
            isList,
            typeOfList,
            listStart,
            listReversed,
            typography,
            background,
            opacity,
            boxShadow,
            border,
            fullWidth,
            size,
            margin,
            padding,
            typographyHover,
            backgroundHover,
            opacityHover,
            boxShadowHover,
            borderHover,
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
            position,
            display,
            motion
        },
        setAttributes,
    } = props;

    const { deviceType } = useSelect(
        select => {
            const {
                __experimentalGetPreviewDeviceType
            } = select(
                'core/edit-post'
            );
            let deviceType = __experimentalGetPreviewDeviceType();
            deviceType = deviceType === 'Desktop' ?
                'general' :
                deviceType;
            return {
                deviceType,
            }
        }
    );
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
                                    isSecondary
                                    items={[
                                        {
                                            label: __('Alignment', 'maxi-blocks'),
                                            content: (
                                                <AlignmentControl
                                                    alignment={alignment}
                                                    onChange={alignment => setAttributes({ alignment })}
                                                    breakpoint={deviceType}
                                                />
                                            )
                                        },
                                        function () {
                                            if (deviceType === 'general') {
                                                if (!isList)
                                                    return {
                                                        label: __('Level', 'maxi-blocks'),
                                                        content: (
                                                            <FontLevelControl
                                                                value={textLevel}
                                                                onChange={(textLevel, typography, typographyHover, margin) =>
                                                                    setAttributes({
                                                                        textLevel,
                                                                        typography,
                                                                        typographyHover,
                                                                        margin
                                                                    })
                                                                }
                                                                fontOptions={typography}
                                                                fontOptionsHover={typographyHover}
                                                                marginOptions={margin}
                                                            />
                                                        )
                                                    }
                                                if (isList)
                                                    return {
                                                        label: __('List Options', 'maxi-blocks'),
                                                        content: (
                                                            <Fragment>
                                                                <SelectControl
                                                                    label={__('Type of list', 'maxi-blocks')}
                                                                    value={typeOfList}
                                                                    options={[
                                                                        { label: __('Unorganized', 'maxi-blocks'), value: 'ul' },
                                                                        { label: __('Organized', 'maxi-blocks'), value: 'ol' }
                                                                    ]}
                                                                    onChange={typeOfList => setAttributes({ typeOfList })}
                                                                />
                                                                {
                                                                    typeOfList === 'ol' &&
                                                                    <Fragment>
                                                                        <__experimentalNumberControl
                                                                            label={__('Start from', 'maxi-blocks')}
                                                                            value={listStart}
                                                                            onChange={listStart => setAttributes({ listStart })}
                                                                        />
                                                                        <SelectControl
                                                                            label={__('Reverse order', 'maxi-blocks')}
                                                                            value={listReversed}
                                                                            options={[
                                                                                { label: __('Yes', 'maxi-blocks'), value: 1 },
                                                                                { label: __('No', 'maxi-blocks'), value: 0 }
                                                                            ]}
                                                                            onChange={value => {
                                                                                console.log(Number(value), !!Number(value));
                                                                                setAttributes({ listReversed: Number(value) })
                                                                            }}
                                                                        />
                                                                    </Fragment>
                                                                }
                                                            </Fragment>
                                                        )
                                                    }
                                            }

                                            return null;
                                        }(),
                                        {
                                            label: __('Typography', 'maxi-blocks'),
                                            disablePadding: true,
                                            content: (
                                                <SettingTabsControl
                                                    items={[
                                                        {
                                                            label: __('Normal', 'gutenberg-extra'),
                                                            content: (
                                                                <TypographyControl
                                                                    typography={typography}
                                                                    onChange={typography => setAttributes({ typography })}
                                                                    hideAlignment
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <TypographyControl
                                                                    typography={typographyHover}
                                                                    onChange={typographyHover => setAttributes({ typographyHover })}
                                                                    target=':hover'
                                                                    hideAlignment
                                                                    breakpoint={deviceType}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        function () {
                                            if (deviceType === 'general') {
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
                                                }
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

                                            />
                                            {hoverAnimation === 'text' && hoverCustomTextTitle === 'yes' &&
                                                <TypographyControl
                                                    fontOptions={hoverAnimationTitleTypography}
                                                    onChange={hoverAnimationTitleTypography => setAttributes({ hoverAnimationTitleTypography })}
                                                    target='>.maxi-block-text-hover .maxi-block-text-hover__title'
                                                />}
                                            {hoverAnimation === 'text' && hoverCustomTextContent === 'yes' &&
                                                <TypographyControl
                                                    fontOptions={hoverAnimationContentTypography}
                                                    onChange={hoverAnimationContentTypography => setAttributes({ hoverAnimationContentTypography })}
                                                    target='>.maxi-block-text-hover .maxi-block-text-hover__content'
                                                />}
                                            {hoverAnimation === 'text' &&
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
                                            {hoverAnimationCustomBorder === 'yes' && hoverAnimation === 'text' &&
                                                <BorderControl
                                                    border={hoverBorder}
                                                    onChange={hoverBorder => setAttributes({ hoverBorder })}
                                                    breakpoint={deviceType}
                                                />
                                            }
                                            {hoverAnimation === 'text' &&
                                                <Fragment>
                                                    <__experimentalAxisControl
                                                        values={hoverPadding}
                                                        onChange={hoverPadding => setAttributes({ hoverPadding })}
                                                        disableAuto
                                                    />
                                                </Fragment>
                                            }
                                            {hoverAnimationType === 'opacity-with-colour' &&
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