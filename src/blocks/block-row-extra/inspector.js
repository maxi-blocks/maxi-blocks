/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { compose } = wp.compose;
const {
    select,
    dispatch,
    withSelect,
    withDispatch
} = wp.data;
const {
    PanelBody,
    BaseControl,
    Button,
    Icon,
    SelectControl,
    RangeControl,
} = wp.components;
const {
    InspectorControls,
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    GXBlock,
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
} from '../../components';
import TEMPLATES from './templates';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    uniqueId,
    uniqBy,
    isEqual
} from 'lodash';

/**
 * Inspector
 */
const Inspector = props => {
    const {
        attributes: {
            uniqueID,
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
        clientId,
        loadTemplate,
        selectOnClick,
        hasInnerBlock,
        setAttributes,
        className,
    } = props;

    return (
        <InspectorControls>
            <PanelBody
                className="gx-panel gx-image-setting gx-content-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Image Settings', 'gutenberg-extra')}
            >
                <BlockStylesControl
                    blockStyle={blockStyle}
                    onChangeBlockStyle={blockStyle => setAttributes({ blockStyle })}
                    defaultBlockStyle={defaultBlockStyle}
                    onChangeDefaultBlockStyle={defaultBlockStyle => setAttributes({ defaultBlockStyle })}
                />
                <RangeControl
                    label={__('Column gap', 'gutenberg-extra')}
                    value={columnGap}
                    onChange={columnGap => setAttributes({ columnGap })}
                    step={.1}
                />
                <CheckBoxControl
                    label={__('Syncronize Columns', 'gutenberg-extra')}
                    checked={syncSize}
                    onChange={syncSize => setAttributes({ syncSize })}
                />
                <CheckBoxControl
                    label={__('Syncronize Styles', 'gutenberg-extra')}
                    checked={syncStyles}
                    onChange={syncStyles => setAttributes({ syncStyles })}
                />
                <SelectControl
                    label={__('Horizontal align', 'gutenberg-extra')}
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
                    label={__('Vertical align', 'gutenberg-extra')}
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
            </PanelBody>
            <PanelBody
                className="gx-panel gx-image-setting gx-style-tab-setting"
                initialOpen={true}
                // why this vvvv title?
                title={__('Image Settings', 'gutenberg-extra')}
            >
                <AccordionControl
                    isPrimary
                    items={[
                        {
                            label: __('Background Image', 'gutenberg-extra'),
                            classNameHeading: 'gx-backgroundsettings-tab',
                            //icon: image,
                            content: (
                                <BackgroundControl
                                    backgroundOptions={background}
                                    onChange={background => setAttributes({ background })}
                                />
                            ),
                        },
                        {
                            label: __('Box Settings', 'gutenberg-extra'),
                            classNameItem: 'gx-box-settings-item',
                            classNameHeading: 'gx-box-settings-tab',
                            //icon: boxSettings,
                            content: (
                                <Fragment>
                                    <PanelBody
                                        className={'gx-panel gx-color-setting gx-style-tab-setting'}
                                    >
                                        <BaseControl
                                            className={"bg-color-parent gx-reset-button background-gradient"}
                                        >
                                            <BoxShadowControl
                                                boxShadowOptions={boxShadow}
                                                onChange={boxShadow => setAttributes({ boxShadow })}
                                            />
                                        </BaseControl>
                                        <hr style={{ marginTop: "28px" }} />
                                        <BorderControl
                                            borderOptions={border}
                                            onChange={border => setAttributes({ border })}
                                            avoidZero={false}
                                        />
                                    </PanelBody>
                                </Fragment>
                            ),
                        },
                        {
                            label: __(' Width / Height', 'gutenberg-extra'),
                            classNameItem: 'gx-width-height-item',
                            classNameHeading: 'gx-width-height-tab',
                            //icon: width,
                            content: (
                                // Is this vvv PanelBody element necessary?
                                <PanelBody
                                    className="gx-panel gx-size-setting gx-style-tab-setting"
                                    initialOpen={true}
                                    title={__('Size Settings', 'gutenberg-extra')}
                                >
                                    <FullSizeControl
                                        sizeSettings={size}
                                        onChange={size => setAttributes({ size })}
                                    />
                                </PanelBody>
                            ),
                        },
                        {
                            label: __('Padding & Margin', 'gutenberg-extra'),
                            classNameItem: 'gx-padding-margin-item',
                            classNameHeading: 'gx-padding-tab',
                            //icon: iconPadding,
                            content: (
                                <PanelBody
                                    className="gx-panel gx-space-setting gx-style-tab-setting"
                                    initialOpen={true}
                                    // why this vvvv title?
                                    title={__('Space Settings', 'gutenberg-extra')}
                                >
                                    <DimensionsControl
                                        value={padding}
                                        onChange={padding => setAttributes({ padding })}
                                        avoidZero
                                    />
                                    <DimensionsControl
                                        value={margin}
                                        onChange={margin => setAttributes({ margin })}
                                        avoidZero
                                    />
                                </PanelBody>
                            ),
                        }
                    ]}
                />
            </PanelBody>
            <PanelBody
                initialOpen={true}
                className="gx-panel gx-advanced-setting gx-advanced-tab-setting"
                title={__('Advanced Settings', 'gutenberg-extra')}
            >
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
            </PanelBody>
        </InspectorControls>
    )
}

export default Inspector;