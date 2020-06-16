/**
 * WordPress dependencies
 */
const { __experimentalLinkControl } = wp.blockEditor;
const {
    useSelect,
    useDispatch
} = wp.data;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
    const { clientId } = props;

    const { linkSettings } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor'
            );
            const attributes = getBlockAttributes(clientId);
            return {
                linkSettings: attributes ? attributes.linkSettings : null,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    return (
        <ToolbarPopover
            className='toolbar-item__link'
            icon={toolbarLink}
            content={(
                <__experimentalLinkControl
                    className="toolbar-item__popover__link-control"
                    value={JSON.parse(linkSettings)}
                    onChange={value =>
                        updateBlockAttributes(clientId, { linkSettings: JSON.stringify(value) })
                    }
                />
            )}
        />
    )
}

export default Link;