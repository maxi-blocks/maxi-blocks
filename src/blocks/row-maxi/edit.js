/**
 * WordPress dependencies
 */
const { synchronizeBlocksWithTemplate } = wp.blocks;
const { compose } = wp.compose;
const {
    select,
    dispatch,
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
    __experimentalToolbar
} from '../../components';
import Inspector from './inspector';
import TEMPLATES from './templates';
import { BackEndResponsiveStyles } from '../../extensions/styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    uniqueId,
    isEqual
} from 'lodash';

/**
 * Edit
 */
const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

class edit extends GXBlock {
    state = {
        selectorBlocks: [],
    }

    componentDidUpdate() {
        this.displayStyles();
        this.setSelectorBlocks()
    }

    setSelectorBlocks() {
        const {
            originalNestedBlocks,
            selectedBlockId
        } = this.props;

        if (isNil(originalNestedBlocks))
            return

        let selectorBlockList = [];
        if (!isNil(selectedBlockId)) {
            selectorBlockList = [...originalNestedBlocks, selectedBlockId]
        }

        if (
            !isEqual(this.state.selectorBlocks, selectorBlockList)
        )
            setTimeout(() => {          // Should find an alternative       
                this.setState({ selectorBlocks: selectorBlockList });
            }, 10);
    }

    /**
     * Retrieve the target for responsive CSS
     */
    get getTarget() {
        return this.target;
    }

    get getObject() {
        if (this.type === 'columns')
            return this.getColumnObject
        if (this.type === 'row')
            return this.getRowObject
    }

    get getColumnObject() { // it will destroy column styles object!
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

    get getRowObject() {
        const {
            horizontalAlign,
            verticalAlign,
            background,
            boxShadow,
            border,
            size,
            margin,
            padding
        } = this.props.attributes;

        return {
            background: { ...JSON.parse(background) },
            boxShadow: { ...JSON.parse(boxShadow) },
            border: { ...JSON.parse(border) },
            borderWidth: { ...JSON.parse(border).borderWidth},
            borderRadius: {...JSON.parse(border).borderRadius},
            size: { ...JSON.parse(size) },
            margin: { ...JSON.parse(margin) },
            padding: { ...JSON.parse(padding) },
            rowAlign: {
                label: "Row align",
                general: {
                    'justify-content': horizontalAlign,
                    'align-content': verticalAlign
                }
            }
        };
    }

    /**
     * Set styles for row and columns
     */
    displayStyles() {
        this.target = `${this.props.attributes.uniqueID}>div.maxi-column-block`;
        this.saveMeta('columns');

        // This should be improved: row have same styling on front and backend, but on different targets
        this.target = `${this.props.attributes.uniqueID}>div.block-editor-inner-blocks>div.block-editor-block-list__layout>div.maxi-column-block-resizer`;
        this.saveMeta('columns');

        this.target = `${this.props.attributes.uniqueID}`;
        this.saveMeta('row');

        // This should be improved: row have same styling on front and backend, but on different targets
        this.target = `${this.props.attributes.uniqueID}>div>div.block-editor-block-list__layout`;
        this.saveMeta('row');

        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        const {
            attributes: {
                uniqueID,
                isFirstOnHierarchy,
                blockStyle,
                extraClassName,
                defaultBlockStyle
            },
            clientId,
            loadTemplate,
            selectOnClick,
            hasInnerBlock,
            className,
        } = this.props;

        const { selectorBlocks } = this.state;

        let classes = classnames(
            'maxi-block maxi-row-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalToolbar />,
            <__experimentalBlock
                data-gx_initial_block_class={defaultBlockStyle}
                className={classes}
            >
                {
                    isFirstOnHierarchy &&
                    <div
                        className="maxi-row-selector-wrapper"
                    >
                        {
                            !isNil(selectorBlocks) &&
                            selectorBlocks.map((blockId, i) => {
                                const blockName = select('core/block-editor').getBlockName(blockId);
                                if (isNil(blockName)) // Check setTimeOut on componentDidUpdate()
                                    return;
                                const blockType = select('core/blocks').getBlockType(blockName);
                                const title = blockType.title;

                                return (
                                    <div
                                        className="maxi-row-selector-item-wrapper"
                                    >
                                        {
                                            i != 0 &&
                                            <span> > </span>
                                        }
                                        <span
                                            className="maxi-row-selector-item"
                                            target={blockId}
                                            onClick={() => selectOnClick(blockId)}
                                        >
                                            {title}
                                        </span>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
                <InnerBlocks
                    // templateLock="insert"
                    allowedBlocks={ALLOWED_BLOCKS}
                    // __experimentalMoverDirection="horizontal" // ???
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
                                                        loadTemplate(i, this.displayStyles.bind(this));
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
    const loadTemplate = async (i, callback) => {
        const template = TEMPLATES[i];
        template.content.map(column => {
            column[1].uniqueID = uniqueIdCreator();
        })

        const newAttributes = template.attributes;
        dispatch('core/block-editor').updateBlockAttributes(clientId, newAttributes);

        const newTemplate = synchronizeBlocksWithTemplate([], template.content);
        dispatch('core/block-editor').replaceInnerBlocks(clientId, newTemplate)
            .then(() => {
                callback();
            });
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