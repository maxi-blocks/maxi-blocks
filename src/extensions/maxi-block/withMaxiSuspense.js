/**
 * WordPress dependencies
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	Suspense,
	useState,
	useEffect,
	useLayoutEffect,
} from '@wordpress/element';

/**
 * External dependencies
 */
import { PuffLoader } from 'react-spinners';

const SUSPENSE_BLOCKS = [
	'container-maxi',
	'row-maxi',
	'column-maxi',
	'group-maxi',
];

const ContentLoader = () => (
	<PuffLoader color='#ff4a17' size={20} speedMultiplier={0.8} />
);

const withMaxiSuspense = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const {
				clientId,
				attributes: { uniqueID },
			} = ownProps;

			const { canBlockRender, blockHasBeenRendered } = useSelect(
				select => select('maxiBlocks'),
				[]
			);

			const [canRender, setCanRender] = useState(
				SUSPENSE_BLOCKS.some(blockName => uniqueID.includes(blockName))
					? canBlockRender(uniqueID)
					: true
			);
			const [hasBeenRendered, setHasBeenRendered] = useState(
				blockHasBeenRendered(uniqueID)
			);

			const {
				blockWantsToRender,
				blockHasBeenRendered: setBlockHasBeenRendered,
			} = useDispatch('maxiBlocks');

			// On first render, request to the store that the block wants to render.
			useLayoutEffect(() => {
				blockWantsToRender(uniqueID, clientId);
			}, []);

			useEffect(() => {
				// If the block has already been rendered, don't need the interval anymore.
				if (canRender && hasBeenRendered) return () => {};

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
			}, [setCanRender, setHasBeenRendered]);

			// Wait for the store to allow the block to render.
			if (!canRender) return <ContentLoader />;

			const WrappedComponentWithProps = (
				<WrappedComponent
					{...ownProps}
					onMaxiBlockRender={() => {
						setBlockHasBeenRendered(uniqueID);
						setHasBeenRendered(true);
					}}
				/>
			);

			// If the block has already been rendered, don't need the suspense again.
			// If we leave the suspense, the block will be re-rendered every time we
			// modify something and generates a strange UX.
			if (canRender && hasBeenRendered) return WrappedComponentWithProps;

			return (
				<Suspense fallback={<ContentLoader />}>
					{WrappedComponentWithProps}
				</Suspense>
			);
		}),
	'withMaxiSuspense'
);

export default withMaxiSuspense;
