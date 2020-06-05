/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
import { GXComponent } from '../index';
import AlignmentControl from '../alignment-control';
import ColorControl from '../color-control';
import FontFamilySelector from '../font-family-selector';
import SettingTabsControl from '../setting-tabs-control';
import SizeControl from '../size-control';
import TextShadowControl from '../text-shadow-control';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
export default class Typography extends GXComponent {

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

        const value = typeof fontOptions === 'object' ? fontOptions : JSON.parse(fontOptions);
        const classes = classnames(
            'maxi-typography-control',
            className
        )

        const Divider = () => (
            <hr style={{ margin: '15px 0' }} />
        );

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

        const onChangeValue = (newValue, target, device) => {
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
                    className="maxi-typography-control__font-family"
                    font={value.font}
                    onChange={(value) => onChangeValue(value, 'font')}
                />
                <ColorControl
                    label={__('Font Color', 'maxi-blocks')}
                    className="maxi-typography-control__color"
                    color={value.general.color}
                    defaultColor={defaultColor}
                    onColorChange={value => onChangeValue(value, 'color')}
                    disableGradient
                />
                <TextShadowControl
                    className="maxi-typography-control__text-shadow"
                    value={value.general['text-shadow']}
                    onChange={val => onChangeValue(val, 'text-shadow')}
                    defaultColor={defaultColor}
                />
                <AlignmentControl
                    className="maxi-typography-control__text-alignment"
                    label={__('Alignment', 'maxi-blocks')}
                    value={value.general['text-align']}
                    onChange={val => onChangeValue(val, 'text-align')}
                />
                <SettingTabsControl
                    items={[
                        {
                            label: __('Desktop', 'gutenberg-extra'),
                            content: (
                                <Fragment>
                                    <SizeControl
                                        className={'maxi-typography-control__size'}
                                        label={__('Size', 'maxi-blocks')}
                                        unit={value.desktop[getKey(value.desktop, 0)]}
                                        onChangeUnit={value => onChangeValue(value, 0, 'desktop')}
                                        value={value.desktop[getKey(value.desktop, 1)]}
                                        onChangeValue={value => onChangeValue(value, 1, 'desktop')}
                                    />
                                    <SizeControl
                                        className={'maxi-typography-control__line-height'}
                                        label={__('Line Height', 'maxi-blocks')}
                                        unit={value.desktop[getKey(value.desktop, 2)]}
                                        onChangeUnit={value => onChangeValue(value, 2, 'desktop')}
                                        value={value.desktop[getKey(value.desktop, 3)]}
                                        onChangeValue={value => onChangeValue(value, 3, 'desktop')}
                                    />
                                    <SizeControl
                                        className={'maxi-typography-control__letter-spacing'}
                                        label={__('Letter Spacing', 'maxi-blocks')}
                                        unit={value.desktop[getKey(value.desktop, 4)]}
                                        onChangeUnit={value => onChangeValue(value, 4, 'desktop')}
                                        value={value.desktop[getKey(value.desktop, 5)]}
                                        onChangeValue={value => onChangeValue(value, 5, 'desktop')}
                                    />
                                    <Divider />
                                    <SelectControl
                                        label={__('Weight', 'maxi-blocks')}
                                        className='maxi-typography-control__weight'
                                        value={value.desktop[getKey(value.desktop, 6)]}
                                        options={getWeightOptions()}
                                        onChange={value => onChangeValue(value, 6, 'desktop')}
                                    />
                                    <SelectControl
                                        label={__('Transform', 'maxi-blocks')}
                                        className='maxi-typography-control__transform'
                                        value={value.desktop[getKey(value.desktop, 7)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'none' },
                                            { label: __('Capitilize', 'maxi-blocks'), value: 'capitalize' },
                                            { label: __('Uppercase', 'maxi-blocks'), value: 'uppercase' },
                                            { label: __('Lowercase', 'maxi-blocks'), value: 'lowercase' },
                                            { label: __('Full Width', 'maxi-blocks'), value: 'full-width' },
                                            { label: __('Full Size Kana', 'maxi-blocks'), value: 'full-size-kana' },
                                        ]}
                                        onChange={value => onChangeValue(value, 7, 'desktop')}
                                    />
                                    <SelectControl
                                        label={__('Style', 'maxi-blocks')}
                                        className='maxi-typography-control__font-style'
                                        value={value.desktop[getKey(value.desktop, 8)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'normal' },
                                            { label: __('Italic', 'maxi-blocks'), value: 'italic' },
                                            { label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
                                            { label: __('Oblique (40 deg)'), value: 'oblique 40deg' },
                                        ]}
                                        onChange={value => onChangeValue(value, 8, 'desktop')}
                                    />
                                    <SelectControl
                                        label={__('Decoration', 'maxi-blocks')}
                                        className='maxi-typography-control__decoration'
                                        value={value.desktop[getKey(value.desktop, 9)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'none' },
                                            { label: __('Overline', 'maxi-blocks'), value: 'overline' },
                                            { label: __('Line Through', 'maxi-blocks'), value: 'line-through' },
                                            { label: __('Underline', 'maxi-blocks'), value: 'underline' },
                                            { label: __('Underline Overline', 'maxi-blocks'), value: 'underline overline' },
                                        ]}
                                        onChange={value => onChangeValue(value, 9, 'desktop')}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Tablet', 'gutenberg-extra'),
                            content: (
                                <Fragment>
                                    <SizeControl
                                        className={'maxi-typography-control__size'}
                                        label={__('Size', 'maxi-blocks')}
                                        unit={value.tablet[getKey(value.tablet, 0)]}
                                        onChangeUnit={value => onChangeValue(value, 0, 'tablet')}
                                        value={value.tablet[getKey(value.tablet, 1)]}
                                        onChangeValue={value => onChangeValue(value, 1, 'tablet')}
                                    />
                                    <SizeControl
                                        className={'maxi-typography-control__line-height'}
                                        label={__('Line Height', 'maxi-blocks')}
                                        unit={value.tablet[getKey(value.tablet, 2)]}
                                        onChangeUnit={value => onChangeValue(value, 2, 'tablet')}
                                        value={value.tablet[getKey(value.tablet, 3)]}
                                        onChangeValue={value => onChangeValue(value, 3, 'tablet')}
                                    />
                                    <SizeControl
                                        className={'maxi-typography-control__letter-spacing'}
                                        label={__('Letter Spacing', 'maxi-blocks')}
                                        unit={value.tablet[getKey(value.tablet, 4)]}
                                        onChangeUnit={value => onChangeValue(value, 4, 'tablet')}
                                        value={value.tablet[getKey(value.tablet, 5)]}
                                        onChangeValue={value => onChangeValue(value, 5, 'tablet')}
                                    />
                                    <Divider />
                                    <SelectControl
                                        label={__('Weight', 'maxi-blocks')}
                                        className='maxi-typography-control__weight'
                                        value={value.tablet[getKey(value.tablet, 6)]}
                                        options={getWeightOptions()}
                                        onChange={value => onChangeValue(value, 6, 'tablet')}
                                    />
                                    <SelectControl
                                        label={__('Transform', 'maxi-blocks')}
                                        className='maxi-typography-control__transform'
                                        value={value.tablet[getKey(value.tablet, 7)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'none' },
                                            { label: __('Capitilize', 'maxi-blocks'), value: 'capitalize' },
                                            { label: __('Uppercase', 'maxi-blocks'), value: 'uppercase' },
                                            { label: __('Lowercase', 'maxi-blocks'), value: 'lowercase' },
                                            { label: __('Full Width', 'maxi-blocks'), value: 'full-width' },
                                            { label: __('Full Size Kana', 'maxi-blocks'), value: 'full-size-kana' },
                                        ]}
                                        onChange={value => onChangeValue(value, 7, 'tablet')}
                                    />
                                    <SelectControl
                                        label={__('Style', 'maxi-blocks')}
                                        className='maxi-typography-control__font-style'
                                        value={value.tablet[getKey(value.tablet, 8)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'normal' },
                                            { label: __('Italic', 'maxi-blocks'), value: 'italic' },
                                            { label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
                                            { label: __('Oblique (40 deg)'), value: 'oblique 40deg' },
                                        ]}
                                        onChange={value => onChangeValue(value, 8, 'tablet')}
                                    />
                                    <SelectControl
                                        label={__('Decoration', 'maxi-blocks')}
                                        className='maxi-typography-control__decoration'
                                        value={value.tablet[getKey(value.tablet, 9)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'none' },
                                            { label: __('Overline', 'maxi-blocks'), value: 'overline' },
                                            { label: __('Line Through', 'maxi-blocks'), value: 'line-through' },
                                            { label: __('Underline', 'maxi-blocks'), value: 'underline' },
                                            { label: __('Underline Overline', 'maxi-blocks'), value: 'underline overline' },
                                        ]}
                                        onChange={value => onChangeValue(value, 9, 'tablet')}
                                    />
                                </Fragment>
                            )
                        },
                        {
                            label: __('Mobile', 'gutenberg-extra'),
                            content: (
                                <Fragment>
                                    <SizeControl
                                        className={'maxi-typography-control__size'}
                                        label={__('Size', 'maxi-blocks')}
                                        unit={value.mobile[getKey(value.mobile, 0)]}
                                        onChangeUnit={value => onChangeValue(value, 0, 'mobile')}
                                        value={value.mobile[getKey(value.mobile, 1)]}
                                        onChangeValue={value => onChangeValue(value, 1, 'mobile')}
                                    />
                                    <SizeControl
                                        className={'maxi-typography-control__line-height'}
                                        label={__('Line Height', 'maxi-blocks')}
                                        unit={value.mobile[getKey(value.mobile, 2)]}
                                        onChangeUnit={value => onChangeValue(value, 2, 'mobile')}
                                        value={value.mobile[getKey(value.mobile, 3)]}
                                        onChangeValue={value => onChangeValue(value, 3, 'mobile')}
                                    />
                                    <SizeControl
                                        className={'maxi-typography-control__letter-spacing'}
                                        label={__('Letter Spacing', 'maxi-blocks')}
                                        unit={value.mobile[getKey(value.mobile, 4)]}
                                        onChangeUnit={value => onChangeValue(value, 4, 'mobile')}
                                        value={value.mobile[getKey(value.mobile, 5)]}
                                        onChangeValue={value => onChangeValue(value, 5, 'mobile')}
                                    />
                                    <Divider />
                                    <SelectControl
                                        label={__('Weight', 'maxi-blocks')}
                                        className='maxi-typography-control__weight'
                                        value={value.mobile[getKey(value.mobile, 6)]}
                                        options={getWeightOptions()}
                                        onChange={value => onChangeValue(value, 6, 'mobile')}
                                    />
                                    <SelectControl
                                        label={__('Transform', 'maxi-blocks')}
                                        className='maxi-typography-control__transform'
                                        value={value.mobile[getKey(value.mobile, 7)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'none' },
                                            { label: __('Capitilize', 'maxi-blocks'), value: 'capitalize' },
                                            { label: __('Uppercase', 'maxi-blocks'), value: 'uppercase' },
                                            { label: __('Lowercase', 'maxi-blocks'), value: 'lowercase' },
                                            { label: __('Full Width', 'maxi-blocks'), value: 'full-width' },
                                            { label: __('Full Size Kana', 'maxi-blocks'), value: 'full-size-kana' },
                                        ]}
                                        onChange={value => onChangeValue(value, 7, 'mobile')}
                                    />
                                    <SelectControl
                                        label={__('Style', 'maxi-blocks')}
                                        className='maxi-typography-control__font-style'
                                        value={value.mobile[getKey(value.mobile, 8)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'normal' },
                                            { label: __('Italic', 'maxi-blocks'), value: 'italic' },
                                            { label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
                                            { label: __('Oblique (40 deg)'), value: 'oblique 40deg' },
                                        ]}
                                        onChange={value => onChangeValue(value, 8, 'mobile')}
                                    />
                                    <SelectControl
                                        label={__('Decoration', 'maxi-blocks')}
                                        className='maxi-typography-control__decoration'
                                        value={value.mobile[getKey(value.mobile, 9)]}
                                        options={[
                                            { label: __('Default', 'maxi-blocks'), value: 'none' },
                                            { label: __('Overline', 'maxi-blocks'), value: 'overline' },
                                            { label: __('Line Through', 'maxi-blocks'), value: 'line-through' },
                                            { label: __('Underline', 'maxi-blocks'), value: 'underline' },
                                            { label: __('Underline Overline', 'maxi-blocks'), value: 'underline overline' },
                                        ]}
                                        onChange={value => onChangeValue(value, 9, 'mobile')}
                                    />
                                </Fragment>
                            )
                        },
                    ]}
                />
            </div>
        )
    }
}