/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import MaxiStyleCardsEditor from './maxiStyleCardsEditor';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleCardBoat } from '../../icons';

const MaxiStyleCardsEditorPopUp = () => {
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
				aria-label={__('Style Card Editor', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<Icon icon={styleCardBoat} />
				<span>{__('Style Card Editor', 'maxi-blocks')}</span>
			</Button>
			{isVisible && <MaxiStyleCardsEditor styleCards={styleCards} />}
		</>
	);
};

export default MaxiStyleCardsEditorPopUp;
