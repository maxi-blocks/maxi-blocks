/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RadioControl,
    Button
} = wp.components;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import AccordionControl from '../accordion-control';
import AlignmentControl from '../alignment-control';
import BorderControl from '../border-control';
import BoxShadowControl from '../box-shadow-control';
import ColorControl from '../color-control';
import DimensionsControl from '../dimensions-control';
import FullSizeControl from '../full-size-control';
import LinkedButton from '../linked-button';
import TypographyControl from '../typography-control';

/**
 * External dependencies
 */
import {
    isEmpty,
    isNil,
} from 'lodash';

/**
 * Styles and icons
 */
import './editor.scss';
import { library } from '../../icons';

/**
 * Block
 */
export class ButtonSettings extends GXComponent {

    target = this.props.target ? this.props.target : 'gx-buttoneditor-button';

    state = {
        selector1: 'normal',
        selector2: 'normal',
        selector3: 'normal',
    }

    componentDidMount() {
        const value = typeof this.props.buttonSettings === 'object' ? this.props.buttonSettings : JSON.parse(this.props.buttonSettings);
        this.saveAndSend(value)
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getObject() {
        if (this.type === 'normal')
            return this.getNormalStylesObject;
        if (this.type === 'hover')
            return this.getHoverStylesObject;
    }

    get getNormalStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isNil(this.object.alignment)) {
            switch (this.object.alignment) {
                case 'left':
                    response.general['margin-right'] = 'auto';
                    break;
                case 'center':
                case 'justify':
                    response.general['margin-right'] = 'auto';
                    response.general['margin-left'] = 'auto';
                    break;
                case 'right':
                    response.general['margin-left'] = 'auto';
                    break;
            }
        }
        if (!isEmpty(this.object.normal.color)) {
            response.general['color'] = this.object.normal.color;
        }
        if (!isEmpty(this.object.normal.backgroundColor)) {
            response.general['background-color'] = this.object.normal.backgroundColor;
        }
        if (!isEmpty(this.object.normal.borderSettings.borderColor)) {
            response.general['border-color'] = this.object.normal.borderSettings.borderColor;
        }
        if (!isEmpty(this.object.normal.borderSettings.borderType)) {
            response.general['border-style'] = this.object.normal.borderSettings.borderType;
        }
        return response;
    }

    get getHoverStylesObject() {
        const response = {
            label: this.object.label,
            general: {}
        }
        if (!isEmpty(this.object.hover.color)) {
            response.general['color'] = this.object.hover.color;
        }
        if (!isEmpty(this.object.hover.backgroundColor)) {
            response.general['background-color'] = this.object.hover.backgroundColor;
        }
        if (!isEmpty(this.object.hover.borderSettings.borderColor)) {
            response.general['border-color'] = this.object.hover.borderSettings.borderColor;
        }
        if (!isEmpty(this.object.hover.borderSettings.borderType)) {
            response.general['border-style'] = this.object.hover.borderSettings.borderType;
        }
        return response;
    }

    /**
    * Saves and send the data. Also refresh the styles on Editor
    */
    saveAndSend(value) {
        this.save(value);

        this.target = this.props.target ? this.props.target : 'gx-buttoneditor-button';
        this.saveMeta(value, 'normal');

        this.target = `${this.target}:hover`;
        this.saveMeta(value, 'hover');

        new BackEndResponsiveStyles(this.getMeta);
    }

    save(value) {
        this.props.onChange(JSON.stringify(value));
    }

    saveMeta(value, type) {
        dispatch('core/editor').editPost({
            meta: {
                _gutenberg_extra_responsive_styles: this.metaValue(value, type),
            },
        });
    }

    render() {
        const {
            className = 'gx-buttonstyles-control',
            buttonSettings,
            target = 'gx-buttoneditor-button'
        } = this.props;

        const {
            selector1,
            selector2,
            selector3
        } = this.state;

        const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

        return (
            <div className={className}>
                <AccordionControl
                    items={[
                        {
                            label: __('Typography & Colors', 'gutenberg-extra'),
                            className: "gx-buttonstyles-selector-control",
                            icon: library,
                            content: (
                                <Fragment>
                                    <RadioControl
                                        className="gx-typography-tab"
                                        selected={selector1}
                                        options={[
                                            { label: 'Normal', value: 'normal' },
                                            { label: 'Hover', value: 'hover' },
                                        ]}
                                        onChange={selector1 => {
                                            this.setState({ selector1 });
                                        }}
                                    />
                                    <TypographyControl
                                        fontOptions={value[selector1].typography}
                                        onChange={val => {
                                            value[selector1].typography = val;
                                            this.saveAndSend(value);
                                        }}
                                        target={target}
                                    />
                                    <ColorControl
                                        label={__('Background Colour', 'gutenberg-extra')}
                                        color={value[selector1].backgroundColor}
                                        onColorChange={val => {
                                            value[selector1].backgroundColor = val;
                                            this.saveAndSend(value);
                                        }}
                                        disableGradient
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Box Settings', 'gutenberg-extra'),
                            content: (
                                <Fragment>
                                    <AlignmentControl
                                        value={value.alignment}
                                        onChange={val => {
                                            value.alignment = val;
                                            this.saveAndSend(value)
                                        }}
                                        disableJustify
                                    />
                                    <RadioControl
                                        className="gx-buttonstyles-selector-control"
                                        selected={selector2}
                                        options={[
                                            { label: 'Normal', value: 'normal' },
                                            { label: 'Hover', value: 'hover' },
                                        ]}
                                        onChange={selector2 => {
                                            this.setState({ selector2 });
                                        }}
                                    />
                                    <BoxShadowControl
                                        boxShadowOptions={value[selector2].boxShadow}
                                        onChange={val => {
                                            value[selector2].boxShadow = JSON.parse(val);
                                            this.saveAndSend(value)
                                        }}
                                        target={
                                            selector2 != 'hover' ?
                                                `${target}` :
                                                `${target}:hover`
                                        }
                                    />
                                    <BorderControl
                                        borderOptions={value[selector2].borderSettings}
                                        onChange={val => {
                                            value[selector2].borderSettings = val;
                                            this.saveAndSend(value)
                                        }}
                                        borderRadiusTarget={target}
                                        borderWidthTarget={target}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Width and Height', 'gutenberg-extra'),
                            content: (
                                <Fragment>
                                    <FullSizeControl
                                        sizeSettings={value.size}
                                        onChange={val => {
                                            value.size = val;
                                            this.saveAndSend(value);
                                        }}
                                        target={target}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Padding and Margin', 'gutenberg-extra'),
                            content: (
                                <Fragment>
                                    <RadioControl
                                        className="gx-buttonstyles-selector-control"
                                        selected={selector3}
                                        options={[
                                            { label: 'Normal', value: 'normal' },
                                            { label: 'Hover', value: 'hover' },
                                        ]}
                                        onChange={selector3 => {
                                            this.setState({ selector3 });
                                        }}
                                    />
                                    <DimensionsControl
                                        value={value[selector3].padding}
                                        onChange={val => {
                                            value[selector3].padding = val;
                                            this.saveAndSend(value)
                                        }}
                                        target={target}
                                    />
                                    <DimensionsControl
                                        value={value[selector3].margin}
                                        onChange={val => {
                                            value[selector3].margin = val;
                                            this.saveAndSend(value)
                                        }}
                                        target={target}
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
        className = 'gx-buttoneditor-button',
        buttonSettings,
        onChange,
        placeholder = __('Read more text...', 'gutenberg-extra')
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);

    return (
        <LinkedButton
            className={className}
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
    )
}

/**
 * FrontEnd
 */
export const ButtonSaver = props => {
    const {
        className = 'gx-buttoneditor-button',
        buttonSettings,
    } = props;

    const value = typeof buttonSettings === 'object' ? buttonSettings : JSON.parse(buttonSettings);
    const linkProps = {
        href: value.linkOptions.url || '',
        target: value.linkOptions.opensInNewTab ? '_blank' : '_self'
    }

    return (
        <Fragment>
            {value.buttonText &&
                <Button
                    className={className}
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