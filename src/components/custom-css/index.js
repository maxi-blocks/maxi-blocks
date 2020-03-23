const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    TextControl,
    TextareaControl,
} = wp.components;

export const customCSSAtributes = {
    extraClassName: {
        type: 'string',
    },
    extraStyles: {
        type: 'string',
    },
    extraHoverStyles: {
        type: 'string',
    },
    extraBeforeStyles: {
        type: 'string',
    },
    extraAfterStyles: {
        type: 'string',
    },
    extraHoverBeforeStyles: {
        type: 'string',
    },
    extraHoverAfterStyles: {
        type: 'string',
    },
}

export const CustomCSS = (props) => {
    const {
        attributes: {
            extraClassName,
            extraStyles
        },
        setAttributes
    } = props;

    return (
        <Fragment>
            <TextControl
                label={__('Additional CSS Classes', 'gutenberg-extra')}
                className="gx-additional-css"
                value={extraClassName || ''}
                onChange={(e) => {
                    setAttributes({
                        extraClassName: e,
                    });
                }}
            />
            <TextareaControl
                label={__('Additional CSS Styles', 'gutenberg-extra')}
                className="gx-additional-css"
                value={extraStyles || ''}
                onChange={(e) => {
                    setAttributes({
                        extraStyles: e,
                    });
                }}
            />
            {/*<TextareaControl
                label={ __( 'Additional CSS Hover Styles', 'gutenber-extra' ) }
                value={ extraHoverStyles || '' }
                onChange={ (e) => {
                    setAttributes( {
                        extraHoverStyles: e,
                    } );
                } }
            />
            <TextareaControl
                label={ __( 'Additional CSS Before Styles', 'gutenber-extra' ) }
                value={ extraBeforeStyles || '' }
                onChange={ (e) => {
                    setAttributes( {
                        extraBeforeStyles: e,
                    } );
                } }
            />
            <TextareaControl
                label={ __( 'Additional CSS After Styles', 'gutenber-extra' ) }
                value={ extraAfterStyles || '' }
                onChange={ (e) => {
                    setAttributes( {
                        extraAfterStyles: e,
                    } );
                } }
            />
            <TextareaControl
                label={ __( 'Additional CSS Hover Before Styles', 'gutenber-extra' ) }
                value={ extraHoverBeforeStyles || '' }
                onChange={ (e) => {
                    setAttributes( {
                        extraHoverBeforeStyles: e,
                    } );
                } }
            />
            <TextareaControl
                label={ __( 'Additional CSS Hover After Styles', 'gutenber-extra' ) }
                value={ extraHoverAfterStyles || '' }
                onChange={ (e) => {
                    setAttributes( {
                        extraHoverAfterStyles: e,
                    } );
                } }
            />*/}
        </Fragment>
    )
}
