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
import BorderControl from '../../../border-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Border
 */
const ALLOWED_BLOCKS = [
    'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    // 'maxi-blocks/divider-maxi'
]

const Border = props => {
    const {
        clientId,
        blockName,
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    const { border } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                blockName: getBlockName(clientId),
                border: attributes ? attributes.border : null,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    const value = typeof border != 'object' ?
        JSON.parse(border) :
        border;

    return (
        <ToolbarPopover
            className='toolbar-item__border'
            icon={(
                <div
                    className='toolbar-item__border__icon'
                    style={{
                        borderStyle: value.general['border-style'],
                        borderWidth: '1px',
                        borderColor: '#fff'
                    }}
                ></div>
            )}
            content={(
                <BorderControl
                    borderOptions={JSON.parse(border)}
                    onChange={border => updateBlockAttributes(
                        clientId,
                        { border }
                    )}
                />
            )}
        />
    )
}

export default Border;