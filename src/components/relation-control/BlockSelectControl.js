/**
 * WordPress dependencies
 */
import {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';

/**
 * BlockSelectControl - Accessible custom dropdown with hover events and search
 */
const BlockSelectControl = ({
	label,
	value,
	options = [],
	onChange,
	onOptionHover,
	className,
	newStyle = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(-1);
	const dropdownRef = useRef(null);
	const searchInputRef = useRef(null);
	const triggerRef = useRef(null);
	const listRef = useRef(null);
	const lastHoveredValue = useRef(null);

	// Generate unique IDs for ARIA
	const instanceId = useRef(
		`block-select-${Math.random().toString(36).substr(2, 9)}`
	);
	const triggerId = `${instanceId.current}-trigger`;
	const listboxId = `${instanceId.current}-listbox`;

	const filteredOptions = useMemo(
		() =>
			options.filter(option =>
				option.label.toLowerCase().includes(searchQuery.toLowerCase())
			),
		[options, searchQuery]
	);

	const clearHover = useCallback(() => {
		if (onOptionHover && lastHoveredValue.current) {
			onOptionHover(lastHoveredValue.current, false);
			lastHoveredValue.current = null;
		}
	}, [onOptionHover]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				clearHover();
				setIsOpen(false);
				setSearchQuery('');
				setActiveIndex(-1);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [clearHover]);

	// Focus search input when dropdown opens, reset active index
	useEffect(() => {
		if (isOpen) {
			if (searchInputRef.current) {
				searchInputRef.current.focus();
			}
			// Set initial active index to selected option or first option
			const selectedIdx = filteredOptions.findIndex(
				opt => opt.value === value
			);
			setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
		}
	}, [isOpen, filteredOptions, value]);

	// Update active index when search changes
	useEffect(() => {
		if (isOpen && filteredOptions.length > 0) {
			const selectedIdx = filteredOptions.findIndex(
				opt => opt.value === value
			);
			setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
		} else if (filteredOptions.length === 0) {
			setActiveIndex(-1);
		}
	}, [isOpen, filteredOptions, value]);

	useEffect(() => {
		if (!isOpen) return;

		if (
			lastHoveredValue.current &&
			!filteredOptions.find(
				option => option.value === lastHoveredValue.current
			)
		) {
			clearHover();
		}
	}, [filteredOptions, isOpen, clearHover]);

	const selectedOption = options.find(opt => opt.value === value);
	const displayLabel =
		selectedOption?.label || __('Select block…', 'maxi-blocks');

	const classes = classnames(
		'maxi-block-select-control',
		{ 'maxi-block-select-control--new-style': newStyle },
		className
	);

	const handleToggle = () => {
		const newIsOpen = !isOpen;
		setIsOpen(newIsOpen);
		if (!newIsOpen) {
			clearHover();
			setSearchQuery('');
			setActiveIndex(-1);
		}
	};

	const handleClose = useCallback(() => {
		clearHover();
		setIsOpen(false);
		setSearchQuery('');
		setActiveIndex(-1);
		triggerRef.current?.focus();
	}, [clearHover]);

	const handleSelect = useCallback(
		optionValue => {
			clearHover();
			onChange(optionValue);
			handleClose();
		},
		[onChange, handleClose, clearHover]
	);

	// Keyboard handler for the trigger button
	const handleTriggerKeyDown = event => {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
				}
				break;
			case 'Enter':
			case ' ':
				event.preventDefault();
				handleToggle();
				break;
			case 'Escape':
				if (isOpen) {
					event.preventDefault();
					handleClose();
				}
				break;
		}
	};

	// Keyboard handler for search input and list navigation
	const handleSearchKeyDown = event => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				setActiveIndex(prev =>
					prev < filteredOptions.length - 1 ? prev + 1 : prev
				);
				break;
			case 'ArrowUp':
				event.preventDefault();
				setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
				break;
			case 'Enter':
				event.preventDefault();
				if (activeIndex >= 0 && filteredOptions[activeIndex]) {
					handleSelect(filteredOptions[activeIndex].value);
				}
				break;
			case 'Escape':
				event.preventDefault();
				handleClose();
				break;
			case 'Tab':
				handleClose();
				break;
		}
	};

	// Get the active descendant ID
	const getOptionId = index => `${instanceId.current}-option-${index}`;
	const activeDescendant =
		activeIndex >= 0 ? getOptionId(activeIndex) : undefined;

	return (
		<BaseControl label={label} className={classes}>
			<div
				className='maxi-block-select-control__wrapper'
				ref={dropdownRef}
			>
				<button
					ref={triggerRef}
					id={triggerId}
					type='button'
					className='maxi-block-select-control__trigger'
					onClick={handleToggle}
					onKeyDown={handleTriggerKeyDown}
					aria-expanded={isOpen}
					aria-haspopup='listbox'
					aria-controls={isOpen ? listboxId : undefined}
				>
					<span className='maxi-block-select-control__trigger-label'>
						{displayLabel}
					</span>
					<span className='maxi-block-select-control__trigger-arrow'>
						▾
					</span>
				</button>
				{isOpen && (
					<div className='maxi-block-select-control__dropdown'>
						<div className='maxi-block-select-control__search'>
							<input
								ref={searchInputRef}
								type='text'
								className='maxi-block-select-control__search-input'
								placeholder={__('Search blocks…', 'maxi-blocks')}
								aria-label={__('Search blocks…', 'maxi-blocks')}
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								onKeyDown={handleSearchKeyDown}
								onClick={e => e.stopPropagation()}
								role='combobox'
								aria-expanded={isOpen}
								aria-controls={listboxId}
								aria-activedescendant={activeDescendant}
								aria-autocomplete='list'
							/>
						</div>
						<ul
							ref={listRef}
							id={listboxId}
							className='maxi-block-select-control__options'
							role='listbox'
							aria-label={label}
							onMouseLeave={clearHover}
						>
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => (
									<li
										key={option.value || `fallback-${index}`}
										id={getOptionId(index)}
										role='option'
										aria-selected={option.value === value}
										className={classnames(
											'maxi-block-select-control__option',
											{
												'maxi-block-select-control__option--selected':
													option.value === value,
												'maxi-block-select-control__option--active':
													index === activeIndex,
											}
										)}
										onMouseEnter={() => {
											setActiveIndex(index);
											if (onOptionHover && option.value) {
												lastHoveredValue.current = option.value;
												onOptionHover(option.value, true);
											}
										}}
										onMouseLeave={() => {
											if (onOptionHover && option.value) {
												onOptionHover(option.value, false);
											}
											if (lastHoveredValue.current === option.value) {
												lastHoveredValue.current = null;
											}
										}}
										onClick={() => handleSelect(option.value)}
									>
										{option.label}
									</li>
								))
							) : (
								<li
									className='maxi-block-select-control__no-results'
									role='option'
									aria-disabled='true'
								>
									{__('No blocks found', 'maxi-blocks')}
								</li>
							)}
						</ul>
					</div>
				)}
			</div>
		</BaseControl>
	);
};

export default BlockSelectControl;
