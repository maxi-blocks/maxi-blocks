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
    MaxiBlock,
    __experimentalVideoPlayer,
    __experimentalToolbar,
    __experimentalBlockPlaceholder
} from '../../components';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getVideoBackgroundObject
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
class edit extends MaxiBlock {
    state = {
        originalWidth: 0,
        styles: {},
        updating: false
    }

    componentDidUpdate() {
        this.setResizeHandleStyles();
        this.displayStyles();

        if (!select('core/editor').isSavingPost() && this.state.updating) {
            this.setState({
                updating: false
            })
            this.saveProps();
        }
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
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID} .maxi-video-player video`]: { videoBackground: { ...getVideoBackgroundObject(JSON.parse(this.props.attributes.background).videoOptions) } },
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
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
                verticalAlign,
                opacity,
                background,
                boxShadow,
                border,
                size,
                margin,
                padding,
                zIndex
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
        if (isNumber(zIndex))
            response.column.general['z-index'] = zIndex;
        if (isNumber(opacity))
            response.column.general['opacity'] = opacity;
        if (!isNil(verticalAlign))
            response.column.general['justify-content'] = verticalAlign;

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

    get getContentObject() {
        const {
            attributes: {
                opacity,
                background,
                boxShadow,
                border,
                size,
                margin,
                padding,
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

        if (isNumber(opacity))
            response.column.general['opacity'] = opacity;

        return response;
    }

    get getHoverAnimationMainObject() {
        const {
            hoverOpacity,
            hoverBackground,
            hoverBorder,
            hoverPadding,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverBackground)) },
            border: { ...JSON.parse(hoverBorder) },
            borderWidth: { ...JSON.parse(hoverBorder).borderWidth },
            borderRadius: { ...JSON.parse(hoverBorder).borderRadius },
            padding: { ...JSON.parse(hoverPadding) },
            animationHover: {
                label: 'Animation Hover',
                general: {}
            }
        };

        if (hoverOpacity)
            response.animationHover.general['opacity'] = hoverOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityObject() {
        const {
            hoverAnimationTypeOpacity,
        } = this.props.attributes;

        const response = {
            animationTypeOpacityHover: {
                label: 'Animation Type Opacity Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacity)
            response.animationTypeOpacityHover.general['opacity'] = hoverAnimationTypeOpacity;

        return response
    }

    get getHoverAnimationTypeOpacityColorObject() {
        const {
            hoverAnimationTypeOpacityColor,
            hoverAnimationTypeOpacityColorBackground,
        } = this.props.attributes;

        const response = {
            background: { ...getBackgroundObject(JSON.parse(hoverAnimationTypeOpacityColorBackground)) },
            animationTypeOpacityHoverColor: {
                label: 'Animation Type Opacity Color Hover',
                general: {}
            }
        };

        if (hoverAnimationTypeOpacityColor)
            response.animationTypeOpacityHoverColor.general['opacity'] = hoverAnimationTypeOpacityColor;

        return response
    }



    get getHoverAnimationTextTitleObject() {
        const {
            hoverAnimationTitleTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationTitleTypography: { ...JSON.parse(hoverAnimationTitleTypography) }
        };

        return response
    }

    get getHoverAnimationTextContentObject() {
        const {
            hoverAnimationContentTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationContentTypography: { ...JSON.parse(hoverAnimationContentTypography) }
        };

        return response
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                columnSize,
                background,
                extraClassName,
                defaultBlockStyle,
            },
            clientId,
            isSelected,
            className,
            rowBlockWidth,
            columnPosition,
            hasInnerBlock,
            getResizePerCent,
            redistributeColumnsSize,
            columnGap,
            originalNestedColumns,
            setAttributes,
            hoverAnimation,
            hoverAnimationDuration,
            hoverAnimationType,
            hoverAnimationTypeText
        } = this.props;

        const { originalWidth } = this.state;

        let classes = classnames(
            'maxi-block',
            'maxi-column-block',
            uniqueID,
            blockStyle,
            extraClassName,
            'hover-animation-'+hoverAnimation,
            'hover-animation-type-'+hoverAnimationType,
            'hover-animation-type-text-'+hoverAnimationTypeText,
            'hover-animation-duration-'+hoverAnimationDuration,
            className,
        );

        const size = typeof this.props.attributes.size != 'object' ?
            JSON.parse(this.props.attributes.size) :
            this.props.attributes.size;

        const getColumnWidthDefault = () => {
            if (columnSize)
                return `${columnSize}%`;

            return `${100 / originalNestedColumns.length}%`;
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <Fragment>
                {
                    rowBlockWidth === 0 &&
                    <Spinner />
                }
                {
                    rowBlockWidth != 0 &&
                    <ResizableBox
                        className={classnames(
                            'maxi-block__resizer',
                            "maxi-column-block__resizer",
                            `maxi-column-block__resizer__${clientId}`,
                            columnPosition
                        )}
                        defaultSize={{
                            width: getColumnWidthDefault()
                        }}
                        minWidth={`${columnGap}%`}
                        maxWidth={
                            !!size.desktop['max-width'] ?
                                `${size.desktop['max-width']}${size.desktop['max-widthUnit']}` :
                                '100%'
                        }
                        enable={{
                            top: false,
                            right: columnPosition != 'maxi-column-block--right',
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
                        <InnerBlocks
                            // allowedBlocks={ALLOWED_BLOCKS}
                            templateLock={false}
                            __experimentalTagName={__experimentalBlock.div}
                            __experimentalPassedProps={{
                                className: classes,
                                ['data-gx_initial_block_class']: defaultBlockStyle,
                            }}
                            renderAppender={
                                !hasInnerBlock ?
                                    () => (
                                        <__experimentalBlockPlaceholder
                                            clientId={clientId}
                                        />
                                    ) :
                                    true ?
                                        () => (
                                            <InnerBlocks.ButtonBlockAppender />
                                        ) :
                                        false
                            }
                        />
                        <__experimentalVideoPlayer videoOptions={background} />
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
    const columnGap = select('core/block-editor').getBlockAttributes(rowBlockId).columnGap;
    const rowBlockNode = document.querySelector(`div[data-block="${rowBlockId}"]`);
    const rowBlockWidth = !isNil(rowBlockNode) ? rowBlockNode.getBoundingClientRect().width : 0;
    const hasInnerBlock = select('core/block-editor').getBlockOrder(clientId).length >= 1;
    const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);

    const getPosition = () => {
        const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);
        switch (originalNestedColumns.indexOf(clientId)) {
            case 0:
                return 'maxi-column-block--left';
            case originalNestedColumns.length - 1:
                return 'maxi-column-block--right';
            default:
                return 'maxi-column-block--center';
        }
    }

    return {
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

        nestedColumns.map(blockId => {
            if (blockId != clientId)
                dispatch('core/block-editor').updateBlockAttributes(blockId, newStyles)
        })
    }

    const getRowPerCentWOMargin = () => {
        return ((100 - ((nestedColumnsNum - 1) * columnGap) * 2));
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