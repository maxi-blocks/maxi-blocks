/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { Suspense, useState, useEffect } from '@wordpress/element';

const LoadComponent = ({ onUnmount }) => {
	useEffect(() => {
		return onUnmount();
	}, []);

	return null;
};

const withMaxiSuspense = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { clientId } = ownProps;

			const [canRender, setCanRender] = useState(false);
			const [hasBeenRendered, setHasBeenRendered] = useState(false);

			useEffect(() => {
				const { blockWantsToRender } = dispatch('maxiBlocks');

				blockWantsToRender(clientId);
			}, []);

			useEffect(() => {
				if (canRender && hasBeenRendered) return true;

				const interval = setInterval(() => {
					const { canBlockRender } = select('maxiBlocks');

					if (!canRender && canBlockRender(clientId)) {
						setCanRender(true);

						clearInterval(interval);
					}

					if (canRender) {
						const { blockHasBeenRendered: getHasBeenRendered } =
							select('maxiBlocks');

						if (!hasBeenRendered && !getHasBeenRendered(clientId)) {
							const {
								blockHasBeenRendered: setBlockHasBeenRendered,
							} = dispatch('maxiBlocks');

							setBlockHasBeenRendered(clientId);
						} else if (
							!hasBeenRendered &&
							getHasBeenRendered(clientId)
						) {
							setHasBeenRendered(true);

							clearInterval(interval);
						}
					}
				}, 10);

				return () => clearInterval(interval);
			});

			if (!canRender) return null;

			const onUnmount = () => {
				const { blockHasBeenRendered } = dispatch('maxiBlocks');

				blockHasBeenRendered(clientId).then(() => {
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
