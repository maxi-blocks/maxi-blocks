/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { PanelColorSettings } = wp.blockEditor;
const { Component } = wp.element;
const {
    SelectControl,
    RadioControl,
    RangeControl
} = wp.components;

/**
 * External dependencies
 */
import { BlockBorder } from '../block-border/index';
import AlignmentControl from '../alignment-control/index';
import image from '@wordpress/icons/build/library/image';
import MiniSizeControl from '../mini-size-control';

/**
 * Styles
 */
import './editor.scss';

/**
 * Default attributes
 */
export const imageSettingsAttributes = {
    imageSettings: {
        type: 'string',
        default: '{"label":"Image Settings","isize":"full","alignment":"","caption":"none","maxWidth":"","width":"","sizeSettings":{"maxWidthUnit":"px","maxWidth":"","widthUnit":"px","width":""},"normal":{"opacity":"","backgroundColor":"","boxShadow":"","borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}},"hover":{"opacity":"","backgroundColor":"","boxShadow":"","borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}}}',
    }
}

/**
 * Block
 */
export default class ImageSettings extends Component {

    state = {
        selector: 'normal',
        borderRadius: () => {
            return JSON.parse(this.props.imageSettings)[this.state.selector].borderSettings.borderRadius
        },
    }

    render() {
        const {
            imageSettings,
            onChange
        } = this.props;

        const {
            selector,
            borderRadius
        } = this.state;

        const value = JSON.parse(imageSettings);

        const onChangeValue = (target, newValue, obj = value) => {
            let parts = target.split(".");
            if (parts.length == 1) {
                obj[parts[0]] = newValue;
                saveAndSend();
                return;
            }
            return onChangeValue(parts.slice(1).join("."), newValue, obj[parts[0]]);
        }

        /**
		* Saves and send the data. Also refresh the styles on Editor
		*/
        const saveAndSend = () => {
            onChange(JSON.stringify(value));
            //     dispatch('core/editor').editPost({
            // 		meta: {
            // 			_gutenberg_extra_responsive_styles: metaValue(),
            // 		},
            //     });
            // new BackEndResponsiveStyles(getMeta());
        }

        return (
            <div className="gx-imagesettings-control">
                <SelectControl
                    label={__('Image Size', 'gutenberg-extra')}
                    value={value.size}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Medium', value: '50%' },
                        { label: 'Small', value: '25%' },
                    ]}
                    onChange={value => onChangeValue('size', value)}
                />
                <AlignmentControl
                // value={value.alignment}
                // onChange={}
                />
                <SelectControl
                    label={__('Caption', 'gutenberg-extra')}
                    value={value.caption}
                    options={[
                        { label: 'Big', value: '100%' },
                        { label: 'Medium', value: '50%' },
                        { label: 'Small', value: '25%' },
                    ]}
                    onChange={value => onChangeValue('caption', value)}
                />
                <MiniSizeControl
                    label={__('Max Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.maxWidthUnit}
                    onChangeUnit={value => onChangeValue('sizeSettings.maxWidthUnit', value)}
                    value={value.sizeSettings.maxWidth}
                    onChangeValue={value => onChangeValue('sizeSettings.maxWidth', value)}
                />
                <MiniSizeControl
                    label={__('Width', 'gutenberg-extra')}
                    unit={value.sizeSettings.widthUnit}
                    onChangeUnit={value => onChangeValue('sizeSettings.widthUnit', value)}
                    value={value.sizeSettings.width}
                    onChangeValue={value => onChangeValue('sizeSettings.width', value)}
                />
                <RadioControl
                    className="gx-imagesettings-selector-control"
                    selected={selector}
                    options={[
                        { label: 'Normal', value: 'normal' },
                        { label: 'Hover', value: 'hover' },
                    ]}
                    onChange={(selector) => { 
                        this.setState({ selector });
                        console.log(value[selector])
                    }}
                />
                <RangeControl
                    label={__('Opacity', 'gutenberg-extra')}
                    value={value[selector].opacity}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={value => onChangeValue(`${selector}.opacity`, value)}
                />
                <PanelColorSettings
                    title={__('Background Colour Settings', 'gutenberg-extra')}
                    colorSettings={[
                        {
                            value: value[selector].backgroundColor,
                            onChange: value => onChangeValue(`${selector}.backgroundColor`, value),
                            label: __('Background Colour', 'gutenberg-extra'),
                        },
                    ]}
                />
                <BlockBorder
                    borderColor={value[selector].borderSettings.borderColor}
                    onChangeBorderColor={value => onChangeValue(`${selector}.borderSettings.borderColor`, value)}
                    borderType={value[selector].borderSettings.borderType}
                    onChangeBorderType={value => onChangeValue(`${selector}.borderSettings.borderType`, value)}
                    borderRadius={JSON.stringify(borderRadius())}
                    onChangeBorderRadius={value => onChangeValue(`${selector}.borderSettings.borderRadius`, JSON.parse(value))}
                    borderWidth={JSON.stringify(value[selector].borderSettings.borderWidth)}
                    onChangeBorderWidth={value => onChangeValue(`${selector}.borderSettings.borderWidth`, JSON.parse(value))}
                />
            </div>
        )
    }
}
