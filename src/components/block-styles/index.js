const { Fragment } = wp.element;
const {	SelectControl } = wp.components;

export const blockStyleAttributes = {
    blockStyle: {
        type: 'string',
        default: 'gx-global'
    },
    defaultBlockStyle: {
        type: 'string',
        default: 'gx-def-light'
    },
}

export const BlockStyles = ( props ) => {
    const {
        attributes: {
            blockStyle,
            defaultBlockStyle
        },
        setAttributes
    } = props;

    return (
        <Fragment>
            <SelectControl
                label="Block Style"
                className="gx-block-style"
                value={blockStyle}
                options={[
                    { label: 'Global', value: 'gx-global' },
                    { label: 'Dark', value: 'gx-dark' },
                    { label: 'Light', value: 'gx-light' },
                ]}
                onChange={(value) => setAttributes({ blockStyle: value })}
            />
            <SelectControl
                label="Default Block Style"
                className="gx--default-block-style"
                value={defaultBlockStyle}
                options={[
                    { label: 'Dark', value: 'gx-def-dark' },
                    { label: 'Light', value: 'gx-def-light' },
                ]}
                onChange={(value) => setAttributes({ defaultBlockStyle: value })}
            />
        </Fragment>
    )
}