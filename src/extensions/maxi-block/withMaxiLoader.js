/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch, useSelect } from '@wordpress/data';
import { createHigherOrderComponent, pure } from '@wordpress/compose';
import {
	useState,
	useEffect,
	useCallback,
	useLayoutEffect,
} from '@wordpress/element';

/**
 * External dependencies
 */
import { PuffLoader } from 'react-spinners';
import { getAttributesValue } from '../attributes';

const sentences = [
	__('Please wait while the minions whip up some magic', 'maxi-blocks'),
	__("Grabbing some extra minions like they're hotcakes", 'maxi-blocks'),
	__("We're working very hard…to look like we're working", 'maxi-blocks'),
	__('Waking up the minions before they mutiny', 'maxi-blocks'),
	__(
		'Getting the minions back on track after their coffee break turned into happy hour',
		'maxi-blocks'
	),
	__('Swapping time and space…because we can', 'maxi-blocks'),
	__("Don't think of purple hippos…", 'maxi-blocks'),
	__(
		"Pay no attention to the person behind the curtain…they're just napping",
		'maxi-blocks'
	),
	__(
		"And enjoy the elevator music…or count how many times you've heard it",
		'maxi-blocks'
	),
	__(
		"Please wait while the little elves build your blocks…sorry, they're unionized",
		'maxi-blocks'
	),
	__(
		"Don't worry, a few bits tried to escape, but we bribed them with chocolate",
		'maxi-blocks'
	),
	__(
		'Checking the gravitational constant in your locale…just in case',
		'maxi-blocks'
	),
	__("At least you're not on hold…yet", 'maxi-blocks'),
	__(
		'The block generator is powered by a hamster on a wheel.',
		'maxi-blocks'
	),
	__('Follow the white rabbit…or just wait patiently', 'maxi-blocks'),
	__(
		'One sec while the satellite moves into position…and the stars align',
		'maxi-blocks'
	),
	__(
		'The bits are flowing slowly today…they need more caffeine',
		'maxi-blocks'
	),
	__(
		'The block generator is powered by a lemon and two wires',
		'maxi-blocks'
	),
	__(
		"It's still faster than you could draw it…unless you're a cheetah",
		'maxi-blocks'
	),
	__("Testing on Timmy…we're going to need more Timmy's", 'maxi-blocks'),
	__("Are we there yet?…nope, but we're enjoying the ride", 'maxi-blocks'),
	__(
		'Counting backwards from infinity…or at least until the coffee is ready',
		'maxi-blocks'
	),
	__(
		"We're baking your blocks…with extra love and a dash of insanity",
		'maxi-blocks'
	),
	__(
		'The minions are on it…as soon as they finish their impromptu dance party.',
		'maxi-blocks'
	),
];

const ContentLoader = () => (
	<div
		style={{
			display: 'flex',
			flexDirection: 'column',
			placeContent: 'center',
			width: '100%',
			height: '100%',
		}}
	>
		<PuffLoader
			color='#ff4a17'
			size={20}
			speedMultiplier={0.8}
			cssOverride={{
				margin: 'auto',
			}}
		/>
		<p style={{ textAlign: 'center' }}>
			{sentences[Math.floor(Math.random() * sentences.length)]}
		</p>
	</div>
);

const SuspendedBlock = ({ onMountBlock, clientId }) => {
	useEffect(() => onMountBlock(), []);

	const { getBlockOrder } = useSelect(
		select => select('core/block-editor'),
		[]
	);

	if (getBlockOrder().indexOf(clientId) === 0) return <ContentLoader />;

	return null;
};

const withMaxiLoader = createHigherOrderComponent(
	WrappedComponent =>
		pure(ownProps => {
			const { clientId, attributes } = ownProps;
			const { uniqueID, isFirstOnHierarchy } = getAttributesValue({
				target: ['uniqueID', 'isFirstOnHierarchy'],
				props: attributes,
			});

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
				if (canRender && hasBeenConsolidated) return;

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
