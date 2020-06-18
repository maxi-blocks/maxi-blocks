/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const {
    RangeControl,
    SelectControl,
} = wp.components;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import {
    AccordionControl,
    BackgroundControl,
    BlockStylesControl,
    BoxShadowControl,
    CustomCSSControl,
    DimensionsControl,
    FullSizeControl,
    HoverAnimationControl,
    SettingTabsControl,
    __experimentalDividerControl,
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
            showLine,
            lineVertical,
            lineHorizontal,
            lineOrientation,
            linesAlign,
            divider1,
            divider2,
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
            extraStyles,
            zIndex
        },
        setAttributes,
    } = props;

    const getLinesQuantity = () => {
        let response = 0;

        const div1 = JSON.parse(divider1).general['border-style'];
        if (!isNil(div1) && div1 != 'none')
            response++;

        const div2 = JSON.parse(divider2).general['border-style'];
        if (!isNil(div2) && div2 != 'none')
            response++;

        return response;
    }

    const getHorizontalOptions = () => {
        if (getLinesQuantity() != 2 || linesAlign == 'column')
            return [
                { label: __('Left', 'maxi-blocks'), value: 'flex-start' },
                { label: __('Center', 'maxi-blocks'), value: 'center' },
                { label: __('Right', 'maxi-blocks'), value: 'flex-end' },
            ]
        else
            return [
                { label: __('Left', 'maxi-blocks'), value: 'flex-start' },
                { label: __('Center', 'maxi-blocks'), value: 'center' },
                { label: __('Space Between', 'maxi-blocks'), value: 'space-between' },
                { label: __('Space Around', 'maxi-blocks'), value: 'space-around' },
                { label: __('Right', 'maxi-blocks'), value: 'flex-end' },
            ]
    }

    const getVerticalOptions = () => {
        if (getLinesQuantity() != 2 || lineOrientation == 'horizontal')
            return [
                { label: __('Top', 'maxi-blocks'), value: 'flex-start' },
                { label: __('Center', 'maxi-blocks'), value: 'center' },
                { label: __('Bottom', 'maxi-blocks'), value: 'flex-end' },
            ]
        else
            return [
                { label: __('Top', 'maxi-blocks'), value: 'flex-start' },
                { label: __('Center', 'maxi-blocks'), value: 'center' },
                { label: __('Space Between', 'maxi-blocks'), value: 'space-between' },
                { label: __('Space Around', 'maxi-blocks'), value: 'space-around' },
                { label: __('Bottom', 'maxi-blocks'), value: 'flex-end' },
            ]
    }

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
                                            label: __('Line', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <SelectControl
                                                        label={__('Show Line', 'maxi-blocks')}
                                                        options={[
                                                            { label: __('No', 'maxi-blocks'), value: 'no' },
                                                            { label: __('Yes', 'maxi-blocks'), value: 'yes' },
                                                        ]}
                                                        value={showLine}
                                                        onChange={showLine => setAttributes({ showLine })}
                                                    />
                                                    {
                                                        showLine === 'yes' &&
                                                        <Fragment>
                                                            <SelectControl
                                                                label={__('Line Vertical Position', 'maxi-blocks')}
                                                                options={getVerticalOptions()}
                                                                value={lineVertical}
                                                                onChange={lineVertical => setAttributes({ lineVertical })}
                                                            />
                                                            <SelectControl
                                                                label={__('Line Horizontal Position', 'maxi-blocks')}
                                                                options={getHorizontalOptions()}
                                                                value={lineHorizontal}
                                                                onChange={lineHorizontal => setAttributes({ lineHorizontal })}
                                                            />
                                                            <SelectControl
                                                                label={__('Line Orientation', 'maxi-blocks')}
                                                                options={[
                                                                    { label: __('Horizontal', 'maxi-blocks'), value: 'horizontal' },
                                                                    { label: __('Vertical', 'maxi-blocks'), value: 'vertical' },
                                                                ]}
                                                                value={lineOrientation}
                                                                onChange={lineOrientation => setAttributes({ lineOrientation })}
                                                            />
                                                            {
                                                                getLinesQuantity() == 2 &&
                                                                <Fragment>
                                                                    <SelectControl
                                                                        label={__('Lines Align', 'maxi-blocks')}
                                                                        options={[
                                                                            { label: 'Same', value: 'row' },
                                                                            { label: 'Paralel', value: 'column' },
                                                                        ]}
                                                                        value={linesAlign}
                                                                        onChange={linesAlign => setAttributes({ linesAlign })}
                                                                    />
                                                                </Fragment>
                                                            }
                                                            <SettingTabsControl
                                                                disablePadding
                                                                items={[
                                                                    {
                                                                        label: __('Line 1', 'maxi-blocks'),
                                                                        content: (
                                                                            <__experimentalDividerControl
                                                                                dividerOptions={divider1}
                                                                                onChange={divider1 => {
                                                                                    setAttributes({ divider1 })
                                                                                }}
                                                                                lineOrientation={lineOrientation}
                                                                            />
                                                                        )
                                                                    },
                                                                    {
                                                                        label: __('Line 2', 'maxi-blocks'),
                                                                        content: (
                                                                            <__experimentalDividerControl
                                                                                dividerOptions={divider2}
                                                                                onChange={divider2 => setAttributes({ divider2 })}
                                                                                lineOrientation={lineOrientation}
                                                                            />
                                                                        )
                                                                    },
                                                                ]}
                                                            />
                                                        </Fragment>
                                                    }
                                                </Fragment>
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

                                            ),
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
                                            label: __('Padding & Margin', 'maxi-blocks'),
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