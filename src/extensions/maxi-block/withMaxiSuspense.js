/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	Suspense,
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
} from '@wordpress/element';

/**
 * External dependencies
 */
import { PuffLoader } from 'react-spinners';

const ContentLoader = () => (
	<div
		style={{
			display: 'flex',
			justifyContent: 'center',
			alignContent: 'center',
			width: '100%',
			height: '100%',
		}}
	>
		<PuffLoader color='#ff4a17' size={20} speedMultiplier={0.8} />
	</div>
);

const SuspendedBlock = ({ onMountBlock }) => {
	useEffect(() => onMountBlock(), []);

	return <ContentLoader />;
};

const withMaxiSuspense = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const {
				clientId,
				attributes: { uniqueID },
			} = ownProps;

			const { canBlockRender } = useSelect(
				select => select('maxiBlocks'),
				[]
			);

			const { blockWantsToRender, blockHasBeenRendered } =
				useDispatch('maxiBlocks');

			useLayoutEffect(() => {
				blockWantsToRender(uniqueID, clientId);
			}, []);

			useEffect(() => {
				// If the block has already been rendered, don't need the interval anymore.
				if (!canRender || !hasBeenRendered) {
					// Use this interval as a heartbeat to check if the store allows the block to render
					// and if it has been already rendered.
					const interval = setInterval(() => {
						if (!canRender && canBlockRender(uniqueID, clientId)) {
							setCanRender(true);

							clearInterval(interval);
						}
						if (
							!hasBeenRendered &&
							blockHasBeenRendered(uniqueID, clientId)
						) {
							setHasBeenRendered(true);

							clearInterval(interval);
						}
					}, 100);

					return () => clearInterval(interval);
				}
			}, [setCanRender, setHasBeenRendered]);

			if (!canRender) return <ContentLoader />;

			if (hasBeenConsolidated) return <WrappedComponent {...ownProps} />;

			return (
				<Suspense fallback={<ContentLoader />}>
					<SuspendedBlock onMountBlock={onMountBlock} />
				</Suspense>
			);
		}),
	'withMaxiSuspense'
);

export default withMaxiSuspense;
