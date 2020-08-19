/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { getBlockAttributes } = wp.blocks;
const {
    Button,
    BaseControl,
} = wp.components;

/**
 * Internal dependencies
 */
import { getLastBreakpointValue } from '../../../../utils';
import FontFamilySelector from '../../../font-family-selector';
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import {
    isEmpty,
    trim
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    toolbarType,
    reset,
} from '../../../../icons';

/**
 * TextOptions
 */
const TextOptions = props => {
    const {
        blockName,
        typography,
        onChange,
        breakpoint
    } = props;

    const defaultRawTypography = getBlockAttributes('maxi-blocks/text-maxi').typography;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

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
            tooltip={__('Text options', 'maxi-blocks')}
            icon={toolbarType}
            advancedOptions='typography'
            content={(
                <div
                    class="toolbar-item__popover__font-options"
                >
                    <div
                        className="toolbar-item__popover__font-options__font"
                    >
                        <FontFamilySelector
                            className="toolbar-item__popover__font-options__font__selector"
                            font={getLastBreakpointValue(value, 'font-family', breakpoint)}
                            onChange={font => {
                                value[breakpoint]['font-family'] = font.value;
                                value.options = font.files;
                                updateTypography();
                            }}
                        />
                        <Button
                            className="components-maxi-control__reset-button"
                            onClick={() => {
                                value[breakpoint]['font-family'] = defaultRawTypography.font;
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
                    <Fragment>
                        <BaseControl
                            label={__('Size', 'maxi-blocks')}
                            className='toolbar-item__popover__font-options__number-control'
                        >
                            <input
                                type='number'
                                value={trim(getLastBreakpointValue(value, 'font-size', breakpoint))}
                                onChange={e => {
                                    value[breakpoint]['font-size'] = isEmpty(e.target.value) ? '' : Number(e.target.value);
                                    updateTypography();
                                }}

                            />
                            <Button
                                className="components-maxi-control__reset-button"
                                onClick={() => {
                                    value[breakpoint]['font-size'] = defaultTypography[breakpoint]['font-size'];
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
                                value={trim(getLastBreakpointValue(value, 'line-height', breakpoint))}
                                onChange={e => {
                                    value[breakpoint]['line-height'] = isEmpty(e.target.value) ? '' : Number(e.target.value);
                                    updateTypography();
                                }}

                            />
                            <Button
                                className="components-maxi-control__reset-button"
                                onClick={() => {
                                    value[breakpoint]['line-height'] = defaultTypography[breakpoint]['line-height'];
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
                                value={trim(getLastBreakpointValue(value, 'letter-spacing', breakpoint))}
                                onChange={e => {
                                    value[breakpoint]['letter-spacing'] = isEmpty(e.target.value) ? '' : Number(e.target.value);
                                    updateTypography();
                                }}

                            />
                            <Button
                                className="components-maxi-control__reset-button"
                                onClick={() => {
                                    value[breakpoint]['letter-spacing'] = defaultTypography[breakpoint]['letter-spacing'];
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
                </div>
            )}
        />
    )
}

export default TextOptions;