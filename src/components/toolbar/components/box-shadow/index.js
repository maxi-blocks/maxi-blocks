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
 * Internal dependencies
 */
import BoxShadowControl from '../../../box-shadow-control';

/**
 * Icons
 */
import { toolbarStyle } from '../../../../icons';

/**
 * PaddingMargin
 */
const ALLOWED_BLOCKS = [
    'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/divider-maxi'
]

const PaddingMargin = props => {
    const { clientId } = props;

    const { blockName, boxShadow } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            return {
                blockName: getBlockName(clientId),
                boxShadow: getBlockAttributes(clientId).boxShadow,
            };
        },
        [clientId]
    );

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__box-shadow'
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
                    <BoxShadowControl
                        boxShadowOptions={JSON.parse(boxShadow)}
                        onChange={boxShadow => updateBlockAttributes(
                            clientId,
                            { boxShadow }
                        )}
                    />
                )
            }
        >
        </Dropdown>
    )
}

export default PaddingMargin;