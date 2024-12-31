/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '@components/alignment-control';
import { getGroupAttributes } from '@extensions/styles';

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
	};
};

export default alignment;
