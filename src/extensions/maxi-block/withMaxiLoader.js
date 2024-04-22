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
import { ContentLoader } from '../../components';
import { getSiteEditorPreviewIframes } from '../fse';

const SuspendedBlock = ({ onMountBlock, clientId }) => {
	useEffect(() => onMountBlock(), [onMountBlock]);

	const { getBlocks } = useSelect(select => {
		const { getBlocks } = select('core/block-editor');
		return { getBlocks };
	}, []);

	const getAllMaxiBlocks = blocks => {
		let maxiBlocks = [];

		blocks.forEach(block => {
			if (block.name.includes('maxi-blocks')) {
				maxiBlocks.push(block);
			}

			// Check for Reusable blocks that might contain maxi-blocks
			if (block.name === 'core/block' && block.innerBlocks.length > 0) {
				maxiBlocks = maxiBlocks.concat(
					getAllMaxiBlocks(block.innerBlocks)
				);
			}

			if (block.innerBlocks && block.innerBlocks.length > 0) {
				maxiBlocks = maxiBlocks.concat(
					getAllMaxiBlocks(block.innerBlocks)
				);
			}
		});

		return maxiBlocks;
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
			const siteEditorPreviewIframes = getSiteEditorPreviewIframes();
			if (siteEditorPreviewIframes.length > 0)
				return <WrappedComponent {...ownProps} />;
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
			}, []);

			const [canRender, setCanRender] = useState(
				canBlockRender(uniqueID, clientId)
			);

			useEffect(() => {
				if (canRender && hasBeenConsolidated) return () => {};

				const interval = setInterval(() => {
					if (canBlockRender(uniqueID, clientId)) {
						setCanRender(true);
						setHasBeenConsolidated(true);
						clearInterval(interval);
					}
				}, 100);

				return () => clearInterval(interval);
			});

			const onMountBlock = useCallback(() => {
				setHasBeenConsolidated(true);
				setCanRender(true);
			}, []);

			if (canRender && hasBeenConsolidated)
				return <WrappedComponent {...ownProps} />;

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
