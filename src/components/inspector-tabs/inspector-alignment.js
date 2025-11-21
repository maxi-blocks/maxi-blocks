/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '@components/alignment-control';
import { getGroupAttributes, getLastBreakpointAttribute } from '@extensions/styles';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Component
 */
const alignment = ({
	props,
	isAlignment,
	isTextAlignment,
	alignmentLabel,
	textAlignmentLabel,
	disableJustify = false,
}) => {
	const { attributes, deviceType, maxiSetAttributes } = props;
	const showLabel =
		!isEmpty(alignmentLabel) && isAlignment && isTextAlignment;

	// Check if default alignment is selected
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const alignmentAttributes = [];
	const textAlignmentAttributes = [];
	
	// Generate all possible alignment attribute names
	breakpoints.forEach(bp => {
		if (isAlignment) {
			alignmentAttributes.push(`alignment-${bp}`);
			alignmentAttributes.push(`alignment-${bp}-hover`);
		}
		if (isTextAlignment) {
			textAlignmentAttributes.push(`text-alignment-${bp}`);
			textAlignmentAttributes.push(`text-alignment-${bp}-hover`);
		}
	});

	// Check if current values are default (left)
	const currentAlignment = isAlignment
		? getLastBreakpointAttribute({
				target: 'alignment',
				breakpoint: deviceType,
				attributes: getGroupAttributes(attributes, 'alignment'),
		  })
		: null;

	const currentTextAlignment = isTextAlignment
		? getLastBreakpointAttribute({
				target: 'text-alignment',
				breakpoint: deviceType,
				attributes: getGroupAttributes(attributes, 'textAlignment'),
		  })
		: null;

	// Default is 'left' for both alignment types
	const isDefaultAlignment = !currentAlignment || currentAlignment === 'left';
	const isDefaultTextAlignment = !currentTextAlignment || currentTextAlignment === 'left';

	// Only ignore indicators if BOTH are default (or not present)
	const shouldIgnoreIndicators =
		(!isAlignment || isDefaultAlignment) &&
		(!isTextAlignment || isDefaultTextAlignment);

	const ignoreIndicator = shouldIgnoreIndicators
		? [...alignmentAttributes, ...textAlignmentAttributes]
		: [];

	return {
		label: __('Alignment', 'maxi-blocks'),
		content: (
			<>
				{isAlignment && (
					<AlignmentControl
						label={alignmentLabel}
						{...getGroupAttributes(attributes, 'alignment')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
						disableJustify={disableJustify}
						showLabel={showLabel}
					/>
				)}
				{isTextAlignment && (
					<AlignmentControl
						label={textAlignmentLabel}
						{...getGroupAttributes(attributes, 'textAlignment')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
						type='text'
						disableRTC={isAlignment}
						showLabel={showLabel}
					/>
				)}
			</>
		),
		ignoreIndicator,
	};
};

export default alignment;
