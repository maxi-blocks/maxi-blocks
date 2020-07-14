/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const {
    RangeControl,
    RadioControl,
    Dropdown,
} = wp.components;

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
    slantTop,
    slantBottom,
    slantTopOpacity,
    slantBottomOpacity,
    peakTop,
    peakBottom,
    mountainsTop,
    mountainsBottom,
    mountainsTopOpacity,
    mountainsBottomOpacity,
    curveTop,
    curveBottom,
    curveTopOpacity,
    curveBottomOpacity,
    arrowTop,
    arrowBottom,
    arrowTopOpacity,
    arrowBottomOpacity,
    asymmetricTop,
    asymmetricBottom,
    asymmetricTopOpacity,
    asymmetricBottomOpacity,
    cloudTop,
    cloudBottom,
    cloudTopOpacity,
    cloudBottomOpacity,
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
            options.push({ label: slantTop, value: 'slant-top' });
            options.push({ label: slantBottom, value: 'slant-bottom' });
            options.push({ label: slantTopOpacity, value: 'slant-top-opacity' });
            options.push({ label: slantBottomOpacity, value: 'slant-bottom-opacity' });
            options.push({ label: peakTop, value: 'peak-top' });
            options.push({ label: peakBottom, value: 'peak-bottom' });
            options.push({ label: mountainsTop, value: 'mountains-top' });
            options.push({ label: mountainsBottom, value: 'mountains-bottom' });
            options.push({ label: mountainsTopOpacity, value: 'mountains-top-opacity' });
            options.push({ label: mountainsBottomOpacity, value: 'mountains-bottom-opacity' });
            options.push({ label: curveTop, value: 'curve-top' });
            options.push({ label: curveBottom, value: 'curve-bottom' });
            options.push({ label: curveTopOpacity, value: 'curve-top-opacity' });
            options.push({ label: curveBottomOpacity, value: 'curve-bottom-opacity' });
            options.push({ label: arrowTop, value: 'arrow-top' });
            options.push({ label: arrowBottom, value: 'arrow-bottom' });
            options.push({ label: arrowTopOpacity, value: 'arrow-top-opacity' });
            options.push({ label: arrowBottomOpacity, value: 'arrow-bottom-opacity' });
            options.push({ label: asymmetricTop, value: 'asymmetric-top' });
            options.push({ label: asymmetricBottom, value: 'asymmetric-bottom' });
            options.push({ label: asymmetricTopOpacity, value: 'asymmetric-top-opacity' });
            options.push({ label: asymmetricBottomOpacity, value: 'asymmetric-bottom-opacity' });
            options.push({ label: cloudTop, value: 'cloud-top' });
            options.push({ label: cloudBottom, value: 'cloud-bottom' });
            options.push({ label: cloudTopOpacity, value: 'cloud-top-opacity' });
            options.push({ label: cloudBottomOpacity, value: 'cloud-bottom-opacity' });
            return options;
        }

        const showShapes = () => {
            switch(value.shapeStyle) {
                case 'waves-top': return wavesTop;
                case 'waves-bottom': return wavesBottom;
                case 'waves-top-opacity': return wavesTopOpacity;
                case 'waves-bottom-opacity': return wavesBottomOpacity;
                case 'wave-top': return waveTop;
                case 'wave-bottom': return waveBottom;
                case 'wave-top-opacity': return waveTopOpacity;
                case 'wave-bottom-opacity': return waveBottomOpacity;
                case 'triangle-top': return triangleTop;
                case 'triangle-bottom': return triangleBottom;
                case 'swish-top': return swishTop;
                case 'swish-bottom': return swishBottom;
                case 'swish-top-opacity': return swishTopOpacity;
                case 'swish-bottom-opacity': return swishBottomOpacity;
                case 'slant-top': return slantTop;
                case 'slant-bottom': return slantBottom;
                case 'slant-top-opacity': return slantTopOpacity;
                case 'slant-bottom-opacity': return slantBottomOpacity;
                case 'peak-top': return peakTop;
                case 'peak-bottom': return peakBottom;
                case 'mountains-top': return mountainsTop;
                case 'mountains-bottom': return mountainsBottom;
                case 'mountains-top-opacity': return mountainsTopOpacity;
                case 'mountains-bottom-opacity': return mountainsBottomOpacity;
                case 'curve-top': return curveTop;
                case 'curve-bottom': return curveBottom;
                case 'curve-top-opacity': return curveTopOpacity;
                case 'curve-bottom-opacity': return curveBottomOpacity;
                case 'arrow-top': return arrowTop;
                case 'arrow-bottom': return arrowBottom;
                case 'arrow-top-opacity': return arrowTopOpacity;
                case 'arrow-bottom-opacity': return arrowBottomOpacity;
                case 'asymmetric-top': return asymmetricTop;
                case 'asymmetric-bottom': return asymmetricBottom;
                case 'asymmetric-top-opacity': return asymmetricTopOpacity;
                case 'asymmetric-bottom-opacity': return asymmetricBottomOpacity;
                case 'cloud-top': return cloudTop;
                case 'cloud-bottom': return cloudBottom;
                case 'cloud-top-opacity': return cloudTopOpacity;
                case 'cloud-bottom-opacity': return cloudBottomOpacity;
                default: return __('Divider Style', 'max-block');
            }
        }

        return (
            <div className="maxi-shapedividercontrol">
                <Dropdown
                    className="maxi-shapedividercontrol__shape-selector"
                    contentClassName="maxi-shapedividercontrol_popover"
                    position="bottom center"
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <div
                            className='maxi-shapedividercontrol__shape-selector__display'
                            onClick={ onToggle }
                        >
                            {showShapes()}
                        </div>
                    ) }
                    renderContent={ () => (
                        <RadioControl
                            className='maxi-shapedividercontrol__shape-list'
                            selected={value.shapeStyle}
                            options={getOptions()}
                            onChange={val => {
                                value.shapeStyle = val;
                                onChange(JSON.stringify(value));
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
                    onChange={val => onChange(val)}
                    disableImage
                    disableVideo
                />
                <SizeControl
                    label={__('Divider Height', 'maxi-blocks')}
                    unit={value.heightUnit}
                    allowedUnits={['px']}
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