/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;
const {
    dispatch,
    select
} = wp.data;

/**
 * Internal dependencies
 */
import GXComponent from '../../../extensions/gx-component';
import DimensionsControl from '../../dimensions-control/index';
import ColorControl from '../../color-control';

/**
 * Attributes
 */
export const borderAttributesTest = {
    borderTest: {
        type: 'string',
        default: '{"label":"Border","general":{"border-color":"","border-style":"solid"},"borderWidth":{"label":"Border width","unit":"px","max":"1000","desktop":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"tablet":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true},"mobile":{"border-top-width":0,"border-right-width":0,"border-bottom-width":0,"border-left-width":0,"sync":true}},"borderRadius":{"label":"Border radius","unit":"px","max":"1000","desktop":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"tablet":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true},"mobile":{"border-top-left-radius":0,"border-top-right-radius":0,"border-bottom-right-radius":0,"border-bottom-left-radius":0,"sync":true}}}'
    }
}

/**
 * Block
 */
export default class BlockBorderTest extends GXComponent {
    render() {
        const {
            borderOptions,
            target = ''
        } = this.props;

        let value = typeof borderOptions === 'object' ? borderOptions : JSON.parse(borderOptions);

        return (
            <Fragment>
                <ColorControl
                    label={__('Color Color', 'gutenberg-extra')}
                    color={value.general['border-color']}
                    onColorChange={val => {
                        value.general['border-color'] = val;
                        this.saveAndSend(value, null, false);
                    }}
                    disableGradient
                    disableGradientAboveBackground
                />
                <SelectControl
                    label={__('Border Type', 'gutenberg-extra')}
                    className="gx-border-type"
                    value={value.general['border-style']}
                    options={[
                        { label: 'None', value: 'none' },
                        { label: 'Dotted', value: 'dotted' },
                        { label: 'Dashed', value: 'dashed' },
                        { label: 'Solid', value: 'solid' },
                        { label: 'Double', value: 'double' },
                        { label: 'Groove', value: 'groove' },
                        { label: 'Ridge', value: 'ridge' },
                        { label: 'Inset', value: 'inset' },
                        { label: 'Outset', value: 'outset' },
                    ]}
                    onChange={val => {
                        value.general['border-style'] = val;
                        this.saveAndSend(value, null, false);
                    }}
                />
                <DimensionsControl
                    value={value.borderWidth}
                    onChange={val => {
                        value.borderWidth = JSON.parse(val);
                        this.saveAndSend(value, null, false);
                    }}
                    target={target}
                    avoidZero
                />
                <DimensionsControl
                    value={value.borderRadius}
                    onChange={val => {
                        value.borderRadius = JSON.parse(val);
                        this.saveAndSend(value, null, false);
                    }}
                    target={target}
                    avoidZero
                />
            </Fragment>
        )
    }
}