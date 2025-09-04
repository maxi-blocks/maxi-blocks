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

	const { getBlocks } = useSelect(select => {
		const { getBlocks } = select('core/block-editor');
		return { getBlocks };
	}, []);

	const getAllMaxiBlocks = blocks => {
		return blocks.reduce((maxiBlocks, block) => {
			if (block.name.includes('maxi-blocks')) {
				maxiBlocks.push(block);
			}

			if (block.innerBlocks?.length) {
				maxiBlocks.push(...getAllMaxiBlocks(block.innerBlocks));
			}

			return maxiBlocks;
		}, []);
	};

	const allBlocks = getBlocks();
	const maxiBlocks = getAllMaxiBlocks(allBlocks);

	const shouldShowLoader = maxiBlocks.some(block => {
		return block.clientId === clientId;
	});

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

				const checkRender = () => {
					const canRenderNow = canBlockRender
						? canBlockRender(uniqueID, clientId)
						: false;

					if (canRenderNow && isPageLoaded) {
						setCanRender(true);
						setHasBeenConsolidated(true);
					} else {
						setTimeout(checkRender, 100);
					}
				};

				checkRender();
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
