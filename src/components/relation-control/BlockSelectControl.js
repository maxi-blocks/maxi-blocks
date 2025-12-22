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
 * BlockSelectControl - Custom dropdown with hover events on options
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
	const dropdownRef = useRef(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const selectedOption = options.find(opt => opt.value === value);
	const displayLabel =
		selectedOption?.label || __('Select block…', 'maxi-blocks');

	const classes = classnames(
		'maxi-block-select-control',
		{ 'maxi-block-select-control--new-style': newStyle },
		className
	);

	return (
		<BaseControl label={label} className={classes}>
			<div
				className='maxi-block-select-control__wrapper'
				ref={dropdownRef}
			>
				<button
					type='button'
					className='maxi-block-select-control__trigger'
					onClick={() => setIsOpen(!isOpen)}
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
					<ul className='maxi-block-select-control__dropdown'>
						{options.map((option, index) => (
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
								}}
							>
								{option.label}
							</li>
						))}
					</ul>
				)}
			</div>
		</BaseControl>
	);
};

export default BlockSelectControl;
