/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { getBlockAttributes } = wp.blocks;
const {
    Button,
    Icon,
    IconButton,
    BaseControl,
} = wp.components;
const { useDispatch } = wp.data;
import openSidebar from '../../../../extensions/dom';

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
    toolbarAdvancedSettings,
    reset,
} from '../../../../icons';
import SettingTabsControl from '../../../setting-tabs-control';

/**
 * TextOptions
 */
const TextOptions = props => {
    const {
        blockName,
        typography,
        onChange
    } = props;

    const defaultRawTypography = getBlockAttributes('maxi-blocks/text-maxi').typography;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const { openGeneralSidebar } = useDispatch(
        'core/edit-post'
    );

    const updateTypography = () => {
        onChange(JSON.stringify(value))
    }

    let value = typeof typography != 'object' ?
        JSON.parse(typography) :
        typography;

    let defaultTypography = typeof defaultRawTypography != 'object' ?
        JSON.parse(defaultRawTypography) :
        defaultRawTypography;

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
                            font={value.font}
                            onChange={font => {
                                value.font = font.value;
                                value.options = font.files;
                                updateTypography();
                            }}
                        />
                        <Button
                            className="components-maxi-dimensions-control__units-reset"
                            onClick={() => {
                                value.font = defaultRawTypography.font;
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
                                                value={value.desktop['font-size']}
                                                onChange={e => {
                                                    value.desktop['font-size'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.desktop['font-size'] = defaultTypography.desktop['font-size'];
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
                                                value={value.desktop['line-height']}
                                                onChange={e => {
                                                    value.desktop['line-height'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.desktop['line-height'] = defaultTypography.desktop['line-height'];
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
                                                value={value.desktop['letter-spacing']}
                                                onChange={e => {
                                                    value.desktop['letter-spacing'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.desktop['letter-spacing'] = defaultTypography.desktop['letter-spacing'];
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
                                                value={value.tablet['font-size']}
                                                onChange={e => {
                                                    value.tablet['font-size'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.tablet['font-size'] = defaultTypography.tablet['font-size'];
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
                                                value={value.tablet['line-height']}
                                                onChange={e => {
                                                    value.tablet['line-height'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.tablet['line-height'] = defaultTypography.tablet['line-height'];
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
                                                value={value.tablet['letter-spacing']}
                                                onChange={e => {
                                                    value.tablet['letter-spacing'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.tablet['letter-spacing'] = defaultTypography.tablet['letter-spacing'];
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
                                        <div className='toolbar-item__popover__dropdown-options'>
                                            <IconButton
                                                className='toolbar-item__popover__dropdown-options__advanced-button'
                                                icon={toolbarAdvancedSettings}
                                                onClick={() =>
                                                    openGeneralSidebar('edit-post/block')
                                                        .then(() => openSidebar('typography'))
                                                }
                                            />
                                        </div>
                                        <BaseControl
                                            label={__('Size', 'maxi-blocks')}
                                            className='toolbar-item__popover__font-options__number-control'
                                        >
                                            <input
                                                type='number'
                                                value={value.mobile['font-size']}
                                                onChange={e => {
                                                    value.mobile['font-size'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.mobile['font-size'] = defaultTypography.mobile['font-size'];
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
                                                value={value.mobile['line-height']}
                                                onChange={e => {
                                                    value.mobile['line-height'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.mobile['line-height'] = defaultTypography.mobile['line-height'];
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
                                                value={value.mobile['letter-spacing']}
                                                onChange={e => {
                                                    value.mobile['letter-spacing'] = Number(e.target.value);
                                                    updateTypography();
                                                }}

                                            />
                                            <Button
                                                className="components-maxi-dimensions-control__units-reset"
                                                onClick={() => {
                                                    value.mobile['letter-spacing'] = defaultTypography.mobile['letter-spacing'];
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