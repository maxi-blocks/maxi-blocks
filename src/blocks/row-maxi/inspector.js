/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { InspectorControls } = wp.blockEditor;
const { Fragment } = wp.element;
const {
    BaseControl,
    SelectControl,
    RangeControl,
    RadioControl,
} = wp.components;

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

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
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            isFirstOnHierarchy,
            blockStyle,
            defaultBlockStyle,
            columnGap,
            wrap,
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
            hoverAnimationType,
            hoverAnimationTypeText,
            hoverAnimationDuration,
            extraClassName,
            extraStyles,
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
            hoverAnimationTypeOpacityColorBackground
        },
        setAttributes,
        onChangeColumnGap
    } = props;

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
                                                    <BaseControl
                                                        label={__('Wrap on', 'maxi-blocks')}
                                                    >
                                                        <input
                                                            type='number'
                                                            placeholder={__('auto', 'maxi-blocks')}
                                                            value={wrap}
                                                            onChange={e => {
                                                                setAttributes({
                                                                    wrap:
                                                                        !isEmpty(e.target.value) ?
                                                                            Number(e.target.value) :
                                                                            null
                                                                })
                                                            }}
                                                        />
<<<<<<< HEAD
                                                    }
=======
                                                    </BaseControl>
>>>>>>> 6daf5d611651abc76f04dd66c45e9e691d3c4b53
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
                                        onChangeHoverAnimationTypeOpacity={hoverAnimationTypeOpacity => setAttributes({ hoverAnimationTypeOpacity})}

                                        hoverAnimationTypeOpacityColor={hoverAnimationTypeOpacityColor}
                                        onChangeHoverAnimationTypeOpacityColor={hoverAnimationTypeOpacityColor => setAttributes({ hoverAnimationTypeOpacityColor})}

<<<<<<< HEAD
                                />
                                {hoverAnimation === 'text' && hoverCustomTextTitle === 'yes' &&
                                <TypographyControl
                                    fontOptions={hoverAnimationTitleTypography}
                                    onChange={hoverAnimationTitleTypography=> setAttributes({ hoverAnimationTitleTypography })}
                                    target='>.maxi-block-text-hover .maxi-block-text-hover__title'
                                />}
                                {hoverAnimation === 'text' && hoverCustomTextContent === 'yes' &&
                                <TypographyControl
                                    fontOptions={hoverAnimationContentTypography}
                                    onChange={hoverAnimationContentTypography=> setAttributes({ hoverAnimationContentTypography })}
                                    target='>.maxi-block-text-hover .maxi-block-text-hover__content'
                                />}
                                { hoverAnimation === 'text' &&
                                <Fragment>
                                <RangeControl
                                    label={__('Opacity', 'maxi-blocks')}
                                    className='maxi-opacity-control'
                                    value={hoverOpacity * 100}
                                    onChange={value => setAttributes({ hoverOpacity: value / 100 })}
                                    min={0}
                                    max={100}
                                    allowReset={true}
                                    initialPosition={0}
                                />
                                <BackgroundControl
                                    backgroundOptions={hoverBackground}
                                    onChange={hoverBackground => setAttributes({ hoverBackground })}
                                    disableImage
                                    target='.maxi-block-text-hover'
                                />
=======
                                />
                                {hoverAnimation === 'text' && hoverCustomTextTitle === 'yes' &&
                                <TypographyControl
                                    fontOptions={hoverAnimationTitleTypography}
                                    onChange={hoverAnimationTitleTypography=> setAttributes({ hoverAnimationTitleTypography })}
                                    target='>.maxi-block-text-hover .maxi-block-text-hover__title'
                                />}
                                {hoverAnimation === 'text' && hoverCustomTextContent === 'yes' &&
                                <TypographyControl
                                    fontOptions={hoverAnimationContentTypography}
                                    onChange={hoverAnimationContentTypography=> setAttributes({ hoverAnimationContentTypography })}
                                    target='>.maxi-block-text-hover .maxi-block-text-hover__content'
                                />}
                                { hoverAnimation === 'text' &&
                                <Fragment>
                                <RangeControl
                                    label={__('Opacity', 'maxi-blocks')}
                                    className='maxi-opacity-control'
                                    value={hoverOpacity * 100}
                                    onChange={value => setAttributes({ hoverOpacity: value / 100 })}
                                    min={0}
                                    max={100}
                                    allowReset={true}
                                    initialPosition={0}
                                />
                                <BackgroundControl
                                    backgroundOptions={hoverBackground}
                                    onChange={hoverBackground => setAttributes({ hoverBackground })}
                                    disableImage
                                    target='.maxi-block-text-hover'
                                />
>>>>>>> 6daf5d611651abc76f04dd66c45e9e691d3c4b53

                                <RadioControl
                                    label={__('Custom Border', 'maxi-blocks')}
                                    className={'maxi-hover-animation-custom-border'}
                                    selected={hoverAnimationCustomBorder}
                                    options={hoverAnimationCustomOptions}
                                    onChange={hoverAnimationCustomBorder => setAttributes({ hoverAnimationCustomBorder })}
                                />
                                </Fragment>
                                }
                                {  hoverAnimationCustomBorder === 'yes' && hoverAnimation === 'text' &&
                                    <BorderControl
                                        borderOptions={hoverBorder}
                                        onChange={hoverBorder => setAttributes({ hoverBorder })}
                                        target='.maxi-block-text-hover'
                                    />
                                }
                                { hoverAnimation === 'text' &&
                                <Fragment>
                                    <DimensionsControl
                                        label= {__('Padding', 'maxi-blocks')}
                                        value={hoverPadding}
                                        onChange={hoverPadding => setAttributes({ hoverPadding })}
                                    />
                                </Fragment>
                                 }
                                 { hoverAnimationType === 'opacity-with-colour' &&
                                    <BackgroundControl
                                    backgroundOptions={hoverAnimationTypeOpacityColorBackground}
                                    onChange={hoverAnimationTypeOpacityColorBackground => setAttributes({ hoverAnimationTypeOpacityColorBackground })}
                                    disableImage
                                />
                                    }
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