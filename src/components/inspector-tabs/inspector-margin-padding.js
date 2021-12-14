/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import AxisControl from '../axis-control';
import { getGroupAttributes } from '../../extensions/styles';

/**
 * Component
 */
const marginPadding = ({
	props,
	prefix,
	customLabel,
	disableMargin = false,
}) => {
	const { attributes, deviceType, setAttributes } = props;

	return {
		label: customLabel ?? __('Margin / Padding', 'maxi-blocks'),
		content: (
			<>
				{!disableMargin && (
					<AxisControl
						{...getGroupAttributes(
							attributes,
							'margin',
							false,
							prefix
						)}
						prefix={prefix}
						label={__('Margin', 'maxi-blocks')}
						onChange={obj => setAttributes(obj)}
						breakpoint={deviceType}
						target='margin'
						optionType='string'
						minMaxSettings={{
							px: {
								min: -999,
								max: 999,
								step: 1,
							},
							em: {
								min: -999,
								max: 999,
								step: 0.1,
							},
							vw: {
								min: -999,
								max: 999,
								step: 0.1,
							},
							'%': {
								min: -999,
								max: 999,
								step: 0.1,
							},
						}}
					/>
				)}
				<AxisControl
					{...getGroupAttributes(
						attributes,
						'padding',
						false,
						prefix
					)}
					prefix={prefix}
					label={__('Padding', 'maxi-blocks')}
					onChange={obj => setAttributes(obj)}
					breakpoint={deviceType}
					target='padding'
					disableAuto
				/>
			</>
		),
	};
};

export default marginPadding;
