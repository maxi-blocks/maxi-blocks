/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    SelectControl,
    RadioControl,
} = wp.components;

/**
 * Styles and icons
 */
import './editor.scss';

/**
 * Component
 */
const EntranceAnimationControl = props => {

    const {
        motionOptions,
        onChange,
    } = props;

    let value = !isObject(motionOptions) ?
        JSON.parse(motionOptions) :
        motionOptions;

    let {
        parallax:parallaxOptions,
    } = value;


    return (
        <div className="maxi-parallax-control">
            <div className='maxi-fancy-radio-control'>
                <RadioControl
                    label={__('Use Parallax Effect', 'maxi-block')}
                    selected={parseInt(parallaxOptions.status)}
                    options={
                        [
                            { label: __('Yes', 'maxi-block'), value: 1 },
                            { label: __('No', 'maxi-block'), value: 0 },
                        ]
                    }
                    onChange={val => {
                        parallaxOptions.status = val;
                        onChange(JSON.stringify(value));
                    }}
                />
            </div>
            {
            !!parseInt(parallaxOptions.status) &&
                <SelectControl
                    label={__('Parallax Effect', 'maxi-blocks')}
                    value={parallaxOptions.effect}
                    options={[
                        { label: 'Scroll', value: 'scroll' },
                        { label: 'Mouse Movement', value: 'mouse' },
                    ]}
                    onChange={val => {
                        parallaxOptions.effect = val;
                        onChange(JSON.stringify(value));
                    }}
                />
            }
        </div>
    )

}

export default EntranceAnimationControl;