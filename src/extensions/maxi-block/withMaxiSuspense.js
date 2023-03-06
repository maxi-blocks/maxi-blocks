/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { Suspense, useState, useEffect, useRef } from '@wordpress/element';

/**
 * External dependencies
 */
import { isEmpty, isNil } from 'lodash';
import { PuffLoader } from 'react-spinners';

const ContentLoader = () => (
	<PuffLoader color='#ff4a17' size={20} speedMultiplier={0.8} />
);

const LoadComponent = ({ onUnmount }) => {
	useEffect(() => {
		return onUnmount();
	}, []);

	return <ContentLoader />;
};

const withMaxiSuspense = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const {
				clientId,
				attributes: { uniqueID },
			} = ownProps;

			const { canBlockRender, blockHasBeenRendered } =
				select('maxiBlocks');

			const [canRender, setCanRender] = useState(
				canBlockRender(uniqueID)
			);
			const [hasBeenRendered, setHasBeenRendered] = useState(
				blockHasBeenRendered(uniqueID)
			);

			const hasInnerBlocks = useRef(null);
			const isChild = useRef(null);
			const hasBeenConsolidated = useRef(canRender && hasBeenRendered);

			useEffect(() => {
				if (!hasBeenConsolidated.current) {
					const { blockWantsToRender } = dispatch('maxiBlocks');

					blockWantsToRender(uniqueID, clientId);
				}
			}, []);

			useEffect(() => {
				if (canRender && hasBeenRendered) {
					if (!hasBeenConsolidated.current)
						hasBeenConsolidated.current = true;

					return true;
				}

				const interval = setInterval(() => {
					const { canBlockRender } = select('maxiBlocks');

					if (isNil(isChild.current)) {
						const { getBlockParents } = select('core/block-editor');

						isChild.current = !isEmpty(
							getBlockParents(clientId).filter(
								val => val !== clientId
							)
						);
					}

					if (isNil(hasInnerBlocks.current)) {
						const { getBlockOrder } = select('core/block-editor');

						hasInnerBlocks.current = !isEmpty(
							getBlockOrder(clientId)
						);
					}

					if (!canRender && canBlockRender(uniqueID, clientId)) {
						setCanRender(true);

						clearInterval(interval);
					}

					if (canRender || canBlockRender(uniqueID, clientId)) {
						const { blockHasBeenRendered: getHasBeenRendered } =
							select('maxiBlocks');

						const blockHasBeenRendered = getHasBeenRendered(
							uniqueID,
							clientId
						);

						if (!hasBeenRendered && !blockHasBeenRendered) {
							const {
								blockHasBeenRendered: setBlockHasBeenRendered,
							} = dispatch('maxiBlocks');

							setBlockHasBeenRendered(uniqueID);
						} else if (!hasBeenRendered && blockHasBeenRendered) {
							setHasBeenRendered(true);

							clearInterval(interval);
						}
					}
				}, 10);

				return () => clearInterval(interval);
			});

			if (!canRender) return <ContentLoader />;

			// Ensures child blocks with no inner blocks are rendered immediately.
			const needsDirectRender =
				!isNil(isChild.current) &&
				isChild.current &&
				!isNil(hasInnerBlocks.current) &&
				!hasInnerBlocks.current;
			const hasFreePass =
				canRender && hasBeenRendered && hasBeenConsolidated.current;

			if (needsDirectRender || hasFreePass)
				return <WrappedComponent {...ownProps} />;

			const onUnmount = () => {
				const { blockHasBeenRendered } = dispatch('maxiBlocks');

				blockHasBeenRendered(uniqueID).then(() => {
					setHasBeenRendered(true);
				});
			};

			return (
				<Suspense
					fallback={<LoadComponent onUnmount={() => onUnmount()} />}
				>
					<WrappedComponent {...ownProps} />
				</Suspense>
			);
		}),
	'withMaxiSuspense'
);

export default withMaxiSuspense;
