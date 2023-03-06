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

			useLayoutEffect(() => {
				blockWantsToRender(uniqueID, clientId);
			}, []);

			useEffect(() => {
				if (canRender && hasBeenRendered) return () => {};

				const interval = setInterval(async () => {
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

			if (!canRender) return <ContentLoader />;

			if (canRender && hasBeenRendered)
				return (
					<WrappedComponent
						{...ownProps}
						onMaxiBlockRender={() =>
							setBlockHasBeenRendered(uniqueID)
						}
					/>
				);

			return (
				<Suspense fallback={<ContentLoader />}>
					<WrappedComponent
						{...ownProps}
						onMaxiBlockRender={() =>
							setBlockHasBeenRendered(uniqueID)
						}
					/>
				</Suspense>
			);
		}),
	'withMaxiSuspense'
);

export default withMaxiSuspense;
