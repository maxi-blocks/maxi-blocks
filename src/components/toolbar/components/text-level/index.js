/**
 * WordPress dependencies
 */
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import FontLevelControl from '../../../font-level-control';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles and icons
 */
import './editor.scss';
import { toolbarSettings } from '../../../../icons';

/**
 * TextLevel
 */
const TextLevel = props => {
    const {
        clientId,
        blockName,
        rawTypography
    } = props;

    const { textLevel, rawTypographyHover } = useSelect(
        (select) => {
            const { getBlockAttributes } = select(
                'core/block-editor',
            );
            const attributes = getBlockAttributes(clientId);
            return {
                textLevel: attributes ? attributes.textLevel : null,
                rawTypographyHover: attributes ? attributes.typographyHover : null,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const typography = JSON.parse(rawTypography);
    const typographyHover = JSON.parse(rawTypographyHover);

    return (
        <ToolbarPopover
            className='toolbar-item__text-level'
            icon={toolbarSettings}
            content={(
                <FontLevelControl
                    value={textLevel}
                    onChange={(textLevel, typography, typographyHover) =>
                        updateBlockAttributes(
                            clientId,
                            {
                                textLevel,
                                typography,
                                typographyHover
                            }
                        )
                    }
                    fontOptions={typography}
                    fontOptionsHover={typographyHover}
                />
            )}
        />
    )
}

export default TextLevel;