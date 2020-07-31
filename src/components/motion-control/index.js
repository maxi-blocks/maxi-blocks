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
 * External dependencies
 */
import classnames from 'classnames';
import { isObject } from 'lodash';

/**
 * Styles and icons
 */
import {
    motionVertical,
    motionVerticalTop1,
    motionVerticalTop2,
    motionVerticalTop3,
    motionVerticalTop4,
    motionVerticalTop5,
    motionVerticalDown1,
    motionVerticalDown2,
    motionVerticalDown3,
    motionVerticalDown4,
    motionVerticalDown5,
    motionHorizontal,
    motionHorizontalLeft1,
    motionHorizontalLeft2,
    motionHorizontalLeft3,
    motionHorizontalLeft4,
    motionHorizontalLeft5,
    motionHorizontalRight1,
    motionHorizontalRight2,
    motionHorizontalRight3,
    motionHorizontalRight4,
    motionHorizontalRight5,
    motionRotate,
    motionRotateLeft1,
    motionRotateLeft2,
    motionRotateLeft3,
    motionRotateLeft4,
    motionRotateLeft5,
    motionRotateRight1,
    motionRotateRight2,
    motionRotateRight3,
    motionRotateRight4,
    motionRotateRight5,
    motionScale,
    motionScaleUp1,
    motionScaleUp2,
    motionScaleUp3,
    motionScaleUp4,
    motionScaleUp5,
    motionScaleDown1,
    motionScaleDown2,
    motionScaleDown3,
    motionScaleDown4,
    motionScaleDown5,
    motionFade,
    motionFadeIn1,
    motionFadeIn2,
    motionFadeIn3,
    motionFadeIn4,
    motionFadeIn5,
    motionFadeOut1,
    motionFadeOut2,
    motionFadeOut3,
    motionFadeOut4,
    motionFadeOut5,
    motionBlur,
    motionBlurIn1,
    motionBlurIn2,
    motionBlurIn3,
    motionBlurIn4,
    motionBlurIn5,
    motionBlurOut1,
    motionBlurOut2,
    motionBlurOut3,
    motionBlurOut4,
    motionBlurOut5,
} from '../../icons';

/**
 * Component
 */
const MotionControl = props => {

    const {
        className,
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

    const verticalPresets = () => {
        let response = [];
        if(verticalOptions.direction === 'up') {
            response = [
                { label: <Icon icon={motionVerticalTop1} />, value: 'preset_1' },
                { label: <Icon icon={motionVerticalTop2} />, value: 'preset_2' },
                { label: <Icon icon={motionVerticalTop3} />, value: 'preset_3' },
                { label: <Icon icon={motionVerticalTop4} />, value: 'preset_4' },
                { label: <Icon icon={motionVerticalTop5} />, value: 'preset_5' },
            ];
        }
        if(verticalOptions.direction === 'down') {
            response = [
                { label: <Icon icon={motionVerticalDown1} />, value: 'preset_6' },
                { label: <Icon icon={motionVerticalDown2} />, value: 'preset_7' },
                { label: <Icon icon={motionVerticalDown3} />, value: 'preset_8' },
                { label: <Icon icon={motionVerticalDown4} />, value: 'preset_9' },
                { label: <Icon icon={motionVerticalDown5} />, value: 'preset_10' },
            ];
        }

        return response;
    }

    const horizontalPresets = () => {
        let response = [];
        if(horizontalOptions.direction === 'left') {
            response = [
                { label: <Icon icon={motionHorizontalLeft1} />, value: 'preset_1' },
                { label: <Icon icon={motionHorizontalLeft2} />, value: 'preset_2' },
                { label: <Icon icon={motionHorizontalLeft3} />, value: 'preset_3' },
                { label: <Icon icon={motionHorizontalLeft4} />, value: 'preset_4' },
                { label: <Icon icon={motionHorizontalLeft5} />, value: 'preset_5' },
            ];
        }
        if(horizontalOptions.direction === 'right') {
            response = [
                { label: <Icon icon={motionHorizontalRight1} />, value: 'preset_6' },
                { label: <Icon icon={motionHorizontalRight2} />, value: 'preset_7' },
                { label: <Icon icon={motionHorizontalRight3} />, value: 'preset_8' },
                { label: <Icon icon={motionHorizontalRight4} />, value: 'preset_9' },
                { label: <Icon icon={motionHorizontalRight5} />, value: 'preset_10' },
            ];
        }

        return response;
    }

    const scalePresets = () => {
        let response = [];
        if(scaleOptions.direction === 'up') {
            response = [
                { label: <Icon icon={motionScaleUp1} />, value: 'preset_1' },
                { label: <Icon icon={motionScaleUp2} />, value: 'preset_2' },
                { label: <Icon icon={motionScaleUp3} />, value: 'preset_3' },
                { label: <Icon icon={motionScaleUp4} />, value: 'preset_4' },
                { label: <Icon icon={motionScaleUp5} />, value: 'preset_5' },
            ];
        }
        if(scaleOptions.direction === 'down') {
            response = [
                { label: <Icon icon={motionScaleDown1} />, value: 'preset_6' },
                { label: <Icon icon={motionScaleDown2} />, value: 'preset_7' },
                { label: <Icon icon={motionScaleDown3} />, value: 'preset_8' },
                { label: <Icon icon={motionScaleDown4} />, value: 'preset_9' },
                { label: <Icon icon={motionScaleDown5} />, value: 'preset_10' },
            ];
        }

        return response;
    }

    const rotatePresets = () => {
        let response = [];
        if(rotateOptions.direction === 'left') {
            response = [
                { label: <Icon icon={motionRotateLeft1} />, value: 'preset_1' },
                { label: <Icon icon={motionRotateLeft2} />, value: 'preset_2' },
                { label: <Icon icon={motionRotateLeft3} />, value: 'preset_3' },
                { label: <Icon icon={motionRotateLeft4} />, value: 'preset_4' },
                { label: <Icon icon={motionRotateLeft5} />, value: 'preset_5' },
            ];
        }
        if(rotateOptions.direction === 'right') {
            response = [
                { label: <Icon icon={motionRotateRight1} />, value: 'preset_6' },
                { label: <Icon icon={motionRotateRight2} />, value: 'preset_7' },
                { label: <Icon icon={motionRotateRight3} />, value: 'preset_8' },
                { label: <Icon icon={motionRotateRight4} />, value: 'preset_9' },
                { label: <Icon icon={motionRotateRight5} />, value: 'preset_10' },
            ];
        }

        return response;
    }

    const fadePresets = () => {
        let response = [];
        if(fadeOptions.direction === 'in') {
            response = [
                { label: <Icon icon={motionFadeIn1} />, value: 'preset_1' },
                { label: <Icon icon={motionFadeIn2} />, value: 'preset_2' },
                { label: <Icon icon={motionFadeIn3} />, value: 'preset_3' },
                { label: <Icon icon={motionFadeIn4} />, value: 'preset_4' },
                { label: <Icon icon={motionFadeIn5} />, value: 'preset_5' },
            ];
        }
        if(fadeOptions.direction === 'out') {
            response = [
                { label: <Icon icon={motionFadeOut1} />, value: 'preset_6' },
                { label: <Icon icon={motionFadeOut2} />, value: 'preset_7' },
                { label: <Icon icon={motionFadeOut3} />, value: 'preset_8' },
                { label: <Icon icon={motionFadeOut4} />, value: 'preset_9' },
                { label: <Icon icon={motionFadeOut5} />, value: 'preset_10' },
            ];
        }

        return response;
    }

    const blurPresets = () => {
        let response = [];
        if(blurOptions.direction === 'in') {
            response = [
                { label: <Icon icon={motionBlurIn1} />, value: 'preset_1' },
                { label: <Icon icon={motionBlurIn2} />, value: 'preset_2' },
                { label: <Icon icon={motionBlurIn3} />, value: 'preset_3' },
                { label: <Icon icon={motionBlurIn4} />, value: 'preset_4' },
                { label: <Icon icon={motionBlurIn5} />, value: 'preset_5' },
            ];
        }
        if(blurOptions.direction === 'out') {
            response = [
                { label: <Icon icon={motionBlurOut1} />, value: 'preset_6' },
                { label: <Icon icon={motionBlurOut2} />, value: 'preset_7' },
                { label: <Icon icon={motionBlurOut3} />, value: 'preset_8' },
                { label: <Icon icon={motionBlurOut4} />, value: 'preset_9' },
                { label: <Icon icon={motionBlurOut5} />, value: 'preset_10' },
            ];
        }

        return response;
    }

    const [motionStatus, setMotionStatus] = useState('vertical');

    let classes = classnames(
        'maxi-motion-control',
        className,
    );

    return (
        <div className={classes}>
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
                            <div className='maxi-classic-radio-control'>
                                <RadioControl
                                    label=''
                                    selected={verticalOptions.preset}
                                    options={verticalPresets()}
                                    onChange={val => {
                                        verticalOptions.preset = val;
                                        verticalOptions.viewport = verticalOptions.presets[verticalOptions.preset].viewport;
                                        verticalOptions.amounts = verticalOptions.presets[verticalOptions.preset].amounts;
                                        onChange(JSON.stringify(value));
                                    }}
                                />
                            </div>
                            <__experimentalAdvancedRangeControl
                                options={verticalOptions.viewport}
                                onChange={val => {
                                    verticalOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Vertical', 'maxi-blocks')}
                                options={verticalOptions.amounts}
                                onChange={val => {
                                    verticalOptions.amounts = val;
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
                            <div className='maxi-classic-radio-control'>
                                <RadioControl
                                    label=''
                                    selected={horizontalOptions.preset}
                                    options={horizontalPresets()}
                                    onChange={val => {
                                        horizontalOptions.preset = val;
                                        horizontalOptions.viewport = horizontalOptions.presets[horizontalOptions.preset].viewport;
                                        horizontalOptions.amounts = horizontalOptions.presets[horizontalOptions.preset].amounts;
                                        onChange(JSON.stringify(value));
                                    }}
                                />
                            </div>
                            <__experimentalAdvancedRangeControl
                                options={horizontalOptions.viewport}
                                onChange={val => {
                                    horizontalOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Horizontal', 'maxi-blocks')}
                                options={horizontalOptions.amounts}
                                onChange={val => {
                                    horizontalOptions.amounts = val;
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
                            <div className='maxi-classic-radio-control'>
                                <RadioControl
                                    label=''
                                    selected={rotateOptions.preset}
                                    options={rotatePresets()}
                                    onChange={val => {
                                        rotateOptions.preset = val;
                                        rotateOptions.viewport = rotateOptions.presets[rotateOptions.preset].viewport;
                                        rotateOptions.amounts = rotateOptions.presets[rotateOptions.preset].amounts;
                                        onChange(JSON.stringify(value));
                                    }}
                                />
                            </div>
                            <__experimentalAdvancedRangeControl
                                options={rotateOptions.viewport}
                                onChange={val => {
                                    rotateOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Rotation', 'maxi-blocks')}
                                options={rotateOptions.amounts}
                                onChange={val => {
                                    rotateOptions.amounts = val;
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
                            <div className='maxi-classic-radio-control'>
                                <RadioControl
                                    label=''
                                    selected={scaleOptions.preset}
                                    options={scalePresets()}
                                    onChange={val => {
                                        scaleOptions.preset = val;
                                        scaleOptions.viewport = scaleOptions.presets[scaleOptions.preset].viewport;
                                        scaleOptions.amounts = scaleOptions.presets[scaleOptions.preset].amounts;
                                        onChange(JSON.stringify(value));
                                    }}
                                />
                            </div>
                            <__experimentalAdvancedRangeControl
                                options={scaleOptions.viewport}
                                onChange={val => {
                                    scaleOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Scale', 'maxi-blocks')}
                                options={scaleOptions.amounts}
                                onChange={val => {
                                    scaleOptions.amounts = val;
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
                            <div className='maxi-classic-radio-control'>
                                <RadioControl
                                    label=''
                                    selected={fadeOptions.preset}
                                    options={fadePresets()}
                                    onChange={val => {
                                        fadeOptions.preset = val;
                                        fadeOptions.viewport = fadeOptions.presets[fadeOptions.preset].viewport;
                                        fadeOptions.amounts = fadeOptions.presets[fadeOptions.preset].amounts;
                                        onChange(JSON.stringify(value));
                                    }}
                                />
                            </div>
                            <__experimentalAdvancedRangeControl
                                options={fadeOptions.viewport}
                                onChange={val => {
                                    fadeOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Fade', 'maxi-blocks')}
                                options={fadeOptions.amounts}
                                max={10}
                                onChange={val => {
                                    fadeOptions.amounts = val;
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
                            <div className='maxi-classic-radio-control'>
                                <RadioControl
                                    label=''
                                    selected={blurOptions.preset}
                                    options={blurPresets()}
                                    onChange={val => {
                                        blurOptions.preset = val;
                                        blurOptions.viewport = blurOptions.presets[blurOptions.preset].viewport;
                                        blurOptions.amounts = blurOptions.presets[blurOptions.preset].amounts;
                                        onChange(JSON.stringify(value));
                                    }}
                                />
                            </div>
                            <__experimentalAdvancedRangeControl
                                options={blurOptions.viewport}
                                onChange={val => {
                                    blurOptions.viewport = val;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <__experimentalGroupInputControl
                                label={__('Blur', 'maxi-blocks')}
                                options={blurOptions.amounts}
                                onChange={val => {
                                    blurOptions.amounts = val;
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