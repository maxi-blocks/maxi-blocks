/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Dropdown,
    Button,
    ColorPicker
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
    const {
        clientId,
        blockName
    } = props;

    const { rawBackground } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                rawBackground: attributes ? attributes.background : null,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName === 'maxi-blocks/divider-maxi' || isNil(rawBackground))
        return null;

    let background = typeof rawBackground != 'object' ?
        JSON.parse(rawBackground) :
        rawBackground;

    const updateBackground = val => {
        background.colorOptions.color = returnColor(val)

        updateBlockAttributes(
            clientId,
            {
                background: JSON.stringify(background)
            }
        )
    }

    const returnColor = val => {
        return `rgba(${val.rgb.r},${val.rgb.g},${val.rgb.b},${val.rgb.a})`;
    }

    return (
        <ToolbarPopover
            className='toolbar-item__background'
            icon={(
                <div
                    className='toolbar-item__icon'
                    style={{
                        background: background.colorOptions.color,
                        border: '1px solid #fff'
                    }}
                ></div>
            )}
            content={(
                <ColorPicker
                    color={background.colorOptions.color}
                    onChangeComplete={val => updateBackground(val)}
                />
            )}
        />
    )
}

export default BackgroundColor;