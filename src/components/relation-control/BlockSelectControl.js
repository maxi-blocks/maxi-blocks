/**
 * WordPress dependencies
 */
import { useState, useRef, useEffect } from '@wordpress/element';
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
 * BlockSelectControl - Custom dropdown with hover events and search functionality
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
	const dropdownRef = useRef(null);
	const searchInputRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
				setSearchQuery(''); // Clear search when closing
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Focus search input when dropdown opens
	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isOpen]);

	const selectedOption = options.find(opt => opt.value === value);
	const displayLabel =
		selectedOption?.label || __('Select block…', 'maxi-blocks');

	// Filter options based on search query
	const filteredOptions = options.filter(option =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const classes = classnames(
		'maxi-block-select-control',
		{ 'maxi-block-select-control--new-style': newStyle },
		className
	);

	const handleToggle = () => {
		setIsOpen(!isOpen);
		if (isOpen) {
			setSearchQuery(''); // Clear search when closing
		}
	};

	return (
		<BaseControl label={label} className={classes}>
			<div
				className='maxi-block-select-control__wrapper'
				ref={dropdownRef}
			>
				<button
					type='button'
					className='maxi-block-select-control__trigger'
					onClick={handleToggle}
					aria-expanded={isOpen}
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
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								onClick={e => e.stopPropagation()}
							/>
						</div>
						<ul className='maxi-block-select-control__options'>
							{filteredOptions.length > 0 ? (
								filteredOptions.map((option, index) => (
									<li
										key={`${option.value}-${index}`}
										className={classnames(
											'maxi-block-select-control__option',
											{
												'maxi-block-select-control__option--selected':
													option.value === value,
											}
										)}
										onMouseEnter={() => {
											if (onOptionHover && option.value) {
												onOptionHover(option.value, true);
											}
										}}
										onMouseLeave={() => {
											if (onOptionHover && option.value) {
												onOptionHover(option.value, false);
											}
										}}
										onClick={() => {
											if (onOptionHover && option.value) {
												onOptionHover(option.value, false);
											}
											onChange(option.value);
											setIsOpen(false);
											setSearchQuery('');
										}}
									>
										{option.label}
									</li>
								))
							) : (
								<li className='maxi-block-select-control__no-results'>
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
