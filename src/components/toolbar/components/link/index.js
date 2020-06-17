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
    const { 
        linkSettings,
        onChange
    } = props;

    return (
        <ToolbarPopover
            className='toolbar-item__link'
            icon={toolbarLink}
            content={(
                <__experimentalLinkControl
                    className="toolbar-item__popover__link-control"
                    value={JSON.parse(linkSettings)}
                    onChange={value => onChange(JSON.stringify(value))
                    }
                />
            )}
        />
    )
}

export default Link;