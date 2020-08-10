/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const {
    Fragment,
    forwardRef
} = wp.element;
const {
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import {
    MaxiBlock,
    __experimentalToolbar,
    __experimentalBreadcrumbs,
    __experimentalBlockPlaceholder,
    __experimentalShapeDivider,
    __experimentalBackgroundDisplayer,
    __experimentalArrowControl
} from '../../components';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getShapeDividerObject,
    getShapeDividerSVGObject,
    getArrowObject,
    getTransfromObject,
    getAlignmentTextObject,
    setBackgroundStyles
} from '../../utils'

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * InnerBlocks version
 */
const ContainerInnerBlocks = forwardRef((props, ref) => {
    const {
        children,
        shapeDivider,
        className,
        dataAlign,
        maxiBlockClass
    } = props;

    return (
        <__experimentalBlock
            ref={ref}
            className={className}
            data-align={dataAlign}
            data-gx_initial_block_class={maxiBlockClass}
        >
            <__experimentalShapeDivider
                shapeDividerOptions={shapeDivider}
            />
            <div
                className='maxi-container-block__wrapper'
            >
                <div
                    className='maxi-container-block__container'
                >
                    {children}
                </div>
            </div>
            <__experimentalShapeDivider
                position='bottom'
                shapeDividerOptions={shapeDivider}
            />
        </__experimentalBlock>
    )
})

/**
 * Edit
 */
class edit extends MaxiBlock {
    get getObject() {
        const {
            uniqueID,
            background,
            backgroundHover
        } = this.props.attributes;

        let response = {
            [uniqueID]: this.getNormalObject,
            [`${uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}:before`]: this.getBeforeObject,
            [`${uniqueID}>.maxi-container-block__wrapper`]: this.getWrapperObject,
            [`${uniqueID}>.maxi-container-block__wrapper>.maxi-container-block__container`]: this.getContainerObject,
            [`${uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
            [`${uniqueID} .maxi-shape-divider__top`]: { shapeDivider: { ...getShapeDividerObject(JSON.parse(this.props.attributes.shapeDivider).top) } },
            [`${uniqueID} .maxi-shape-divider__top svg`]: { shapeDivider: { ...getShapeDividerSVGObject(JSON.parse(this.props.attributes.shapeDivider).top) } },
            [`${uniqueID} .maxi-shape-divider__bottom`]: { shapeDivider: { ...getShapeDividerObject(JSON.parse(this.props.attributes.shapeDivider).bottom) } },
            [`${uniqueID} .maxi-shape-divider__bottom svg`]: { shapeDivider: { ...getShapeDividerSVGObject(JSON.parse(this.props.attributes.shapeDivider).bottom) } },
        }

        response = Object.assign(
            response,
            setBackgroundStyles(uniqueID, background, backgroundHover)
        )

        return response;
    }

    get getNormalObject() {
        const {
            size,
            opacity,
            border,
            boxShadow,
            zIndex,
            position,
            display,
            transform
        } = this.props.attributes;

        const response = {
            size: { ...JSON.parse(size) },
            border: { ...JSON.parse(border) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            opacity: { ...JSON.parse(opacity) },
            zindex: { ...JSON.parse(zIndex) },
            position: { ...JSON.parse(position) },
            positionOptions: { ...JSON.parse(position).options },
            display: { ...JSON.parse(display) },
            transform: { ...getTransfromObject(JSON.parse(transform)) },
            container: {
                label: 'Container',
                general: {},
            }
        };

        return response;
    }
    get getBeforeObject() {

        const { arrow } = this.props.attributes;

        const response = {
            arrow: { ...getArrowObject(JSON.parse(arrow)) }
        }

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            borderHover,
            boxShadowHover,
        } = this.props.attributes;

        const response = {
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
            borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
            opacityHover: { ...JSON.parse(opacityHover) }
        };

        return response;
    }

    get getWrapperObject() {
        const {
            margin,
            padding,
        } = this.props.attributes;

        const response = {
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
        };

        return response;
    }

    get getContainerObject() {
        const {
            sizeContainer,
        } = this.props.attributes;

        const response = {
            sizeContainer: { ...JSON.parse(sizeContainer) }
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
            hoverAnimationTitleTypography: { ...JSON.parse(hoverAnimationTitleTypography) },
            hoverAnimationTitleAlignmentTypography: { ...getAlignmentTextObject(JSON.parse(hoverAnimationTitleTypography).textAlign) }
        };

        return response
    }

    get getHoverAnimationTextContentObject() {
        const {
            hoverAnimationContentTypography
        } = this.props.attributes;

        const response = {
            hoverAnimationContentTypography: { ...JSON.parse(hoverAnimationContentTypography) },
            hoverAnimationContentAlignmentTypography: { ...getAlignmentTextObject(JSON.parse(hoverAnimationContentTypography).textAlign) }
        };

        return response
    }

    render() {
        const {
            attributes: {
                uniqueID,
                isFirstOnHierarchy,
                blockStyle,
                defaultBlockStyle,
                fullWidth,
                extraClassName,
                background,
                hoverAnimation,
                hoverAnimationType,
                hoverAnimationTypeText,
                hoverAnimationDuration,
                shapeDivider,
            },
            className,
            clientId,
            hasInnerBlock,
        } = this.props;

        const classes = classnames(
            'maxi-block maxi-container-block',
            `maxi-motion-effect maxi-motion-effect-${uniqueID}`,
            uniqueID,
            blockStyle,
            extraClassName,
            'hover-animation-' + hoverAnimation,
            'hover-animation-type-' + hoverAnimationType,
            'hover-animation-type-text-' + hoverAnimationTypeText,
            'hover-animation-duration-' + hoverAnimationDuration,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBreadcrumbs />,
            <Fragment>
                {
                    isFirstOnHierarchy && fullWidth &&
                    <__experimentalBlock.section
                        className={classes}
                        data-align={fullWidth}
                        data-maxi_initial_block_class={defaultBlockStyle}
                    >
                        <__experimentalBackgroundDisplayer
                            backgroundOptions={background}
                            uniqueID={uniqueID}

                        />
                        <__experimentalShapeDivider
                            shapeDividerOptions={shapeDivider}
                        />
                        <div
                            className='maxi-container-block__wrapper'
                        >
                            <InnerBlocks
                                templateLock={false}
                                __experimentalTagName='div'
                                __experimentalPassedProps={{
                                    className: 'maxi-container-block__container',
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
                        </div>
                        <__experimentalShapeDivider
                            position='bottom'
                            shapeDividerOptions={shapeDivider}
                        />
                    </__experimentalBlock.section>
                }
                {
                    (!isFirstOnHierarchy || !fullWidth) &&
                    <InnerBlocks
                        templateLock={false}
                        __experimentalTagName={ContainerInnerBlocks}
                        __experimentalPassedProps={{
                            className: classes,
                            dataAlign: fullWidth,
                            maxiBlockClass: defaultBlockStyle,
                            shapeDivider: shapeDivider,
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
                }
            </
            Fragment>

        ];
    }
}

export default withSelect((select, ownProps) => {
    const { clientId } = ownProps;

    const hasInnerBlock = !isEmpty(select('core/block-editor').getBlockOrder(clientId));
    let deviceType = select('core/edit-post').__experimentalGetPreviewDeviceType();
    deviceType = deviceType === 'Desktop' ?
        'general' :
        deviceType;

    return {
        hasInnerBlock,
        deviceType
    }
})(edit)