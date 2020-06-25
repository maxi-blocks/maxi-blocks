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
    GXBlock,
    __experimentalToolbar,
    __experimentalBreadcrumbs,
    __experimentalBlockPlaceholder
} from '../../components';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject
} from '../../extensions/styles/utils'

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNumber
} from 'lodash';

/**
 * Edit
 */
class edit extends GXBlock {
    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}>.maxi-section-block__container`]: this.getContainerObject,
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
            section: {
                label: 'Section',
                general: {},
            }
        };

        if (isNumber(opacity))
            response.section.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.section.general['z-index'] = zIndex;

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
            sectionHover: {
                label: 'Section',
                general: {}
            }
        };

        if (isNumber(opacityHover))
            response.sectionHover.general['opacity'] = opacityHover;

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
            response.container.breakpoints.sm.value = `${containerSm}px`;
        if (isNumber(maxWidthSm))
            response.container.breakpoints.sm.content = `max-width: ${maxWidthSm}px`;
        if (isNumber(containerMd))
            response.container.breakpoints.md.value = `${containerMd}px`;
        if (isNumber(maxWidthMd))
            response.container.breakpoints.md.content = `max-width: ${maxWidthMd}px`;
        if (isNumber(containerLg))
            response.container.breakpoints.lg.value = `${containerLg}px`;
        if (isNumber(maxWidthLg))
            response.container.breakpoints.lg.content = `max-width: ${maxWidthLg}px`;
        if (isNumber(containerXl))
            response.container.breakpoints.xl.value = `${containerXl}px`;
        if (isNumber(maxWidthXl))
            response.container.breakpoints.xl.content = `max-width: ${maxWidthXl}px`;

        return response;
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
            },
            className,
            clientId,
            hasInnerBlock,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-section-block',
            uniqueID,
            blockStyle,
            extraClassName,
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
                        data-gx_initial_block_class={defaultBlockStyle}
                    >
                        <InnerBlocks
                            templateLock={false}
                            __experimentalTagName='div'
                            __experimentalPassedProps={{
                                className: 'maxi-section-block__container',
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