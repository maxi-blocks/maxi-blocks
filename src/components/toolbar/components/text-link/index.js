/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { __experimentalLinkControl } = wp.blockEditor;
const { useSelect } = wp.data;
const {
    toggleFormat,
    create,
    toHTMLString,
    getActiveFormat
} = wp.richText;

/**
 * Internal dependencies
 */
import ToolbarPopover from '../toolbar-popover';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';

/**
 * Icons
 */
import './editor.scss';
import { toolbarLink } from '../../../../icons';

/**
 * Link
 */
const Link = props => {
    const {
        blockName,
        content,
        onChange,
        node,
        isList,
        typeOfList
    } = props;

    if (blockName != 'maxi-blocks/text-maxi')
        return null;

    const formatName = 'core/link';

    const formatElement = {
        element: node,
        html: content,
        multilineTag: isList ? 'li' : undefined,
        multilineWrapperTags: isList ? typeOfList : undefined,
        __unstableIsEditableTree: true
    }

    const { formatValue, isActive, formatOptions } = useSelect(
        select => {
            const {
                getSelectionStart,
                getSelectionEnd
            } = select('core/block-editor');
            const formatValue = create(formatElement);
            formatValue['start'] = getSelectionStart().offset;
            formatValue['end'] = getSelectionEnd().offset;

            const activeFormat = getActiveFormat(formatValue, formatName);

            const isActive =
                !isNil(activeFormat) && activeFormat.type === formatName || false;

            return {
                formatValue,
                isActive,
                formatOptions: activeFormat
            }
        },
        [getActiveFormat, formatElement]
    )

    const createLinkValue = formatOptions => {
        if (isEmpty(formatOptions))
            return;

        const {
            attributes: {
                url,
                target,
                id
            },
            unregisteredAttributes: {
                rel
            }
        } = formatOptions;

        const value = {
            url,
            opensInNewTab: target === '_blank' ? true : false,
            id,
        };

        if (!!rel) {
            value.noFollow = rel.indexOf('nofollow') >= 0 ? true : false;
            value.sponsored = rel.indexOf('sponsored') >= 0 ? true : false;
            value.ugc = rel.indexOf('ugc') >= 0 ? true : false;
        }

        return value;
    }

    const createLinkAttribute = (
        {
            url,
            type,
            id,
            opensInNewTab,
            noFollow,
            sponsored,
            ugc
        }
    ) => {
        const format = {
            type: formatName,
            attributes: {
                url,
                rel: ''
            },
        };

        if (type) format.attributes.type = type;
        if (id) format.attributes.type = id;

        if (opensInNewTab) {
            format.attributes.target = '_blank';
            format.attributes.rel += 'noreferrer noopener';
        }
        if (noFollow)
            format.attributes.rel += ' nofollow';
        if (sponsored)
            format.attributes.rel += ' sponsored';
        if (ugc)
            format.attributes.rel += ' ugc';

        return format;
    }

    const formatChecker = format => {
        if (!isActive && format.start === format.end) {
            format.start = 0;
            format.end = content.length;
        }

        return format;
    }

    const onClick = attributes => {
        const newAttribute = createLinkAttribute(attributes);
        const newFormat = toggleFormat(formatChecker(formatValue), newAttribute);

        const newContent = toHTMLString({
            value: newFormat,
            multilineTag: isList ? 'li' : null,
        })

        onChange(newContent)
    }

    return (
        <ToolbarPopover
            icon={toolbarLink}
            tooltip={__('Link', 'maxi-blocks')}
            content={(
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
                            title: __('Add "UGC" rel', 'maxi-blocks'),
                        },
                    ]}
                />
            )}
        />
    )
}

export default Link;