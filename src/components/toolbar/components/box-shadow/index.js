/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import BoxShadowControl from '../../../box-shadow-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Icons
 */
import './editor.scss';
import { toolbarDropShadow } from '../../../../icons';

/**
 * BoxShadow
 */
const ALLOWED_BLOCKS = [
    // 'maxi-blocks/text-maxi',
    'maxi-blocks/button-maxi',
    'maxi-blocks/image-maxi',
    'maxi-blocks/divider-maxi',
    'maxi-blocks/section-maxi',
    'maxi-blocks/svg-icon-maxi',
]

const BoxShadow = props => {
    const {
        blockName,
        boxShadow,
        defaultBoxShadow,
        onChange,
        breakpoint
    } = props;

    if (!ALLOWED_BLOCKS.includes(blockName))
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__box-shadow'
            tooltip={__('Drop shadow', 'maxi-blocks')}
            icon={toolbarDropShadow}
            advancedOptions='box shadow'
            content={(
                <BoxShadowControl
                    boxShadow={boxShadow}
                    defaultBoxShadow={defaultBoxShadow}
                    onChange={boxShadow => onChange(boxShadow)}
                    breakpoint={breakpoint}
                    disableAdvanced
                />
            )}
        />
    )
}

export default BoxShadow;