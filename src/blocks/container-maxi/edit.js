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
    __experimentalBlockPlaceholder
} from '../../components';
import Inspector from './inspector';
import {
    getBackgroundObject,
    getBoxShadowObject,
    getVideoBackgroundObject
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
            [`${this.props.attributes.uniqueID} .maxi-video-player video`]: { videoBackground: { ...getVideoBackgroundObject(JSON.parse(this.props.attributes.background).videoOptions) } },
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
            opacity: { ...JSON.parse(opacity) },
            zindex: { ...JSON.parse(zIndex) },
        };

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
            opacityHover: { ...JSON.parse(opacityHover) }
        };

        return response;
    }

    get getContainerObject() {
        const {
            sizeContainer,
        } = this.props.attributes;

        const response = {
            size: { ...JSON.parse(sizeContainer) }
        };

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
                background
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
            className
        );

        return [
            <Inspector {...this.props} />,
            // <__experimentalToolbar {...this.props} />,
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