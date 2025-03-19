/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	getDefaultAttribute,
	getLastBreakpointAttribute,
} from '@extensions/styles';

/**
 * Internal dependencies
 */
import AdvancedNumberControl from '@components/advanced-number-control';
import { setSVGStrokeWidth } from '@extensions/svg';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { select } from '@wordpress/data';

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

	const useBreakpoint =
		breakpoint === 'general'
			? select('maxiBlocks').receiveBaseBreakpoint()
			: breakpoint;

	const strokeAttrLabel = `${prefix}stroke-${useBreakpoint}${
		isHover ? '-hover' : ''
	}`;
	const defaultStrokeAttrLabel = `${prefix}stroke-general${
		isHover ? '-hover' : ''
	}`;
	const stroke = props[strokeAttrLabel] || props[defaultStrokeAttrLabel];
	const defaultStroke = getDefaultAttribute(strokeAttrLabel);
	const placeholderStroke = getLastBreakpointAttribute({
		target: `${prefix}stroke`,
		breakpoint: 'general',
		attributes: props,
		isHover,
	});

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
					...(!prefix.includes('navigation') && {
						[`${prefix === 'svg-' ? '' : prefix}content`]:
							setSVGStrokeWidth(content, val),
					}),
				});
			}}
			min={0.1}
			max={5}
			step={0.1}
			onReset={() => {
				onChange({
					[strokeAttrLabel]: defaultStroke,
					[`${prefix === 'svg-' ? '' : prefix}content`]:
						setSVGStrokeWidth(content, defaultStroke),
					isReset: true,
				});
			}}
			defaultValue={defaultStroke}
			initialPosition={placeholderStroke}
		/>
	);
};

export default SvgStrokeWidthControl;
