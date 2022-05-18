/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AlignmentControl from '../alignment-control';
import { getGroupAttributes } from '../../extensions/styles';
import ResponsiveTabsControl from '../responsive-tabs-control';

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
			<ResponsiveTabsControl breakpoint={deviceType}>
				<>
					{isAlignment && (
						<>
							{isTextAlignment && (
								<label
									className='maxi-base-control__label'
									htmlFor={`${alignmentLabel}-alignment`}
								>
									{`${alignmentLabel} alignment`}
								</label>
							)}
							<AlignmentControl
								id={`${alignmentLabel}-alignment`}
								label={alignmentLabel}
								{...getGroupAttributes(attributes, 'alignment')}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={deviceType}
								disableJustify={disableJustify}
							/>
						</>
					)}
					{isTextAlignment && (
						<>
							{isAlignment && (
								<label
									className='maxi-base-control__label'
									htmlFor={`${textAlignmentLabel}-alignment`}
								>
									{`${textAlignmentLabel} alignment`}
								</label>
							)}
							<AlignmentControl
								id={`${textAlignmentLabel}-alignment`}
								label={textAlignmentLabel}
								{...getGroupAttributes(
									attributes,
									'textAlignment'
								)}
								onChange={obj => maxiSetAttributes(obj)}
								breakpoint={deviceType}
								type='text'
							/>
						</>
					)}
				</>
			</ResponsiveTabsControl>
		),
	};
};

export default alignment;
