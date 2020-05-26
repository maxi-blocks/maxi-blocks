/**
 * WordPress dependencies
 */
const { __experimentalLinkControl } = wp.blockEditor;
const {
    Icon,
    Dropdown,
    Button
} = wp.components;
const {
    useSelect,
    useDispatch
} = wp.data;

/**
 * Icons
 */
import { toolbarLink } from '../../../icons';

/**
 * Link
 */
const Link = props => {
    const { clientId } = props;

	const { linkSettings } = useSelect(
		( select ) => {
			const { getBlockAttributes } = select(
				'core/block-editor'
            );
			return {
				linkSettings: getBlockAttributes( clientId ).linkSettings,
			};
		},
		[ clientId ]
	);

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__link'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarLink}
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
                    <__experimentalLinkControl
                        className="toolbar-item__popover__link-control"
                        value={JSON.parse(linkSettings)}
                        onChange={value => 
                            updateBlockAttributes(clientId, { linkSettings: JSON.stringify(value) })
                        }
                    />
                )
            }
        >
        </Dropdown>
    )
}

export default Link;