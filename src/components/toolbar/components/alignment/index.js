/**
 * Internal dependencies
 */
import AlignmentControl from '../../../alignment-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarAlign } from '../../../../icons';

/**
 * Alignment
 */
const ALLOWED_BLOCKS = [
    'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/divider-maxi'
]

const Alignment = props => {
    const {
        blockName,
        alignmentDesktop,
        onChange
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__alignment'
            icon={toolbarAlign}
            content={(
                <AlignmentControl
                    value={alignmentDesktop}
                    onChange={alignmentDesktop => onChange(alignmentDesktop)}
                    disableJustify={
                        blockName === 'maxi-blocks/text-maxi' ?
                            false :
                            true
                    }
                />
            )}
        />
    )
}

export default Alignment;