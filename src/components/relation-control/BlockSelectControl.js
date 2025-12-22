/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect, useCallback } from '@wordpress/element';
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

	// Generate unique IDs for ARIA
	const instanceId = useRef(`block-select-${Math.random().toString(36).substr(2, 9)}`);
	const triggerId = `${instanceId.current}-trigger`;
	const listboxId = `${instanceId.current}-listbox`;

	// Filter options based on search query
	const filteredOptions = options.filter(option =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
				setSearchQuery('');
				setActiveIndex(-1);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Focus search input when dropdown opens, reset active index
	useEffect(() => {
		if (isOpen) {
			if (searchInputRef.current) {
				searchInputRef.current.focus();
			}
			// Set initial active index to selected option or first option
			const selectedIdx = filteredOptions.findIndex(opt => opt.value === value);
			setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
		}
	}, [isOpen]);

	// Update active index when search changes
	useEffect(() => {
		if (isOpen && filteredOptions.length > 0) {
			const selectedIdx = filteredOptions.findIndex(opt => opt.value === value);
			setActiveIndex(selectedIdx >= 0 ? selectedIdx : 0);
		} else if (filteredOptions.length === 0) {
			setActiveIndex(-1);
		}
	}, [searchQuery, filteredOptions.length]);

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
			setSearchQuery('');
			setActiveIndex(-1);
		}
	};

	const handleClose = useCallback(() => {
		setIsOpen(false);
		setSearchQuery('');
		setActiveIndex(-1);
		triggerRef.current?.focus();
	}, []);

	const handleSelect = useCallback((optionValue) => {
		if (onOptionHover && optionValue) {
			onOptionHover(optionValue, false);
		}
		onChange(optionValue);
		handleClose();
	}, [onChange, onOptionHover, handleClose]);

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
	const activeDescendant = activeIndex >= 0 ? getOptionId(activeIndex) : undefined;

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
												onOptionHover(option.value, true);
											}
										}}
										onMouseLeave={() => {
											if (onOptionHover && option.value) {
												onOptionHover(option.value, false);
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
