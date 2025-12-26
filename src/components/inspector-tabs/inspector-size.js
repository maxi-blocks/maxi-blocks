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
// import FullSizeControl from '@components/full-size-control';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import ContentLoader from '@components/content-loader';

const FullSizeControl = lazy(() =>
	import(/* webpackChunkName: "maxi-size-control" */ '@components/full-size-control')
);

/**
 * Component
 */
const size = ({
	props,
	prefix = '',
	block = false,
	hideHeight = false,
	hideWidth = false,
	hideMaxWidth = false,
	hideFit,
	hideFullWidth = false,
	isImage = false,
}) => {
	const { attributes, deviceType, maxiSetAttributes, name } = props;
	const { isFirstOnHierarchy } = attributes;

	const isBlockFullWidth = getLastBreakpointAttribute({
		target: `${prefix}full-width`,
		breakpoint: deviceType,
		attributes,
	});

	const showFullWidth =
		(isFirstOnHierarchy || name === 'maxi-blocks/row-maxi') &&
		!hideFullWidth;

	return {
		label: __('Height / Width', 'maxi-blocks'),
		content: (
			<Suspense fallback={<ContentLoader />}>
				<FullSizeControl
					{...getGroupAttributes(attributes, 'size', false, prefix)}
					prefix={prefix}
					onChange={obj => maxiSetAttributes(obj)}
					breakpoint={deviceType}
					hideHeight={hideHeight}
					hideWidth={hideWidth || isBlockFullWidth}
					hideMaxWidth={hideMaxWidth}
					hideFit={hideFit}
					isBlockFullWidth={isBlockFullWidth}
					allowForceAspectRatio={block}
					showFullWidth={showFullWidth}
					block={block}
					isImage={isImage}
				/>
			</Suspense>
		),
		extraIndicators: [
			...(isFirstOnHierarchy ? 'blockFullWidth' : 'fullWidth'),
		],
	};
};

export default size;
