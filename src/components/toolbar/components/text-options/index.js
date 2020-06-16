/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useDispatch } = wp.data;
const { Fragment } = wp.element;
const {
    Button,
    BaseControl
} = wp.components;

/**
 * Internal dependencies
 */
import FontFamilySelector from '../../../font-family-selector';
import ToolbarPopover from '../toolbar-popover';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    toolbarType,
    reset
} from '../../../../icons';
import SettingTabsControl from '../../../setting-tabs-control';

/**
 * TextOptions
 */
const TextOptions = props => {
    const {
        clientId,
        blockName,
        rawTypography
    } = props;

    const defaultRawTypography = wp.blocks.getBlockAttributes('maxi-blocks/text-maxi').typography;

    const { updateBlockAttributes } = useDispatch(
        'core/block-editor'
    );

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const updateTypography = () => {
        updateBlockAttributes(
            clientId,
            {
                typography: JSON.stringify(typography)
            }
        )
    }

    let typography = JSON.parse(rawTypography);
    let defaultTypography = JSON.parse(defaultRawTypography);

    return (
        <ToolbarPopover
            className='toolbar-item__text-options'
            icon={toolbarType}
            content={(
                <div
                    class="toolbar-item__popover__wrapper toolbar-item__popover__font-options"
                >
                    <div
                        className="toolbar-item__popover__font-options__font"
                    >
                        <FontFamilySelector
                            className="toolbar-item__popover__font-options__font__selector"
                            font={typography.font}
                            onChange={font => {
                                typography.font = font.value;
                                typography.options = font.files;
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
                    <SettingTabsControl
                        disablePadding
                        items={[
                            {
                                label: __('Desktop', 'maxi-blocks'),
                                content: (
                                    <Fragment>
                                        <BaseControl
                                            label={__('Size', 'maxi-blocks')}
                                            className='toolbar-item__popover__font-options__number-control'
                                        >
                                            <input
                                                type='number'
                                                value={typography.desktop['font-size']}
                                                onChange={e => {
                                                    typography.desktop['font-size'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.desktop['font-size'] = defaultTypography.desktop['font-size'];
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
                                                value={typography.desktop['line-height']}
                                                onChange={e => {
                                                    typography.desktop['line-height'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.desktop['line-height'] = defaultTypography.desktop['line-height'];
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
                                                value={typography.desktop['letter-spacing']}
                                                onChange={e => {
                                                    typography.desktop['letter-spacing'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.desktop['letter-spacing'] = defaultTypography.desktop['letter-spacing'];
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
                                    </Fragment>
                                )
                            },
                            {
                                label: __('Tablet', 'maxi-blocks'),
                                content: (
                                    <Fragment>
                                        <BaseControl
                                            label={__('Size', 'maxi-blocks')}
                                            className='toolbar-item__popover__font-options__number-control'
                                        >
                                            <input
                                                type='number'
                                                value={typography.tablet['font-size']}
                                                onChange={e => {
                                                    typography.tablet['font-size'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.tablet['font-size'] = defaultTypography.tablet['font-size'];
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
                                                value={typography.tablet['line-height']}
                                                onChange={e => {
                                                    typography.tablet['line-height'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.tablet['line-height'] = defaultTypography.tablet['line-height'];
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
                                                value={typography.tablet['letter-spacing']}
                                                onChange={e => {
                                                    typography.tablet['letter-spacing'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.tablet['letter-spacing'] = defaultTypography.tablet['letter-spacing'];
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
                                    </Fragment>
                                )
                            },
                            {
                                label: __('Mobile', 'maxi-blocks'),
                                content: (
                                    <Fragment>
                                        <BaseControl
                                            label={__('Size', 'maxi-blocks')}
                                            className='toolbar-item__popover__font-options__number-control'
                                        >
                                            <input
                                                type='number'
                                                value={typography.mobile['font-size']}
                                                onChange={e => {
                                                    typography.mobile['font-size'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.mobile['font-size'] = defaultTypography.mobile['font-size'];
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
                                                value={typography.mobile['line-height']}
                                                onChange={e => {
                                                    typography.mobile['line-height'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.mobile['line-height'] = defaultTypography.mobile['line-height'];
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
                                                value={typography.mobile['letter-spacing']}
                                                onChange={e => {
                                                    typography.mobile['letter-spacing'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    typography.mobile['letter-spacing'] = defaultTypography.mobile['letter-spacing'];
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
                                    </Fragment>
                                )
                            },
                        ]}
                    />
                </div>
            )}
        />
    )
}

export default TextOptions;