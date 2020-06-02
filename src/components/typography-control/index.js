/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import DeviceSelectorControl from '../device-selector-control/';
import FontFamilySelector from '../font-family-selector';
import SizeControl from '../size-control';
import TextShadowControl from '../text-shadow-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
export default class Typography extends GXComponent {

    state = {
        device: 'desktop',
    }

    componentDidMount() {
        const value = typeof this.props.fontOptions === 'object' ? this.props.fontOptions : JSON.parse(this.props.fontOptions);
        this.saveAndSend(value)
    }

    render() {
        const {
            className,
            fontOptions,
            defaultColor = '#9b9b9b',
        } = this.props;

        const {
            device
        } = this.state;

        const value = typeof fontOptions === 'object' ? fontOptions : JSON.parse(fontOptions);
        const classes = classnames(
            'maxi-typography-control',
            className
        )

        const Divider = () => (
            <hr style={{ marginBottom: '15px', }} />
        );

        const onSelect = (device) => {
            switch (device) {
                case 'desktop':
                    this.setState({ device: 'desktop' });
                    break;
                case 'tablet':
                    this.setState({ device: 'tablet' });
                    break;
                case 'mobile':
                    this.setState({ device: 'mobile' });
                    break;
                default:
                    break;
            }
        };

        const getWeightOptions = () => {
            const fontOptions = Object.keys(value.options);
            if (fontOptions.length === 0) {
                return [
                    { label: __('Thin (Hairline)', 'maxi-blocks'), value: 100 },
                    { label: __('Extra Light (Ultra Light)', 'maxi-blocks'), value: 200 },
                    { label: __('Light', 'maxi-blocks'), value: 300 },
                    { label: __('Normal (Regular)', 'maxi-blocks'), value: 400 },
                    { label: __('Medium', 'maxi-blocks'), value: 500 },
                    { label: __('Semi Bold (Demi Bold)', 'maxi-blocks'), value: 600 },
                    { label: __('Bold', 'maxi-blocks'), value: 700 },
                    { label: __('Extra Bold (Ultra Bold)', 'maxi-blocks'), value: 800 },
                    { label: __('Black (Heavy)', 'maxi-blocks'), value: 900 },
                    { label: __('Extra Black (Ultra Black)', 'maxi-blocks'), value: 950 },
                ]
            }
            const weightOptions = {
                100: 'Thin (Hairline)',
                200: 'Extra Light (Ultra Light)',
                300: 'Light',
                400: 'Normal (Regular)',
                500: 'Medium',
                600: 'Semi Bold (Demi Bold)',
                700: 'Bold',
                800: 'Extra Bold (Ultra Bold)',
                900: 'Black (Heavy)',
                950: 'Extra Black (Ultra Black)',
            }
            let response = [];
            if (!fontOptions.includes('900')) {
                fontOptions.push('900')
            }
            fontOptions.map(weight => {
                let weightOption = {};
                if (weightOptions[weight]) {
                    weightOption.label = __(weightOptions[weight], 'maxi-blocks');
                    weightOption.value = weight;
                    response.push(weightOption);
                }
            })
            return response;
        }

        const getKey = (obj, target) => {
            return Object.keys(obj)[target];
        }

        const onChangeValue = (newValue, target) => {
            if (typeof newValue === 'undefined') {
                newValue = '';
            }
            switch (target) {
                case 'font':
                    value.font = newValue.value;
                    value.options = newValue.files;
                    break;
                case 'color':
                    value.general.color = newValue;
                    break;
                case 'text-shadow':
                    value.general['text-shadow'] = newValue;
                    break;
                case 'text-align':
                    value.general['text-align'] = newValue;
                default:
                    value[device][getKey(value[device], target)] = newValue;
            }
            this.saveAndSend(value);
        }

        return (
            <div className={classes}>
                <FontFamilySelector
                    className={'maxi-font-family-selector'}
                    font={value.font}
                    onChange={(value) => onChangeValue(value, 'font')}
                />
                <ColorControl
                    label={__('Font Color', 'maxi-blocks')}
                    color={value.general.color}
                    defaultColor={defaultColor}
                    onColorChange={value => onChangeValue(value, 'color')}
                    disableGradient
                />
                <TextShadowControl
                    value={value.general['text-shadow']}
                    onChange={val => onChangeValue(val, 'text-shadow')}
                    defaultColor={defaultColor}
                />
                <AlignmentControl
                    label={__('Alignment', 'maxi-blocks')}
                    value={value.general['text-align']}
                    onChange={val => onChangeValue(val, 'text-align')}
                />
                <DeviceSelectorControl
                    device={device}
                    onChange={onSelect}
                />
                <SizeControl
                    className={'maxi-typography-size'}
                    label={__('Size', 'maxi-blocks')}
                    unit={value[device][getKey(value[device], 0)]}
                    onChangeUnit={value => onChangeValue(value, 0)}
                    value={value[device][getKey(value[device], 1)]}
                    onChangeValue={value => onChangeValue(value, 1)}
                />
                <SizeControl
                    className={'maxi-typography-line-height'}
                    label={__('Line Height', 'maxi-blocks')}
                    unit={value[device][getKey(value[device], 2)]}
                    onChangeUnit={value => onChangeValue(value, 2)}
                    value={value[device][getKey(value[device], 3)]}
                    onChangeValue={value => onChangeValue(value, 3)}
                />
                <SizeControl
                    className={'maxi-typography-letter-spacing'}
                    label={__('Letter Spacing', 'maxi-blocks')}
                    unit={value[device][getKey(value[device], 4)]}
                    onChangeUnit={value => onChangeValue(value, 4)}
                    value={value[device][getKey(value[device], 5)]}
                    onChangeValue={value => onChangeValue(value, 5)}
                />
                <Divider />
                <SelectControl
                    label={__('Weight', 'maxi-blocks')}
                    className='maxi-title-typography-setting'
                    value={value[device][getKey(value[device], 6)]}
                    options={getWeightOptions()}
                    onChange={value => onChangeValue(value, 6)}
                />
                <SelectControl
                    label={__('Transform', 'maxi-blocks')}
                    className='maxi-title-typography-setting'
                    value={value[device][getKey(value[device], 7)]}
                    options={[
                        { label: __('Default', 'maxi-blocks'), value: 'none' },
                        { label: __('Capitilize', 'maxi-blocks'), value: 'capitalize' },
                        { label: __('Uppercase', 'maxi-blocks'), value: 'uppercase' },
                        { label: __('Lowercase', 'maxi-blocks'), value: 'lowercase' },
                        { label: __('Full Width', 'maxi-blocks'), value: 'full-width' },
                        { label: __('Full Size Kana', 'maxi-blocks'), value: 'full-size-kana' },
                    ]}
                    onChange={value => onChangeValue(value, 7)}
                />
                <SelectControl
                    label={__('Style', 'maxi-blocks')}
                    className='maxi-title-typography-setting'
                    value={value[device][getKey(value[device], 8)]}
                    options={[
                        { label: __('Default', 'maxi-blocks'), value: 'normal' },
                        { label: __('Italic', 'maxi-blocks'), value: 'italic' },
                        { label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
                        { label: __('Oblique (40 deg)'), value: 'oblique 40deg' },
                    ]}
                    onChange={value => onChangeValue(value, 8)}
                />
                <SelectControl
                    label={__('Decoration', 'maxi-blocks')}
                    className='maxi-title-typography-setting'
                    value={value[device][getKey(value[device], 9)]}
                    options={[
                        { label: __('Default', 'maxi-blocks'), value: 'none' },
                        { label: __('Overline', 'maxi-blocks'), value: 'overline' },
                        { label: __('Line Through', 'maxi-blocks'), value: 'line-through' },
                        { label: __('Underline', 'maxi-blocks'), value: 'underline' },
                        { label: __('Underline Overline', 'maxi-blocks'), value: 'underline overline' },
                    ]}
                    onChange={value => onChangeValue(value, 9)}
                />
            </div>
        )
    }
}