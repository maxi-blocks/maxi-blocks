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
    getColumnSizeObject,
    getTransfromObject,
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
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
        }

        const videoOptions = JSON.parse(this.props.attributes.background).videoOptions;
        if (!isNil(videoOptions) && !isEmpty(videoOptions.mediaURL))
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
                zIndex,
                position,
                display,
                transform
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
            position: { ...JSON.parse(position) },
            positionOptions: { ...JSON.parse(position).options },
            display: { ...JSON.parse(display) },
            transform: { ...getTransfromObject(JSON.parse(transform)) },
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
        const { 
            margin,
            display
        } = this.props.attributes;

        let response = {
            margin: { ...JSON.parse(margin) },
            display: { ...JSON.parse(display) }
        };

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
                size,
                columnSize,
                background,
                extraClassName,
                defaultBlockStyle,
            },
            clientId,
            className,
            rowBlockWidth,
            hasInnerBlock,
            deviceType,
            onDeviceTypeChange,
            originalNestedColumns,
            setAttributes,
            hoverAnimation,
            hoverAnimationDuration,
            hoverAnimationType,
            hoverAnimationTypeText
        } = this.props;

        onDeviceTypeChange();

        let classes = classnames(
            'maxi-block',
            'maxi-column-block',
            uniqueID,
            blockStyle,
            extraClassName,
            'hover-animation-' + hoverAnimation,
            'hover-animation-type-' + hoverAnimationType,
            'hover-animation-type-text-' + hoverAnimationTypeText,
            'hover-animation-duration-' + hoverAnimationDuration,
            className,
        );

        const sizeValue = !isObject(size) ?
            JSON.parse(size) :
            size;

        const columnValue = !isObject(columnSize) ?
            JSON.parse(columnSize) :
            columnSize;

        const getColumnWidthDefault = () => {
            if (columnValue[deviceType].size)
                return `${columnValue[deviceType].size}%`;

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
                        maxWidth={
                            !!sizeValue[deviceType]['max-width'] ?
                                `${sizeValue[deviceType]['max-width']}${sizeValue[deviceType]['max-widthUnit']}` :
                                '100%'
                        }
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
                                ['data-maxi_initial_block_class']: defaultBlockStyle,
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
    let deviceType = select('core/edit-post').__experimentalGetPreviewDeviceType();
    deviceType = deviceType === 'Desktop' ?
        'general' :
        deviceType;

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

    const onDeviceTypeChange = function () {
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