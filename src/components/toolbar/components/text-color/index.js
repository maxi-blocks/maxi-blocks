/**
 * WordPress dependencies
 */
const { ColorPicker } = wp.components;
const { useDispatch } = wp.data;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarStyle } from '../../../../icons';

/**
 * TextColor
 */
const TextColor = props => {
    const {
        clientId,
        blockName,
        rawTypography
    } = props;

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const updateTypography = val => {
        typography.general.color = returnColor(val)

        updateBlockAttributes(
            clientId,
            {
                typography: JSON.stringify(typography)
            }
        )
    }

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    }

    let typography = JSON.parse(rawTypography);

    if(!typography)
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            icon={toolbarStyle}
            content={(
                <ColorPicker
                    color={typography.general.color}
                    onChangeComplete={val => updateTypography(val)}
                />
            )}
        />
    )
}

export default TextColor;