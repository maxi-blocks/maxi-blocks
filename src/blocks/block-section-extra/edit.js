/**
 * WordPress dependencies
 */
const {
    select,
    dispatch,
    withSelect
} = wp.data;
const {
    InnerBlocks,
    __experimentalBlock
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import { GXBlock } from '../../components';
import Inspector from './inspector';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isNil,
    isEqual
} from 'lodash';

/**
 * Edit
 */
class edit extends GXBlock {
    state = {
        selectorBlocks: [],
    }

    componentDidMount() {
        this.uniqueIDChecker(this.props.attributes.uniqueID);
    }

    componentDidUpdate() {
        this.setSelectorBlocks();
    }

    setSelectorBlocks() {
        const {
            originalNestedBlocks,
            selectedBlockId
        } = this.props;

        if (isNil(originalNestedBlocks))
            return;

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

    render() {
        const {
            attributes: {
                uniqueID,
                isFirstOnHierarchy,
                blockStyle,
                extraClassName,
                defaultBlockStyle
            },
            className,
            clientId,
            hasInnerBlock,
        } = this.props;

        const { selectorBlocks } = this.state;

        let classes = classnames(
            'gx-block gx-section-block',
            uniqueID,
            blockStyle,
            extraClassName,
            className
        );

        /**
         * Block selector
         * 
         * @param {string} id Block id to select
         */
        const selectOnClick = id => {
            dispatch('core/editor').selectBlock(id);
        }

        /**
         * Check if current block or children is select
         */
        const isSelect = () => {
            const selectedBlock = select('core/editor').getSelectedBlockClientId();
            const nestedColumns = select('core/block-editor').getBlockOrder(clientId);
            return nestedColumns.includes(selectedBlock) || clientId === selectedBlock;
        }

        return [
            <Inspector {...this.props} />,
            <__experimentalBlock
                data-gx_initial_block_class={defaultBlockStyle}
                className={classes}
            >
                {
                    isFirstOnHierarchy &&
                    <div
                        className="gx-section-selector-wrapper"
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
                                        className="gx-section-selector-item-wrapper"
                                    >
                                        {
                                            i != 0 &&
                                            <span> > </span>
                                        }
                                        <span
                                            className="gx-section-selector-item"
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
                    templateLock={false}
                    renderAppender={
                        !hasInnerBlock || isSelect() ?
                            () => (
                                <InnerBlocks.ButtonBlockAppender />
                            ) :
                            false
                    }
                />
            </__experimentalBlock>
        ];
    }
}

export default withSelect((select, ownProps) => {
    const { clientId } = ownProps

    const selectedBlockId = select('core/block-editor').getSelectedBlockClientId();
    const originalNestedBlocks = select('core/block-editor').getBlockParents(selectedBlockId);
    const hasInnerBlock = select('core/block-editor').getBlockOrder(clientId).length >= 1;

    return {
        selectedBlockId,
        originalNestedBlocks,
        hasInnerBlock
    }
})(edit)