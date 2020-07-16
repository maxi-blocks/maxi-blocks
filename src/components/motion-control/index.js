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
    BackgroundControl,
    SizeControl,
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
const ShapeDividerControl = props => {

    // const {
    //     shapeDividerOptions,
    //     onChange,
    // } = props;

    // let value = !isObject(shapeDividerOptions) ?
    // JSON.parse(shapeDividerOptions) :
    // shapeDividerOptions;

    // let {
    //     top:shapeDividerTopOptions,
    //     bottom:shapeDividerBottomOptions
    // } = value;

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
                    <h1>Vertical Settings</h1>
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