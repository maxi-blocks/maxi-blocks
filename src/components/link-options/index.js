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

    const onChangeValue = (target, value) => {
        linkOptions[target] = value;
        onChangeOptions(JSON.stringify(linkOptions))
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
                checked={linkOptions.opensInNewWindow}
                onChange={(newValue) => onChangeValue('opensInNewWindow', newValue)}
            />
            <Checkbox
                label={__('Add "nofollow" attribute', 'gutenberg-extra')}
                checked={linkOptions.addNofollow}
                onChange={( newValue) => onChangeValue ( 'addNofollow', newValue )}
            />

            <Checkbox
                label={__('Add "noopener" attribute', 'gutenberg-extra')}
                checked={linkOptions.addNoopener}
                onChange={( newValue) => onChangeValue ( 'addNoopener', newValue )}
            />

            <Checkbox
                label={__('Add "noreferrer" attribute', 'gutenberg-extra')}
                checked={linkOptions.addNoreferrer}
                onChange={( newValue) => onChangeValue ( 'addNoreferrer', newValue )}
            />

            <Checkbox
                label={__('Add "sponsored" attribute', 'gutenberg-extra')}
                checked={linkOptions.addSponsored}
                onChange={( newValue) => onChangeValue ( 'addSponsored', newValue )}
            />

            <Checkbox
                label={__('Add "ugc" attribute', 'gutenberg-extra')}
                checked={linkOptions.addUgc}
                onChange={( newValue) => onChangeValue ( 'addUgc', newValue )}
            />
        </Fragment>
    )
}