/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Fragment } = wp.element;
const {
    ResizableBox,
    Spinner
} = wp.components;
const {
    withSelect,
    withDispatch,
    select,
} = wp.data;
const {
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    GXBlock,
    __experimentalToolbar
} from '../../components';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject
} from '../../extensions/styles/utils';

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
    state = {
        originalWidth: 0,
        styles: {}
    }

    componentDidUpdate() {
        this.spaceChecker();
        this.setResizeHandleStyles();
        this.props.synchronizeColumns(this.props.syncSize);
        this.props.synchronizeStyles(this.props.attributes)
        this.displayStyles();
    }

    spaceChecker() {
        if (isNil(this.props.attributes.originalNestedColumns))
            return;

        let totalSize = [];
        this.props.originalNestedColumns.map(columnId => {
            totalSize.push(select('core/block-editor').getBlockAttributes(columnId).columnSize);
        })

        if (round(sum(totalSize)) != round(this.props.getRowPerCentWOMargin()))
            this.props.redistributeColumnsSize(this.props.attributes.columnSize)
    }

    setResizeHandleStyles() {
        const {
            columnGap,
            rowBlockWidth,
            clientId
        } = this.props;

        const value = (columnGap * rowBlockWidth) / 100;
        const node = document.querySelector(`.maxi-column-block-resizer-${clientId} .components-resizable-box__handle`);
        if (!isNil(node))
            node.style.transform = `translateX(${value}px)`;
    }

    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject
        }

        return response;
    }

    /**
     * Get object for styling
     */
    get getNormalObject() {
        const {
            attributes: {
                columnSize,
                opacity,
                background,
                boxShadow,
                border,
                size,
                margin,
                padding
            },
        } = this.props;

        let response = {
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            column: {
                label: "Column",
                general: {},
            }
        };

        if (!isNil(columnSize) && isNumber(columnSize))
            if (columnSize != 0) {
                response.column.general['flex'] = `0 0 ${columnSize}%`;
                response.column.general['max-width'] = `${columnSize}%`;
            }
            else {
                response.column.general['flex'] = '0 0 auto';
                response.column.general['max-width'] = '';
            }
        if (isNumber(opacity))
            response.column.general['opacity'] = opacity;

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            backgroundHover,
            boxShadowHover,
            borderHover,
        } = this.props.attributes;

        let response = {
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
            borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
            columnHover: {
                label: "columnHover",
                general: {}
            }
        };

        if (isNumber(opacityHover))
            response.columnHover.general['opacity'] = opacityHover;

        return response;
    }

    render() {
        const ALLOWED_BLOCKS = wp.blocks.getBlockTypes().map(block => block.name)
            .filter(blockName => (blockName !== 'maxi-blocks/row-maxi' && blockName !== 'maxi-blocks/column-maxi'));

        const {
            attributes: {
                uniqueID,
                blockStyle,
                columnSize,
                extraClassName,
                defaultBlockStyle
            },
            clientId,
            className,
            rowBlockWidth,
            columnPosition,
            hasInnerBlock,
            getResizePerCent,
            redistributeColumnsSize,
            columnGap,
            syncSize,
            setAttributes
        } = this.props;

        const {
            originalWidth
        } = this.state;

        let classes = classnames(
            'maxi-block maxi-column-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        /**
         * Check if current block or children is select
         */
        const isSelect = () => {
            const selectedBlock = select('core/editor').getSelectedBlockClientId();
            const nestedColumns = select('core/block-editor').getBlockOrder(clientId);
            return nestedColumns.includes(selectedBlock) || clientId === selectedBlock;
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar />,
            <Fragment>
                {
                    rowBlockWidth === 0 &&
                    <Spinner />
                }
                {
                    rowBlockWidth != 0 &&
                    <ResizableBox
                        className={classnames(
                            "maxi-column-block-resizer",
                            `maxi-column-block-resizer-${clientId}`,
                            columnPosition
                        )}
                        size={{
                            width: `${columnSize}%`
                        }}
                        minWidth={`${columnGap}%`}
                        maxWidth="100%"
                        enable={{
                            top: false,
                            right: columnPosition != 'maxi-column-right' ? true : false,
                            bottom: false,
                            left: false,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        onResizeStart={(event, direction, elt, delta) => {
                            this.setState({
                                originalWidth: elt.getBoundingClientRect().width
                            })
                        }}
                        onResize={(event, direction, elt, delta) => {
                            setAttributes({
                                columnSize: round(getResizePerCent(delta, originalWidth), 1),
                            });
                            redistributeColumnsSize(getResizePerCent(delta, originalWidth))
                        }}
                        showHandle={!syncSize}
                    >
                        <__experimentalBlock.div
                            className={classes}
                            data-gx_initial_block_class={defaultBlockStyle}
                        >
                            <div
                                className="maxi-column-block-content"
                            >
                                <InnerBlocks
                                    // allowedBlocks={ALLOWED_BLOCKS}
                                    templateLock={false}
                                    renderAppender={
                                        !hasInnerBlock || isSelect() ?
                                            () => (
                                                <InnerBlocks.ButtonBlockAppender />
                                            ) :
                                            false
                                    }
                                />
                            </div>
                        </__experimentalBlock.div>
                    </ResizableBox>
                }
            </Fragment>
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
    const rowBlockNode = document.querySelector(`div[data-block="${rowBlockId}"]`);
    const rowBlockWidth = !isNil(rowBlockNode) ? rowBlockNode.getBoundingClientRect().width : 0;
    const hasInnerBlock = select('core/block-editor').getBlockOrder(clientId).length >= 1;
    const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);

    const getPosition = () => {
        const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);
        switch (originalNestedColumns.indexOf(clientId)) {
            case 0:
                return 'maxi-column-left';
            case originalNestedColumns.length - 1:
                return 'maxi-column-right';
            default:
                return 'maxi-column-center';
        }
    }

    return {
        syncSize,
        syncStyles,
        rowBlockId,
        rowBlockWidth,
        columnGap,
        columnPosition: getPosition(),
        hasInnerBlock,
        originalNestedColumns
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const {
        attributes: {
            columnSize
        },
        syncSize,
        syncStyles,
        columnGap,
        rowBlockId,
        rowBlockWidth,
        clientId,
    } = ownProps;

    const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);
    let nestedColumns = [...originalNestedColumns];
    nestedColumns = pull(nestedColumns, clientId);
    const nestedColumnsNum = originalNestedColumns.length;

    const basicStyling = (id, object) => { // With new GXBlock style delivery system may is no requried anymore
        const blockUniqueID = select('core/block-editor').getBlockAttributes(id).uniqueID;

        const target = `${blockUniqueID}">.maxi-column-block-content"`;
        let obj = {};
        if (object.label === 'Background')
            obj = getBackgroundObject(object)
        if (object.label === 'Box Shadow')
            obj = getBoxShadowObject(object)
        else
            obj = object;

        // const responsiveStyle = new ResponsiveStylesResolver(target, obj);
        // const response = JSON.stringify(responsiveStyle.getNewValue);

        // dispatch('core/editor').editPost({
        //     meta: {
        //         _gutenberg_extra_responsive_styles: response,
        //     },
        // });
        // new BackEndResponsiveStyles(meta);
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

    const synchronizeColumns = (forceUpdate = false) => {
        if (!syncSize && !forceUpdate)
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

    const getRowPerCentWOMargin = () => {
        return ((100 - (nestedColumnsNum - 1) * columnGap * 2));
    }

    const getResizePerCent = (delta, originalWidth) => {
        const newWidth = originalWidth + delta.width;
        const diffPerCent = newWidth / rowBlockWidth * getRowPerCentWOMargin();

        return diffPerCent;
    }

    const redistributeColumnsSize = newColumnSize => {
        let newColumnId = '';
        if (originalNestedColumns.indexOf(clientId) === originalNestedColumns.length - 1)
            newColumnId = originalNestedColumns[originalNestedColumns.length - 2]
        else
            newColumnId = select('core/block-editor').getAdjacentBlockClientId(clientId);

        let restColumnSizes = [];
        originalNestedColumns.map(columnId => {
            if (columnId === clientId || columnId === newColumnId)
                return;
            restColumnSizes.push(select('core/block-editor').getBlockAttributes(columnId).columnSize);
        })

        let newSize = round(getRowPerCentWOMargin() - newColumnSize - sum(restColumnSizes), 2);
        if (newSize < columnGap * 1.2) {
            newSize = columnGap;
        }

        const newColumnNode = document.querySelector(`.maxi-column-block-resizer-${newColumnId}`);
        if (!isNil(newColumnNode))
            newColumnNode.style.width = `${newSize}%`;

        dispatch('core/block-editor').updateBlockAttributes(newColumnId, {
            columnSize: newSize
        })
    }

    return {
        synchronizeColumns,
        synchronizeStyles,
        getRowPerCentWOMargin,
        getResizePerCent,
        redistributeColumnsSize,
    }
})

export default compose(editSelect, editDispatch)(edit);