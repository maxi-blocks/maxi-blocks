/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
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
import { toolbarStyle } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
    const { clientId } = props;

    const { padding, margin } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            return {
                padding: getBlockAttributes(clientId).padding,
                margin: getBlockAttributes(clientId).margin,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockType.name != 'maxi-blocks/text-maxi')
        return null;

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
                    <Fragment>
                        
                    </Fragment>
                )
            }
        >
        </Dropdown>
    )
}

export default PaddingMargin;