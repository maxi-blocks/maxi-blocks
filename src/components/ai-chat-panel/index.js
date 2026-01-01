/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { cloneDeep } from 'lodash';

/**
 * Internal dependencies
 */
import './editor.scss';

const SYSTEM_PROMPT = `You are Maxi AI, an assistant for MaxiBlocks.
Help the user edit their page.

You have access to these specific tools to make changes. Respond with a JSON object calling one of these actions:

1. Change Background Color:
{ "action": "set_background_color", "color": "#0000FF" }
(Use hex codes. If user says "blue", use #0000FF. If "red", #FF0000, etc.)

2. Change Text Color:
{ "action": "set_text_color", "color": "#FF0000" }

3. Change Padding:
{ "action": "set_padding", "value": 20 }
(Number only, sets equality for all sides)

4. Change Font Size:
{ "action": "set_font_size", "value": 24 }

5. Generic Block Update (fallback for other attributes):
{ "action": "update_block", "attributes": { "key": "value" } }

6. Message (if no action needed):
{ "action": "message", "content": "I can help with that..." }

Rules:
- Respond ONLY with JSON.
- Do not explain the JSON.
- If the user asks for "blue background", respond with the JSON for set_background_color.
`;

const AIChatPanel = ({ isOpen, onClose }) => {
	const [messages, setMessages] = useState([
		{
			role: 'assistant',
			content: __('Hi! Select a block and tell me what to change. Try "Make background blue" or "Add 50px padding".', 'maxi-blocks'),
		},
	]);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const selectedBlock = useSelect(
		select => select('core/block-editor').getSelectedBlock(),
		[]
	);

	const { updateBlockAttributes } = useDispatch('core/block-editor');

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	// Smart Handlers for MaxiBlocks Logic
	const handleSetBackgroundColor = (clientId, color, currentAttributes) => {
		const newAttributes = {};
		
		// 1. Set general background color (for simple blocks)
		newAttributes['background-color-general'] = color;
		newAttributes['background-palette-status-general'] = false;
		newAttributes['background-active-media-general'] = 'color';

		// 2. Handle complex background-layers (for Container/Row blocks)
		if (currentAttributes['background-layers'] && Array.isArray(currentAttributes['background-layers'])) {
			const layers = cloneDeep(currentAttributes['background-layers']);
			// Find existing color layer or creating one is complex, usually the first layer is color or can be used as color
			// We update the first layer to be our color layer
			if (layers.length > 0) {
				layers[0].type = 'color';
				layers[0]['background-color-general'] = color;
				layers[0]['background-palette-status-general'] = false;
				
				// Ensure it is visible
				layers[0]['display-general'] = 'block';
				
				newAttributes['background-layers'] = layers;
			}
		}

		updateBlockAttributes(clientId, newAttributes);
		return __('Background color updated.', 'maxi-blocks');
	};

	const handleSetTextColor = (clientId, color) => {
		updateBlockAttributes(clientId, {
			'color-general': color,
			'palette-status-general': false, // Disable palette to use custom color
		});
		return __('Text color updated.', 'maxi-blocks');
	};

	const handleSetPadding = (clientId, value) => {
		const valStr = String(value);
		updateBlockAttributes(clientId, {
			'padding-top-general': valStr,
			'padding-bottom-general': valStr,
			'padding-left-general': valStr,
			'padding-right-general': valStr,
			'padding-sync-general': true, // Ensure sync is on
		});
		return __('Padding updated.', 'maxi-blocks');
	};

	const handleSetFontSize = (clientId, value) => {
		updateBlockAttributes(clientId, {
			'font-size-general': Number(value),
			'typography-unit-general': 'px',
		});
		return __('Font size updated.', 'maxi-blocks');
	};

	const parseAndExecuteAction = async responseText => {
		console.log('AI Response:', responseText);
		
		try {
			let action;
			try {
				action = JSON.parse(responseText.trim());
			} catch {
				const jsonMatch = responseText.match(/\{[\s\S]*\}/);
				if (jsonMatch) {
					action = JSON.parse(jsonMatch[0]);
				}
			}

			if (!action || !action.action) {
				return { executed: false, message: responseText };
			}

			if (action.action === 'message') {
				return { executed: false, message: action.content };
			}

			if (!selectedBlock?.clientId) {
				return {
					executed: false,
					message: __('Please select a block first.', 'maxi-blocks'),
				};
			}

			let resultMsg = 'Action executed.';
			const attrs = selectedBlock.attributes;

			switch (action.action) {
				case 'set_background_color':
					resultMsg = handleSetBackgroundColor(selectedBlock.clientId, action.color, attrs);
					break;
				case 'set_text_color':
					resultMsg = handleSetTextColor(selectedBlock.clientId, action.color);
					break;
				case 'set_padding':
					resultMsg = handleSetPadding(selectedBlock.clientId, action.value);
					break;
				case 'set_font_size':
					resultMsg = handleSetFontSize(selectedBlock.clientId, action.value);
					break;
				case 'update_block':
					if (action.attributes) {
						updateBlockAttributes(selectedBlock.clientId, action.attributes);
						resultMsg = __('Block settings updated.', 'maxi-blocks');
					}
					break;
				default:
					return { executed: false, message: __('Unknown action.', 'maxi-blocks') };
			}

			return {
				executed: true,
				message: resultMsg,
			};

		} catch (e) {
			console.error('Parse error:', e);
			return { executed: false, message: __('Error parsing AI response.', 'maxi-blocks') };
		}
	};

	const sendMessage = async () => {
		if (!input.trim() || isLoading) return;

		const userMessage = input.trim();
		setInput('');
		setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
		setIsLoading(true);

		try {
			let context = '';
			if (selectedBlock) {
				context = `\n\nUser has selected: ${selectedBlock.name}\nAttributes: ${JSON.stringify(selectedBlock.attributes, null, 2)}`;
			} else {
				context = '\n\nNo block is currently selected.';
			}

			const response = await fetch(`${window.wpApiSettings?.root || '/wp-json/'}maxi-blocks/v1.0/ai/chat`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...(window.wpApiSettings?.nonce ? { 'X-WP-Nonce': window.wpApiSettings.nonce } : {}),
				},
				body: JSON.stringify({
					messages: [
						{ role: 'system', content: SYSTEM_PROMPT },
						{ role: 'system', content: 'Context: ' + context },
						...messages.filter(m => m.role !== 'assistant' || !m.executed).slice(-6).map(m => ({ 
							role: m.role === 'assistant' ? 'assistant' : 'user', 
							content: m.content 
						})),
						{ role: 'user', content: userMessage },
					],
					model: 'gpt-4o-mini',
					temperature: 0.2, // Low temperature for consistent JSON
					streaming: false,
				}),
			});

			if (!response.ok) {
				throw new Error(await response.text());
			}

			const data = await response.json();
			const assistantContent = data?.choices?.[0]?.message?.content || __('Sorry, I couldn\'t process that.', 'maxi-blocks');

			const { executed, message } = await parseAndExecuteAction(assistantContent);

			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: message,
					executed,
				},
			]);
		} catch (error) {
			console.error('AI Chat error:', error);
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: __('Error: Please check your OpenAI API key in Maxi AI settings.', 'maxi-blocks'),
					isError: true,
				},
			]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const handleSuggestion = suggestion => {
		setInput(suggestion);
	};

	const suggestions = [
		__('Make background blue', 'maxi-blocks'),
		__('Increase font size', 'maxi-blocks'),
		__('Add 50px padding', 'maxi-blocks'),
		__('Change text color to red', 'maxi-blocks'),
	];

	if (!isOpen) return null;

	return (
		<div className='maxi-ai-chat-panel'>
			<div className='maxi-ai-chat-panel__header'>
				<h3>
					<span>✨</span>
					{__('Maxi AI v2', 'maxi-blocks')}
					{selectedBlock && (
						<span style={{ fontSize: '11px', fontWeight: 'normal', opacity: 0.7, marginLeft: '8px' }}>
							{selectedBlock.name.replace('maxi-blocks/', '')}
						</span>
					)}
				</h3>
				<button className='maxi-ai-chat-panel__close' onClick={onClose}>
					×
				</button>
			</div>

			<div className='maxi-ai-chat-panel__messages'>
				{messages.map((msg, index) => (
					<div
						key={index}
						className={`maxi-ai-chat-panel__message maxi-ai-chat-panel__message--${msg.role}${msg.isError ? ' maxi-ai-chat-panel__message--error' : ''}`}
					>
						{msg.content}
						{msg.executed && (
							<span style={{ display: 'block', fontSize: '11px', marginTop: '4px', opacity: 0.8 }}>
								✓ {__('Applied', 'maxi-blocks')}
							</span>
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
				<div ref={messagesEndRef} />
			</div>

			{messages.length === 1 && (
				<div className='maxi-ai-chat-panel__suggestions'>
					{suggestions.map((suggestion, index) => (
						<button
							key={index}
							className='maxi-ai-chat-panel__suggestion'
							onClick={() => handleSuggestion(suggestion)}
						>
							{suggestion}
						</button>
					))}
				</div>
			)}

			<div className='maxi-ai-chat-panel__input-area'>
				<input
					type='text'
					className='maxi-ai-chat-panel__input'
					placeholder={selectedBlock ? __('Ask Maxi...', 'maxi-blocks') : __('Select a block first...', 'maxi-blocks')}
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					disabled={isLoading}
				/>
				<button
					className='maxi-ai-chat-panel__send'
					onClick={sendMessage}
					disabled={isLoading || !input.trim()}
				>
					<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
						<path d='M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z' />
					</svg>
				</button>
			</div>
		</div>
	);
};

export default AIChatPanel;
