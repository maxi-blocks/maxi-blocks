/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
    SelectControl,
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Internal dependencies
 */
import FullSizeControl from '../../../full-size-control';

/**
 * Icons
 */
import { toolbarSettings } from '../../../../icons';

/**
 * Size
 */
const Size = props => {
    const {
        clientId,
        blockName
    } = props;

    if (blockName === 'maxi-blocks/image-maxi')
        return null;

    const { fullWidth, size } = useSelect(
        select => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                fullWidth: attributes ? attributes.fullWidth : null,
                size: attributes ? attributes.size : null,
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
                    className='toolbar-item__size'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarSettings}
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
                    <Fragment>
                        <SelectControl
                            label={__('Fullwidth', 'maxi-blocks')}
                            value={fullWidth}
                            options={[
                                { label: __('No', 'maxi-blocks'), value: 'normal' },
                                { label: __('Yes', 'maxi-blocks'), value: 'full' }
                            ]}
                            onChange={fullWidth => updateBlockAttributes(
                                clientId,
                                { fullWidth }
                            )}
                        />
                        <FullSizeControl
                            sizeSettings={size}
                            onChange={size => updateBlockAttributes(
                                clientId,
                                { size }
                            )}
                        />
                    </Fragment>
                )
            }
        />
    )
}

export default Size;