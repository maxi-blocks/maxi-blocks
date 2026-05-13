/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import { useState, useEffect, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { ContentLoader } from '@components';

const SuspendedBlock = ({ onMountBlock, clientId }) => {
	useEffect(() => onMountBlock(), [onMountBlock]);

	const shouldShowLoader = useSelect(
		select => {
			const block = select('core/block-editor').getBlock(clientId);
			return block?.name?.startsWith('maxi-blocks/') ?? false;
		},
		[clientId]
	);

	if (shouldShowLoader) {
		return <ContentLoader cloud={false} />;
	}

	return null;
};

const withMaxiLoader = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			if (!ownProps) return null;
			const {
				clientId,
				attributes: { uniqueID },
			} = ownProps;

			const { canBlockRender, isPageLoaded } = useSelect(select => {
				const maxiBlocksSelect = select('maxiBlocks');
				return {
					canBlockRender: maxiBlocksSelect.canBlockRender,
					isPageLoaded: maxiBlocksSelect.getIsPageLoaded(),
				};
			}, []);

			const [hasBeenConsolidated, setHasBeenConsolidated] =
				useState(false);

			const initialCanRender = canBlockRender
				? canBlockRender(uniqueID, clientId)
				: false;
			const [canRender, setCanRender] = useState(initialCanRender);

			useEffect(() => {
				if (canRender && hasBeenConsolidated) return;

				let timeoutId;
				let isMounted = true;

				const checkRender = () => {
					if (!isMounted) return; // Prevent execution after unmount

					const canRenderNow = canBlockRender
						? canBlockRender(uniqueID, clientId)
						: false;

					if (canRenderNow && isPageLoaded) {
						setCanRender(true);
						setHasBeenConsolidated(true);
					} else {
						// Only schedule next check if still mounted
						if (isMounted) {
							timeoutId = setTimeout(checkRender, 100);
						}
					}
				};

				checkRender();

				// Cleanup function to prevent memory leaks
				return () => {
					isMounted = false;
					if (timeoutId) {
						clearTimeout(timeoutId);
					}
				};
			}, [
				canRender,
				hasBeenConsolidated,
				canBlockRender,
				uniqueID,
				clientId,
				isPageLoaded,
			]);

			const onMountBlock = useCallback(() => {
				// Block mount callback - no logging needed
			}, []);

			if (!canRender || !hasBeenConsolidated) {
				return (
					<SuspendedBlock
						onMountBlock={onMountBlock}
						clientId={clientId}
					/>
				);
			}

			return <WrappedComponent {...ownProps} />;
		}),
	'withMaxiLoader'
);

export default withMaxiLoader;
