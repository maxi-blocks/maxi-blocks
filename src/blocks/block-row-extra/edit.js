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
import { GXBlock } from '../../components';
import Inspector from './inspector';
import TEMPLATES from './templates';

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
const ALLOWED_BLOCKS = ['gutenberg-extra/block-column-extra'];

class edit extends GXBlock {
    state = {
        selectorBlocks: [],
    }

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID);
        this.setStyles();
    }

    componentDidUpdate() {
        this.setStyles();
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

    get getColumnObject() {
        const { columnGap } = this.props.attributes;

        return {
            label: "Columns margin",
            general: {
                margin: `0 ${columnGap}%`
            }
        };
    }

    get getRowObject() {
        const {
            horizontalAlign,
            verticalAlign
        } = this.props.attributes;

        return {
            label: "Row align",
            general: {
                'justify-content': horizontalAlign,
                'align-content': verticalAlign
            }
        };
    }

    /**
    * Refresh the styles on Editor
    */
    displayStyles(type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(null, type),
            },
        });
    }

    /**
     * Set styles for row and columns
     */
    setStyles() {
        this.target = `${this.props.attributes.uniqueID}>div.gx-column-block`;
        this.displayStyles('columns');

        // This should be improved: row have same styling on front and backend, but on different targets
        this.target = `${this.props.attributes.uniqueID}>div.block-editor-inner-blocks>div.block-editor-block-list__layout>div.gx-column-block-resizer`;
        this.displayStyles('columns');

        this.target = `${this.props.attributes.uniqueID}`;
        this.displayStyles('row');

        // This should be improved: row have same styling on front and backend, but on different targets
        this.target = `${this.props.attributes.uniqueID}>div>div.block-editor-block-list__layout`;
        this.displayStyles('row');

        new BackEndResponsiveStyles(this.getMeta);
    }

    render() {
        const {
            attributes: {
                uniqueID,
                blockStyle,
                extraClassName,
            },
            clientId,
            loadTemplate,
            selectOnClick,
            hasInnerBlock,
            className,
        } = this.props;

        const { selectorBlocks } = this.state;

        let classes = classnames(
            'gx-block gx-row-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        return [
            <Inspector {...this.props} />,
            <__experimentalBlock
                className={classes}
            >
                {
                    selectorBlocks[0] === clientId &&
                    <div
                        className="gx-row-selector-wrapper"
                    >
                        {
                            !isNil(selectorBlocks) &&
                            selectorBlocks.map((blockId, i) => {
                                const blockName = wp.data.select('core/block-editor').getBlockName(blockId);
                                if (isNil(blockName)) // Check setTimeOut on componentDidUpdate()
                                    return;
                                const blockType = wp.data.select('core/blocks').getBlockType(blockName);
                                const title = blockType.title;

                                return (
                                    <div
                                        className="gx-row-selector-item-wrapper"
                                    >
                                        {
                                            i != 0 &&
                                            <span> > </span>
                                        }
                                        <span
                                            className="gx-row-selector-item"
                                            target={blockId}
                                            onClick={e => {
                                                selectOnClick(blockId);
                                                this.setState
                                            }}
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
                                    class="gx-row-template-wrapper"
                                    onClick={() => selectOnClick(clientId)}
                                >
                                    {
                                        TEMPLATES.map((template, i) => {
                                            return (
                                                <Button
                                                    className="gx-row-template-button"
                                                    onClick={() => {
                                                        loadTemplate(i, this.setStyles.bind(this));
                                                    }}
                                                >
                                                    <Icon
                                                        className="gx-row-template-icon"
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
    const hasInnerBlock = select('core/block-editor').getBlockOrder(clientId).length >= 1;

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
        const newID = uniqueId('gx-block-column-extra-');
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