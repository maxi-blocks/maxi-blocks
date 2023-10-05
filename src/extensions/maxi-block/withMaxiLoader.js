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

const SuspendedBlock = ({ onMountBlock, clientId }) => {
	useEffect(() => onMountBlock(), [onMountBlock]);

	const { getBlock, getBlocks } = useSelect(select => {
		const { getBlock, getBlocks } = select('core/block-editor');
		return { getBlock, getBlocks };
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

	const excludedBlocks = [
		'maxi-blocks/container-maxi',
		'maxi-blocks/group-maxi',
	];

	const shouldShowLoader = maxiBlocks.some(block => {
		return (
			block.clientId === clientId && !excludedBlocks.includes(block.name)
		);
	});

	if (shouldShowLoader) {
		return <ContentLoader cloud={false} />;
	}

	return null;
};

const withMaxiLoader = createHigherOrderComponent(
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

			// If you want the loader for all blocks, we can remove this line
			// if (!isFirstOnHierarchy) return <WrappedComponent {...ownProps} />;

			const { blockWantsToRender } = useDispatch('maxiBlocks');

			useLayoutEffect(() => {
				blockWantsToRender(uniqueID, clientId);
			}, []);

			const [canRender, setCanRender] = useState(
				canBlockRender(uniqueID, clientId)
			);

			useEffect(() => {
				if (canRender) return () => {};

				const interval = setInterval(() => {
					if (canBlockRender(uniqueID, clientId)) {
						setCanRender(true);
						clearInterval(interval);
					}
				}, 100);

				return () => clearInterval(interval);
			});

			const onMountBlock = useCallback(() => {
				setCanRender(true);
			}, []);

			if (canRender) return <WrappedComponent {...ownProps} />;

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
