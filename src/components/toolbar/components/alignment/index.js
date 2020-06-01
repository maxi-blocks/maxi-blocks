/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
} = wp.components;
const {
    useSelect,
    useDispatch
} = wp.data;

/**
 * Internal dependencies
 */
import AlignmentControl from '../../../alignment-control';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

/**
 * Icons
 */
import {
    toolbarAlign,
} from '../../../../icons';

/**
 * Alignment
 */
const ALLOWED_BLOCKS = [
    'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/divider-maxi'
]

const Alignment = props => {
    const { clientId } = props;

    const { blockName, alignment, rawTypography } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            return {
                blockName: getBlockName(clientId),
                alignment: getBlockAttributes(clientId).alignment,
                rawTypography: getBlockAttributes(clientId).typography,
            };
        },
        [clientId]
    );

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    let typography = undefined;
    if (!isNil(rawTypography))
        typography = JSON.parse(rawTypography);

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__alignment'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarAlign}
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
                    <Fragment>
                        {
                            typography &&
                            <AlignmentControl
                                value={typography.general['text-align']}
                                onChange={alignment => {
                                    typography.general['text-align'] = alignment;
                                    updateBlockAttributes(
                                        clientId,
                                        {
                                            typography: JSON.stringify(typography)
                                        }
                                    )
                                }}
                                disableJustify={
                                    blockName === 'maxi-blocks/button-maxi' ?
                                        true :
                                        false
                                }
                            />
                        }
                        {
                            !typography &&
                            <AlignmentControl
                                value={alignment}
                                onChange={alignment => updateBlockAttributes(
                                    clientId,
                                    { alignment }
                                )}
                                disableJustify
                            />
                        }
                    </Fragment>
                )
            }
        >
        </Dropdown>
    )
}

export default Alignment;