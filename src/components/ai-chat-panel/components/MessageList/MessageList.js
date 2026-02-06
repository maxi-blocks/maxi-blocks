import { __ } from '@wordpress/i18n';

const MessageList = ({
	messages = [],
	isLoading = false,
	onSuggestion,
	onUndo,
	paletteColors = [],
	customColors = [],
	endRef,
}) => (
	<div className='maxi-ai-chat-panel__messages'>
		{messages.map((msg, index) => (
			<div
				key={index}
				className={`maxi-ai-chat-panel__message maxi-ai-chat-panel__message--${msg.role}${
					msg.isError ? ' maxi-ai-chat-panel__message--error' : ''
				}`}
			>
				{msg.content}
				{msg.options && (
					<div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
						{msg.optionsType === 'palette' ? (
							<>
								{paletteColors.map((color, i) => (
									<button
										key={`std-${i}`}
										onClick={() => onSuggestion?.(`Color ${i + 1}`)}
										className='maxi-ai-chat-panel__palette-swatch'
										style={{ backgroundColor: color }}
										title={`Color ${i + 1}`}
										type='button'
									/>
								))}
								{customColors.map(custom => (
									<button
										key={`custom-${custom.id}`}
										onClick={() => onSuggestion?.(`Color ${custom.id}`)}
										className='maxi-ai-chat-panel__palette-swatch maxi-ai-chat-panel__palette-swatch--custom'
										style={{ backgroundColor: custom.value }}
										title={custom.name || `Custom Color ${custom.id}`}
										type='button'
									/>
								))}
							</>
						) : (
							msg.options.map((opt, i) => (
								<button
									key={i}
									onClick={() => onSuggestion?.(opt)}
									className='maxi-ai-chat-panel__option-button'
									type='button'
								>
									{opt}
								</button>
							))
						)}
					</div>
				)}
				{msg.executed && (
					<div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
						<span style={{ fontSize: '11px', opacity: 0.8 }}>
							{msg.undone ? `Undo: ${__('Undone', 'maxi-blocks')}` : `OK: ${__('Applied', 'maxi-blocks')}`}
						</span>
						{!msg.undone && (
							<button
								className='maxi-ai-chat-panel__undo'
								onClick={onUndo}
								title={__('Undo changes', 'maxi-blocks')}
								type='button'
							>
								{__('Undo', 'maxi-blocks')}
							</button>
						)}
					</div>
				)}
			</div>
		))}
		{isLoading && (
			<div className='maxi-ai-chat-panel__message maxi-ai-chat-panel__message--assistant'>
				<div className='maxi-ai-chat-panel__typing'>
					<span />
					<span />
					<span />
				</div>
			</div>
		)}
		<div ref={endRef} />
	</div>
);

export default MessageList;

