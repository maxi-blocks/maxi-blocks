/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    dispatch,
    select
} = wp.data;

/**
 * Internal dependencies
 */
import GXComponent from '../../../extensions/gx-component';
import MiniSizeControl from '../../mini-size-control';

export const sizeControlAttributesTest = {
    sizeTest: {
        type: 'string',
        default: '{"label":"Size","general":{"max-widthUnit":"px","max-width":"","widthUnit":"px","width":"","min-widthUnit":"px","min-width":"","max-heightUnit":"px","max-height":"","heightUnit":"px","height":"","min-heightUnit":"px","min-height":""}}'
    }
}

/**
 * Block
 */
export default class SizeControlTest extends GXComponent {

    componentDidMount() {
        const value = typeof this.props.sizeSettings === 'object' ? this.props.sizeSettings : JSON.parse(this.props.sizeSettings);
        this.saveAndSend(value)
    }

    render() {
        const {
            sizeSettings,
        } = this.props;

        let value = typeof sizeSettings === 'object' ? sizeSettings : JSON.parse(sizeSettings);

        const onChangeValue = (target, val) => {
            if (typeof val === 'undefined')
                val = '';
            value.general[target] = val;
            this.saveAndSend(value);
        }

        return (
            <Fragment>
                <MiniSizeControl
                    label={__("Max Width", 'gutenberg-extra')}
                    unit={value.general['max-widthUnit']}
                    onChangeUnit={value => onChangeValue('max-widthUnit', value)}
                    value={value.general['max-width']}
                    onChangeValue={value => onChangeValue('max-width', value)}
                />
                <MiniSizeControl
                    label={__("Width", 'gutenberg-extra')}
                    unit={value.general.widthUnit}
                    onChangeUnit={value => onChangeValue('widthUnit', value)}
                    value={value.general.width}
                    onChangeValue={value => onChangeValue('width', value)}
                />
                <MiniSizeControl
                    label={__("Min Width", 'gutenberg-extra')}
                    unit={value.general['min-widthUnit']}
                    onChangeUnit={value => onChangeValue('min-widthUnit', value)}
                    value={value.general['min-width']}
                    onChangeValue={value => onChangeValue('min-width', value)}
                />
                <MiniSizeControl
                    label={__("Max Height", 'gutenberg-extra')}
                    unit={value.general['max-heightUnit']}
                    onChangeUnit={value => onChangeValue('max-heightUnit', value)}
                    value={value.general['max-height']}
                    onChangeValue={value => onChangeValue('max-height', value)}
                />
                <MiniSizeControl
                    label={__("Height", 'gutenberg-extra')}
                    unit={value.general.heightUnit}
                    onChangeUnit={value => onChangeValue('heightUnit', value)}
                    value={value.general.height}
                    onChangeValue={value => onChangeValue('height', value)}
                />
                <MiniSizeControl
                    label={__("Min Height", 'gutenberg-extra')}
                    unit={value.general['min-heightUnit']}
                    onChangeUnit={value => onChangeValue('min-heightUnit', value)}
                    value={value.general['min-height']}
                    onChangeValue={value => onChangeValue('min-height', value)}
                />
            </Fragment>
        )
    }
}