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
    TextareaControl,
} = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import SizeControl from '../size-control';

/**
 * Component
 */
const HoverEffectControl = props => {

    const {
        hoverOptions,
        onChange,
    } = props;

    let value = !isObject(hoverOptions) ?
        JSON.parse(hoverOptions) :
        hoverOptions;

    let {
        basic: basicOptions,
        text: textOptions,
    } = value;

    return (
        <div className="maxi-hover-effect-control">
            <div className='maxi-fancy-radio-control'>
                <RadioControl
                    label=''
                    selected={value.type}
                    options={
                        [
                            { label: __('None', 'maxi-blocks'), value: 'none' },
                            { label: __('Basic', 'maxi-blocks'), value: 'basic' },
                            { label: __('Text', 'maxi-blocks'), value: 'text' },
                        ]
                    }
                    onChange={val => {
                        value.type = val;
                        onChange(JSON.stringify(value));
                    }}
                />
            </div>
            {
                value.type === 'basic' &&
                <Fragment>
                    <SelectControl
                        label={__('Effect Type', 'maxi-blocks')}
                        value={basicOptions.type}
                        options={[
                            { label: 'None', value: 'none' },
                            { label: 'Zoom In', value: 'zoom-in' },
                            { label: 'Zoom Out', value: 'zoom-out' },
                            { label: 'Slide', value: 'slide' },
                            { label: 'Rotate', value: 'rotate' },
                            { label: 'Blur', value: 'blur' },
                            { label: 'Gray Scale', value: 'greay-scale' },
                            { label: 'Clear Gray Scale', value: 'clear-greay-scale' },
                        ]}
                        onChange={val => {
                            basicOptions.type = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Duration (s)', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={1}
                        step={0.1}
                        value={basicOptions.duration}
                        onChangeValue={val => {
                            basicOptions.duration = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                </Fragment>
            }
            {
                value.type === 'text' &&
                <Fragment>
                    <SelectControl
                        label={__('Animation Type', 'maxi-blocks')}
                        value={textOptions.type}
                        options={[
                            { label: 'None', value: '' },
                            { label: 'Bounce', value: 'bounce' },
                            { label: 'Flash', value: 'flash' },
                            { label: 'Pulse', value: 'pulse' },
                            { label: 'Rubberband', value: 'rubberBand' },
                            { label: 'Shakex', value: 'shakeX' },
                            { label: 'Shakey', value: 'shakeY' },
                            { label: 'Headshake', value: 'headShake' },
                            { label: 'Swing', value: 'swing' },
                            { label: 'Tada', value: 'tada' },
                            { label: 'Wobble', value: 'wobble' },
                            { label: 'Jello', value: 'jello' },
                            { label: 'Heart Beat', value: 'heartBeat' },
                            { label: 'Back In Down', value: 'backInDown' },
                            { label: 'Back In Left', value: 'backInLeft' },
                            { label: 'Back In Right', value: 'backInRight' },
                            { label: 'Back In Up', value: 'backInUp' },
                            { label: 'Backout Down', value: 'backOutDown' },
                            { label: 'Backout Left', value: 'backOutLeft' },
                            { label: 'Backout Right', value: 'backOutRight' },
                            { label: 'Backout Up', value: 'backOutUp' },
                            { label: 'Bounce In', value: 'bounceIn' },
                            { label: 'Bounce In Down', value: 'bounceInDown' },
                            { label: 'Bounce In Left', value: 'bounceInLeft' },
                            { label: 'Bounce In Right', value: 'bounceInRight' },
                            { label: 'Bounce In Up', value: 'bounceInUp' },
                            { label: 'Bounce Out', value: 'bounceOut' },
                            { label: 'Bounce Out Down', value: 'bounceOutDown' },
                            { label: 'Bounce Out Left', value: 'bounceOutLeft' },
                            { label: 'Bounce Out Right', value: 'bounceOutRight' },
                            { label: 'Bounce Out Up', value: 'bounceOutUp' },
                            { label: 'Fade In ', value: 'fadeIn' },
                            { label: 'Fade In Down', value: 'fadeInDown' },
                            { label: 'Fade In Down Big', value: 'fadeInDownBig' },
                            { label: 'Fade In Left', value: 'fadeInLeft' },
                            { label: 'Fade In Left Big', value: 'fadeInLeftBig' },
                            { label: 'Fade In Right', value: 'fadeInRight' },
                            { label: 'Fade In Right Big', value: 'fadeInRightBig' },
                            { label: 'Fade In Up', value: 'fadeInUp' },
                            { label: 'Fade In Up Big', value: 'fadeInUpBig' },
                            { label: 'Fade In Top Left', value: 'fadeInTopLeft' },
                            { label: 'Fade In Top Right', value: 'fadeInTopRight' },
                            { label: 'Fade In Bottom Left', value: 'fadeInBottomLeft' },
                            { label: 'Fade In Bottom Right', value: 'fadeInBottomRight' },
                            { label: 'Fade Out', value: 'fadeOut' },
                            { label: 'Fade Out Down', value: 'fadeOutDown' },
                            { label: 'Fade Out Down Big', value: 'fadeOutDownBig' },
                            { label: 'Fade Out Left', value: 'fadeOutLeft' },
                            { label: 'Fade Out Left Big', value: 'fadeOutLeftBig' },
                            { label: 'Fade Out Right', value: 'fadeOutRight' },
                            { label: 'Fade Out Right Big', value: 'fadeOutRightBig' },
                            { label: 'Fade Out Up', value: 'fadeOutUp' },
                            { label: 'Fade Out Up Big', value: 'fadeOutUpBig' },
                            { label: 'Fade Out Top Left', value: 'fadeOutTopLeft' },
                            { label: 'Fade Out Top Right', value: 'fadeOutTopRight' },
                            { label: 'Fade Out Bottom Right', value: 'fadeOutBottomRight' },
                            { label: 'Fade Out Bottom Left', value: 'fadeOutBottomLeft' },
                            { label: 'Flip', value: 'flip' },
                            { label: 'Flip In X', value: 'flipInX' },
                            { label: 'Flip In Y', value: 'flipInY' },
                            { label: 'Flip Out X', value: 'flipOutX' },
                            { label: 'Flip Out Y', value: 'flipOutY' },
                            { label: 'Light Speed In Right', value: 'lightSpeedInRight' },
                            { label: 'Light Speed In Left', value: 'lightSpeedInLeft' },
                            { label: 'Light Speed Out Right', value: 'lightSpeedOutRight' },
                            { label: 'Light Speed Out Left', value: 'lightSpeedOutLeft' },
                            { label: 'Rotate In', value: 'rotateIn' },
                            { label: 'Rotate In Down Left', value: 'rotateInDownLeft' },
                            { label: 'Rotate In Down Right', value: 'rotateInDownRight' },
                            { label: 'Rotate In Up Left', value: 'rotateInUpLeft' },
                            { label: 'Rotate In Up Right', value: 'rotateInUpRight' },
                            { label: 'Rotate Out', value: 'rotateOut' },
                            { label: 'Rotate Out Down Left', value: 'rotateOutDownLeft' },
                            { label: 'Rotate Out Down Right', value: 'rotateOutDownRight' },
                            { label: 'Rotate Out Up Left', value: 'rotateOutUpLeft' },
                            { label: 'Rotate Out Up Right', value: 'rotateOutUpRight' },
                            { label: 'Hinge', value: 'hinge' },
                            { label: 'Jack In The Box', value: 'jackInTheBox' },
                            { label: 'Roll In', value: 'rollIn' },
                            { label: 'Roll Out', value: 'rollOut' },
                            { label: 'Zoom In', value: 'zoomIn' },
                            { label: 'Zoom In Down', value: 'zoomInDown' },
                            { label: 'Zoom In Left', value: 'zoomInLeft' },
                            { label: 'Zoom In Right', value: 'zoomInRight' },
                            { label: 'Zoom In Up', value: 'zoomInUp' },
                            { label: 'Zoom Out', value: 'zoomOut' },
                            { label: 'Zoom Out Down', value: 'zoomOutDown' },
                            { label: 'Zoom Out Left', value: 'zoomOutLeft' },
                            { label: 'Zoom Out Right', value: 'zoomOutRight' },
                            { label: 'Zoom Out Up', value: 'zoomOutUp' },
                            { label: 'Slide In Down', value: 'slideInDown' },
                            { label: 'Slide In Left', value: 'slideInLeft' },
                            { label: 'Slide In Right', value: 'slideInRight' },
                            { label: 'Slide In Up', value: 'slideInUp' },
                            { label: 'Slide Out Down', value: 'slideOutDown' },
                            { label: 'Slide Out Left', value: 'slideOutLeft' },
                            { label: 'Slide Out Right', value: 'slideOutRight' },
                            { label: 'Slide Out Up', value: 'slideOutUp' }
                        ]}
                        onChange={val => {
                            textOptions.type = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <SizeControl
                        label={__('Duration (s)', 'maxi-blocks')}
                        disableUnit
                        min={0}
                        max={10}
                        initial={1}
                        step={0.1}
                        value={textOptions.duration}
                        onChangeValue={val => {
                            textOptions.duration = val;
                            onChange(JSON.stringify(value));
                        }}
                    />
                    <TextareaControl
                        label="Hover Title Text"
                        value={textOptions.title.textTitle}
                    />
                    <div className='maxi-fancy-radio-control'>
                        <RadioControl
                            label={__('Enable Custom Style (Title Text)', 'maxi-block')}
                            selected={parseInt(textOptions.title.status)}
                            options={
                                [
                                    { label: __('No', 'maxi-block'), value: 0 },
                                    { label: __('Yes', 'maxi-block'), value: 1 },
                                ]
                            }
                            onChange={val => {
                                textOptions.title.status = val;
                                onChange(JSON.stringify(value));
                            }}
                        />
                    </div>
                    {
                    !!parseInt(textOptions.title.status) &&
                        <Fragment><p>settings</p></Fragment>
                    }
                    <TextareaControl
                        label="Hover Content Text"
                        value={textOptions.content}
                    />
                </Fragment>
            }
        </div>
    )

}

export default HoverEffectControl;