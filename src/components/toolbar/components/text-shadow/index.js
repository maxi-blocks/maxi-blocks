/**
 * Internal dependencies
 */
import TextShadowControl from '../../../text-shadow-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDropShadow } from '../../../../icons';

/**
 * TextShadow
 */
const TextShadow = props => {
    const {
        blockName,
        typography,
        onChange
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    let value = typeof typography != 'object' ?
        JSON.parse(typography) :
        typography;

    return (
        <ToolbarPopover
            className='toolbar-item__box-shadow'
            icon={toolbarDropShadow}
            content={(
                <TextShadowControl
                    boxShadowOptions={value.desktop['text-shadow']}
                    onChange={boxShadow => {
                        value.desktop['text-shadow'] = boxShadow;
                        onChange(JSON.stringify(value))
                    }}
                />
            )}
        />
    )
}

export default TextShadow;