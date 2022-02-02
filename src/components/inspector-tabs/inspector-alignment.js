/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '../alignment-control';
import { getGroupAttributes } from '../../extensions/styles';

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
					/>
				)}
				{isTextAlignment && (
					<AlignmentControl
						label={textAlignmentLabel}
						{...getGroupAttributes(attributes, 'textAlignment')}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
						type='text'
					/>
				)}
			</>
		),
	};
};

export default alignment;
