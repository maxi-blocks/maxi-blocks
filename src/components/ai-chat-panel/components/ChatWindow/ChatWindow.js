import { __ } from '@wordpress/i18n';
import { useCallback, useEffect, useRef, useState } from '@wordpress/element';
import HeaderBar from '../HeaderBar';
import MessageList from '../MessageList';
import Composer from '../Composer';
import { clampPosition } from '../../hooks/useDraggable';
import { usePersistentState } from '../../hooks/usePersistentState';

const DEFAULT_MESSAGES = [
	{
		role: 'assistant',
		content: __('Hi! Ask Maxi AI for help with this page.', 'maxi-blocks'),
	},
];

const ChatWindow = ({
	isOpen = true,
	onClose,
	selectedBlockName,
	initialMessages = DEFAULT_MESSAGES,
}) => {
	const [messages, setMessages] = useState(initialMessages);
	const [input, setInput] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [scope, setScope] = useState('page');

	const [position, setPosition] = usePersistentState(
		'maxi-ai-chat-position',
		null
	);
	const [isDragging, setIsDragging] = useState(false);
	const dragOffset = useRef({ x: 0, y: 0 });
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages, isLoading]);

	const handleMouseDown = useCallback(
		event => {
			if (event.target.closest('button')) return;
			setIsDragging(true);
			const panelRect = event.currentTarget
				.closest('.maxi-ai-chat-panel')
				.getBoundingClientRect();
			dragOffset.current = {
				x: event.clientX - panelRect.left,
				y: event.clientY - panelRect.top,
			};
			event.preventDefault();
		},
		[]
	);

	const handleMouseMove = useCallback(
		event => {
			if (!isDragging) return;
			const newX = event.clientX - dragOffset.current.x;
			const newY = event.clientY - dragOffset.current.y;

			const maxX = window.innerWidth - 100;
			const maxY = window.innerHeight - 50;

			const next = clampPosition(
				{ x: newX, y: newY },
				{ minX: 0, minY: 0, maxX, maxY }
			);
			setPosition(next);
		},
		[isDragging, setPosition]
	);

	const handleMouseUp = useCallback(() => {
		setIsDragging(false);
	}, []);

	useEffect(() => {
		if (!isDragging) return undefined;
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const handleSend = useCallback(() => {
		if (!input.trim()) return;
		const nextMessage = { role: 'user', content: input.trim() };
		setMessages(prev => [...prev, nextMessage]);
		setInput('');
		setIsLoading(true);

		setTimeout(() => {
			setMessages(prev => [
				...prev,
				{
					role: 'assistant',
					content: __('Got it. Working on that now.', 'maxi-blocks'),
					executed: true,
				},
			]);
			setIsLoading(false);
		}, 400);
	}, [input]);

	const handleSuggestion = suggestion => {
		setInput(suggestion);
	};

	const handleUndo = () => {
		setMessages(prev => {
			const updated = [...prev];
			for (let i = updated.length - 1; i >= 0; i -= 1) {
				if (updated[i].role === 'assistant' && updated[i].executed && !updated[i].undone) {
					updated[i].undone = true;
					break;
				}
			}
			return updated;
		});
	};

	if (!isOpen) return null;

	return (
		<div
			className={`maxi-ai-chat-panel${
				isDragging ? ' maxi-ai-chat-panel--dragging' : ''
			}`}
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
			<HeaderBar
				selectedBlockName={selectedBlockName}
				scope={scope}
				onScopeChange={setScope}
				onClose={onClose}
				onMouseDown={handleMouseDown}
				isDragging={isDragging}
			/>
			<MessageList
				messages={messages}
				isLoading={isLoading}
				onSuggestion={handleSuggestion}
				onUndo={handleUndo}
				endRef={messagesEndRef}
			/>
			<Composer
				input={input}
				onInputChange={setInput}
				onSend={handleSend}
				isLoading={isLoading}
				placeholder={
					selectedBlockName
						? __('Ask Maxi...', 'maxi-blocks')
						: __('How can I help?', 'maxi-blocks')
				}
			/>
		</div>
	);
};

export default ChatWindow;

