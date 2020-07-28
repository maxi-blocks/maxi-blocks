/**
 * External dependencies
 */
import { isObject } from 'lodash';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    RadioControl,
    SelectControl,
    Icon,
} = wp.components;
const {
    Fragment,
    useState,
} = wp.element;

/**
 * Internal dependencies
 */
import {
    __experimentalAdvancedRangeControl,
    __experimentalGroupInputControl
} from '../../components';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    motionVertical,
    motionHorizontal,
    motionRotate,
    motionScale,
    motionFade,
    motionBlur,
} from '../../icons';

/**
 * Component
 */
const MotionControl = props => {

    const {
        motionOptions,
        onChange,
    } = props;

    let value = !isObject(motionOptions) ?
        JSON.parse(motionOptions) :
        motionOptions;

    let {
        vertical: verticalOptions,
        horizontal: horizontalOptions,
        rotate: rotateOptions,
        scale: scaleOptions,
        fade: fadeOptions,
        blur: blurOptions,
    } = value;

    const [motionStatus, setMotionStatus] = useState('vertical');

    return (
        <div className="maxi-motion-control">
            <div className='maxi-fancy-radio-control'>
                <RadioControl
                    label=''
                    selected={motionStatus}
                    options={
                        [
                            { label: <Icon icon={motionVertical} />, value: 'vertical' },
                            { label: <Icon icon={motionHorizontal} />, value: 'horizontal' },
                            { label: <Icon icon={motionRotate} />, value: 'rotate' },
                            { label: <Icon icon={motionScale} />, value: 'scale' },
                            { label: <Icon icon={motionFade()} />, value: 'fade' },
                            { label: <Icon icon={motionBlur()} />, value: 'blur' },
                        ]
                    }
                    onChange={value => setMotionStatus(value)}
                />
            </div>
            {
            motionStatus === 'vertical' &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Vertical', 'maxi-block')}
                            selected={parseInt(verticalOptions.status)}
                            options={
                                [
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                    { label: __('No', 'maxi-block'), value: 0 },
                                ]
                            }
                            onChange={val => {
                                verticalOptions.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(verticalOptions.status) &&
                        <Fragment>
                            <SelectControl
                                label={__('Direction', 'maxi-blocks')}
                                value={verticalOptions.direction}
                                options={[
                                    { label: 'Up', value: 'up' },
                                    { label: 'Down', value: 'down' },
                                ]}
                                onChange={val => {
                                    verticalOptions.direction = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalAdvancedRangeControl
                                options={verticalOptions.viewport}
                                onChange={val => {
                                    verticalOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Vertical', 'maxi-blocks')}
                                options={verticalOptions}
                                onChange={val => {
                                    verticalOptions = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                        </Fragment>
                    }
                </Fragment>
            }
            {
            motionStatus === 'horizontal' &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Horizontal', 'maxi-block')}
                            selected={parseInt(horizontalOptions.status)}
                            options={
                                [
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                    { label: __('No', 'maxi-block'), value: 0 },
                                ]
                            }
                            onChange={val => {
                                horizontalOptions.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(horizontalOptions.status) &&
                        <Fragment>
                            <SelectControl
                                label={__('Direction', 'maxi-blocks')}
                                value={horizontalOptions.direction}
                                options={[
                                    { label: 'To left', value: 'left' },
                                    { label: 'To Right', value: 'right' },
                                ]}
                                onChange={val => {
                                    horizontalOptions.direction = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalAdvancedRangeControl
                                options={horizontalOptions.viewport}
                                onChange={val => {
                                    horizontalOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Horizontal', 'maxi-blocks')}
                                options={horizontalOptions}
                                onChange={val => {
                                    horizontalOptions = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                        </Fragment>
                    }
                </Fragment>
            }
            {
            motionStatus === 'rotate' &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Rotate', 'maxi-block')}
                            selected={parseInt(rotateOptions.status)}
                            options={
                                [
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                    { label: __('No', 'maxi-block'), value: 0 },
                                ]
                            }
                            onChange={val => {
                                rotateOptions.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(rotateOptions.status) &&
                        <Fragment>
                            <SelectControl
                                label={__('Direction', 'maxi-blocks')}
                                value={rotateOptions.direction}
                                options={[
                                    { label: 'To left', value: 'left' },
                                    { label: 'To Right', value: 'right' },
                                ]}
                                onChange={val => {
                                    rotateOptions.direction = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalAdvancedRangeControl
                                options={rotateOptions.viewport}
                                onChange={val => {
                                    rotateOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Rotation', 'maxi-blocks')}
                                options={rotateOptions}
                                onChange={val => {
                                    rotateOptions = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                        </Fragment>
                    }
                </Fragment>
            }
            {
            motionStatus === 'scale' &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Scale', 'maxi-block')}
                            selected={parseInt(scaleOptions.status)}
                            options={
                                [
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                    { label: __('No', 'maxi-block'), value: 0 },
                                ]
                            }
                            onChange={val => {
                                scaleOptions.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(scaleOptions.status) &&
                        <Fragment>
                            <SelectControl
                                label={__('Direction', 'maxi-blocks')}
                                value={scaleOptions.direction}
                                options={[
                                    { label: 'Scale Up', value: 'up' },
                                    { label: 'Scale Down', value: 'down' },
                                ]}
                                onChange={val => {
                                    scaleOptions.direction = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalAdvancedRangeControl
                                options={scaleOptions.viewport}
                                onChange={val => {
                                    scaleOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Scale', 'maxi-blocks')}
                                options={scaleOptions}
                                onChange={val => {
                                    scaleOptions = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                        </Fragment>
                    }
                </Fragment>
            }
            {
            motionStatus === 'fade' &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Fade', 'maxi-block')}
                            selected={parseInt(fadeOptions.status)}
                            options={
                                [
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                    { label: __('No', 'maxi-block'), value: 0 },
                                ]
                            }
                            onChange={val => {
                                fadeOptions.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(fadeOptions.status) &&
                        <Fragment>
                            <SelectControl
                                label={__('Direction', 'maxi-blocks')}
                                value={fadeOptions.direction}
                                options={[
                                    { label: 'Fade In', value: 'in' },
                                    { label: 'Fade Out', value: 'out' },
                                ]}
                                onChange={val => {
                                    fadeOptions.direction = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalAdvancedRangeControl
                                options={fadeOptions.viewport}
                                onChange={val => {
                                    fadeOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Fade', 'maxi-blocks')}
                                options={fadeOptions}
                                onChange={val => {
                                    fadeOptions = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                        </Fragment>
                    }
                </Fragment>
            }
            {
            motionStatus === 'blur' &&
                <Fragment>
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Blur', 'maxi-block')}
                            selected={parseInt(blurOptions.status)}
                            options={
                                [
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                    { label: __('No', 'maxi-block'), value: 0 },
                                ]
                            }
                            onChange={val => {
                                blurOptions.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(blurOptions.status) &&
                        <Fragment>
                            <SelectControl
                                label={__('Direction', 'maxi-blocks')}
                                value={blurOptions.direction}
                                options={[
                                    { label: 'Blur In', value: 'in' },
                                    { label: 'Blur Out', value: 'out' },
                                ]}
                                onChange={val => {
                                    blurOptions.direction = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalAdvancedRangeControl
                                options={blurOptions.viewport}
                                onChange={val => {
                                    blurOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Blur', 'maxi-blocks')}
                                options={blurOptions}
                                onChange={val => {
                                    blurOptions = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                        </Fragment>
                    }
                </Fragment>
            }
        </div>
    )

}

export default MotionControl;