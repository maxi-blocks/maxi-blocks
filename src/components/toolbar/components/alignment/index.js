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
import './editor.scss';
import { toolbarAlign } from '../../../../icons';

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
    const {
        clientId,
        blockName
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    const { alignment, alignmentDesktop } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            return {
                alignment: getBlockAttributes(clientId).alignment,
                alignmentDesktop: getBlockAttributes(clientId).alignmentDesktop,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

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
                            alignment &&
                            <AlignmentControl
                                value={alignment}
                                onChange={alignment => updateBlockAttributes(
                                    clientId,
                                    { alignment }
                                )}
                                disableJustify={
                                    blockName === 'maxi-blocks/text-maxi' ?
                                        false :
                                        true
                                }
                            />
                        }
                        {
                            alignmentDesktop &&
                            <AlignmentControl
                                value={alignmentDesktop}
                                onChange={alignmentDesktop => updateBlockAttributes(
                                    clientId,
                                    { alignmentDesktop }
                                )}
                                disableJustify={
                                    blockName === 'maxi-blocks/text-maxi' ?
                                        false :
                                        true
                                }
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