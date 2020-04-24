/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import ColorControl from '../color-control';
import DimensionsControl from '../dimensions-control/index';

/**
 * Component
 */
export default class BorderControl extends GXComponent {

    componentDidMount() {
        const value = typeof this.props.borderOptions === 'object' ? this.props.borderOptions : JSON.parse(this.props.borderOptions);
        this.saveAndSend(value)
    }

    render() {
        const {
            borderOptions,
            target = ''
        } = this.props;

        let value = typeof borderOptions === 'object' ? borderOptions : JSON.parse(borderOptions);

        return (
            <Fragment>
                <ColorControl
                    label={__('Color', 'gutenberg-extra')}
                    color={value.general['border-color']}
                    defaultColor={value['defaultBorderColor']}
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