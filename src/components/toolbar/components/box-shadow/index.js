/**
 * Internal dependencies
 */
import BoxShadowControl from '../../../box-shadow-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDropShadow } from '../../../../icons';

/**
 * BoxShadow
 */
const ALLOWED_BLOCKS = [
    // 'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/divider-maxi',
    'maxi-blocks/section-maxi',
]

const BoxShadow = props => {
    const {
        blockName,
        boxShadow,
        onChange
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__box-shadow'
            icon={toolbarDropShadow}
            content={(
                <BoxShadowControl
                    boxShadowOptions={boxShadow}
                    onChange={boxShadow => onChange(boxShadow)}
                />
            )}
        />
    )
}

export default BoxShadow;