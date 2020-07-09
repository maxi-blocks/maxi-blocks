/**
 * WordPress dependencies
 */
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import __experimentalMarginPaddingControl from '../../../margin-padding-control';

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
        breakpoint
    } = props;

    return (
        <ToolbarPopover
            className='toolbar-item__padding-margin'
            icon={toolbarPadding}
            content={(
                <Fragment>
                    <__experimentalMarginPaddingControl
                        value={padding}
                        onChange={padding => onChangePadding(padding)}
                        breakpoint={breakpoint}
                    />
                    {
                        blockName != 'maxi-blocks/column-maxi' &&
                        <__experimentalMarginPaddingControl
                            value={margin}
                            onChange={margin => onChangeMargin(margin)}
                            breakpoint={breakpoint}
                        />
                    }
                </Fragment>
            )}
        />
    )
}

export default PaddingMargin;