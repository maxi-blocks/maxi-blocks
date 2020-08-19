/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';
import __experimentalAxisControl from '../../../axis-control';

/**
 * Styles & Icons
 */
import './editor.scss';
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
            tooltip={__('Padding & Margin', 'maxi-blocks')}
            icon={toolbarPadding}
            content={(
                <div className='toolbar-item__popover__padding-margin'>
                    <__experimentalAxisControl
                        values={padding}
                        onChange={padding => onChangePadding(padding)}
                        breakpoint={breakpoint}
                        disableAuto
                    />
                    {
                        blockName != 'maxi-blocks/column-maxi' &&
                        <__experimentalAxisControl
                            values={margin}
                            onChange={margin => onChangeMargin(margin)}
                            breakpoint={breakpoint}
                        />
                    }
                </div>
            )}
        />
    )
}

export default PaddingMargin;