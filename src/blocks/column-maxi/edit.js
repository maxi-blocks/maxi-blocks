/**
 * WordPress dependencies
 */
const { compose } = wp.compose;
const { Fragment } = wp.element;
const {
    ResizableBox,
    Spinner,
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
        // this.spaceChecker();
        this.setResizeHandleStyles();
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
        const node = document.querySelector(`.maxi-column-block__resizer__${clientId} > span > .components-resizable-box__handle`);
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
            originalNestedColumns,
            setAttributes
        } = this.props;

        const { originalWidth } = this.state;

        let classes = classnames(
            'maxi-block',
            'maxi-column-block',
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

        const getColumnWidthDefault = () => {
            if (columnSize)
                return `${columnSize}%`;

            return `${100 / originalNestedColumns.length}%`;
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props}/>,
            <Fragment>
                {
                    rowBlockWidth === 0 &&
                    <Spinner />
                }
                {
                    rowBlockWidth != 0 &&
                    <ResizableBox
                        className={classnames(
                            "maxi-column-block__resizer",
                            `maxi-column-block__resizer__${clientId}`,
                            columnPosition
                        )}
                        defaultSize={{
                            width: getColumnWidthDefault()
                        }}
                        minWidth={`${columnGap}%`}
                        maxWidth="100%"
                        enable={{
                            top: false,
                            right: columnPosition != 'maxi-column-right',
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
                            redistributeColumnsSize(getResizePerCent(delta, originalWidth))
                        }}
                        onResizeStop={(event, direction, elt, delta) => {
                            setAttributes({
                                columnSize: round(getResizePerCent(delta, originalWidth), 1),
                            });
                            redistributeColumnsSize(getResizePerCent(delta, originalWidth), true);
                        }}
                    >
                        <__experimentalBlock.div
                            className={classes}
                            data-gx_initial_block_class={defaultBlockStyle}
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
        columnGap,
        rowBlockId,
        rowBlockWidth,
        clientId,
    } = ownProps;

    const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);
    let nestedColumns = [...originalNestedColumns];
    nestedColumns = pull(nestedColumns, clientId);
    const nestedColumnsNum = originalNestedColumns.length;

    const cloneStyles = () => {
        let newStyles = { ...ownProps.attributes };
        delete newStyles.uniqueID;
        delete newStyles.columnSize;
        delete newStyles.sizeTablet;
        delete newStyles.sizeMobile;

        nestedColumns.map(blockId => {
            if (blockId != clientId)
                dispatch('core/block-editor').updateBlockAttributes(blockId, newStyles)
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

    const redistributeColumnsSize = (newColumnSize, save = false) => {
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
        if (newSize < columnGap * 1.2)
            newSize = columnGap;

        const newColumnNode = document.querySelector(`.maxi-column-block__resizer__${newColumnId}`);
        if (!isNil(newColumnNode))
            newColumnNode.style.width = `${newSize}%`;

        if (save)
            dispatch('core/block-editor').updateBlockAttributes(
                newColumnId,
                {
                    columnSize: newSize
                }
            )
    }

    const getColumnMaxWidth = () => {
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

        const columnGapWidth = columnGap * (originalNestedColumns.length - 1);
        const maxWidth = round(100 - columnGapWidth - sum(restColumnSizes), 2);

        return maxWidth;
    }

    return {
        cloneStyles,
        getRowPerCentWOMargin,
        getResizePerCent,
        redistributeColumnsSize,
        getColumnMaxWidth
    }
})

export default compose(editSelect, editDispatch)(edit);