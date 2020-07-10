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
    wavesBottom,
    wavesTop,
} from '../../icons';
import { Icon } from '@wordpress/icons';

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
            options.push({ label: wavesBottom, value: 'x1' });
            options.push({ label: wavesTop, value: 'x2' });
            options.push({ label: wavesBottom, value: 'x3' });
            return options;
        }

        const showShapes = () => {
            let result;
            if (value.shapeStyle === '') result = __('Divider Style', 'max-block');
            if (value.shapeStyle === 'x1') result = wavesBottom;
            if (value.shapeStyle === 'x2') result = wavesTop;
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