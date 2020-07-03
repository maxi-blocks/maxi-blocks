/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { SelectControl } = wp.components;
const { Fragment } = wp.element;

/**
 * Internal dependencies
 */
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
const TypographyControl = props => {
    const {
        className,
        fontOptions,
        defaultColor = '#9b9b9b',
        hideAlignment = false,
        onChange,
        breakpoint = 'general'
    } = props;

    const value = typeof fontOptions === 'object' ?
        fontOptions :
        JSON.parse(fontOptions);

    const classes = classnames(
        'maxi-typography-control',
        className
    )

    const Divider = () => (
        <hr style={{ margin: '15px 0' }} />
    );

    const getWeightOptions = () => {
        const fontOptions = Object.keys(value[breakpoint]['font-options']);
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

    return (
        <div className={classes}>
            <FontFamilySelector
                className="maxi-typography-control__font-family"
                font={value[breakpoint]['font-family']}
                onChange={font => {
                    value[breakpoint]['font-family'] = font.value;
                    value[breakpoint]['font-options'] = font.files;
                    onChange(JSON.stringify(value));
                }}
            />
            <ColorControl
                label={__('Font Color', 'maxi-blocks')}
                className="maxi-typography-control__color"
                color={value[breakpoint].color}
                defaultColor={defaultColor} // #128
                onColorChange={val => {
                    value[breakpoint].color = val;
                    onChange(JSON.stringify(value));
                }}
                disableGradient
            />
            {
                !hideAlignment &&
                <AlignmentControl
                    className="maxi-typography-control__text-alignment"
                    label={__('Alignment', 'maxi-blocks')}
                    value={value.general['text-align']}
                    onChange={val => {
                        value.general['text-align'] = val;
                        onChange(JSON.stringify(value))
                    }}
                />
            }
            <SizeControl
                className={'maxi-typography-control__size'}
                label={__('Size', 'maxi-blocks')}
                unit={value[breakpoint]['font-sizeUnit']}
                onChangeUnit={val => {
                    value[breakpoint]['font-sizeUnit'] = val;
                    onChange(JSON.stringify(value))
                }}
                value={value[breakpoint]['font-size']}
                onChangeValue={val => {
                    value[breakpoint]['font-size'] = val;
                    onChange(JSON.stringify(value))
                }}
            />
            <SizeControl
                className={'maxi-typography-control__line-height'}
                label={__('Line Height', 'maxi-blocks')}
                unit={value[breakpoint]['line-heightUnit']}
                onChangeUnit={val => {
                    value[breakpoint]['line-heightUnit'] = val;
                    onChange(JSON.stringify(value))
                }}
                value={value[breakpoint]['line-height']}
                onChangeValue={val => {
                    value[breakpoint]['line-height'] = val;
                    onChange(JSON.stringify(value))
                }}
            />
            <SizeControl
                className={'maxi-typography-control__letter-spacing'}
                label={__('Letter Spacing', 'maxi-blocks')}
                unit={value[breakpoint]['letter-spacingUnit']}
                onChangeUnit={val => {
                    value[breakpoint]['letter-spacingUnit'] = val;
                    onChange(JSON.stringify(value))
                }}
                value={value[breakpoint]['letter-spacing']}
                onChangeValue={val => {
                    value[breakpoint]['letter-spacing'] = val;
                    onChange(JSON.stringify(value))
                }}
            />
            <Divider />
            <SelectControl
                label={__('Weight', 'maxi-blocks')}
                className='maxi-typography-control__weight'
                value={value[breakpoint]['font-weight']}
                options={getWeightOptions()}
                onChange={val => {
                    value[breakpoint]['font-weight'] = val;
                    onChange(JSON.stringify(value))
                }}
            />
            <SelectControl
                label={__('Transform', 'maxi-blocks')}
                className='maxi-typography-control__transform'
                value={value[breakpoint]['text-transform']}
                options={[
                    { label: __('Default', 'maxi-blocks'), value: 'none' },
                    { label: __('Capitilize', 'maxi-blocks'), value: 'capitalize' },
                    { label: __('Uppercase', 'maxi-blocks'), value: 'uppercase' },
                    { label: __('Lowercase', 'maxi-blocks'), value: 'lowercase' },
                ]}
                onChange={val => {
                    value[breakpoint]['text-transform'] = val;
                    onChange(JSON.stringify(value))
                }}
            />
            <SelectControl
                label={__('Style', 'maxi-blocks')}
                className='maxi-typography-control__font-style'
                value={value[breakpoint]['font-style']}
                options={[
                    { label: __('Default', 'maxi-blocks'), value: 'normal' },
                    { label: __('Italic', 'maxi-blocks'), value: 'italic' },
                    { label: __('Oblique', 'maxi-blocks'), value: 'oblique' },
                ]}
                onChange={val => {
                    value[breakpoint]['font-style'] = val;
                    onChange(JSON.stringify(value));
                }}
            />
            <SelectControl
                label={__('Decoration', 'maxi-blocks')}
                className='maxi-typography-control__decoration'
                value={value[breakpoint]['text-decoration']}
                options={[
                    { label: __('Default', 'maxi-blocks'), value: 'none' },
                    { label: __('Overline', 'maxi-blocks'), value: 'overline' },
                    { label: __('Line Through', 'maxi-blocks'), value: 'line-through' },
                    { label: __('Underline', 'maxi-blocks'), value: 'underline' },
                    { label: __('Underline Overline', 'maxi-blocks'), value: 'underline overline' },
                ]}
                onChange={val => {
                    value[breakpoint]['text-decoration'] = val;
                    onChange(JSON.stringify(value))
                }}
            />
            <TextShadowControl
                className="maxi-typography-control__text-shadow"
                value={value[breakpoint]['text-shadow']}
                onChange={val => {
                    value[breakpoint]['text-shadow'] = val;
                    onChange(JSON.stringify(value))
                }}
                defaultColor={defaultColor} // #128
            />
        </div>
    )
}

export default TypographyControl;