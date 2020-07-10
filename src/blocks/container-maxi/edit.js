/**
 * WordPress dependencies
 */
const { withSelect } = wp.data;
const { Fragment } = wp.element;
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
    __experimentalBreadcrumbs,
    __experimentalBlockPlaceholder,
    __experimentalShapeDivider
} from '../../components';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getVideoBackgroundObject,
    getShapeDividerObject,
    getShapeDividerSVGObject,
} from '../../extensions/styles/utils'

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNumber,
} from 'lodash';

/**
 * Edit
 */
class edit extends MaxiBlock {
    get getObject() {

        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}>.maxi-container-block__container`]: this.getContainerObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__content`]: this.getHoverAnimationTextContentObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover .maxi-block-text-hover__title`]: this.getHoverAnimationTextTitleObject,
            [`${this.props.attributes.uniqueID} .maxi-block-text-hover`]: this.getHoverAnimationMainObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity:hover .hover_el`]: this.getHoverAnimationTypeOpacityObject,
            [`${this.props.attributes.uniqueID}.hover-animation-basic.hover-animation-type-opacity-with-colour:hover .hover_el:before`]: this.getHoverAnimationTypeOpacityColorObject,
            [`${this.props.attributes.uniqueID} .maxi-video-player video`]: { videoBackground: { ...getVideoBackgroundObject(JSON.parse(this.props.attributes.background).videoOptions) } },
            ['maxi-shape-divider__top']: { shapeDivider: { ...getShapeDividerObject(JSON.parse(this.props.attributes.shapeDivider)) } },
            ['maxi-shape-divider__top svg']: { shapeDivider: { ...getShapeDividerSVGObject(JSON.parse(this.props.attributes.shapeDivider)) } },
            ['maxi-shape-divider__bottom']: { shapeDividerBottom: { ...getShapeDividerObject(JSON.parse(this.props.attributes.shapeDividerBottom)) } },
            ['maxi-shape-divider__bottom svg']: { shapeDividerBottom: { ...getShapeDividerSVGObject(JSON.parse(this.props.attributes.shapeDividerBottom)) } },
        }

        return response;
    }

    get getNormalObject() {
        const {
            size,
            opacity,
            background,
            border,
            boxShadow,
            margin,
            padding,
            zIndex
        } = this.props.attributes;

        const response = {
            size: { ...JSON.parse(size) },
            background: { ...getBackgroundObject(JSON.parse(background)) },
            border: { ...JSON.parse(border) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            container: {
                label: 'Container',
                general: {},
            }
        };

        if (isNumber(opacity))
            response.container.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.container.general['z-index'] = zIndex;

        return response;
    }

    get getHoverObject() {
        const {
            opacityHover,
            backgroundHover,
            borderHover,
            boxShadowHover,
        } = this.props.attributes;

        const response = {
            backgroundHover: { ...getBackgroundObject(JSON.parse(backgroundHover)) },
            boxShadowHover: { ...getBoxShadowObject(JSON.parse(boxShadowHover)) },
            borderHover: { ...JSON.parse(borderHover) },
            borderWidthHover: { ...JSON.parse(borderHover).borderWidth },
            borderRadiusHover: { ...JSON.parse(borderHover).borderRadius },
            containerHover: {
                label: 'Container',
                general: {}
            }
        };

        if (isNumber(opacityHover))
            response.containerHover.general['opacity'] = opacityHover;

            return response;
    }

    get getContainerObject() {
        const {
            containerXl,
            maxWidthXl,
            containerLg,
            maxWidthLg,
            containerMd,
            maxWidthMd,
            containerSm,
            maxWidthSm,
            containerPadding
        } = this.props.attributes;

        const response = {
            container: {
                label: 'Container',
                general: {},
                breakpoints: {
                    sm: {},
                    md: {},
                    lg: {},
                    xl: {},
                }
            }
        };

        if (isNumber(containerPadding)){
            response.container.general['padding-left'] = `${containerPadding}px`;
            response.container.general['padding-right'] = `${containerPadding}px`;
        }
        if (isNumber(containerSm))
            response.container.breakpoints.sm.rule = `min-width:${containerSm}px`;
        if (isNumber(maxWidthSm))
            response.container.breakpoints.sm.content = `max-width: ${maxWidthSm}px`;
        if (isNumber(containerMd))
            response.container.breakpoints.md.rule = `min-width:${containerMd}px`;
        if (isNumber(maxWidthMd))
            response.container.breakpoints.md.content = `max-width: ${maxWidthMd}px`;
        if (isNumber(containerLg))
            response.container.breakpoints.lg.rule = `min-width:${containerLg}px`;
        if (isNumber(maxWidthLg))
            response.container.breakpoints.lg.content = `max-width: ${maxWidthLg}px`;
        if (isNumber(containerXl))
            response.container.breakpoints.xl.rule = `min-width:${containerXl}px`;
        if (isNumber(maxWidthXl))
            response.container.breakpoints.xl.content = `max-width: ${maxWidthXl}px`;

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
                shapeDividerBottom,
            },
            className,
            clientId,
            hasInnerBlock,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-container-block',
            uniqueID,
            blockStyle,
            extraClassName,
            'hover-animation-'+hoverAnimation,
            'hover-animation-type-'+hoverAnimationType,
            'hover-animation-type-text-'+hoverAnimationTypeText,
            'hover-animation-duration-'+hoverAnimationDuration,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBreadcrumbs />,
            <Fragment>
                <__experimentalShapeDivider
                    shapeDividerOptions={shapeDivider}
                />
                {
                    isFirstOnHierarchy && fullWidth &&
                    <__experimentalBlock.section
                        className={classes}
                        data-align={fullWidth}
                        data-gx_initial_block_class={defaultBlockStyle}
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
                        <__experimentalVideoPlayer videoOptions={background} />
                    </__experimentalBlock.section>
                }
                {
                    (!isFirstOnHierarchy || !fullWidth) &&
                    <InnerBlocks
                        templateLock={false}
                        __experimentalTagName={__experimentalBlock}
                        __experimentalPassedProps={{
                            className: classes,
                            ['data-align']: fullWidth,
                            ['data-gx_initial_block_class']: defaultBlockStyle
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
                <__experimentalShapeDivider
                    position="bottom"
                    shapeDividerOptions={shapeDividerBottom}
                />
            </Fragment>
        ];
    }
}

export default withSelect((select, ownProps) => {
    const { clientId } = ownProps;

    const hasInnerBlock = !isEmpty(select('core/block-editor').getBlockOrder(clientId));

    return {
        hasInnerBlock
    }
})(edit)