import { __ } from '@wordpress/i18n';

const Composer = ({
	input = '',
	onInputChange,
	onSend,
	isLoading = false,
	placeholder,
}) => {
	const handleKeyDown = event => {
		if (event.key === 'Enter' && !event.shiftKey) {
			event.preventDefault();
			onSend?.();
		}
	};

	return (
		<div className='maxi-ai-chat-panel__input-area'>
			<input
				type='text'
				className='maxi-ai-chat-panel__input'
				placeholder={placeholder || __('How can I help?', 'maxi-blocks')}
				value={input}
				onChange={event => onInputChange?.(event.target.value)}
				onKeyDown={handleKeyDown}
				disabled={isLoading}
			/>
			<button
				className='maxi-ai-chat-panel__send'
				onClick={onSend}
				disabled={isLoading || !input.trim()}
				type='button'
				aria-label={__('Send', 'maxi-blocks')}
			>
				<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
					<path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
				</svg>
			</button>
		</div>
	);
};

export default Composer;

