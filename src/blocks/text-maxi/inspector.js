/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    RangeControl,
    SelectControl
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
    CustomCSSControl,
    DimensionsControl,
    FontLevelControl,
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    TypographyControl,
    __experimentalZIndexControl
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
            textLevel,
            alignmentDesktop,
            alignmentTablet,
            alignmentMobile,
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
            extraClassName,
            extraStyles,
            zIndex
        },
        setAttributes,
    } = props;

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
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Tablet', 'maxi-blocks'),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={alignmentTablet}
                                                                    onChange={alignmentTablet => setAttributes({ alignmentTablet })}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Mobile', 'maxi-blocks'),
                                                            content: (
                                                                <AlignmentControl
                                                                    value={alignmentMobile}
                                                                    onChange={alignmentMobile => setAttributes({ alignmentMobile })}
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
                                            )
                                        },
                                        {
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
                                                    sizeOptions={size}
                                                />
                                            )
                                        },
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
                                                                    fontOptions={typography}
                                                                    onChange={typography => setAttributes({ typography })}
                                                                    hideAlignment
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <TypographyControl
                                                                    fontOptions={typographyHover}
                                                                    onChange={typographyHover => setAttributes({ typographyHover })}
                                                                    target=':hover'
                                                                    hideAlignment
                                                                />
                                                            )
                                                        },
                                                    ]}
                                                />
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
                                            label: __('Sizing', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    {
                                                        isFirstOnHierarchy &&
                                                        <SelectControl
                                                            label={__('Fullwidth', 'maxi-blocks')}
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
                                <__experimentalZIndexControl
                                    value={zIndex}
                                    onChange={zIndex => setAttributes({ zIndex })}
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