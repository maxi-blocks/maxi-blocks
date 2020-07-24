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
    SizeControl,
    __experimentalAdvancedRangeControl
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
                        value={verticalOptions.viewport}
                        onChangeValue={val => {
                            verticalOptions.viewport = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <div className='maxi-motion-amounts-control'>
                        <div className='maxi-motion-amounts-control__input'>
                            <input
                                type="number"
                                min={0}
                                max={10}
                                value={verticalOptions.startValue}
                                onChange={e => {
                                    verticalOptions.startValue = e.target.value;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <label>{__('Starting Scale', 'maxi-blocks')}</label>
                        </div>
                        <div className='maxi-motion-amounts-control__input'>
                            <input
                                type="number"
                                min={0}
                                max={10}
                                value={verticalOptions.midValue}
                                onChange={e => {
                                    verticalOptions.midValue = e.target.value;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <label>{__('Mid Scale', 'maxi-blocks')}</label>
                        </div>
                        <div className='maxi-motion-amounts-control__input'>
                            <input
                                type="number"
                                min={0}
                                max={10}
                                value={verticalOptions.endtValue}
                                onChange={e => {
                                    verticalOptions.endtValue = e.target.value;
                                    onChange(JSON.stringify(value));
                                }}
                            />
                            <label>{__('End Scale', 'maxi-blocks')}</label>
                        </div>
                    </div>
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
                    <SizeControl
                        label={__('Speed', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={5}
                        step={0.1}
                        value={horizontalOptions.speed}
                        onChangeValue={val => {
                            horizontalOptions.speed = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Top', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={100}
                        value={horizontalOptions.viewportTop}
                        onChangeValue={val => {
                            horizontalOptions.viewportTop = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Bottom', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={0}
                        value={horizontalOptions.viewportBottom}
                        onChangeValue={val => {
                            horizontalOptions.viewportBottom = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
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
                    <SizeControl
                        label={__('Speed', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={0.3}
                        step={0.1}
                        value={rotateOptions.speed}
                        onChangeValue={val => {
                            rotateOptions.speed = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Top', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={100}
                        value={rotateOptions.viewportTop}
                        onChangeValue={val => {
                            rotateOptions.viewportTop = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Bottom', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={0}
                        value={rotateOptions.viewportBottom}
                        onChangeValue={val => {
                            rotateOptions.viewportBottom = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
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
                    <SizeControl
                        label={__('Speed', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={5}
                        step={0.1}
                        value={scaleOptions.speed}
                        onChangeValue={val => {
                            scaleOptions.speed = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Top', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={100}
                        value={scaleOptions.viewportTop}
                        onChangeValue={val => {
                            scaleOptions.viewportTop = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Bottom', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={0}
                        value={scaleOptions.viewportBottom}
                        onChangeValue={val => {
                            scaleOptions.viewportBottom = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
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
                    <SizeControl
                        label={__('Level', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={5}
                        step={0.1}
                        value={fadeOptions.speed}
                        onChangeValue={val => {
                            fadeOptions.speed = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Top', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={100}
                        value={fadeOptions.viewportTop}
                        onChangeValue={val => {
                            fadeOptions.viewportTop = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Bottom', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={0}
                        value={fadeOptions.viewportBottom}
                        onChangeValue={val => {
                            fadeOptions.viewportBottom = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
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
                    <SizeControl
                        label={__('Level', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={5}
                        step={0.1}
                        value={blurOptions.speed}
                        onChangeValue={val => {
                            blurOptions.speed = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Top', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={100}
                        value={blurOptions.viewportTop}
                        onChangeValue={val => {
                            blurOptions.viewportTop = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Bottom', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={0}
                        value={blurOptions.viewportBottom}
                        onChangeValue={val => {
                            blurOptions.viewportBottom = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                </Fragment>
            }
        </div>
    )

}

export default MotionControl;