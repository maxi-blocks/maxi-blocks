/**
 * WordPress dependencies
 */
const {
    Icon,
    Dropdown,
    Button,
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Icons
 */
import { toolbarStyle } from '../../../icons';

/**
 * TextLevel
 */
const TextLevel = props => {
    const { clientId } = props;

    const { blockType, rawTypography, textLevel } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            const { getBlockType } = select(
                'core/blocks'
            );
            return {
                blockType: getBlockType(getBlockName(clientId)),
                rawTypography: getBlockAttributes(clientId).typography,
                textLevel: getBlockAttributes(clientId).textLevel,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockType.name != 'maxi-blocks/text-maxi')
        return null;

    const updateTypography = val => {
        typography.general.color = returnColor(val)

        updateBlockAttributes(
            clientId,
            {
                typography: JSON.stringify(typography)
            }
        )
    }

    let typography = JSON.parse(rawTypography);

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__text-level'
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
                    position: 'top center'
                }
            }
            renderContent={
                () => (
                    <div
                        class="toolbar-item__popover__wrapper toolbar-item__popover__text-level"
                    >
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'p'}
                        >
                            P
                        </Button>
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'h1'}
                        >
                            H1
                        </Button>
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'h2'}
                        >
                            H2
                        </Button>
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'h3'}
                        >
                            H3
                        </Button>
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'h4'}
                        >
                            H4
                        </Button>
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'h5'}
                        >
                            H5
                        </Button>
                        <Button
                            className="toolbar-item__popover__text-level__button"
                            aria-presed={textLevel === 'h6'}
                        >
                            H6
                        </Button>
                    </div>
                )
            }
        >
        </Dropdown>
    )
}

export default TextLevel;