/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RangeControl,
    Button,
} = wp.components;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import { GXComponent } from '../../index';
import AccordionControl from '../../accordion-control';
import AlignmentControl from '../../alignment-control';
import BorderControl from '../../border-control';
import BoxShadowControl from '../../box-shadow-control';
import ColorControl from '../../color-control';
import DimensionsControl from '../../dimensions-control';
import FullSizeControl from '../../full-size-control';
import LinkedButton from '../../linked-button';
import NormalHoverControl from '../../normal-hover-control';
import TypographyControl from '../../typography-control';

/**
 * External dependencies
 */
import classnames from 'classnames';
import {
    isEmpty,
    isNil,
    isNumber
} from 'lodash';

/**
 * Styles
 */
import './editor.scss';



/**
 * Component
 */
export class ButtonSettings extends GXComponent {

    target = this.props.target ? this.props.target : 'maxi-buttoneditor-wrapper';

    state = {
        selectorTypographyColors: 'normal',
        selectorOpacityShadow: 'normal',
        selectorPaddingMargin: 'normal',
        selectorBorder: 'normal'
    }

    componentDidMount() {
        const value = typeof this.props.buttonSettings === 'object' ? this.props.buttonSettings : JSON.parse(this.props.buttonSettings);
        this.saveAndSend(value)
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getObject() {
        if (this.type === 'wrapper')
            return this.getWrapperStylesObject;
        if (this.type === 'normal')
            return this.getNormalStylesObject;
        if (this.type === 'hover')
            return this.getHoverStylesObject;
    }

    get getWrapperStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isNil(this.object.alignment)) {
            switch (this.object.alignment) {
                case 'left':
                    response.general['justify-content'] = 'flex-start';
                    break;
                case 'center':
                    response.general['justify-content'] = 'center';
                    break;
                case 'right':
                    response.general['justify-content'] = 'flex-end';
                    break;
            }
        }
        return response;
    }

    get getNormalStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isEmpty(this.object.normal.color))
            response.general['color'] = this.object.normal.color;
        if (!isEmpty(this.object.normal.backgroundColor))
            response.general['background-color'] = this.object.normal.backgroundColor;
        if (isNumber(this.object.normal.opacity))
            response.general['opacity'] = this.object.normal.opacity;
        if (!isEmpty(this.object.normal.borderSettings.borderColor))
            response.general['border-color'] = this.object.normal.borderSettings.borderColor;
        if (!isEmpty(this.object.normal.borderSettings.borderType))
            response.general['border-style'] = this.object.normal.borderSettings.borderType;
        return response;
    }

    get getHoverStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isEmpty(this.object.hover.color))
            response.general['color'] = this.object.hover.color;
        if (!isEmpty(this.object.hover.backgroundColor))
            response.general['background-color'] = this.object.hover.backgroundColor;
        if (isNumber(this.object.hover.opacity))
            response.general['opacity'] = this.object.hover.opacity;
        if (!isEmpty(this.object.hover.borderSettings.borderColor))
            response.general['border-color'] = this.object.hover.borderSettings.borderColor;
        if (!isEmpty(this.object.hover.borderSettings.borderType))
            response.general['border-style'] = this.object.hover.borderSettings.borderType;

        return response;
    }

    /**
    * Saves and send the data. Also refresh the styles on Editor
    */
    saveAndSend(value) {
        this.save(value);

        this.target = this.props.target ? this.props.target : 'maxi-buttoneditor-wrapper';
        this.saveMeta(value, 'wrapper');

        this.target = `${this.props.target ? this.props.target : 'maxi-buttoneditor-wrapper'} .maxi-buttoneditor-button`;
        this.saveMeta(value, 'normal');

        this.target = `${this.props.target ? this.props.target : 'maxi-buttoneditor-wrapper'} .maxi-buttoneditor-button:hover`;
        this.saveMeta(value, 'hover');

        new BackEndResponsiveStyles(this.getMeta);
    }

    save(value) {
        this.props.onChange(JSON.stringify(value));
    }

    saveMeta(value, type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(value, type, false),
            },
        });
    }

    render() {
        const {
            className,
            buttonSettings,
            target = 'maxi-buttoneditor-wrapper'
        } = this.props;

        const {
            selectorTypographyColors,
            selectorOpacityShadow,
            selectorPaddingMargin,
            selectorBorder
        } = this.state;

        const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);
        const classes = classnames('maxi-buttonsettings-control', className);

        return (
            <div className={classes}>
                <AccordionControl
                    isSecondary
                    items={[
                        {
                            label: __('Typography & Colors', 'maxi-blocks'),
                            classNameItem: "maxi-typography-item",
                            classNameHeading: "maxi-typography-tab",
                            content: (
                                <Fragment>
                                    {/** Should alignment be under this section? */}
                                    <AlignmentControl
                                        value={value.alignment}
                                        onChange={val => {
                                            value.alignment = val;
                                            this.saveAndSend(value)
                                        }}
                                        disableJustify
                                    />
                                    <NormalHoverControl
                                        selector={selectorTypographyColors}
                                        onChange={selectorTypographyColors => {
                                            this.setState({ selectorTypographyColors });
                                        }}
                                    />
                                    <ColorControl
                                        label={__('Background Colour', 'maxi-blocks')}
                                        color={value[selectorTypographyColors].backgroundColor}
                                        defaultcolor={value[selectorTypographyColors].defaultBackgroundColor}
                                        onColorChange={val => {
                                            value[selectorTypographyColors].backgroundColor = val;
                                            this.saveAndSend(value);
                                        }}
                                        gradient={value[selectorTypographyColors].background}
                                        defaultGradient={value[selectorTypographyColors].resetBackground}
                                        onGradientChange={val => {
                                            value[selectorTypographyColors].background = val;
                                            this.saveAndSend(value);
                                        }}
                                        disableGradientOverBackground
                                    />
                                    <TypographyControl
                                        fontOptions={value[selectorTypographyColors].typography}
                                        onChange={val => {
                                            value[selectorTypographyColors].typography = val;
                                            this.saveAndSend(value);
                                        }}
                                        target={`${target} .maxi-buttoneditor-button`}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Opacity / Shadow', 'maxi-blocks'),
                            /** why maxi-typography-tab if is Opacity/shadow settings? */
                            classNameItem: "maxi-box-settings-item",
                            classNameHeading: "maxi-typography-tab",
                            content: (
                                <Fragment>
                                    <NormalHoverControl
                                        selector={selectorOpacityShadow}
                                        onChange={selectorOpacityShadow => {
                                            this.setState({ selectorOpacityShadow });
                                        }}
                                    />
                                    <RangeControl
                                        label={__("Opacity", "maxi-blocks")}
                                        className={"maxi-opacity-control"}
                                        value={value[selectorOpacityShadow].opacity * 100}
                                        onChange={val => {
                                            value[selectorOpacityShadow].opacity = val / 100;
                                            this.saveAndSend(value);
                                        }}
                                        min={0}
                                        max={100}
                                        allowReset={true}
                                        initialPosition={0}
                                    />
                                    <BoxShadowControl
                                        boxShadowOptions={value[selectorBorder].boxShadow}
                                        onChange={val => {
                                            value[selectorBorder].boxShadow = JSON.parse(val);
                                            this.saveAndSend(value)
                                        }}
                                        target={
                                            selectorBorder != 'hover' ?
                                                `${target} .maxi-buttoneditor-button` :
                                                `${target} .maxi-buttoneditor-button:hover`
                                        }
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __("Border", "maxi-blocks"),
                            classNameItem: "maxi-border-item",
                            classNameHeading: 'maxi-border-tab',
                            content: (
                                <Fragment>
                                    <NormalHoverControl
                                        selector={selectorBorder}
                                        onChange={selectorBorder => {
                                            this.setState({ selectorBorder });
                                        }}
                                    />
                                    <BorderControl
                                        borderOptions={value[selectorOpacityShadow].borderSettings}
                                        onChange={val => {
                                            value[selectorOpacityShadow].borderSettings = val;
                                            this.saveAndSend(value)
                                        }}
                                        target={`${target} .maxi-buttoneditor-button`}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Width / Height', 'maxi-blocks'),
                            /** why maxi-typography-tab if its width/height? */
                            classNameItem: "maxi-width-height-item",
                            classNameHeading: "maxi-typography-tab",
                            content: (
                                <Fragment>
                                    <FullSizeControl
                                        sizeSettings={value.size}
                                        onChange={val => {
                                            value.size = val;
                                            this.saveAndSend(value);
                                        }}
                                        target={`${target} .maxi-buttoneditor-button`}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Padding / Margin', 'maxi-blocks'),
                            /** why maxi-typography-tab if its width/height? */
                            classNameItem: "maxi-padding-margin-item",
                            classNameHeading: "maxi-typography-tab",
                            content: (
                                <Fragment>
                                    <NormalHoverControl
                                        selector={selectorPaddingMargin}
                                        onChange={selectorPaddingMargin => {
                                            this.setState({ selectorPaddingMargin });
                                        }}
                                    />
                                    <DimensionsControl
                                        value={value[selectorPaddingMargin].padding}
                                        onChange={val => {
                                            value[selectorPaddingMargin].padding = val;
                                            this.saveAndSend(value)
                                        }}
                                        target={`${target} .maxi-buttoneditor-button`}
                                    />
                                    <DimensionsControl
                                        value={value[selectorPaddingMargin].margin}
                                        onChange={val => {
                                            value[selectorPaddingMargin].margin = val;
                                            this.saveAndSend(value)
                                        }}
                                        target={`${target} .maxi-buttoneditor-button`}
                                    />
                                </Fragment>
                            )
                        }
                    ]}
                />
            </div>
        )
    }
}

/**
 * Backend editor
 */
export const ButtonEditor = props => {
    const {
        className,
        buttonSettings,
        onChange,
        placeholder = __('Read more text...', 'maxi-blocks')
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);
    const classes = classnames("maxi-buttoneditor-wrapper", className);

    return (
        <div className={classes}>
            <LinkedButton
                className="maxi-buttoneditor-button"
                placeholder={placeholder}
                buttonText={value.buttonText}
                onTextChange={val => {
                    value.buttonText = val;
                    onChange(JSON.stringify(value));
                }}
                externalLink={value.linkOptions}
                onLinkChange={val => {
                    value.linkOptions = val;
                    onChange(JSON.stringify(value));
                }}
            />
        </div>
    )
}

/**
 * FrontEnd
 */
export const ButtonSaver = props => {
    const {
        className,
        buttonSettings,
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);
    const linkProps = {
        href: value.linkOptions.url || '',
        target: value.linkOptions.opensInNewTab ? '_blank' : '_self'
    }
    const classes = classnames("maxi-buttoneditor-button", className)

    return (
        <Fragment>
            {value.buttonText &&
                <Button
                    className={classes}
                    href={value.linkOptions.url}
                    {...linkProps}
                >
                    {value.opensInNewTab}
                    {value.buttonText}
                </Button>
            }
        </Fragment>
    )
}