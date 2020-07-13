/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    RangeControl,
    SelectControl,
    RadioControl,
    Dropdown,
    Button,
} = wp.components;

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Internal dependencies
 */
import { MaxiComponent } from '../index';
import {
    BackgroundControl,
    SizeControl,
} from '../../components';

/**
 * Styles and icons
 */
import './editor.scss';
import {
    wavesTop,
    wavesBottom,
    wavesTopOpacity,
    wavesBottomOpacity,
    waveTop,
    waveBottom,
    waveTopOpacity,
    waveBottomOpacity,
    triangleTop,
    triangleBottom,
    swishTop,
    swishBottom,
    swishTopOpacity,
    swishBottomOpacity,
} from '../../icons';

/**
 * Component
 */
export default class ShapeDividerControl extends MaxiComponent {

    render() {

        const {
            shapeDividerOptions,
            onChange,
        } = this.props;

        let value = typeof shapeDividerOptions === 'object' ?
        shapeDividerOptions :
        JSON.parse(shapeDividerOptions);

        const getOptions = () => {
            let options = [];
            options.push({ label: __('None', 'max-block'), value: '' });
            options.push({ label: wavesTop, value: 'waves-top' });
            options.push({ label: wavesBottom, value: 'waves-bottom' });
            options.push({ label: wavesTopOpacity, value: 'waves-top-opacity' });
            options.push({ label: wavesBottomOpacity, value: 'waves-bottom-opacity' });
            options.push({ label: waveTop, value: 'wave-top' });
            options.push({ label: waveBottom, value: 'wave-bottom' });
            options.push({ label: waveTopOpacity, value: 'wave-top-opacity' });
            options.push({ label: waveBottomOpacity, value: 'wave-bottom-opacity' });
            options.push({ label: triangleTop, value: 'triangle-top' });
            options.push({ label: triangleBottom, value: 'triangle-bottom' });
            options.push({ label: swishTop, value: 'swish-top' });
            options.push({ label: swishBottom, value: 'swish-bottom' });
            options.push({ label: swishTopOpacity, value: 'swish-top-opacity' });
            options.push({ label: swishBottomOpacity, value: 'swish-bottom-opacity' });
            return options;
        }

        const showShapes = () => {
            let result;
            if (value.shapeStyle === '') result = __('Divider Style', 'max-block');
            if (value.shapeStyle === 'waves-top') result = wavesTop;
            if (value.shapeStyle === 'waves-bottom') result = wavesBottom;
            if (value.shapeStyle === 'waves-top-opacity') result = wavesTopOpacity;
            if (value.shapeStyle === 'waves-bottom-opacity') result = wavesBottomOpacity;
            if (value.shapeStyle === 'wave-top') result = waveTop;
            if (value.shapeStyle === 'wave-bottom') result = waveBottom;
            if (value.shapeStyle === 'wave-top-opacity') result = waveTopOpacity;
            if (value.shapeStyle === 'wave-bottom-opacity') result = waveBottomOpacity;
            if (value.shapeStyle === 'triangle-top') result = triangleTop;
            if (value.shapeStyle === 'triangle-bottom') result = triangleBottom;
            if (value.shapeStyle === 'swish-top') result = swishTop;
            if (value.shapeStyle === 'swish-bottom') result = swishBottom;
            if (value.shapeStyle === 'swish-top-opacity') result = swishTopOpacity;
            if (value.shapeStyle === 'swish-bottom-opacity') result = swishBottomOpacity;
            return result;
        }

        return (
            <div className="maxi-shapedividercontrol">
                <Dropdown
                    className="maxi-shapedividercontrol__shape-selector"
                    contentClassName="maxi-shapedividercontrol_popover"
                    position="bottom center"
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <div
                            className={'maxi-shapedividercontrol__shape-selector__display'}
                            onClick={ onToggle }
                        >
                            {showShapes()}
                        </div>
                    ) }
                    renderContent={ () => (
                        <RadioControl
                            className={'maxi-shapedividercontrol__shape-list'}
                            selected={value.shapeStyle}
                            options={getOptions()}
                            onChange={val => {
                                value.shapeStyle = val;
                                onChange(JSON.stringify(value))
                            }}
                        />
                    ) }
                />
                <RangeControl
                    label={__('Opacity', 'maxi-blocks')}
                    className='maxi-opacity-control'
                    value={value.opacity * 100}
                    onChange={val => {
                        value.opacity = val / 100;
                        onChange(JSON.stringify(value))
                    }}
                    min={0}
                    max={100}
                    allowReset={true}
                    initialPosition={0}
                />
                <BackgroundControl
                    backgroundOptions={value}
                    onChange={val => {
                        onChange(val)
                    }}
                    disableImage
                    disableVideo
                />
                <SizeControl
                    label={__('Divider Height', 'maxi-blocks')}
                    unit={value.heightUnit}
                    onChangeUnit={val => {
                        value.heightUnit = val;
                        onChange(JSON.stringify(value))
                    }}
                    value={value.height}
                    onChangeValue={val => {
                        value.height = val;
                        onChange(JSON.stringify(value))
                    }}
                />
            </div>
        )
    }

}