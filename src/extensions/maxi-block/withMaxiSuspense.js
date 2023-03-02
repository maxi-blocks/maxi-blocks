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

const ContentLoader = () => <PuffLoader color='#093c58' size={60} />;

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

			const [canRender, setCanRender] = useState(false);
			const [hasBeenRendered, setHasBeenRendered] = useState(false);

			const hasInnerBlocks = useRef(null);
			const isChild = useRef(null);

			useEffect(() => {
				const { blockWantsToRender } = dispatch('maxiBlocks');

				blockWantsToRender(uniqueID, clientId);
			}, []);

			useEffect(() => {
				if (canRender && hasBeenRendered) return true;

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

					if (canRender) {
						const { blockHasBeenRendered: getHasBeenRendered } =
							select('maxiBlocks');

						if (
							!hasBeenRendered &&
							!getHasBeenRendered(uniqueID, clientId)
						) {
							const {
								blockHasBeenRendered: setBlockHasBeenRendered,
							} = dispatch('maxiBlocks');

							setBlockHasBeenRendered(uniqueID);
						} else if (
							!hasBeenRendered &&
							getHasBeenRendered(uniqueID, clientId)
						) {
							setHasBeenRendered(true);

							clearInterval(interval);
						}
					}
				}, 10);

				return () => clearInterval(interval);
			});

			if (!canRender) return <ContentLoader />;

			// Ensures child blocks with no inner blocks are rendered immediately.
			if (
				!isNil(isChild.current) &&
				isChild.current &&
				!isNil(hasInnerBlocks.current) &&
				!hasInnerBlocks.current
			)
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
