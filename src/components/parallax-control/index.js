/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Fragment } = wp.element;
const {
    RadioControl,
    RangeControl
} = wp.components;

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Component
 */
const ParallaxControl = props => {

    const {
        className,
        motionOptions,
        onChange,
    } = props;

    let value = !isObject(motionOptions) ?
        JSON.parse(motionOptions) :
        motionOptions;

    let {
        parallax: parallaxOptions,
    } = value;

    const classes = classnames(
        'maxi-parallax-control',
        className,
    );

    return (
        <div className={classes}>
            <div className='maxi-fancy-radio-control'>
                <RadioControl
                    label={__('Use Parallax Effect', 'maxi-blocks')}
                    selected={parallaxOptions.status}
                    options={[
                        { label: __('Yes', 'maxi-blocks'), value: 1 },
                        { label: __('No', 'maxi-blocks'), value: 0 },
                    ]}
                    onChange={val => {
                        parallaxOptions.status = Number(val);
                        onChange(JSON.stringify(value));
                    }}
                />
            </div>
            {
                !!parallaxOptions.status &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Direction', 'maxi-blocks')}
                            selected={parallaxOptions.direction}
                            options={[
                                { label: __('Up', 'maxi-blocks'), value: 'up' },
                                { label: __('Down', 'maxi-blocks'), value: 'down' },
                            ]}
                            onChange={val => {
                                parallaxOptions.direction = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    <RangeControl
                        label={__('Speed', 'maxi-blocks')}
                        value={parallaxOptions.speed}
                        onChange={val => {
                            parallaxOptions.speed = Number(val);
                            onChange(JSON.stringify(value))
                        }}
                        min={1}
                        max={10}
                    />
                </Fragment>
            }
        </div>
    )

}

export default ParallaxControl;