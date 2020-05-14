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
    dispatch
} = wp.data;
const {
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import { GXBlock } from '../../components';
import Inspector from './inspector';
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
    state = {
        originalWidth: 0,
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
        const node = document.querySelector(`.gx-column-block-resizer-${clientId} .components-resizable-box__handle`);
        if (!isNil(node))
            node.style.transform = `translateX(${value}px)`;
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
            'gx-block gx-column-block',
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
            <Fragment>
                {
                    rowBlockWidth === 0 &&
                    <Spinner />
                }
                {
                    rowBlockWidth != 0 &&
                    <ResizableBox
                        className={classnames(
                            "gx-column-block-resizer",
                            `gx-column-block-resizer-${clientId}`,
                            columnPosition
                        )}
                        size={{
                            width: `${columnSize}%`
                        }}
                        minWidth={`${columnGap}%`}
                        maxWidth="100%"
                        enable={{
                            top: false,
                            right: columnPosition != 'gx-column-right' ? true : false,
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
                                className="gx-column-block-content"
                            >
                                <InnerBlocks
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
                return 'gx-column-left';
            case originalNestedColumns.length - 1:
                return 'gx-column-right';
            default:
                return 'gx-column-center';
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

    const basicStyling = (id, object, avoidZero = true) => {
        const blockUniqueID = select('core/block-editor').getBlockAttributes(id).uniqueID;
        const meta = JSON.parse(select('core/editor').getEditedPostAttribute('meta')._gutenberg_extra_responsive_styles);

        const target = `${blockUniqueID}">.gx-column-block-content"`;
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

        const newColumnNode = document.querySelector(`.gx-column-block-resizer-${newColumnId}`);
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