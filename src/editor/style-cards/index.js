// import {useEffect, useRef, useMemo} from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import MaxiStyleCardsEditor from './maxiStyleCardsEditor';
import { Button, Icon } from '../../components';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleCardMenu } from '../../icons';

const MaxiStyleCardsEditorPopUp = () => {
	const { styleCards } = useSelect(select => {
		const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');

		const styleCards = receiveMaxiStyleCards() || {};

		return { styleCards };
	});

	const [isVisible, setIsVisible] = useState(false);
	// const ref1 = useRef(null);
	// function useIsInViewport(ref) {
	// 	const [isIntersecting, setIsIntersecting] = useState(false);

	// 	const observer = useMemo(
	// 		() =>
	// 			new IntersectionObserver(([entry]) =>
	// 				setIsIntersecting(entry.isIntersecting)
	// 			),
	// 		[]
	// 	);

	// 	useEffect(() => {
	// 		observer.observe(ref.current);

	// 		return () => {
	// 			observer.disconnect();
	// 		};
	// 	}, [ref, observer]);

	// 	return isIntersecting;
	// }

	// const isInViewport1 = useIsInViewport(ref1);
	// console.log('isInViewport1: ', isInViewport1);
	// const ref1 = useRef(null);
	// function elementInViewport(ref) {
	// 	let top = ref.offsetTop;
	// 	let left = ref.offsetLeft;
	// 	const width = ref.offsetWidth;
	// 	const height = ref.offsetHeight;

	// 	while (ref.offsetParent) {
	// 		ref = ref.offsetParent;
	// 		top += ref.offsetTop;
	// 		left += ref.offsetLeft;
	// 	}

	// 	return (
	// 		top >= window.pageYOffset &&
	// 		left >= window.pageXOffset &&
	// 		top + height <= window.pageYOffset + window.innerHeight &&
	// 		left + width <= window.pageXOffset + window.innerWidth
	// 	);
	// }

	// console.log(elementInViewport(ref1));

	return (
		<>
			<Button
				id='maxi-button__go-to-customizer'
				className='action-buttons__button style-card-button'
				aria-label={__('Style cards', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<Icon icon={styleCardMenu} />
				<span>{__('Style cards', 'maxi-blocks')}</span>
			</Button>
			{isVisible && (
				<MaxiStyleCardsEditor
					// ref={ref1}
					styleCards={styleCards}
					setIsVisible={setIsVisible}
				/>
			)}
		</>
	);
};

export default MaxiStyleCardsEditorPopUp;
