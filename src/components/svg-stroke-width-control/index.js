/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '../../extensions/styles';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '../advanced-number-control';
import { setSVGStrokeWidth } from '../../extensions/svg';

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
	} = props;

	const strokeAttrLabel = `${prefix}stroke-${breakpoint}${
		isHover ? '-hover' : ''
	}`;
	const stroke = props[strokeAttrLabel];
	const defaultStroke = getDefaultAttribute(strokeAttrLabel);
	const placeholderStroke = getLastBreakpointAttribute({
		target: `${prefix}stroke`,
		breakpoint,
		attributes: props,
		isHover,
	});

	return (
		<AdvancedNumberControl
			label={__(customLabel, 'maxi-blocks')}
			value={stroke}
			placeholder={placeholderStroke}
			onChangeValue={rawVal => {
				const val = rawVal !== undefined && rawVal !== '' ? rawVal : '';

				onChange({
					[strokeAttrLabel]:
						val !== undefined && val !== '' ? val : '',
				});

				!prefix.includes('navigation') &&
					onChange({
						[`${prefix === 'svg-' ? '' : prefix}content`]:
							setSVGStrokeWidth(content, val),
					});
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() =>
				onChange({
					[strokeAttrLabel]: defaultStroke,
				})
			}
			defaultValue={defaultStroke}
			initialPosition={placeholderStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
