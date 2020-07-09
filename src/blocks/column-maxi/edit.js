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
    getVideoBackgroundObject,
    getOpacityObject,
    getColumnSizeObject
} from '../../extensions/styles/utils';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil,
    round,
    isObject,
    isEmpty
} from 'lodash';

/**
 * Editor
 */
class edit extends MaxiBlock {
    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`maxi-column-block__resizer__${this.props.attributes.uniqueID}`]: this.getResizerObject,
        }

        const videoOptions = JSON.parse(this.props.attributes.background).videoOptions;
        if(!isNil(videoOptions) && !isEmpty(videoOptions.mediaURL))
            Object.assign(
                response, 
                {
                    [`${this.props.attributes.uniqueID} .maxi-video-player video`]: 
                        { videoBackground: { ...getVideoBackgroundObject(videoOptions) } }
                }
            )

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
            opacity: { ...getOpacityObject(JSON.parse(opacity)) },
            zindex: { ...JSON.parse(zIndex) },
            columnSize: { ...getColumnSizeObject(JSON.parse(columnSize)) },
            column: {
                label: "Column",
                general: {},
            }
        };

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
            opacity: { ...getOpacityObject(JSON.parse(opacityHover)) },
        };

        return response;
    }

    get getResizerObject() {
        const { margin } = this.props.attributes;

        let response = {
            margin: { ...JSON.parse(margin) },
        };

        return response;
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                columnSize,
                extraClassName,
                defaultBlockStyle,
                hoverAnimation,
                hoverAnimationDuration,
                background,
            },
            clientId,
            className,
            rowBlockWidth,
            hasInnerBlock,
            deviceType,
            onDeviceTypeChange,
            originalNestedColumns,
            setAttributes
        } = this.props;

        onDeviceTypeChange();

        let classes = classnames(
            'maxi-block',
            'maxi-column-block',
            uniqueID,
            blockStyle,
            'hover-animation-type-' + hoverAnimation,
            'hover-animation-duration-' + hoverAnimationDuration,
            extraClassName,
            className,
        );

        const columnValue = !isObject(columnSize) ?
            JSON.parse(columnSize) :
            columnSize;

        const getColumnWidthDefault = () => {
            if (columnValue.general.size)
                return `${columnValue.general.size}%`;

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
                        ref={ref => console.log('ref', ref)}
                        className={classnames(
                            'maxi-block__resizer',
                            "maxi-column-block__resizer",
                            `maxi-column-block__resizer__${uniqueID}`,
                        )}
                        defaultSize={{
                            width: getColumnWidthDefault()
                        }}
                        minWidth='1%'
                        maxWidth='100%'
                        enable={{
                            top: false,
                            right: true,
                            bottom: false,
                            left: true,
                            topRight: false,
                            bottomRight: false,
                            bottomLeft: false,
                            topLeft: false,
                        }}
                        onResizeStop={(event, direction, elt, delta) => {
                            columnValue[deviceType].size = round(Number(elt.style.width.replace('%', '')));

                            setAttributes({
                                columnSize: JSON.stringify(columnValue),
                            });
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
    const rowBlockNode = document.querySelector(`div[data-block="${rowBlockId}"]`);
    const rowBlockWidth = !isNil(rowBlockNode) ? rowBlockNode.getBoundingClientRect().width : 0;
    const hasInnerBlock = select('core/block-editor').getBlockOrder(clientId).length >= 1;
    const originalNestedColumns = select('core/block-editor').getBlockOrder(rowBlockId);
    const deviceType = select('core/edit-post').__experimentalGetPreviewDeviceType() === 'Desktop' ?
        'general' :
        select('core/edit-post').__experimentalGetPreviewDeviceType();

    return {
        rowBlockId,
        rowBlockWidth,
        hasInnerBlock,
        originalNestedColumns,
        deviceType
    }
});

const editDispatch = withDispatch((dispatch, ownProps) => {
    const {
        attributes: {
            uniqueID,
            columnSize
        },
        deviceType,
    } = ownProps;

    const onDeviceTypeChange = function() {
        let newDeviceType = select('core/edit-post').__experimentalGetPreviewDeviceType();
        newDeviceType = newDeviceType === 'Desktop' ? 
            'general' : 
            newDeviceType;

        const allowedDeviceTypes = [
            'general',
            'xl',
            'l',
            'm',
            's',
        ];

        if (allowedDeviceTypes.includes(newDeviceType) && deviceType != newDeviceType) {
            const node = document.querySelector(`.maxi-column-block__resizer__${uniqueID}`);
            if (isNil(node))
                return;
            const newColumnSize = JSON.parse(columnSize);
            node.style.width = `${newColumnSize[newDeviceType].size}%`;
        }
    };

    return {
        onDeviceTypeChange
    }
});

export default compose(editSelect, editDispatch)(edit);