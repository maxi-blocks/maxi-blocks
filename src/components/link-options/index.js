/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { TextareaControl } = wp.components;

/**
 * External dependencies
 */
import Checkbox from '../checkbox/index';

export const linkOptionsAttributes = {
    linkOptions: {
        type: 'string',
        default: '{"opensInNewWindow":false,"addNofollow":false,"addNoopener":false,"addNoreferrer":false,"addSponsored":false,"addUgc":false}',
    }
}

export const LinkOptions = (props) => {
    const {
        label,
        value,
        onChangeLink,
        linkOptions,
        onChangeOptions,
    } = props;

    const values = JSON.parse(linkOptions);

    const onChangeValue = (target, value) => {
        values[target] = value;
        onChangeOptions(JSON.stringify(values));
    }

    return (
        <Fragment>
            <TextareaControl
                label={label}
                value={value}
                onChange={onChangeLink}
            />
            <Checkbox
                label={__('Open in New Window', 'gutenberg-extra')}
                id='gx-new-window'
                checked={values.opensInNewWindow}
                onChange={(newValue) => onChangeValue('opensInNewWindow', newValue)}
            />
            <Checkbox
                label={__('Add "nofollow" attribute', 'gutenberg-extra')}
                checked={values.addNofollow}
                onChange={( newValue) => onChangeValue ( 'addNofollow', newValue )}
            />

            <Checkbox
                label={__('Add "noopener" attribute', 'gutenberg-extra')}
                checked={values.addNoopener}
                onChange={( newValue) => onChangeValue ( 'addNoopener', newValue )}
            />

            <Checkbox
                label={__('Add "noreferrer" attribute', 'gutenberg-extra')}
                checked={values.addNoreferrer}
                onChange={( newValue) => onChangeValue ( 'addNoreferrer', newValue )}
            />

            <Checkbox
                label={__('Add "sponsored" attribute', 'gutenberg-extra')}
                checked={values.addSponsored}
                onChange={( newValue) => onChangeValue ( 'addSponsored', newValue )}
            />

            <Checkbox
                label={__('Add "ugc" attribute', 'gutenberg-extra')}
                checked={values.addUgc}
                onChange={( newValue) => onChangeValue ( 'addUgc', newValue )}
            />
        </Fragment>
    )
}

export const Link = ({
    value,
    linkOptions,
    ...props
}) => {

    const values = JSON.parse(linkOptions);

    const getRel = () => {
        let response = '';
        values.addNofollow ? response += 'nofollow ' : null;
        values.addNoopener ? response += 'noopener ' : null;
        values.addNoreferrer ? response += 'noreferrer ' : null;
        values.addSponsored ? response += 'sponsored ' : null;
        values.addUgc ? response += 'ugc ' : null;

        return response.trim();
    }

    return(
        <a
            href={value}
            target={values.opensInNewWindow ? '_blank' : ''}
            rel={getRel()}
            {...props}
        >
        </a>
    )
}