/**
 * WordPress dependencies
 */
const {
    Icon,
    Dropdown,
    Button,
    ColorPicker
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * BackgroundColor
 */
const BackgroundColor = props => {
    const { clientId } = props;

    const { blockName, rawBackground } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            return {
                blockName: getBlockName(clientId),
                rawBackground: getBlockAttributes(clientId).background,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName === 'maxi-blocks/divider-maxi')
        return null;

    let background = JSON.parse(rawBackground);

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
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__text-options'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <div
                        className='toolbar-item__icon'
                        style={{
                            background: background.colorOptions.color,
                            border: '1px solid #fff'
                        }}
                    ></div>
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
                        color={background.colorOptions.color}
                        onChangeComplete={val => updateBackground(val)}
                    />
                )
            }
        >
        </Dropdown>
    )
}

export default BackgroundColor;