/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { TextareaControl } = wp.components;

/**
 * Internal dependencies
 */
import CheckBoxControl from '../checkbox-control';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Blocks
 */
export const LinkOptionsControl = props => {
    const {
        label,
        link,
        onChangeLink,
        linkOptions,
        onChangeOptions,
    } = props;

    let value = typeof linkOptions === 'object' ? linkOptions : JSON.parse(linkOptions);

    const onChangeValue = (target, val) => {
        value[target] = val;
        onChangeOptions(JSON.stringify(value));
    }

    return (
        <Fragment>
            <TextareaControl
                label={label}
                value={link}
                onChange={onChangeLink}
            />
            <CheckBoxControl
                label={__('Open in New Window', 'gutenberg-extra')}
                id='gx-new-window'
                checked={value.opensInNewWindow}
                onChange={newValue => onChangeValue('opensInNewWindow', newValue)}
            />
            <CheckBoxControl
                label={__('Add "nofollow" attribute', 'gutenberg-extra')}
                checked={value.addNofollow}
                onChange={newValue => onChangeValue('addNofollow', newValue)}
            />

            <CheckBoxControl
                label={__('Add "noopener" attribute', 'gutenberg-extra')}
                checked={value.addNoopener}
                onChange={newValue => onChangeValue('addNoopener', newValue)}
            />

            <CheckBoxControl
                label={__('Add "noreferrer" attribute', 'gutenberg-extra')}
                checked={value.addNoreferrer}
                onChange={newValue => onChangeValue('addNoreferrer', newValue)}
            />

            <CheckBoxControl
                label={__('Add "sponsored" attribute', 'gutenberg-extra')}
                checked={value.addSponsored}
                onChange={newValue => onChangeValue('addSponsored', newValue)}
            />
            <CheckBoxControl
                label={__('Add "ugc" attribute', 'gutenberg-extra')}
                checked={value.addUgc}
                onChange={newValue => onChangeValue('addUgc', newValue)}
            />
        </Fragment>
    )
}

export const Link = ({
    link,
    linkOptions,
    ...props
}) => {

    let value = typeof linkOptions === 'object' ? linkOptions : JSON.parse(linkOptions);

    const getRel = () => {
        let response = '';
        value.addNofollow ? response += 'nofollow ' : null;
        value.addNoopener ? response += 'noopener ' : null;
        value.addNoreferrer ? response += 'noreferrer ' : null;
        value.addSponsored ? response += 'sponsored ' : null;
        value.addUgc ? response += 'ugc ' : null;

        return response.trim();
    }

    return (
        <Fragment>
            {
                !isEmpty(link) &&
                <a
                    href={link}
                    target={value.opensInNewWindow ? '_blank' : ''}
                    rel={getRel()}
                    {...props}
                >
                </a>
            }
            {
                isEmpty(link) &&
                <div {...props}>
                </div>
            }
        </Fragment>
    )
}