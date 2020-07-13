/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    RangeControl,
    Button,
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
    DimensionsControl,
    CustomCSSControl,
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
            extraStyles,
            mediaID,
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
        clientId,
        columnGap,
        cloneStyles,
        redistributeColumnsSize,
        getColumnMaxWidth,
        setAttributes
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
                                            label: __('Column Settings', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <RangeControl
                                                        label={__('Column Size', 'maxi-blocks')}
                                                        value={columnSize}
                                                        onChange={columnSize => {
                                                            redistributeColumnsSize(columnSize, true);
                                                            document.querySelector(`.maxi-column-block__resizer__${clientId}`)
                                                                .style.width = `${columnSize}%`;
                                                            setAttributes({ columnSize })
                                                        }}
                                                        min={columnGap}
                                                        max={getColumnMaxWidth()}
                                                        step={.1}
                                                    />
                                                    <Button
                                                        onClick={() => cloneStyles()}
                                                        isPrimary
                                                    >
                                                        Clone styles
                                                    </Button>
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
                                                                        disableImage
                                                                        disableVideo
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
                                                <FullSizeControl
                                                    sizeSettings={size}
                                                    onChange={size => setAttributes({ size })}
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