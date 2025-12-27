/**
 * Higher-Order Component that wraps a block's edit component in a lazy loader.
 * This defers loading of the edit component until the block is actually rendered,
 * reducing initial bundle size.
 *
 * Usage:
 *   const edit = withLazyEdit(() => import('./edit'));
 *   registerBlockType(metadata, { edit, ... });
 */

/**
 * WordPress dependencies
 */
import { Suspense, lazy } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Spinner from '@components/spinner';

/**
 * Creates a lazy-loaded wrapper for a block edit component.
 *
 * @param {Function} importFn - Dynamic import function, e.g., () => import('./edit')
 * @returns {Function} - React component that lazy loads the edit component
 */
const withLazyEdit = importFn => {
	const LazyEdit = lazy(importFn);

	const LazyEditWrapper = props => (
		<Suspense
			fallback={
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						minHeight: '100px',
					}}
				>
					<Spinner />
				</div>
			}
		>
			<LazyEdit {...props} />
		</Suspense>
	);

	return LazyEditWrapper;
};

export default withLazyEdit;
