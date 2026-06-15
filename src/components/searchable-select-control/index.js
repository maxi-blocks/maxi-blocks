/**
 * WordPress dependencies
 */
import {
	useCallback,
	useEffect,
	useId,
	useMemo,
	useRef,
	useState,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty, isPlainObject } from 'lodash';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import ResetButton from '@components/reset-control';

/**
 * Styles
 */
import './editor.scss';

const flattenOptions = options => {
	if (!isPlainObject(options)) {
		return (options || []).filter(option => option !== undefined);
	}

	return Object.entries(options).flatMap(([groupLabel, groupOptions]) =>
		groupOptions
			.filter(option => option !== undefined)
			.map(option => ({
				...option,
				groupLabel: groupLabel || option.groupLabel,
			}))
	);
};

const getFilteredOptions = (options, searchQuery = '') => {
	const normalizedSearch = searchQuery.toLowerCase().trim();

	if (!normalizedSearch) return options;

	return options.filter(option =>
		[option.label, option.value, option.groupLabel, option.searchLabel]
			.filter(Boolean)
			.some(optionValue =>
				String(optionValue).toLowerCase().includes(normalizedSearch)
			)
	);
};

const SearchableSelectControl = ({
	help,
	label,
	onChange,
	onReset,
	options = [],
	className,
	hideLabelFromVision,
	value,
	defaultValue,
	newStyle = false,
	placeholder = __('Search options...', 'maxi-blocks'),
	__nextHasNoMarginBottom,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(-1);
	const dropdownRef = useRef(null);
	const searchInputRef = useRef(null);
	const triggerRef = useRef(null);
	const instanceId = useId();
	const id = `inspector-searchable-select-control-${instanceId}`;
	const listboxId = `${id}-listbox`;

	const flatOptions = useMemo(() => flattenOptions(options), [options]);
	const selectedValue = value ?? defaultValue ?? flatOptions[0]?.value;
	const selectedOption = flatOptions.find(
		option => option.value === selectedValue
	);

	const filteredOptions = useMemo(() => {
		return getFilteredOptions(flatOptions, searchQuery);
	}, [flatOptions, searchQuery]);

	const closeDropdown = useCallback(
		({ restoreFocus } = { restoreFocus: true }) => {
			setIsOpen(false);
			setSearchQuery('');
			setActiveIndex(-1);

			if (restoreFocus) triggerRef.current?.focus();
		},
		[]
	);

	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				closeDropdown({ restoreFocus: false });
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [closeDropdown]);

	useEffect(() => {
		if (!isOpen) return;

		searchInputRef.current?.focus();

		const selectedIndex = filteredOptions.findIndex(
			option => option.value === selectedValue
		);

		setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
	}, [filteredOptions, isOpen, selectedValue]);

	const selectOption = useCallback(
		option => {
			if (!option || option.disabled) return;

			onChange(option.value);
			closeDropdown();
		},
		[closeDropdown, onChange]
	);

	const handleSearchKeyDown = event => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				setActiveIndex(currentIndex =>
					Math.min(currentIndex + 1, filteredOptions.length - 1)
				);
				break;
			case 'ArrowUp':
				event.preventDefault();
				setActiveIndex(currentIndex => Math.max(currentIndex - 1, 0));
				break;
			case 'Home':
				event.preventDefault();
				setActiveIndex(filteredOptions.length ? 0 : -1);
				break;
			case 'End':
				event.preventDefault();
				setActiveIndex(
					filteredOptions.length ? filteredOptions.length - 1 : -1
				);
				break;
			case 'Enter':
				event.preventDefault();
				selectOption(filteredOptions[activeIndex]);
				break;
			case 'Escape':
				event.preventDefault();
				closeDropdown();
				break;
			case 'Tab':
				closeDropdown({ restoreFocus: false });
				break;
			default:
				break;
		}
	};

	const classes = classnames(
		'maxi-searchable-select-control',
		{ 'maxi-searchable-select-control__second-style': newStyle },
		className
	);

	if (isEmpty(flatOptions)) return null;

	return (
		<BaseControl
			__nextHasNoMarginBottom={__nextHasNoMarginBottom}
			label={label}
			hideLabelFromVision={hideLabelFromVision}
			id={id}
			help={help}
			className={classes}
		>
			<div
				className='maxi-searchable-select-control__wrapper'
				ref={dropdownRef}
			>
				<button
					ref={triggerRef}
					id={id}
					type='button'
					className='maxi-searchable-select-control__trigger'
					onClick={() => setIsOpen(!isOpen)}
					aria-expanded={isOpen}
					aria-haspopup='listbox'
					aria-controls={isOpen ? listboxId : undefined}
				>
					<span className='maxi-searchable-select-control__trigger-label'>
						{selectedOption?.label || __('Select...', 'maxi-blocks')}
					</span>
					<span
						className='maxi-searchable-select-control__trigger-arrow'
						aria-hidden='true'
					/>
				</button>
				{isOpen && (
					<div className='maxi-searchable-select-control__dropdown'>
						<input
							ref={searchInputRef}
							type='text'
							className='maxi-searchable-select-control__search-input'
							placeholder={placeholder}
							aria-label={placeholder}
							value={searchQuery}
							onChange={event => setSearchQuery(event.target.value)}
							onKeyDown={handleSearchKeyDown}
						/>
						<ul
							id={listboxId}
							className='maxi-searchable-select-control__options'
							role='listbox'
							aria-label={label}
						>
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => (
									<li
										key={`${option.label}-${option.value}-${index}`}
										role='option'
										data-value={option.value}
										aria-selected={option.value === selectedValue}
										className={classnames(
											'maxi-searchable-select-control__option',
											{
												'maxi-searchable-select-control__option--selected':
													option.value === selectedValue,
												'maxi-searchable-select-control__option--active':
													index === activeIndex,
												'maxi-searchable-select-control__option--disabled':
													option.disabled,
											},
											option.className
										)}
										onMouseEnter={() => setActiveIndex(index)}
										onClick={() => selectOption(option)}
									>
										<span className='maxi-searchable-select-control__option-label'>
											{option.label}
										</span>
										{option.groupLabel && (
											<span className='maxi-searchable-select-control__option-group'>
												{option.groupLabel}
											</span>
										)}
									</li>
								))
							) : (
								<li className='maxi-searchable-select-control__empty'>
									{__('No matching options', 'maxi-blocks')}
								</li>
							)}
						</ul>
					</div>
				)}
			</div>
			{onReset && (
				<ResetButton onReset={() => onReset()} />
			)}
		</BaseControl>
	);
};

export { flattenOptions };
export { getFilteredOptions };
export default SearchableSelectControl;
