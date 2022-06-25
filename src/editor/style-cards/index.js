/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { Button, Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { DotTip } from '@wordpress/nux';

/**
 * Internal dependencies
 */
import MaxiStyleCardsEditor from './maxiStyleCardsEditor';

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

	return (
		<>
			<Button
				id='maxi-button__go-to-customizer'
				className='action-buttons__button style-card-button'
				aria-label={__('Style card manager', 'maxi-blocks')}
				onClick={() => setIsVisible(!isVisible)}
			>
				<DotTip tipId='guide/sc'>
					Change global colours using the Style Cards manager. You can
					change the card whenever you want.
				</DotTip>
				<Icon icon={styleCardMenu} />
				<span>{__('Style card manager', 'maxi-blocks')}</span>
			</Button>
			{isVisible && (
				<MaxiStyleCardsEditor
					styleCards={styleCards}
					setIsVisible={setIsVisible}
				/>
			)}
		</>
	);
};

export default MaxiStyleCardsEditorPopUp;
