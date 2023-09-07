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
	useEffect(() => onMountBlock(), []);

	const { getBlockOrder } = useSelect(
		select => select('core/block-editor'),
		[]
	);

	if (getBlockOrder().indexOf(clientId) === 0)
		return <ContentLoader cloud={false} />;

	return null;
};

const withMaxiLoader = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const {
				clientId,
				attributes: { uniqueID, isFirstOnHierarchy },
			} = ownProps;

			const { canBlockRender, getIsPageLoaded } = useSelect(
				select => select('maxiBlocks'),
				[]
			);

			if (!isFirstOnHierarchy) return <WrappedComponent {...ownProps} />;

			const { blockWantsToRender, setIsPageLoaded } =
				useDispatch('maxiBlocks');

			useLayoutEffect(() => {
				blockWantsToRender(uniqueID, clientId);
			}, []);

			const [canRender, setCanRender] = useState(
				canBlockRender(uniqueID, clientId) || getIsPageLoaded()
			);
			const [hasBeenConsolidated, setHasBeenConsolidated] =
				useState(false);

			useEffect(() => {
				if (canRender && hasBeenConsolidated) return () => {};

				const interval = setInterval(async () => {
					if (getIsPageLoaded()) {
						setCanRender(true);
						setHasBeenConsolidated(true);

						clearInterval(interval);
					} else if (
						!canRender &&
						canBlockRender(uniqueID, clientId)
					) {
						setCanRender(true);

						clearInterval(interval);
					}
				}, 100);

				// Sorry linter, we can't be always consistent 🤷
				// eslint-disable-next-line consistent-return
				return () => clearInterval(interval);
			});

			const onMountBlock = useCallback(() => {
				setHasBeenConsolidated(true);

				if (!getIsPageLoaded()) setIsPageLoaded(true);
			});

			if (canRender && (hasBeenConsolidated || getIsPageLoaded()))
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
