/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { compose } = wp.compose;
const {
    withSelect,
    withDispatch,
    select,
    dispatch
} = wp.data;
const {
    InnerBlocks,
    InspectorControls,
    __experimentalBlock
} = wp.blockEditor;
const {
    PanelBody,
    RangeControl,
    BaseControl
} = wp.components;

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
    DimensionsControl,
    CustomCSSControl,
    FullSizeControl,
    HoverAnimationControl,
} from '../../components';
import {
    getBackgroundObject,
    getBoxShadowObject
} from './utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    pull,
    isNil,
    isNumber,
    sum,
    round
} from 'lodash';

/**
 * Editor
 */
class edit extends GXBlock {

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID, this.displayStyles.bind(this));
    }

    componentDidUpdate() {
        this.props.synchronizeColumns(this.props.attributes);
        this.props.synchronizeStyles(this.props.attributes)
        this.displayStyles();
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        return `${this.props.attributes.uniqueID}`;
    }

    /**
     * Get object for styling
     */
    get getObject() {
        const {
            attributes: {
                columnSize,
                sizeMobile,
                sizeTablet
            },
        } = this.props;

        let response = {
            label: "Column",
            desktop: {},
            tablet: {},
            mobile: {}
        };

        if (!isNil(columnSize) && isNumber(columnSize))
            if (columnSize != 0) {
                response.desktop['flex'] = `0 0 ${columnSize}%`;
                response.desktop['max-width'] = `${columnSize}%`;
            }
            else {
                response.desktop['flex'] = '0 0 auto';
                response.desktop['max-width'] = '';
            }
        if (!isNil(sizeTablet) && isNumber(sizeTablet)) {
            if (sizeTablet != 0) {
                response.tablet['flex'] = `0 0 ${sizeTablet}%`;
                response.tablet['max-width'] = `${sizeTablet}%`;
            }
            else {
                response.tablet['flex'] = '0 0 auto';
                response.tablet['max-width'] = '';
            }
        }
        if (!isNil(sizeMobile) && isNumber(sizeMobile)) {
            if (sizeMobile != 0) {
                response.mobile['flex'] = `0 0 ${sizeMobile}%`;
                response.mobile['max-width'] = `${sizeMobile}%`;
            }
            else {
                response.mobile['flex'] = '0 0 auto';
                response.mobile['max-width'] = '';
            }
        }

        return response;
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles() {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(),
            },
        });
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                columnSize,
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
            syncSize,
            getColumnSize,
            getMaxRangeSize,
            clientId,
            className,
            setAttributes
        } = this.props;

        const columnSizeStyle = getColumnSize(this.props.attributes);

        let classes = classnames(
            'gx-block gx-column-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        /**
         * Check if InnerBlock contains other blocks
         */
        const hasInnerBlock = () => {
            return select('core/block-editor').getBlockOrder(clientId).length >= 1;
        }

        /**
         * Check if current block or children is select
         */
        const isSelect = () => {
            const selectedBlock = select('core/editor').getSelectedBlockClientId();
            const nestedColumns = select('core/block-editor').getBlockOrder(clientId);
            return nestedColumns.includes(selectedBlock) || clientId === selectedBlock;
        }

        return [
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
                    {
                        !syncSize &&
                        <RangeControl
                            label={__('Column Size', 'gutenberg-extra')}
                            value={columnSize}
                            onChange={columnSize => setAttributes({ columnSize })}
                            min={0}
                            max={getMaxRangeSize()}
                            step={.1}
                        />
                    }
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
                                    target=">.gx-column-block-content"
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
                                                target=">.gx-column-block-content"
                                                />
                                            </BaseControl>
                                            <hr style={{ marginTop: "28px" }} />
                                            <BorderControl
                                                borderOptions={border}
                                                onChange={border => setAttributes({ border })}
                                            target=">.gx-column-block-content"
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
                                        target=">.gx-column-block-content"
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
                                            target=">.gx-column-block-content"
                                            avoidZero
                                        />
                                        <DimensionsControl
                                            value={margin}
                                            onChange={margin => setAttributes({ margin })}
                                            target=">.gx-column-block-content"
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
            </InspectorControls>,
            <__experimentalBlock.div
                className={classes}
                style={{
                    flex: `0 0 ${columnSizeStyle}%`,
                    maxWidth: `${columnSizeStyle}%`,
                }}
            >
                <div
                    className="gx-column-block-content"
                >
                    <InnerBlocks
                        templateLock={false}
                        renderAppender={
                            !hasInnerBlock() || isSelect() ?
                                () => (
                                    <InnerBlocks.ButtonBlockAppender />
                                ) :
                                false
                        }
                    />
                </div>
            </__experimentalBlock.div>
        ];
    }
}

const editSelect = withSelect((select, ownProps) => {
    const {
        clientId
    } = ownProps;

    const rowBlockId = select('core/block-editor').getBlockRootClientId(clientId); // getBlockHierarchyRootClientId
    const syncSize = select('core/block-editor').getBlockAttributes(rowBlockId).syncSize;
    const syncStyles = select('core/block-editor').getBlockAttributes(rowBlockId).syncStyles;
    const columnGap = select('core/block-editor').getBlockAttributes(rowBlockId).columnGap;

    return {
        syncSize,
        syncStyles,
        rowBlockId,
        columnGap,
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const {
        syncSize,
        syncStyles,
        columnGap,
        rowBlockId,
        clientId,
    } = ownProps;

    const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);
    let nestedColumns = [...originalNestedColumns];
    nestedColumns = pull(nestedColumns, clientId);
    const nestedColumnsNum = originalNestedColumns.length;

    const basicStyling = (id, object, avoidZero = true) => {
        const blockUniqueID = select('core/block-editor').getBlockAttributes(id).uniqueID;
        const meta = JSON.parse(select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles);

        const target = `${blockUniqueID}`;
        let obj = {};
        if (object.label === 'Background')
            obj = getBackgroundObject(object)
        if (object.label === 'Box Shadow')
            obj = getBoxShadowObject(object)
        else
            obj = object;

        const responsiveStyle = new ResponsiveStylesResolver(target, meta, obj, avoidZero);
        const response = JSON.stringify(responsiveStyle.getNewValue);

        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: response,
            },
        });
        new BackEndResponsiveStyles(meta);
    }

    const synchronizeStyles = attributes => {
        if (!syncStyles)
            return;

        let newStyles = { ...attributes };
        delete newStyles.uniqueID;
        delete newStyles.columnSize;
        delete newStyles.sizeTablet;
        delete newStyles.sizeMobile;

        nestedColumns.map(blockId => {
            dispatch('core/block-editor').updateBlockAttributes(blockId, newStyles)
                .then(
                    () => {
                        if (syncStyles) {
                            basicStyling(blockId, JSON.parse(newStyles.background), false);
                            basicStyling(blockId, JSON.parse(newStyles.boxShadow), false);
                            basicStyling(blockId, JSON.parse(newStyles.border), false);
                            basicStyling(blockId, JSON.parse(newStyles.border).borderWidth, false);
                            basicStyling(blockId, JSON.parse(newStyles.border).borderRadius, false);
                            basicStyling(blockId, JSON.parse(newStyles.size));
                            basicStyling(blockId, JSON.parse(newStyles.margin));
                            basicStyling(blockId, JSON.parse(newStyles.padding));
                        }
                    }
                )
        })
    }

    const getSizeSync = () => {
        return (100 - (nestedColumnsNum - 1) * columnGap * 2) / nestedColumnsNum;
    }

    const synchronizeColumns = () => {
        if (!syncSize)
            return;

        const newAttributes = {
            columnSize: getSizeSync(),
            sizeTablet: getSizeSync(),
            sizeMobile: getSizeSync(),
        }

        nestedColumns.map(blockId => {
            dispatch('core/block-editor').updateBlockAttributes(blockId, newAttributes)
        })
    }

    const getSizeUnsync = () => {
        let nestedColumnsSizes = [];
        originalNestedColumns.map(columnId => {
            nestedColumnsSizes.push(select('core/block-editor').getBlockAttributes(columnId).columnSize);
        });
        const totalNestedColumnsSizes = sum(nestedColumnsSizes) + (nestedColumnsSizes.length - 1) * columnGap * 2;
        const totalDiff = totalNestedColumnsSizes - 100;

        if (round(totalDiff) != 0)
            nestedColumns.map(columnId => {
                const columnSize = select('core/block-editor').getBlockAttributes(columnId).columnSize;
                const newSize = columnSize - round(totalDiff, 2) / 2 > columnGap * 1.2 ?
                    round(columnSize - round(totalDiff, 2) / 2, 2) :
                    columnGap;
                dispatch('core/block-editor').updateBlockAttributes(columnId, {
                    columnSize: newSize
                })
            })
    }

    const getColumnSize = attributes => {
        if (syncSize)
            return getSizeSync();
        if (!syncSize) {
            getSizeUnsync();
            return attributes.columnSize;
        }
    };

    const getMaxRangeSize = () => {
        return (100 - (nestedColumnsNum - 1) * columnGap * 3);
    }

    return {
        synchronizeColumns,
        synchronizeStyles,
        getColumnSize,
        getMaxRangeSize
    }
})

export default compose(editSelect, editDispatch)(edit);