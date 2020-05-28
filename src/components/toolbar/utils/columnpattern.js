/**
 * WordPress dependencies
 */
const {
    Icon,
    Dropdown,
    Button
} = wp.components;
const { useSelect } = wp.data;

/**
 * Internal dependencies
 */
import TEMPLATES from '../../../blocks/row-maxi/templates';

/**
 * Icons
 */
import { toolbarStyle } from '../../../icons';

/**
 * Column patterns
 * 
 * @todo Shows just row patterns with same existing number of columns
 */
const ColumnPatterns = props => {
    const { clientId } = props;

    const { blockType } = useSelect(
		( select ) => {
			const { getBlockName } = select(
                'core/block-editor',
            );
			const { getBlockType } = select(
                'core/blocks' 
            );
			return {
				blockType: getBlockType(getBlockName(clientId))
			};
		},
		[ clientId ]
    );
    if( blockType.name != 'maxi-blocks/row-maxi')
        return null;

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
                        icon={toolbarStyle}
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
        >
        </Dropdown>
    )
}

export default ColumnPatterns;