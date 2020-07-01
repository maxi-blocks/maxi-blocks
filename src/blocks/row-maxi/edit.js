/**
 * WordPress dependencies
 */
const { synchronizeBlocksWithTemplate } = wp.blocks;
const {
    compose,
    withInstanceId
} = wp.compose;
const {
    select,
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
    MaxiBlock,
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
    isNumber,
    round,
    sum
} from 'lodash';

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

class edit extends MaxiBlock {
    get getObject() {
        let response = {
            [this.props.attributes.uniqueID]: this.getNormalObject,
            [`${this.props.attributes.uniqueID}:hover`]: this.getHoverObject,
            [`${this.props.attributes.uniqueID}>.maxi-column-block`]: this.getColumnObject,
            [`${this.props.attributes.uniqueID}>.maxi-column-block__resizer`]: this.getColumnObject
        }

        return response;
    }

    get getNormalObject() {
        const {
            wrap,
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
                general: {},
                breakpoints: {
                    wrap: {
                        content: 'flex-wrap: wrap;'
                    }
                }
            },
        };

        if (isNumber(opacity))
            response.row.general['opacity'] = opacity;
        if (isNumber(zIndex))
            response.row.general['z-index'] = zIndex;
        if (isNumber(wrap))
            response.row.breakpoints.wrap.rule = `max-width:${wrap}px`;

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
        const {
            wrap,
            columnGap
        } = this.props.attributes;

        let response = {
            columnMargin: {
                label: "Columns margin",
                general: {
                    margin: `0 ${columnGap}%`
                },
                breakpoints: {
                    wrap: {
                        content: 'flex: 0 0 100% !important;max-width: 100% !important;margin: inherit !important;'
                    }
                }
            },
        };

        if (isNumber(wrap))
            response.columnMargin.breakpoints.wrap.rule = `max-width:${wrap}px`;

        return response;
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
                defaultBlockStyle,
                fullWidth,
            },
            clientId,
            loadTemplate,
            selectOnClick,
            hasInnerBlock,
            hoverAnimation,
            hoverAnimationDuration,
            className,
            setAttributes,
            instanceId
        } = this.props;

        const classes = classnames(
            'maxi-block maxi-row-block',
            uniqueID,
            blockStyle,
            'hover-animation-type-'+hoverAnimation,
            'hover-animation-duration-'+hoverAnimationDuration,
            extraClassName,
            className,
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar {...this.props} />,
            <__experimentalBreadcrumbs />,
            <InnerBlocks
                // templateLock={'insert'}
                __experimentalTagName={__experimentalBlock.div}
                __experimentalPassedProps={{
                    className: classes,
                    ['data-align']: fullWidth,
                    ['data-gx_initial_block_class']: defaultBlockStyle
                }}
                allowedBlocks={ALLOWED_BLOCKS}
                renderAppender={
                    !hasInnerBlock ?
                        () => (
                            <div
                                className="maxi-row-block__template"
                                onClick={() => selectOnClick(clientId)}
                                key={`maxi-row-block--${instanceId}`}
                            >
                                {
                                    TEMPLATES.map((template, i) => {
                                        return (
                                            <Button
                                                className="maxi-row-block__template__button"
                                                onClick={() => {
                                                    setAttributes({ rowPattern: i });
                                                    loadTemplate(i);
                                                }}
                                            >
                                                <Icon
                                                    className="maxi-row-block__template__icon"
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
        hasInnerBlock,
    }
})

const editDispatch = withDispatch((dispatch, ownProps) => {
    const {
        clientId,

    } = ownProps;

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
        dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate);

        onChangeColumnGap(newAttributes.columnGap)
    }

    /**
     * Block selector
     *
     * @param {string} id Block id to select
     */
    const selectOnClick = (id) => {
        dispatch('core/editor').selectBlock(id);
    }

    const onChangeColumnGap = columnGap => {
        const nestedBlocks = select('core/block-editor').getBlockOrder(clientId);
        let columnSizes = {};
        nestedBlocks.map(columnId => {
            columnSizes[columnId] = select('core/block-editor').getBlockAttributes(columnId).columnSize;
        })

        const totalSize = round(sum(Object.values(columnSizes)), 2);
        const realSize = (100 - ((nestedBlocks.length - 1) * columnGap) * 2);
        const diffSizeXUnit = (realSize - totalSize) / nestedBlocks.length;

        for (let [key, value] of Object.entries(columnSizes)) {
            const newValue = round(Number(value + diffSizeXUnit), 2);

            dispatch('core/block-editor').updateBlockAttributes(
                key,
                {
                    columnSize: newValue
                }
            )
                .then(() => document.querySelector(`.maxi-column-block__resizer__${key}`).style.width = `${newValue}%`)
        }
    }

    return {
        loadTemplate,
        selectOnClick,
        onChangeColumnGap,
    }
})

export default compose(
    editSelect,
    editDispatch,
    withInstanceId
)(edit);