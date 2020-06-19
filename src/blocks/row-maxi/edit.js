/**
 * WordPress dependencies
 */
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { compose } = wp.compose;
const {
    withSelect,
    withDispatch
} = wp.data;
const {
    Button,
    Icon,
} = wp.components;
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
    __experimentalBreadcrumbs
} from '../../components';
import Inspector from './inspector';
import TEMPLATES from './templates';
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
    isNil,
    uniqueId,
    isNumber
} from 'lodash';

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

class edit extends GXBlock {
    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}>div>div.block-editor-block-list__layout`]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}>div>div.block-editor-block-list__layout:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}>div.maxi-column-block`]: this.getColumnObject,
            [`${this.props.attributes.uniqueID}>div.block-editor-inner-blocks>div.block-editor-block-list__layout>div.maxi-column-block__resizer`]: this.getColumnObject
        }

        return response;
    }

    get getNormalObject() {
        const {
            horizontalAlign,
            verticalAlign,
            opacity,
            background,
            border,
            size,
            boxShadow,
            margin,
            padding,
            zIndex
        } = this.props.attributes;

        let response = {
            background: { ...getBackgroundObject(JSON.parse(background)) },
            boxShadow: { ...getBoxShadowObject(JSON.parse(boxShadow)) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth },
            borderRadius: { ...JSON.parse(border).borderRadius },
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            row: {
                label: "Row",
                general: {
                    'justify-content': horizontalAlign,
                    'align-content': verticalAlign,
                }
            }
        };

        if (isNumber(opacity))
            response.row.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.row.general['z-index'] = zIndex;

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
            row: {
                label: "Row",
                general: {}
            }
        };

        if (isNumber(opacityHover))
            response.row.general['opacity'] = opacityHover;

        return response;
    }

    get getColumnObject() {
        const { columnGap } = this.props.attributes;

        return {
            columnMargin: {
                label: "Columns margin",
                general: {
                    margin: `0 ${columnGap}%`
                }
            }
        };
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
                defaultBlockStyle,
                fullWidth
            },
            clientId,
            loadTemplate,
            selectOnClick,
            hasInnerBlock,
            className,
            setAttributes
        } = this.props;

        let classes = classnames(
            'maxi-block maxi-row-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className,
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBreadcrumbs />,
            <__experimentalBlock
                data-gx_initial_block_class={defaultBlockStyle}
                className={classes}
                data-align={fullWidth}
            >
                <InnerBlocks
                    // templateLock="insert"
                    allowedBlocks={ALLOWED_BLOCKS}
                    renderAppender={
                        !hasInnerBlock ?
                            () => (
                                <div
                                    class="maxi-row-template-wrapper"
                                    onClick={() => selectOnClick(clientId)}
                                >
                                    {
                                        TEMPLATES.map((template, i) => {
                                            return (
                                                <Button
                                                    className="maxi-row-template-button"
                                                    onClick={() => {
                                                        setAttributes({ rowPattern: i });
                                                        loadTemplate(i);
                                                    }}
                                                >
                                                    <Icon
                                                        className="maxi-row-template-icon"
                                                        icon={template.icon}
                                                    />
                                                </Button>
                                            )
                                        })
                                    }
                                </div>
                            ) :
                            false
                    }
                />
            </__experimentalBlock>
        ];
    }
}

const editSelect = withSelect((select, ownProps) => {
    const { clientId } = ownProps

    const selectedBlockId = select('core/block-editor').getSelectedBlockClientId();
    const originalNestedBlocks = select('core/block-editor').getBlockParents(selectedBlockId);
    const hasInnerBlock = !isEmpty(select('core/block-editor').getBlockOrder(clientId));

    return {
        selectedBlockId,
        originalNestedBlocks,
        hasInnerBlock
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const { clientId } = ownProps;

    /**
     * Creates uniqueID for columns on loading templates
     */
    const uniqueIdCreator = () => {
        const newID = uniqueId('maxi-column-maxi-');
        if (!isEmpty(document.getElementsByClassName(newID)) || !isNil(document.getElementById(newID)))
            uniqueIdCreator();

        return newID;
    }

    /**
     * Loads template into InnerBlocks
     * 
     * @param {integer} i Element of object TEMPLATES
     * @param {function} callback 
     */
    const loadTemplate = i => {
        const template = TEMPLATES[i];
        template.content.map(column => {
            column[1].uniqueID = uniqueIdCreator();
        })

        const newAttributes = template.attributes;
        dispatch('core/block-editor').updateBlockAttributes(clientId, newAttributes);

        const newTemplate = synchronizeBlocksWithTemplate([], template.content);
        dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate)
    }

    /**
     * Block selector
     * 
     * @param {string} id Block id to select
     */
    const selectOnClick = (id) => {
        dispatch('core/editor').selectBlock(id);
    }

    return {
        loadTemplate,
        selectOnClick,
    }
})

export default compose(
    editSelect,
    editDispatch
)(edit);