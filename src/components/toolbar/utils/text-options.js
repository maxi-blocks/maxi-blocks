/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState } = wp.element;
const {
    Icon,
    Dropdown,
    Button,
    BaseControl
} = wp.components;
const {
    useSelect,
    useDispatch,
} = wp.data;

/**
 * Internal dependencies
 */
import FontFamilySelector from '../../font-family-selector';
import DeviceSelectorControl from '../../device-selector-control';

/**
 * Icons
 */
import {
    toolbarType,
    reset
} from '../../../icons';

/**
 * TextOptions
 */
const TextOptions = props => {
    const { clientId } = props;

    const { blockType, rawTypography, defaultRawTypography } = useSelect(
        (select) => {
            const { getBlockName, getBlockAttributes } = select(
                'core/block-editor',
            );
            const { getBlockType } = select(
                'core/blocks'
            );
            return {
                blockType: getBlockType(getBlockName(clientId)),
                rawTypography: getBlockAttributes(clientId).typography,
                defaultRawTypography: wp.blocks.getBlockAttributes('maxi-blocks/text-maxi').typography,
            };
        },
        [clientId]
    );

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockType.name != 'maxi-blocks/text-maxi')
        return null;

    const updateTypography = () => {
        updateBlockAttributes(
            clientId,
            {
                typography: JSON.stringify(typography)
            }
        )
    }

    const [device, setDevice] = useState('desktop');

    let typography = JSON.parse(rawTypography);
    let defaultTypography = JSON.parse(defaultRawTypography);

    return (
        <Dropdown
            className='toolbar-item toolbar-item__dropdown'
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className='toolbar-item__text-options'
                    onClick={onToggle}
                    aria-expanded={isOpen}
                    action="popup"
                >
                    <Icon
                        className='toolbar-item__icon'
                        icon={toolbarType}
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
                    <div
                        class="toolbar-item__popover__wrapper toolbar-item__popover__font-options"
                    >
                        <div
                            className="toolbar-item__popover__font-options__font"
                        >
                            <FontFamilySelector
                                className="toolbar-item__popover__font-options__font__selector"
                                font={typography.font}
                                onChange={e => {
                                    typography.font = value;
                                    updateTypography();
                                }}
                            />
                            <Button
                                className="components-maxi-dimensions-control__units-reset"
                                onClick={() => {
                                    typography.font = defaultRawTypography.font;
                                    updateTypography();
                                }}
                                isSmall
                                aria-label={sprintf(
                                    /* translators: %s: a texual label  */
                                    __('Reset %s settings', 'maxi-blocks'),
                                    'font size'
                                )}
                                type="reset"
                            >
                                {reset}
                            </Button>
                        </div>
                        <DeviceSelectorControl
                            device={device}
                            onChange={device => setDevice(device)}
                        />
                        <BaseControl
                            label={__('Size', 'maxi-blocks')}
                            className='toolbar-item__popover__font-options__number-control'
                        >
                            <input
                                type='number'
                                // className='maxi-sizecontrol-value'
                                value={typography[device]['font-size']}
                                onChange={e => {
                                    typography[device]['font-size'] = Number(e.target.value);
                                    updateTypography();
                                }}

                            />
                            <Button
                                className="components-maxi-dimensions-control__units-reset"
                                onClick={() => {
                                    typography[device]['font-size'] = defaultTypography[device]['font-size'];
                                    updateTypography();
                                }}
                                isSmall
                                aria-label={sprintf(
                                    /* translators: %s: a texual label  */
                                    __('Reset %s settings', 'maxi-blocks'),
                                    'size'
                                )}
                                type="reset"
                            >
                                {reset}
                            </Button>
                        </BaseControl>
                        <BaseControl
                            label={__('Line Height', 'maxi-blocks')}
                            className='toolbar-item__popover__font-options__number-control'
                        >
                            <input
                                type='number'
                                // className='maxi-sizecontrol-value'
                                value={typography[device]['line-height']}
                                onChange={e => {
                                    typography[device]['line-height'] = Number(e.target.value);
                                    updateTypography();
                                }}

                            />
                            <Button
                                className="components-maxi-dimensions-control__units-reset"
                                onClick={() => {
                                    typography[device]['line-height'] = defaultTypography[device]['line-height'];
                                    updateTypography();
                                }}
                                isSmall
                                aria-label={sprintf(
                                    /* translators: %s: a texual label  */
                                    __('Reset %s settings', 'maxi-blocks'),
                                    'line height'
                                )}
                                type="reset"
                            >
                                {reset}
                            </Button>
                        </BaseControl>
                        <BaseControl
                            label={__('Letter Spacing', 'maxi-blocks')}
                            className='toolbar-item__popover__font-options__number-control'
                        >
                            <input
                                type='number'
                                // className='maxi-sizecontrol-value'
                                value={typography[device]['letter-spacing']}
                                onChange={e => {
                                    typography[device]['letter-spacing'] = Number(e.target.value);
                                    updateTypography();
                                }}

                            />
                            <Button
                                className="components-maxi-dimensions-control__units-reset"
                                onClick={() => {
                                    typography[device]['letter-spacing'] = defaultTypography[device]['letter-spacing'];
                                    updateTypography();
                                }}
                                isSmall
                                aria-label={sprintf(
                                    /* translators: %s: a texual label  */
                                    __('Reset %s settings', 'maxi-blocks'),
                                    'letter spacing'
                                )}
                                type="reset"
                            >
                                {reset}
                            </Button>
                        </BaseControl>
                    </div>
                )
            }
        >
        </Dropdown>
    )
}

export default TextOptions;