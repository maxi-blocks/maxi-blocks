/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalLinkControl } = wp.blockEditor;
const { useSelect } = wp.data;
const { applyFormat, create, toHTMLString } = wp.richText;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
    const { blockName, content, onChange, node } = props;

    if (blockName !== 'maxi-blocks/text-maxi') return null;

    /**
     * Gets the all format objects at the start of the selection.
     *
     * @param {Object} value                Value to inspect.
     * @param {Array} EMPTY_ACTIVE_FORMATS Array to return if there are no active
     * formats.
     * @return {?Object} Active format objects.
     * @package
     * @see packages/rich-text/src/get-active-formats.js
     */
    const getActiveFormats = (
        { formats, start, end, activeFormats },
        EMPTY_ACTIVE_FORMATS = []
    ) => {
        if (start === undefined) {
            return EMPTY_ACTIVE_FORMATS;
        }

        if (start === end) {
            // For a collapsed caret, it is possible to override the active formats.
            if (activeFormats) {
                return activeFormats;
            }

            const formatsBefore = formats[start - 1] || EMPTY_ACTIVE_FORMATS;
            const formatsAfter = formats[start] || EMPTY_ACTIVE_FORMATS;

            // By default, select the lowest amount of formats possible (which means
            // the caret is positioned outside the format boundary). The user can
            // then use arrow keys to define `activeFormats`.
            if (formatsBefore.length < formatsAfter.length) {
                return formatsBefore;
            }

            return formatsAfter;
        }

        return formats[start] || EMPTY_ACTIVE_FORMATS;
    };

    const { formatValue, isActive, formatOptions } = useSelect(
        select => {
            const { getSelectionStart, getSelectionEnd } = select(
                'core/block-editor'
            );
            const formatValue = create({
                element: node,
                html: content,
            });
            formatValue.start = getSelectionStart().offset;
            formatValue.end = getSelectionEnd().offset;

            let formatOptions = {};
            const isActive = getActiveFormats(formatValue).some(type => {
                if (type.type === 'core/link') {
                    formatOptions = type;
                    return true;
                }
                return false;
            });

            return {
                formatValue,
                isActive,
                formatOptions,
            };
        },
        [getActiveFormats, node, content]
    );

    const createLinkValue = formatOptions => {
        if (isEmpty(formatOptions)) return;

        const {
            attributes: { url, target, id },
            unregisteredAttributes: { rel },
        } = formatOptions;

        const value = {
            url,
            opensInNewTab: target === '_blank',
            id,
        };

        if (rel) {
            value.noFollow = rel.indexOf('nofollow') >= 0;
            value.sponsored = rel.indexOf('sponsored') >= 0;
            value.ugc = rel.indexOf('ugc') >= 0;
        }

        return value;
    };

    const createLinkAttribute = ({
        url,
        type,
        id,
        opensInNewTab,
        noFollow,
        sponsored,
        ugc,
    }) => {
        const format = {
            type: 'core/link',
            attributes: {
                url,
                rel: '',
            },
        };

        if (type) format.attributes.type = type;
        if (id) format.attributes.type = id;

        if (opensInNewTab) {
            format.attributes.target = '_blank';
            format.attributes.rel += 'noreferrer noopener';
        }
        if (noFollow) format.attributes.rel += ' nofollow';
        if (sponsored) format.attributes.rel += ' sponsored';
        if (ugc) format.attributes.rel += ' ugc';

        return format;
    };

    const formatChecker = format => {
        if (!isActive && format.start === format.end) {
            format.start = 0;
            format.end = content.length;
        }

        return format;
    };

    const onClick = attributes => {
        const newAttribute = createLinkAttribute(attributes);
        const newFormat = applyFormat(formatChecker(formatValue), newAttribute);

        const newContent = toHTMLString({
            value: newFormat,
        });

        onChange(newContent);
    };

    return (
        <ToolbarPopover
            icon={toolbarLink}
            tooltip={__('Link', 'maxi-blocks')}
            content={
                <__experimentalLinkControl
                    value={createLinkValue(formatOptions)}
                    onChange={onClick}
                    settings={[
                        {
                            id: 'opensInNewTab',
                            title: __('Open in new tab', 'maxi-blocks'),
                        },
                        {
                            id: 'noFollow',
                            title: __('Add "nofollow" rel', 'maxi-blocks'),
                        },
                        {
                            id: 'sponsored',
                            title: __('Add "sponsored" rel', 'maxi-blocks'),
                        },
                        {
                            id: 'ugc',
                            title: __('Add "sponsored" rel', 'maxi-blocks'),
                        },
                    ]}
                />
            }
        />
    );
};

export default Link;
