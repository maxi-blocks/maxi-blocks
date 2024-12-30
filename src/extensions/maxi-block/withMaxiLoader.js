/**
 * WordPress dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
} from '@wordpress/element';

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

			const { canBlockRender } = useSelect(
				select => select('maxiBlocks'),
				[]
			);

			const [hasBeenConsolidated, setHasBeenConsolidated] =
				useState(false);
			const { blockWantsToRender } = useDispatch('maxiBlocks');

			useLayoutEffect(() => {
				blockWantsToRender(uniqueID, clientId);
			}, [blockWantsToRender, uniqueID, clientId]);

			const [canRender, setCanRender] = useState(
				canBlockRender(uniqueID, clientId)
			);

			useEffect(() => {
				if (canRender && hasBeenConsolidated) return;

				const checkRender = () => {
					if (canBlockRender(uniqueID, clientId)) {
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
			]);

			const onMountBlock = useCallback(() => {
				setHasBeenConsolidated(true);
				setCanRender(true);
			}, []);

			if (canRender && hasBeenConsolidated) {
				return <WrappedComponent {...ownProps} />;
			}

			return (
				<SuspendedBlock
					onMountBlock={onMountBlock}
					clientId={clientId}
				/>
			);
		}),
	'withMaxiLoader'
);

export default withMaxiLoader;
