/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;

/**
 * Styles
 */
import './style.scss';

/**
 * Component
 */
const BlockStylesControl = (props) => {
    const {
        blockStyle,
        onChangeBlockStyle,
        defaultBlockStyle,
        onChangeDefaultBlockStyle,
        isFirstOnHierarchy,
    } = props;

    const getSelectorOptions = () => {
        if (isFirstOnHierarchy)
            return [
                { label: __('Dark', 'gutenberg-extra'), value: 'gx-dark' },
                { label: __('Light', 'gutenberg-extra'), value: 'gx-light' },
                { label: __('Custom', 'gutenberg-extra'), value: 'gx-custom' },
            ];
        else
            return [
                { label: __('Parent', 'gutenberg-extra'), value: 'gx-parent' },
                { label: __('Custom', 'gutenberg-extra'), value: 'gx-custom' }
            ]
    }

    return (
        <Fragment>
            <SelectControl
                label={__('Block Style', 'gutenberg-extra')}
                className={'gx-block-style'}
                value={blockStyle}
                options={getSelectorOptions()}
                onChange={value => onChangeBlockStyle(value)}
            />
            {
                blockStyle === 'gx-custom' &&
                <SelectControl
                    label={__('Default Block Style', 'gutenberg-extra')}
                    className={'gx--default-block-style'}
                    value={defaultBlockStyle}
                    options={[
                        { label: __('Dark', 'gutenberg-extra'), value: 'gx-def-dark' },
                        { label: __('Light', 'gutenberg-extra'), value: 'gx-def-light' },
                    ]}
                    onChange={value => onChangeDefaultBlockStyle(value)}
                />
            }
        </Fragment>
    )
}

export default BlockStylesControl;