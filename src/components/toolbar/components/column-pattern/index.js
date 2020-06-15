/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const { synchronizeBlocksWithTemplate } = wp.blocks;
const {
    Icon,
    Dropdown,
    Button
} = wp.components;
const {
    select,
    useSelect,
    useDispatch
} = wp.data;

/**
 * Internal dependencies
 */
import TEMPLATES from '../../../../blocks/row-maxi/templates';

/**
 * External dependencies
 */
import {
    uniqueId,
    isEmpty,
    isNil
} from 'lodash'

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarColumnPattern } from '../../../../icons';

/**
 * Column patterns
 * 
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPatterns = props => {
    const { clientId, blockName } = props;

    if (blockName != 'maxi-blocks/row-maxi')
        return null;

    const { rowPattern, innerBlocks } = useSelect(
        select => {
            const {
                getBlockAttributes,
                getBlockOrder
            } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                rowPattern: attributes ? attributes.rowPattern : null,
                innerBlocks: getBlockOrder(clientId)
            };
        },
        [clientId]
    );

    const { updateBlockAttributes, replaceInnerBlocks } = useDispatch(
        'core/block-editor'
    );

    /**
     * Creates a new array with columns content before loading template for saving
     * current content and be ready to load in new columns
     * 
     * @param {object} blockIds Inner blocks ids of parent block
     * @param {array} newTemplate Parent array for nesting children
     * 
     * @returns {array} Array with saved content
     */
    const getcurrentContent = (blockIds, newTemplate = []) => {
        if (isNil(blockIds) || isEmpty(blockIds))
            return null;

        blockIds.map(id => {
            const blockName = select('core/block-editor').getBlockName(id);
            const blockAttributes = select('core/block-editor').getBlockAttributes(id);
            const innerBlocks = select('core/block-editor').getBlockOrder(id);

            let response;
            if (blockName === 'maxi-blocks/column-maxi')
                newTemplate.push(getcurrentContent(innerBlocks, response));
            else
                newTemplate.push([
                    blockName,
                    blockAttributes,
                    getcurrentContent(innerBlocks, response)
                ]);
        })

        return newTemplate;
    }

    /**
     * Merges an array with new template and current content
     * 
     * @param {array} template Columns template for load
     * @param {array} currentContent Content inside current template
     * 
     * @returns {array} Merged array with column template and current content
     */
    const expandWithNewContent = (template, currentContent) => {
        currentContent.map((content, i) => {
            if (!isNil(template[i]) && isNil(template[2]))
                template[i].push(content);
        })

        return template;
    }

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
        const currentContent = getcurrentContent(innerBlocks);
        const template = TEMPLATES[i];
        template.content.map(column => {
            column[1].uniqueID = uniqueIdCreator();
        })

        const newAttributes = template.attributes;
        updateBlockAttributes(clientId, newAttributes);

        const newTemplateContent = expandWithNewContent(template.content, currentContent);

        const newTemplate = synchronizeBlocksWithTemplate([], newTemplateContent);
        replaceInnerBlocks(clientId, newTemplate);
    }

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__column-pattern'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarColumnPattern}
                    />
                </Button>
            )}
            popoverProps={
                {
                    className: 'toolbar-item__popover',
                    noArrow: false,
                    position: 'center'
                }
            }
            renderContent={
                () => (
                    <div
                        class="toolbar-item__popover__wrapper toolbar-item__popover__column-pattern"
                    >
                        {
                            TEMPLATES.map((template, i) => (
                                <Button
                                    className="toolbar-item__popover__column-pattern__template-button"
                                    aria-pressed={rowPattern === i}
                                    onClick={() => loadTemplate(i)}
                                >
                                    <Icon
                                        className="toolbar-item__popover__column-pattern__template-button__icon"
                                        icon={template.icon}
                                    />
                                </Button>
                            )
                            )
                        }
                    </div>
                )
            }
        />
    )
}

export default ColumnPatterns;