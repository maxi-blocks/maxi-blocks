/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;

/**
 * Internal dependencies
 */
import DimensionsControl from '../../../dimensions-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isNumber } from 'lodash';

/**
 * Icons
 */
import { toolbarPadding } from '../../../../icons';

/**
 * PaddingMargin
 */
const PaddingMargin = props => {
    const {
        blockName,
        margin,
        onChangeMargin,
        padding,
        onChangePadding,
        columnGap,
        onChangeColumnGap
    } = props;

    return (
        <ToolbarPopover
            className='toolbar-item__padding-margin'
            icon={toolbarPadding}
            content={(
                <Fragment>
                    <DimensionsControl
                        value={padding}
                        onChange={padding => onChangePadding(padding)}
                    />
                    {
                        blockName != 'maxi-blocks/column-maxi' &&
                        <DimensionsControl
                            value={margin}
                            onChange={margin => onChangeMargin(margin)}
                        />
                    }
                    {
                        isNumber(columnGap) &&
                        <RangeControl
                            label={__('Column gap', 'maxi-blocks')}
                            value={columnGap}
                            onChange={columnGap => onChangeColumnGap(columnGap)}
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