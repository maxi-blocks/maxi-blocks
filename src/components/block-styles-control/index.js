/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;

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
                { label: __('Dark', 'maxi-blocks'), value: 'maxi-dark' },
                { label: __('Light', 'maxi-blocks'), value: 'maxi-light' },
                { label: __('Custom', 'maxi-blocks'), value: 'maxi-custom' },
            ];
        else
            return [
                { label: __('Parent', 'maxi-blocks'), value: 'maxi-parent' },
                { label: __('Custom', 'maxi-blocks'), value: 'maxi-custom' }
            ]
    }

    return (
        <Fragment>
            <SelectControl
                label={__('Block Style', 'maxi-blocks')}
                className={'maxi-block-style'}
                value={blockStyle}
                options={getSelectorOptions()}
                onChange={value => onChangeBlockStyle(value)}
            />
            {
                blockStyle === 'maxi-custom' &&
                <SelectControl
                    label={__('Default Block Style', 'maxi-blocks')}
                    className={'maxi--default-block-style'}
                    value={defaultBlockStyle}
                    options={[
                        { label: __('Dark', 'maxi-blocks'), value: 'maxi-def-dark' },
                        { label: __('Light', 'maxi-blocks'), value: 'maxi-def-light' },
                    ]}
                    onChange={value => onChangeDefaultBlockStyle(value)}
                />
            }
        </Fragment>
    )
}

export default BlockStylesControl;