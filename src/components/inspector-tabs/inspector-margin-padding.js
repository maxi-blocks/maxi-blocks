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
import { shouldApplySCBlockDefaultsToControl } from '@extensions/style-cards/blockDefaults';

const MarginPaddingContent = ({
	breakpoint,
	attributes,
	maxiSetAttributes,
	prefix,
	disableMargin,
	fullWidth,
	applyStyleCardDefaults,
}) => {
	const marginAttributes = getGroupAttributes(
		attributes,
		'margin',
		false,
		prefix,
		false,
		applyStyleCardDefaults
	);
	const paddingAttributes = getGroupAttributes(
		attributes,
		'padding',
		false,
		prefix,
		false,
		applyStyleCardDefaults
	);

	return (
		<>
			{!disableMargin && (
				<MarginControl
					{...marginAttributes}
					prefix={prefix}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={breakpoint}
					fullWidth={fullWidth}
					noResponsiveTabs
				/>
			)}
			{!disableMargin && <hr />}
			<PaddingControl
				{...paddingAttributes}
				prefix={prefix}
				onChange={obj => maxiSetAttributes(obj)}
				breakpoint={breakpoint}
				noResponsiveTabs
			/>
		</>
	);
};

/**
 * Component
 */
const marginPadding = ({
	props,
	prefix = '',
	customLabel,
	disableMargin = false,
}) => {
	const { attributes, deviceType, maxiSetAttributes, name } = props;
	const applyStyleCardDefaults = shouldApplySCBlockDefaultsToControl({
		name,
		attributes,
		prefix,
	});

	const fullWidth = getLastBreakpointAttribute({
		target: `${prefix}full-width`,
		breakpoint: deviceType,
		attributes: getGroupAttributes(
			attributes,
			'size',
			false,
			prefix,
			false,
			applyStyleCardDefaults
		),
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
					applyStyleCardDefaults={applyStyleCardDefaults}
				/>
			</ResponsiveTabsControl>
		),
	};
};

export default marginPadding;
