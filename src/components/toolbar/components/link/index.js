/**
 * WordPress dependencies
 */
const { __experimentalLinkControl } = wp.blockEditor;

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
    const {
        blockName,
        linkSettings,
        onChange
    } = props;

    if (blockName == 'maxi-blocks/divider-maxi')
        return null;

    return (
        <ToolbarPopover
            icon={toolbarLink}
            content={(
                <__experimentalLinkControl
                    value={JSON.parse(linkSettings)}
                    onChange={value => onChange(JSON.stringify(value))
                    }
                />
            )}
        />
    )
}

export default Link;