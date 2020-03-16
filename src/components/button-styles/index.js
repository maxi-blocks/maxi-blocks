const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    PanelColorSettings
} = wp.blockEditor;

export const buttonStyleAttributes = {
    buttonColor: {
        type: 'string',
        default: "",
    },
    buttonBgColor: {
        type: 'string',
        default: "",
    },
}

export const ButtonStyles = ( props ) => {
    const {
           className,
           attributes: {
               buttonColor,
               buttonBgColor,
           },
           setAttributes,
       } = props;


    return (
        <Fragment>
        <PanelColorSettings
            title={__('Button Settings', 'gutenberg-extra' )}
            colorSettings={[
                {
                    value: buttonBgColor,
                    onChange: (value) => setAttributes({ buttonBgColor: value }),
                    label: __('Background Colour', 'gutenberg-extra' ),
                },
            ]}
        />

        <PanelColorSettings
            title={__('Button Settings', 'gutenberg-extra' )}
            colorSettings={[
                {
                    value: buttonColor,
                    onChange: (value) => setAttributes({ buttonColor: value }),
                    label: __('Text Colour', 'gutenberg-extra' ),
                },
            ]}
        />
        </Fragment>

    )
}