/**
 * WordPress dependencies
 */
const { Icon } = wp.components;

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

/**
 * Icons
 */
import {
    toolbarBorder,
} from '../../../../icons';

/**
 * Component
 */
const Border = props => {
    const {
        blockName,
        border,
        onChange,
        breakpoint
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
                        borderStyle: JSON.parse(border)[breakpoint]['border-style'],
                        background: JSON.parse(border)[breakpoint]['border-style'] === 'none'? 
                            'transparent' : 
                            JSON.parse(border)[breakpoint]['border-color'],
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: '#fff'
                    }}
                >
                    <Icon

                        className='toolbar-item__border__inner-icon'
                        icon={toolbarBorder}
                    />
                </div>
            )}
            content={(
                <BorderControl
                    border={border}
                    onChange={value => onChange(value)}
                    breakpoint={breakpoint}
                />
            )}
        />
    )
}

export default Border;