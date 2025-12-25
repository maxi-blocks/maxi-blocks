/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, forwardRef, lazy, Suspense } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
// import MaxiStyleCardsEditor from './maxiStyleCardsEditor';
import Button from '@components/button';
import Icon from '@components/icon';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleCardMenu } from '@maxi-icons';

const MaxiStyleCardsEditor = lazy(() => import('./maxiStyleCardsEditor'));

const MaxiStyleCardsEditorPopUp = forwardRef((props, settingsRef) => {
	const { styleCards } = useSelect(select => {
		const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');

		const styleCards = receiveMaxiStyleCards() || {};

		return { styleCards };
	});

	const [isVisible, setIsVisible] = useState(false);

	return (
		<>
			<Button
				id='maxi-button__style-cards'
				className='action-buttons__button style-card-button'
				aria-label={__('Style cards', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<Icon icon={styleCardMenu} />
				<span>{__('Style cards', 'maxi-blocks')}</span>
			</Button>
			{isVisible && (
				<Suspense fallback={null}>
					<MaxiStyleCardsEditor
						ref={settingsRef}
						styleCards={styleCards}
						setIsVisible={setIsVisible}
					/>
				</Suspense>
			)}
		</>
	);
});

export default MaxiStyleCardsEditorPopUp;
