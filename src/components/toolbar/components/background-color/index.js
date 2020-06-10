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
        <Fragment>
            {
                !isNil(background) &&
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
                />
            }
        </Fragment>
    )
}

export default BackgroundColor;