/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, forwardRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import MaxiStyleCardsEditor from './maxiStyleCardsEditor';
import Button from '@components/button';
import Icon from '@components/icon';
import applyHeadingPaletteColor from '@extensions/style-cards/applyHeadingPaletteColor';

/**
 * Styles and icons
 */
import './editor.scss';
import { styleCardMenu } from '@maxi-icons';

const MaxiStyleCardsEditorPopUp = forwardRef((props, settingsRef) => {
	const { styleCards } = useSelect(select => {
		const { receiveMaxiStyleCards } = select('maxiBlocks/style-cards');

		const styleCards = receiveMaxiStyleCards() || {};

		return { styleCards };
	});

	const [isVisible, setIsVisible] = useState(false);

	const focusHeadingsGlobals = (headingLevel = 'h1') => {
		const headingAccordion = document.querySelector(
			'.maxi-blocks-sc__type--heading'
		);
		if (!headingAccordion) return false;

		const headingButton = headingAccordion.querySelector(
			'.maxi-accordion-control__item__button'
		);
		// Only click if accordion is closed (aria-expanded not true)
		if (headingButton && headingButton.getAttribute('aria-expanded') !== 'true') {
			headingButton.click();
		}

		const headingPanel = headingAccordion.querySelector(
			'.maxi-accordion-control__item__panel'
		);
		if (!headingPanel) return false;

		const tabButton = headingPanel.querySelector(
			`.maxi-tabs-control__button-${headingLevel.toLowerCase()}`
		);
		if (tabButton) {
			tabButton.click();
			return true;
		}

		return false;
	};

	useEffect(() => {
		window.maxiBlocksOpenStyleCardsEditor = (options = {}) => {
			setIsVisible(true);

			if (options.applyHeadingPaletteColor) {
				applyHeadingPaletteColor({
					headingLevel: options.applyHeadingLevel ?? options.headingLevel ?? 'all',
				});
			}

			if (options.focusHeadingsGlobals) {
				const { headingLevel = 'h1', delay = 300 } = options;
				setTimeout(() => {
					focusHeadingsGlobals(headingLevel);
				}, delay);
			}
		};
		window.maxiBlocksCloseStyleCardsEditor = () => setIsVisible(false);

		return () => {
			delete window.maxiBlocksOpenStyleCardsEditor;
			delete window.maxiBlocksCloseStyleCardsEditor;
		};
	}, []);

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
