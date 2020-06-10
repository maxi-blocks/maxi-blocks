/**
 * WordPress dependencies
 */
const {
    Icon,
    Dropdown,
    Button,
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import FontLevelControl from '../../../font-level-control';

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
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__text-level'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarSettings}
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
                )
            }
        >
        </Dropdown>
    )
}

export default TextLevel;