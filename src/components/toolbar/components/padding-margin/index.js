/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import DimensionsControl from '../../../dimensions-control';
import ToolbarPopover from '../toolbar-popover';

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
        <ToolbarPopover
            className='toolbar-item__padding-margin'
            icon={toolbarPadding}
            content={(
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
            )}
        />
    )
}

export default PaddingMargin;