/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Internal dependencies
 */
import FontLevelControl from '../../../font-level-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarHeadingsLevel } from '../../../../icons';

/**
 * TextLevel
 */
const TextLevel = props => {
    const {
        blockName,
        textLevel,
        typography,
        typographyHover,
        margin,
        isList,
        onChange
    } = props;

    if (blockName != 'maxi-blocks/text-maxi' || isList)
        return null;

    return (
        <ToolbarPopover
            className='toolbar-item__text-level'
            tooltip={__('Text level', 'maxi-blocks')}
            icon={toolbarHeadingsLevel}
            content={(
                <FontLevelControl
                    value={textLevel}
                    onChange={(textLevel, typography, typographyHover, margin) =>
                        onChange(textLevel, typography, typographyHover, margin)
                    }
                    fontOptions={typography}
                    fontOptionsHover={typographyHover}
                    marginOptions={margin}
                />
            )}
        />
    )
}

export default TextLevel;