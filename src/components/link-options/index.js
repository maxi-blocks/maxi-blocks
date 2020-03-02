const { __ } = wp.i18n;
const { ToggleControl, TextareaControl } = wp.components;
const { Fragment } = wp.element;

export const LinkOptions = (props) => {

    const {
        label,
        value,
        onChangeLink,
        opensInNewWindow,
        onChangeOpensInNewWindow,
        addNofollow,
        onChangeAddNofollow,
        addNoopener,
        onChangeAddNoopener,
        addNoreferrer,
        onChangeAddNoreferrer,
        addSponsored,
        onChangeAddSponsored,
        addUgc,
        onChangeAddUgc,
    } = props;

    return (
        <Fragment>
            <TextareaControl
                label={label}
                value={value || ''}
                onChange={onChangeLink}
            />
            <ToggleControl
                label={__('Open in New Window', 'gutenberg-extra')}
                id='gx-new-window'
                checked={opensInNewWindow}
                onChange={onChangeOpensInNewWindow}
            />
            <ToggleControl
                label={__('Add "nofollow" attribute', 'gutenberg-extra')}
                checked={addNofollow}
                onChange={onChangeAddNofollow}
            />

            <ToggleControl
                label={__('Add "noopener" attribute', 'gutenberg-extra')}
                checked={addNoopener}
                onChange={onChangeAddNoopener}
            />

            <ToggleControl
                label={__('Add "noreferrer" attribute', 'gutenberg-extra')}
                checked={addNoreferrer}
                onChange={onChangeAddNoreferrer}
            />

            <ToggleControl
                label={__('Add "sponsored" attribute', 'gutenberg-extra')}
                checked={addSponsored}
                onChange={onChangeAddSponsored}
            />

            <ToggleControl
                label={__('Add "ugc" attribute', 'gutenberg-extra')}
                checked={addUgc}
                onChange={onChangeAddUgc}
            />
        </Fragment>
    )
}