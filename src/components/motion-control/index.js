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
import { SizeControl } from '../../components';

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
const ShapeDividerControl = props => {

    const {
        motionOptions,
        onChange,
    } = props;

    let value = !isObject(motionOptions) ?
    JSON.parse(motionOptions) :
    motionOptions;

    let {
        vertical: verticalOptions,
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
            {console.log(typeof verticalOptions.status, verticalOptions.status)}
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
                    <SizeControl
                        label={__('Speed', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={4}
                        step={0.1}
                        value={verticalOptions.speed}
                        onChangeValue={val => {
                            verticalOptions.speed = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Top', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={100}
                        value={verticalOptions.viewportTop}
                        onChangeValue={val => {
                            verticalOptions.viewportTop = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Viewport Bottom', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={100}
                        initial={0}
                        value={verticalOptions.viewportBottom}
                        onChangeValue={val => {
                            verticalOptions.viewportBottom = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                </Fragment>
            }
            {
            motionStatus === 'horizontal' &&
                <Fragment>
                    <h1>horizontal Settings</h1>
                </Fragment>
            }
            {
            motionStatus === 'rotate' &&
                <Fragment>
                    <h1>rotate Settings</h1>
                </Fragment>
            }
            {
            motionStatus === 'scale' &&
                <Fragment>
                    <h1>scale Settings</h1>
                </Fragment>
            }
            {
            motionStatus === 'fade' &&
                <Fragment>
                    <h1>fade Settings</h1>
                </Fragment>
            }
            {
            motionStatus === 'blur' &&
                <Fragment>
                    <h1>blur Settings</h1>
                </Fragment>
            }
        </div>
    )

}

export default ShapeDividerControl;