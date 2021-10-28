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
	alignmentLable,
	textAlignmentLable,
	disableJustify = false,
}) => {
	const { attributes, deviceType, setAttributes } = props;

	return {
		label: __('Alignment', 'maxi-blocks'),
		content: (
			<>
				{isAlignment && (
					<AlignmentControl
						label={alignmentLable}
						{...getGroupAttributes(attributes, 'alignment')}
						onChange={obj => setAttributes(obj)}
						breakpoint={deviceType}
						disableJustify={disableJustify}
					/>
				)}
				{isTextAlignment && (
					<AlignmentControl
						label={textAlignmentLable}
						{...getGroupAttributes(attributes, 'textAlignment')}
						onChange={obj => setAttributes(obj)}
						breakpoint={deviceType}
						type='text'
					/>
				)}
			</>
		),
	};
};

export default alignment;
