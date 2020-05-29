/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import ColorControl from '../color-control';
import DimensionsControl from '../dimensions-control/index';

/**
 * External dependencies
 */
import classnames from 'classnames';

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
            className,
            target = '',
        } = this.props;

        let value = typeof borderOptions === 'object' ? borderOptions : JSON.parse(borderOptions);
        const classes = classnames('maxi-border-control', className);
        
        return (
            <div className={classes}>
                <ColorControl
                    label={__('Color', 'maxi-blocks')}
                    color={value.general['border-color']}
                    defaultColor={value['defaultBorderColor']}
                    onColorChange={val => {
                        value.general['border-color'] = val;
                        this.saveAndSend(value);
                    }}
                    disableGradient
                    disableGradientAboveBackground
                />
                <SelectControl
                    label={__('Border Type', 'maxi-blocks')}
                    className="maxi-border-type"
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
                        this.saveAndSend(value);
                    }}
                />
                <DimensionsControl
                    value={value.borderWidth}
                    onChange={val => {
                        value.borderWidth = JSON.parse(val);
                        this.saveAndSend(value);
                    }}
                    target={target}
                />
                <DimensionsControl
                    value={value.borderRadius}
                    onChange={val => {
                        value.borderRadius = JSON.parse(val);
                        this.saveAndSend(value);
                    }}
                    target={target}
                />
            </div>
        )
    }

}