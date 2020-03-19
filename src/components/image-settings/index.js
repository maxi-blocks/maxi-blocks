/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;
const { PanelColorSettings } = wp.blockEditor;

/**
 * External dependencies
 */
import { SizeControl } from '../size-control/index';
import { BlockBorder } from '../block-border/index';
import AlignmentControl from '../alignment-control/index';
import image from '@wordpress/icons/build/library/image';

/**
 * Default attributes
 */

export const imageSettingsAttributes = {
    imageSettings: {
        type: 'string',
        default: '{"label":"Image Settings","borderSettings":{"borderColor":"","borderType":"none","borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}}}}',    
    }
}

/**
 * Block
 */
export const ImageSettings = props => {

    const {
        imageSettings
    } = props;

    const values = JSON.parse(imageSettings);

    const onChangeBorder = e => {
        console.log(e)
    }

    return (
        <Fragment>
            <SelectControl
                label="Image Size"
                value="100%"
                options={ [
                    { label: 'Big', value: '100%' },
                    { label: 'Medium', value: '50%' },
                    { label: 'Small', value: '25%' },
                ] }
                onChange={ size => console.log(size) }
            />
            <AlignmentControl/>
            {/* <SizeControl 
                {...props} 
            /> */}
            <PanelColorSettings
                title={__('Background Colour Settings', 'gutenberg-extra')}
                colorSettings={[
                    {
                        value: '#000',
                        onChange: (value) => console.log(value),
                        label: __('Background Colour', 'gutenberg-extra'),
                    },
                ]}
                />
            <BlockBorder 
                borderColor={JSON.stringify(values.borderSettings.borderColor)}
                onchangeBorderColor={onChangeBorder}
                borderType={JSON.stringify(values.borderSettings.borderType)}
                onchangeBorderType={onChangeBorder}
                borderRadius={JSON.stringify(values.borderSettings.borderRadius)}
                onchangeBorderRadius={onChangeBorder}
                borderWidth={JSON.stringify(values.borderSettings.borderWidth)}
                onchangeBorderWidth={onChangeBorder}
            />
        </Fragment>
    )
}