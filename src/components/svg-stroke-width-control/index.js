/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	getAttributeKey,
	getAttributesValue,
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/attributes';
import AdvancedNumberControl from '../advanced-number-control';
import { setSVGStrokeWidth } from '../../extensions/svg';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Component
 */
const SvgStrokeWidthControl = props => {
	const {
		onChange,
		breakpoint,
		prefix,
		content,
		isHover = false,
		customLabel = 'Stroke width',
		className,
	} = props;

	const classes = classnames('maxi-svg-stroke-width-control', className);

	const strokeAttrLabel = getAttributeKey(
		'_str',
		isHover,
		prefix,
		breakpoint
	);
	const stroke = getAttributesValue({
		target: '_str',
		props,
		breakpoint,
		isHover,
		prefix,
	});
	const defaultStroke = getDefaultAttribute(strokeAttrLabel);
	const placeholderStroke = getLastBreakpointAttribute({
		target: '_str',
		prefix,
		breakpoint,
		attributes: props,
		isHover,
	});
	const contentLabel = getAttributeKey(
		'_c',
		isHover,
		`${prefix === 's-' ? '' : prefix}`
	);

	return (
		<AdvancedNumberControl
			label={__(customLabel, 'maxi-blocks')}
			className={classes}
			value={stroke}
			placeholder={placeholderStroke}
			onChangeValue={rawVal => {
				const val = rawVal !== undefined && rawVal !== '' ? rawVal : '';

				onChange({
					[strokeAttrLabel]:
						val !== undefined && val !== '' ? val : '',
					...(!prefix.includes('n') && {
						[contentLabel]: setSVGStrokeWidth(content, val),
					}),
				});
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() => {
				onChange({
					[strokeAttrLabel]: defaultStroke,
					[contentLabel]: setSVGStrokeWidth(content, defaultStroke),
					isReset: true,
				});
			}}
			defaultValue={defaultStroke}
			initialPosition={placeholderStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
