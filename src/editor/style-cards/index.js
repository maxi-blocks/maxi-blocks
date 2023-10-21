/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, forwardRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * External dependencies
 */
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const MaxiStyleCardsEditor = loadable(() => import('./maxiStyleCardsEditor'));
const Button = loadable(() => import('../../components/button'));
const Icon = loadable(() => import('../../components/icon'));

/**
 * Styles and icons
 */
import './editor.scss';
import { styleCardMenu } from '../../icons';

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
					ref={settingsRef}
					styleCards={styleCards}
					setIsVisible={setIsVisible}
				/>
			)}
		</>
	);
});

export default MaxiStyleCardsEditorPopUp;
