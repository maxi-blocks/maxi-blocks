import { __ } from '@wordpress/i18n';
import useAiChat from '../../hooks/useAiChat';

const ChatWindow = ({ isOpen, onClose }) => {
	const {
		messages,
		input,
		setInput,
		isLoading,
		scope,
		sendMessage,
		handleKeyDown,
		handleSuggestion,
		handleUndo,
		handleScopeChange,
		showHistory,
		setShowHistory,
		chatHistory,
		loadChat,
		deleteHistoryItem,
		startNewChat,
		currentChatId,
		position,
		isDragging,
		handleMouseDown,
		selectedBlock,
		getPaletteColors,
		customColors,
		messagesEndRef,
	} = useAiChat({ onClose });

	if (!isOpen) return null;

	return (
		<div
			className={`maxi-ai-chat-panel${isDragging ? ' maxi-ai-chat-panel--dragging' : ''}`}
			style={
				position
					? {
							left: position.x,
							top: position.y,
							bottom: 'auto',
					  }
					: undefined
			}
		>
			<div
				className='maxi-ai-chat-panel__header'
				onMouseDown={handleMouseDown}
				style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
			>
				<h3>
					<span aria-hidden='true'>✨</span>
					{__('Maxi AI', 'maxi-blocks')}
					{selectedBlock &&
						`: ${selectedBlock.name
							.replace('maxi-blocks/', '')
							.replace('-maxi', '')
							.split('-')
							.map(
								word =>
									word.charAt(0).toUpperCase() + word.slice(1)
							)
							.join(' ')}`}
				</h3>
				<div className='maxi-ai-chat-panel__scope-options'>
					<button
						className={`maxi-ai-chat-panel__scope-option ${
							scope === 'page' ? 'is-active' : ''
						}`}
						onClick={() => handleScopeChange('page')}
						title={__(
							'Apply changes to the entire page',
							'maxi-blocks'
						)}
						type='button'
						data-testid='maxi-ai-apply-page'
					>
						{__('Page', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${
							scope === 'selection' ? 'is-active' : ''
						}`}
						onClick={() => handleScopeChange('selection')}
						title={__(
							'Apply changes only to the selected block',
							'maxi-blocks'
						)}
						type='button'
						data-testid='maxi-ai-apply-section'
					>
						{__('Selection', 'maxi-blocks')}
					</button>
					<button
						className={`maxi-ai-chat-panel__scope-option ${
							scope === 'global' ? 'is-active' : ''
						}`}
						onClick={() => handleScopeChange('global')}
						title={__(
							'Apply changes globally via Style Cards',
							'maxi-blocks'
						)}
						type='button'
					>
						{__('Style Card', 'maxi-blocks')}
					</button>
				</div>
				<div className='maxi-ai-chat-panel__header-actions'>
					<button
						className='maxi-ai-chat-panel__icon-btn'
						onClick={startNewChat}
						type='button'
						title={__('New chat', 'maxi-blocks')}
						aria-label={__('New chat', 'maxi-blocks')}
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2.5'
							width='16'
							height='16'
						>
							<path d='M12 5v14M5 12h14' />
						</svg>
					</button>
					<button
						className={`maxi-ai-chat-panel__icon-btn${
							showHistory ? ' is-active' : ''
						}`}
						onClick={() => setShowHistory(v => !v)}
						type='button'
						title={__('Chat history', 'maxi-blocks')}
						aria-label={__('Chat history', 'maxi-blocks')}
					>
						<svg
							viewBox='0 0 24 24'
							fill='none'
							stroke='currentColor'
							strokeWidth='2'
							width='16'
							height='16'
						>
							<circle cx='12' cy='12' r='9' />
							<path d='M12 7v5l3 3' />
						</svg>
					</button>
					<button
						className='maxi-ai-chat-panel__close'
						onClick={onClose}
						type='button'
						aria-label={__('Close', 'maxi-blocks')}
					>
						&#x2715;
					</button>
				</div>
			</div>

			{showHistory && (
				<div className='maxi-ai-chat-panel__history'>
					<div className='maxi-ai-chat-panel__history-header'>
						{__('Recent chats', 'maxi-blocks')}
					</div>
					{chatHistory.length === 0 ? (
						<div className='maxi-ai-chat-panel__history-empty'>
							{__('No previous chats', 'maxi-blocks')}
						</div>
					) : (
						chatHistory.map(entry => (
							<div
								key={entry.id}
								className={`maxi-ai-chat-panel__history-item${
									entry.id === currentChatId
										? ' is-current'
										: ''
								}`}
								onClick={() => loadChat(entry)}
								role='button'
								tabIndex={0}
								onKeyDown={e =>
									e.key === 'Enter' && loadChat(entry)
								}
							>
								<div className='maxi-ai-chat-panel__history-item-title'>
									{entry.title}
								</div>
								<div className='maxi-ai-chat-panel__history-item-date'>
									{new Date(
										entry.timestamp
									).toLocaleDateString()}
								</div>
								<button
									className='maxi-ai-chat-panel__history-item-delete'
									onClick={e =>
										deleteHistoryItem(entry.id, e)
									}
									title={__('Delete', 'maxi-blocks')}
									type='button'
								>
									&#x2715;
								</button>
							</div>
						))
					)}
				</div>
			)}

			<div className='maxi-ai-chat-panel__messages'>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`maxi-ai-chat-panel__message maxi-ai-chat-panel__message--${
							msg.role
						}${
							msg.isError
								? ' maxi-ai-chat-panel__message--error'
								: ''
						}`}
						data-testid={msg.testId}
					>
						{msg.content}
						{msg.options && (
							<div
								style={{
									display: 'flex',
									gap: '8px',
									marginTop: '8px',
									flexWrap: 'wrap',
								}}
							>
								{msg.optionsType === 'palette' ? (
									<>
										{getPaletteColors().map((color, i) => (
											<button
												key={`std-${i}`}
												onClick={() =>
													handleSuggestion(
														`Color ${i + 1}`
													)
												}
												className='maxi-ai-chat-panel__palette-swatch'
												style={{
													backgroundColor: color,
												}}
												title={`Color ${i + 1}`}
												type='button'
											/>
										))}
										{customColors &&
											customColors.length > 0 &&
											customColors.map(cc => (
												<button
													key={`custom-${cc.id}`}
													onClick={() =>
														handleSuggestion(
															`Color ${cc.id}`
														)
													}
													className='maxi-ai-chat-panel__palette-swatch maxi-ai-chat-panel__palette-swatch--custom'
													style={{
														backgroundColor:
															cc.value,
													}}
													title={
														cc.name ||
														`Custom Color ${cc.id}`
													}
													type='button'
												/>
											))}
									</>
								) : (
									msg.options.map((opt, i) => (
										<button
											key={i}
											onClick={() =>
												handleSuggestion(opt)
											}
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
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									marginTop: '4px',
								}}
							>
								<span style={{ fontSize: '11px', opacity: 0.8 }}>
									{msg.undone
										? ' ' + __('Undone', 'maxi-blocks')
										: '✓ ' + __('Applied', 'maxi-blocks')}
								</span>
								{!msg.undone && (
									<button
										className='maxi-ai-chat-panel__undo'
										onClick={handleUndo}
										title={__(
											'Undo changes',
											'maxi-blocks'
										)}
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
					<div
						className='maxi-ai-chat-panel__message maxi-ai-chat-panel__message--assistant'
						data-testid='maxi-ai-loading'
					>
						<div className='maxi-ai-chat-panel__typing'>
							<span />
							<span />
							<span />
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			<div className='maxi-ai-chat-panel__input-area'>
				<input
					type='text'
					className='maxi-ai-chat-panel__input'
					placeholder={
						selectedBlock
							? __('Ask Maxi...', 'maxi-blocks')
							: __('How can I help?', 'maxi-blocks')
					}
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={isLoading}
					data-testid='maxi-ai-prompt'
				/>
				<button
					className='maxi-ai-chat-panel__send'
					onClick={sendMessage}
					disabled={isLoading || !input.trim()}
					type='button'
					aria-label={__('Send', 'maxi-blocks')}
					data-testid='maxi-ai-send'
				>
					<svg
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
					>
						<path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default ChatWindow;
