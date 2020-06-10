/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Dropdown,
    Button,
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import BorderControl from '../../../border-control';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

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
            return {
                blockName: getBlockName(clientId),
                border: getBlockAttributes(clientId).border,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    const value = typeof border != 'object' ? JSON.parse(border) : border;

    return (
        <Fragment>
            {
                !isNil(value) &&
                <Dropdown
                    className='toolbar-item toolbar-item__dropdown'
                    renderToggle={({ isOpen, onToggle }) => (
                        <Button
                            className='toolbar-item__box-shadow'
                            onClick={onToggle}
                            aria-expanded={isOpen}
                            action="popup"
                        >
                            <div
                                className='toolbar-item__icon toolbar-item__box-shadow__icon'
                                style={{
                                    borderStyle: value.general['border-style']
                                }}
                            ></div>
                        </Button>
                    )}
                    popoverProps={
                        {
                            className: 'toolbar-item__popover toolbar-item__box-shadow__popover',
                            noArrow: false,
                            position: 'top center'
                        }
                    }
                    renderContent={
                        () => (
                            <BorderControl
                                borderOptions={JSON.parse(border)}
                                onChange={border => updateBlockAttributes(
                                    clientId,
                                    { border }
                                )}
                            />
                        )
                    }
                />
            }
        </Fragment>
    )
}

export default Border;