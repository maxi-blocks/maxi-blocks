/**
 * WordPress dependencies
 */
const {
    Icon,
    Dropdown,
    Button,
    ColorPicker
} = wp.components;
const { useDispatch } = wp.data;

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

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__text-options'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarStyle}
                    />
                </Button>
            )}
            popoverProps={
                {
                    className: 'toolbar-item__popover',
                    noArrow: false,
                    position: 'center'
                }
            }
            renderContent={
                () => (
                    <ColorPicker
                        color={typography.general.color}
                        onChangeComplete={val => updateTypography(val)}
                    />
                )
            }
        >
        </Dropdown>
    )
}

export default TextColor;