import './style.scss';
/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {	SelectControl } = wp.components;

/**
 * Component
 */
const BlockStylesControl = ( props ) => {
    const {
        blockStyle,
        onChangeBlockStyle,
        firstSelectorOptions = [
            { label: __('Global', 'gutenberg-extra'), value: 'gx-global' },
            { label: __('Dark', 'gutenberg-extra'), value: 'gx-dark' },
            { label: __('Light', 'gutenberg-extra'), value: 'gx-light' },
        ],
        defaultBlockStyle,
        onChangeDefaultBlockStyle,
        secondSelectorOptions = [
            { label: __('Dark', 'gutenberg-extra'), value: 'gx-def-dark' },
            { label: __('Light', 'gutenberg-extra'), value: 'gx-def-light' },
        ],
    } = props;

    return (
        <Fragment>
            <SelectControl
                label={__( 'Block Style', 'gutenberg-extra')}
                className={'gx-block-style'}
                value={blockStyle}
                options={firstSelectorOptions}
                onChange={value => onChangeBlockStyle( value )}
            />
            <SelectControl
                label={__( 'Default Block Style', 'gutenberg-extra')}
                className={'gx--default-block-style'}
                value={defaultBlockStyle}
                options={secondSelectorOptions}
                onChange={value => onChangeDefaultBlockStyle( value )}
            />
        </Fragment> 
    )
}

export default BlockStylesControl;