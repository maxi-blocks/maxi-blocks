/**
 * WordPress dependencies
 */
const {
    useSelect,
    useDispatch,
} = wp.data;

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
    'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/divider-maxi',
    'maxi-blocks/section-maxi',
]

const BoxShadow = props => {
    const {
        clientId,
        blockName
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    const { boxShadow } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                boxShadow: attributes ? attributes.boxShadow : null
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    return (
        <ToolbarPopover
            className='toolbar-item__box-shadow'
            icon={toolbarDropShadow}
            content={(
                <BoxShadowControl
                    boxShadowOptions={JSON.parse(boxShadow)}
                    onChange={boxShadow => updateBlockAttributes(
                        clientId,
                        { boxShadow }
                    )}
                />
            )}
        />
    )
}

export default BoxShadow;