/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    useSelect,
    useDispatch
} = wp.data;

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
        clientId,
        blockName
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    const { alignment, alignmentDesktop } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                alignment: attributes ? attributes.alignment : null,
                alignmentDesktop: attributes ? attributes.alignmentDesktop : null,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    return (
        <ToolbarPopover
            className='toolbar-item__alignment'
            icon={toolbarAlign}
            content={(
                <Fragment>
                    {
                        alignment &&
                        <AlignmentControl
                            value={alignment}
                            onChange={alignment => updateBlockAttributes(
                                clientId,
                                { alignment }
                            )}
                            disableJustify={
                                blockName === 'maxi-blocks/text-maxi' ?
                                    false :
                                    true
                            }
                        />
                    }
                    {
                        alignmentDesktop &&
                        <AlignmentControl
                            value={alignmentDesktop}
                            onChange={alignmentDesktop => updateBlockAttributes(
                                clientId,
                                { alignmentDesktop }
                            )}
                            disableJustify={
                                blockName === 'maxi-blocks/text-maxi' ?
                                    false :
                                    true
                            }
                        />
                    }
                </Fragment>
            )}
        />
    )
}

export default Alignment;