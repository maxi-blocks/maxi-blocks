/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '@components/alignment-control';
import { getGroupAttributes, getDefaultAttribute } from '@extensions/styles';

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

	// Get the actual default values from the block's attributes
	// This handles different blocks having different defaults (e.g., button text-alignment is 'center')
	const alignmentDefaultValue =
		getDefaultAttribute('alignment-general', props.clientId) || 'center';
	const textAlignmentDefaultValue =
		getDefaultAttribute('text-alignment-general', props.clientId) || 'left';

	// Check if any alignment attribute is set to a non-default value
	// Treat both undefined/null AND values matching the default as "default"
	const hasNonDefaultAlignment =
		isAlignment &&
		alignmentAttributes.some(attr => {
			const value = attributes[attr];
			// If undefined/null, it's default
			if (value === undefined || value === null) return false;
			// If set to default value, it's default
			if (value === alignmentDefaultValue) return false;
			// Otherwise it's non-default
			return true;
		});

	const hasNonDefaultTextAlignment =
		isTextAlignment &&
		textAlignmentAttributes.some(attr => {
			const value = attributes[attr];
			// If undefined/null, it's default
			if (value === undefined || value === null) return false;
			// If set to default value, it's default
			if (value === textAlignmentDefaultValue) return false;
			// Otherwise it's non-default
			return true;
		});

	// Only ignore indicators if BOTH types (if present) have not been set to non-default values
	const shouldIgnoreIndicators =
		(!isAlignment || !hasNonDefaultAlignment) &&
		(!isTextAlignment || !hasNonDefaultTextAlignment);

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
