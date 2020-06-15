/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
    RangeControl
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import DimensionsControl from '../../../dimensions-control';

/**
 * Icons
 */
import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
    const { clientId } = props;

    const { padding, margin, columnGap } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                padding: attributes ? attributes.padding : null,
                margin: attributes ? attributes.margin : null,
                columnGap: attributes ? attributes.columnGap : null
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
                    className='toolbar-item__padding-margin'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarPadding}
                    />
                </Button>
            )}
            popoverProps={
                {
                    className: 'toolbar-item__popover',
                    noArrow: false,
                    position: 'top center'
                }
            }
            renderContent={
                () => (
                    <Fragment>
                        <DimensionsControl
                            value={padding}
                            onChange={padding => updateBlockAttributes(
                                clientId,
                                {
                                    padding
                                }
                            )}
                        />
                        <DimensionsControl
                            value={margin}
                            onChange={margin => updateBlockAttributes(
                                clientId,
                                {
                                    margin
                                }
                            )}
                        />
                        {
                            columnGap &&
                            <RangeControl
                                label={__('Column gap', 'maxi-blocks')}
                                value={columnGap}
                                onChange={columnGap => updateBlockAttributes(
                                    clientId,
                                    {
                                        columnGap
                                    }
                                )}
                                step={.1}
                                min={0}
                                max={5}
                            />
                        }
                    </Fragment>
                )
            }
        />
    )
}

export default PaddingMargin;