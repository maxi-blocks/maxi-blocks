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
]

const Border = props => {
    const {
        blockName,
        border, 
        onChange
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__border'
            icon={(
                <div
                    className='toolbar-item__border__icon'
                    style={{
                        borderStyle: JSON.parse(border).general['border-style'],
                        borderWidth: '1px',
                        borderColor: '#fff'
                    }}
                ></div>
            )}
            content={(
                <BorderControl
                    borderOptions={border}
                    onChange={value => onChange(value)}
                />
            )}
        />
    )
}

export default Border;