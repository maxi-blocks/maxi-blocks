/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
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
    SettingTabsControl
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
            syncSize,
            syncStyles,
            horizontalAlign,
            verticalAlign,
            background,
            boxShadow,
            border,
            size,
            padding,
            margin,
            hoverAnimation,
            hoverAnimationDuration,
            extraClassName,
            extraStyles
        },
        setAttributes,
    } = props;

    return (
        <InspectorControls>
            <SettingTabsControl
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
                                    <RangeControl
                                        label={__('Column gap', 'maxi-blocks')}
                                        value={columnGap}
                                        onChange={columnGap => setAttributes({ columnGap })}
                                        step={.1}
                                        min={0}
                                        max={5}
                                    />
                                    <CheckBoxControl
                                        label={__('Syncronize Columns', 'maxi-blocks')}
                                        checked={syncSize}
                                        onChange={syncSize => setAttributes({ syncSize })}
                                    />
                                    <CheckBoxControl
                                        label={__('Syncronize Styles', 'maxi-blocks')}
                                        checked={syncStyles}
                                        onChange={syncStyles => setAttributes({ syncStyles })}
                                    />
                                    <SelectControl
                                        label={__('Horizontal align', 'maxi-blocks')}
                                        value={horizontalAlign}
                                        options={
                                            [
                                                { label: 'Flex-start', value: 'flex-start' },
                                                { label: 'Flex-end', value: 'flex-end' },
                                                { label: 'Center', value: 'center' },
                                                { label: 'Space between', value: 'space-between' },
                                                { label: 'Space around', value: 'space-around' },
                                            ]
                                        }
                                        onChange={horizontalAlign => setAttributes({ horizontalAlign })}
                                    />
                                    <SelectControl
                                        label={__('Vertical align', 'maxi-blocks')}
                                        value={verticalAlign}
                                        options={
                                            [
                                                { label: 'Stretch', value: 'stretch' },
                                                { label: 'Flex-start', value: 'flex-start' },
                                                { label: 'Flex-end', value: 'flex-end' },
                                                { label: 'Center', value: 'center' },
                                                { label: 'Space between', value: 'space-between' },
                                                { label: 'Space around', value: 'space-around' },
                                            ]
                                        }
                                        onChange={verticalAlign => setAttributes({ verticalAlign })}
                                    />
                                </div>
                                <AccordionControl
                                    isPrimary
                                    items={[
                                        {
                                            label: __('Background Image', 'maxi-blocks'),
                                            content: (
                                                <BackgroundControl
                                                    backgroundOptions={background}
                                                    onChange={background => setAttributes({ background })}
                                                />
                                            ),
                                        },
                                        {
                                            label: __('Box Settings', 'maxi-blocks'),
                                            content: (
                                                <Fragment>
                                                    <BoxShadowControl
                                                        boxShadowOptions={boxShadow}
                                                        onChange={boxShadow => setAttributes({ boxShadow })}
                                                    />
                                                    <hr style={{ marginTop: "28px" }} />
                                                    <BorderControl
                                                        borderOptions={border}
                                                        onChange={border => setAttributes({ border })}
                                                    />
                                                </Fragment>
                                            ),
                                        },
                                        {
                                            label: __(' Width / Height', 'maxi-blocks'),
                                            content: (
                                                <FullSizeControl
                                                    sizeSettings={size}
                                                    onChange={size => setAttributes({ size })}
                                                />
                                            ),
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
                                            ),
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
                            </div>
                        )
                    }
                ]}
            />
        </InspectorControls>
    )
}

export default Inspector;