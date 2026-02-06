import { __ } from '@wordpress/i18n';

const LauncherButton = ({ isOpen, onToggle, variant = 'floating' }) => (
	<button
		className={`maxi-ai-launcher maxi-ai-launcher--${variant}${
			isOpen ? ' is-open' : ''
		}`}
		onClick={onToggle}
		type='button'
		aria-pressed={isOpen}
		aria-label={__('Toggle Maxi AI', 'maxi-blocks')}
		title={__('Maxi AI', 'maxi-blocks')}
	>
		+
	</button>
);

export default LauncherButton;

