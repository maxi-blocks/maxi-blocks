import { __ } from '@wordpress/i18n';

const formatBlockLabel = name => {
	if (!name) return '';
	return (
		': ' +
		String(name)
			.replace('maxi-blocks/', '')
			.replace('-maxi', '')
			.split('-')
			.map(word => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ')
	);
};

const HeaderBar = ({
	title = __('Maxi AI', 'maxi-blocks'),
	selectedBlockName,
	scope = 'page',
	onScopeChange,
	onClose,
	onMouseDown,
	isDragging,
}) => (
	<div
		className='maxi-ai-chat-panel__header'
		onMouseDown={onMouseDown}
		style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
	>
		<h3>
			<span>*</span>
			{title}
			{selectedBlockName && formatBlockLabel(selectedBlockName)}
		</h3>
		<div className='maxi-ai-chat-panel__scope-options'>
			<button
				className={`maxi-ai-chat-panel__scope-option ${
					scope === 'page' ? 'is-active' : ''
				}`}
				onClick={() => onScopeChange?.('page')}
				title={__('Apply changes to the entire page', 'maxi-blocks')}
				type='button'
			>
				{__('Page', 'maxi-blocks')}
			</button>
			<button
				className={`maxi-ai-chat-panel__scope-option ${
					scope === 'selection' ? 'is-active' : ''
				}`}
				onClick={() => onScopeChange?.('selection')}
				title={__('Apply changes only to the selected block', 'maxi-blocks')}
				type='button'
			>
				{__('Selection', 'maxi-blocks')}
			</button>
		</div>
		<button
			className='maxi-ai-chat-panel__close'
			onClick={onClose}
			type='button'
			aria-label={__('Close', 'maxi-blocks')}
		>
			X
		</button>
	</div>
);

export default HeaderBar;

