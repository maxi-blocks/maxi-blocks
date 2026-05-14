/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import MarginControl from '@components/margin-control';
import PaddingControl from '@components/padding-control';
import ResponsiveTabsControl from '@components/responsive-tabs-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';

const MarginPaddingContent = ({
	breakpoint,
	attributes,
	maxiSetAttributes,
	prefix,
	disableMargin,
	fullWidth,
}) => (
	<>
		{!disableMargin && (
			<MarginControl
				{...getGroupAttributes(attributes, 'margin', false, prefix)}
				prefix={prefix}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={breakpoint}
				fullWidth={fullWidth}
				noResponsiveTabs
			/>
		)}
		{!disableMargin && <hr />}
		<PaddingControl
			{...getGroupAttributes(attributes, 'padding', false, prefix)}
			prefix={prefix}
			onChange={obj => maxiSetAttributes(obj)}
			breakpoint={breakpoint}
			noResponsiveTabs
		/>
	</>
);

/**
 * Component
 */
const marginPadding = ({
	props,
	prefix = '',
	customLabel,
	disableMargin = false,
}) => {
	const { attributes, deviceType, maxiSetAttributes } = props;

	const fullWidth = getLastBreakpointAttribute({
		target: `${prefix}full-width`,
		breakpoint: deviceType,
		attributes,
	});

	return {
		label: customLabel ?? __('Margin / Padding', 'maxi-blocks'),
		content: (
			<ResponsiveTabsControl breakpoint={deviceType}>
				<MarginPaddingContent
					attributes={attributes}
					maxiSetAttributes={maxiSetAttributes}
					prefix={prefix}
					disableMargin={disableMargin}
					fullWidth={fullWidth}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default marginPadding;
