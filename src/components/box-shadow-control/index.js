/**
 * Wordpress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const { RangeControl } = wp.components;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import ColorControl from '../color-control';
import PopoverControl from '../popover-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
class BoxShadow extends GXComponent {

    componentDidMount() {
        const value = typeof this.props.boxShadowOptions === 'object' ? this.props.boxShadowOptions : JSON.parse(this.props.boxShadowOptions);
        this.saveAndSend(value)
    }

    /**
     * Creates a new object for being joined with the rest of the values on meta
     */
    get getObject() {
        const response = {
            label: this.object.label,
            general: {
                "box-shadow": this.getShadow
            }
        }

        return response;
    }

    get getShadow() {
        let response = '';
        this.object.shadowHorizontal ? response += (this.object.shadowHorizontal + 'px ') : null;
        this.object.shadowVertical ? response += (this.object.shadowVertical + 'px ') : null;
        this.object.shadowBlur ? response += (this.object.shadowBlur + 'px ') : null;
        this.object.shadowSpread ? response += (this.object.shadowSpread + 'px ') : null;
        this.object.shadowColor ? response += (this.object.shadowColor) : null;

        return response.trim();
    }

    render() {
        const { boxShadowOptions } = this.props;

        let value = typeof boxShadowOptions === 'object' ? boxShadowOptions : JSON.parse(boxShadowOptions);

        const onChangeValue = (target, val) => {
            value[target] = val;
            this.saveAndSend(value);
        }

        return (
            <Fragment>
                <ColorControl
                    label={__('Color', 'gutenberg-extra')}
                    color={value.shadowColor}
                    onColorChange={val => onChangeValue('shadowColor', val)}
                    disableGradient
                    disableGradientAboveBackground
                />
                <RangeControl
                    label={__('Horizontal', 'gutenberg-extra')}
                    className={'gx-shadow-horizontal-control'}
                    value={value.shadowHorizontal}
                    onChange={val => onChangeValue('shadowHorizontal', val)}
                    min={-100}
                    max={100}
                    allowReset={true}
                    initialPosition={0}
                />
                <RangeControl
                    label={__('Vertical', 'gutenberg-extra')}
                    className={'gx-shadow-vertical-control'}
                    value={value.shadowVertical}
                    onChange={val => onChangeValue('shadowVertical', val)}
                    min={-100}
                    max={100}
                    allowReset={true}
                    initialPosition={0}
                />
                <RangeControl
                    label={__('Blur', 'gutenberg-extra')}
                    className={'gx-shadow-blur-control'}
                    value={value.shadowBlur}
                    onChange={val => onChangeValue('shadowBlur', val)}
                    min={0}
                    max={100}
                    allowReset={true}
                    initialPosition={0}
                />
                <RangeControl
                    label={__('Spread', 'gutenberg-extra')}
                    className={'gx-shadow-spread-control'}
                    value={value.shadowSpread}
                    onChange={val => onChangeValue('shadowSpread', val)}
                    min={-100}
                    max={100}
                    allowReset={true}
                    initialPosition={0}
                />
            </Fragment>
        )
    }
}

const BoxShadowControl = props => {

    const {
        boxShadowOptions,
        onChange,
        className
    } = props;

    const classes = classnames('gx-boxshadow-control', className);

    return (
        <PopoverControl
            label={__('Box shadow', 'gutenberg-extra')}
            className={classes}
            popovers={[
                {
                    content: (
                        <BoxShadow
                            boxShadowOptions={boxShadowOptions}
                            onChange={onChange}
                        />
                    )
                }
            ]}
        />
    )
}

export default BoxShadowControl;