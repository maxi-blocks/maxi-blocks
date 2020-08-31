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
const { useSelect } = wp.data;
const {
    applyFormat,
    create,
    toHTMLString,
    getActiveFormat,
    registerFormatType
} = wp.richText;

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
    isObject,
    isEmpty,
    isNil,
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
 * Register format
 */
registerFormatType('maxi-blocks/text-size', {
    title: 'Text color',
    tagName: 'span',
    className: 'maxi-text-block--has-size',
    attributes: {
        style: 'style',
        size: 'number'
    },
});

/**
 * TextOptions
 */
const TextOptions = props => {
    const {
        blockName,
        typography,
        onChange,
        node,
        content,
        breakpoint
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const defaultRawTypography = getBlockAttributes('maxi-blocks/text-maxi').typography;
    const formatName = 'maxi-blocks/text-size';

    const { formatValue, isActive, currentSize } = useSelect(
        (select) => {
            const { getSelectionStart, getSelectionEnd } = select(
                'core/block-editor'
            );
            const formatValue = create({
                element: node.querySelector('p'),
                html: content,
            });
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const activeFormat = getActiveFormat(formatValue, formatName);
            const isActive =
                !isNil(activeFormat) && activeFormat.type === formatName || false;

            const currentSize =
                isActive && activeFormat.attributes.size || '';

            return {
                formatValue,
                isActive,
                currentSize
            };
        },
        [getActiveFormat, node, content]
    );

    const onChangeSize = (val) => {
        if (formatValue.start === formatValue.end) {
            value[breakpoint]['font-size'] = isEmpty(val) ? '' : Number(val);
            updateTypography();
            return;
        }

        const newFormat = applyFormat(formatValue, {
            type: formatName,
            isActive: isActive,
            attributes: {
                style: `font-size: ${isEmpty(val) ? '' : Number(val)}${value[breakpoint]['font-sizeUnit']}`,
                size: val
            }
        });

        const newContent = toHTMLString({
            value: newFormat,
        });

        onChange({ typography: JSON.stringify(value), content: newContent });
    };

    const updateTypography = () => {
        onChange({ typography: JSON.stringify(value), content: content });
    };

    const value =
        (!isObject(typography) && JSON.parse(typography)) || typography;

    const defaultTypography = typeof defaultRawTypography != 'object' &&
        JSON.parse(defaultRawTypography) ||
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
                                value={trim(isActive && Number(currentSize) || getLastBreakpointValue(value, 'font-size', breakpoint))}
                                onChange={e => {
                                    onChangeSize(e.target.value);
                                }}

                            />
                            <Button
                                className="components-maxi-control__reset-button"
                                onClick={() => {
                                    value[breakpoint]['font-size'] = defaultTypography[breakpoint]['font-size'];
                                    onChangeSize(null);
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