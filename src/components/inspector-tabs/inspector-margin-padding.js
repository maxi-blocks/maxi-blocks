/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { lazy, Suspense } from '@wordpress/element';

/**
 * Internal dependencies
 */
// import MarginControl from '@components/margin-control';
// import PaddingControl from '@components/padding-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import ContentLoader from '@components/content-loader';

const MarginControl = lazy(() =>
	import(/* webpackChunkName: "maxi-margin-control" */ '@components/margin-control')
);
const PaddingControl = lazy(() =>
	import(/* webpackChunkName: "maxi-padding-control" */ '@components/padding-control')
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
			<>
				{!disableMargin && (
					<Suspense fallback={<ContentLoader />}>
						<MarginControl
							{...getGroupAttributes(
								attributes,
								'margin',
								false,
								prefix
							)}
							prefix={prefix}
							onChange={obj => maxiSetAttributes(obj)}
							breakpoint={deviceType}
							fullWidth={fullWidth}
						/>
					</Suspense>
				)}
				<Suspense fallback={<ContentLoader />}>
					<PaddingControl
						{...getGroupAttributes(
							attributes,
							'padding',
							false,
							prefix
						)}
						prefix={prefix}
						onChange={obj => maxiSetAttributes(obj)}
						breakpoint={deviceType}
					/>
				</Suspense>
			</>
		),
	};
};

export default marginPadding;
