/**
 * WordPress dependencies
 */
const {
    select,
    withSelect
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
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject
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
                general: {}
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

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                defaultBlockStyle,
                fullWidth,
                extraClassName,
            },
            className,
            clientId,
            isSelected,
            hasInnerBlock,
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-container-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        /**
         * Check if current block or children is select
         * 
         * todo: should go to withSelect
         */
        const isSelect = () => {
            const selectedBlock = select('core/editor').getSelectedBlockClientId();
            const nestedColumns = select('core/block-editor').getBlockOrder(clientId);
            return nestedColumns.includes(selectedBlock) || clientId === selectedBlock;
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBreadcrumbs />,
            <InnerBlocks
                templateLock={false}
                __experimentalTagName={__experimentalBlock.div}
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