/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const {
    Fragment,
    useState
} = wp.element;
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
            textLevel,
            alignment,
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
            zIndex,
            breakpoints
        },
        setAttributes,
    } = props;

    const [breakpoint, setBreakpoint] = useState('general')

    return (
        <InspectorControls>
            <__experimentalResponsiveSelector
                selected={breakpoint}
                onChange={breakpoint => setBreakpoint(breakpoint)}
            />
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
                                                    breakpoint={breakpoint}
                                                />
                                            )
                                        },
                                        function () {
                                            if (breakpoint === 'general') {
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
                                                            sizeOptions={size}
                                                        />
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
                                                                    fontOptions={typography}
                                                                    onChange={typography => {
                                                                        console.log(JSON.parse(typography))
                                                                        setAttributes({ typography })
                                                                    }}
                                                                    hideAlignment
                                                                    breakpoint={breakpoint}
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
                                                                    breakpoint={breakpoint}
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
                                                                    <__experimentalOpacityControl
                                                                        opacity={opacity}
                                                                        onChange={opacity => setAttributes({ opacity })}
                                                                        breakpoint={breakpoint}
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
                                                                        breakpoint={breakpoint}
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
                                                                    border={border}
                                                                    onChange={border => setAttributes({ border })}
                                                                    breakpoint={breakpoint}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BorderControl
                                                                    border={borderHover}
                                                                    onChange={borderHover => setAttributes({ borderHover })}
                                                                    breakpoint={breakpoint}
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
                                                        breakpoint={breakpoint}
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
                                                                    breakpoint={breakpoint}
                                                                />
                                                            )
                                                        },
                                                        {
                                                            label: __('Hover', 'gutenberg-extra'),
                                                            content: (
                                                                <BoxShadowControl
                                                                    boxShadow={boxShadowHover}
                                                                    onChange={boxShadowHover => setAttributes({ boxShadowHover })}
                                                                    breakpoint={breakpoint}
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
                                                        breakpoint={breakpoint}
                                                    />
                                                    <__experimentalMarginPaddingControl
                                                        value={margin}
                                                        onChange={margin => setAttributes({ margin })}
                                                        breakpoint={breakpoint}
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
                                <__experimentalZIndexControl
                                    zindex={zIndex}
                                    onChange={zIndex => setAttributes({ zIndex })}
                                    breakpoint={breakpoint}
                                />
                                {
                                    breakpoint != 'general' &&
                                    <__experimentalResponsiveControl
                                        breakpoints={breakpoints}
                                        onChange={breakpoints => {
                                            console.log(breakpoints)
                                            setAttributes({ breakpoints })
                                        }}
                                        breakpoint={breakpoint}
                                    />
                                }
                            </div>
                        )
                    }
                ]}
            />
        </InspectorControls >
    )
}

export default Inspector;