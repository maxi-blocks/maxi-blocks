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

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID, this.displayStyles.bind(this)); // May should go on constructor
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
                columnSize,
                columnGap,
                extraClassName,
            },
            getColumnSize,
            clientId,
            className,
            isSelected,
            rowBlockId,
            rowBlockWidth,
            columnPosition,
            hasInnerBlock,
            setAttributes
        } = this.props;

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

        const getResizePerCent = delta => {
            const rowBlockNode = document.querySelector(`div[data-block="${rowBlockId}"]`);
            const rowBlockWidth = rowBlockNode.getBoundingClientRect().width;
            const newWidth = this.state.originalWidth + delta.width;
            const diffPerCent = newWidth / rowBlockWidth * 100;

            return diffPerCent;
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
                            columnPosition
                        )}
                        size={{
                            width: (columnSize / 100) * rowBlockWidth
                        }}
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
                                columnSize: round(getResizePerCent(delta), 1),
                            });
                        }}
                        onResizeStop={(event, direction, elt, delta) => {
                            setAttributes({
                                columnSize: round(getResizePerCent(delta), 1),
                            });
                        }}
                        showHandle={true}
                    >
                        <__experimentalBlock.div
                            className={classes}
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
        hasInnerBlock
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