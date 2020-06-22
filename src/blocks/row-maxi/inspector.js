/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    SelectControl,
    RangeControl,
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
    CheckBoxControl,
    DimensionsControl,
    CustomCSSControl,
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
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
            columnGap,
            wrapTablet,
            wrapMobile,
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
            extraStyles,
            zIndex
        },
        setAttributes,
        onChangeColumnGap
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
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Row Settings', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <RangeControl
                                                        label={__('Column gap', 'maxi-blocks')}
                                                        value={columnGap}
                                                        onChange={columnGap => {
                                                            onChangeColumnGap(columnGap);
                                                            setAttributes({ columnGap })
                                                        }
                                                        }
                                                        step={.1}
                                                        min={0}
                                                        max={5}
                                                    />
                                                    <CheckBoxControl
                                                        label={__('Wrap on Mobile', 'maxi-blocks')}
                                                        checked={wrapMobile}
                                                        onChange={wrapMobile => setAttributes({ wrapMobile })}
                                                    />
                                                    {
                                                        !wrapMobile &&
                                                        <CheckBoxControl
                                                            label={__('Wrap on Tablet', 'maxi-blocks')}
                                                            checked={wrapTablet}
                                                            onChange={wrapTablet => setAttributes({ wrapTablet })}
                                                        />
                                                    }
                                                    {/* <SelectControl
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
                                                    /> */}
                                                </Fragment>
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
        </InspectorControls>
    )
}

export default Inspector;