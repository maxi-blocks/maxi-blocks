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
 * Internal dependencies
 */
import DimensionsControl from '../../dimensions-control';

/**
 * Icons
 */
import { toolbarPadding } from '../../../icons';

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

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__padding-margin'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarPadding}
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
                        <DimensionsControl
                            value={padding}
                            onChange={padding => updateBlockAttributes(
                                clientId,
                                {
                                    padding
                                }
                            )}
                        // target=">.maxi-column-block-content"
                        />
                        <DimensionsControl
                            value={margin}
                            onChange={margin => updateBlockAttributes(
                                clientId,
                                {
                                    margin
                                }
                            )}
                        // target=">.maxi-column-block-content"
                        />
                    </Fragment>
                )
            }
        >
        </Dropdown>
    )
}

export default PaddingMargin;