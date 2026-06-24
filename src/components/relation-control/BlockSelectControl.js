/**
 * WordPress dependencies
 */
import {
	useState,
	useRef,
	useEffect,
	useCallback,
	useMemo,
	useId,
	Fragment,
} from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import BaseControl from '@components/base-control';
import { debugPreview as debugRelationPreview } from '@extensions/relations/debugPreview';

const getColumnKey = (groupLabel, columnLabel) =>
	`${groupLabel || 'blocks'}::${columnLabel}`;

const getEventTargetDebug = target => ({
	nodeName: target?.nodeName,
	className:
		typeof target?.className === 'string'
			? target.className
			: target?.className?.baseVal || '',
	text: target?.textContent?.trim?.().slice(0, 80) || '',
});

const getSelectedGroupKey = option => option.groupLabel || 'blocks';

const hasOwnProperty = (object, key) =>
	Object.prototype.hasOwnProperty.call(object, key);

const getExpandedState = ({ overrides, defaults, key }) =>
	hasOwnProperty(overrides, key) ? overrides[key] : !!defaults[key];

const getSelectedVisibleIndex = (visibleOptions, selectedValues) => {
	const selectedIndex = visibleOptions.findIndex(option =>
		selectedValues.includes(option.value)
	);

	return selectedIndex >= 0
		? selectedIndex
		: visibleOptions.length
		? 0
		: -1;
};

const getOptionTypeLabel = option =>
	option.blockTypeLabel
		? sprintf(__('%s block', 'maxi-blocks'), option.blockTypeLabel)
		: __('Block type', 'maxi-blocks');

const getSearchCountLabel = count =>
	count === 1
		? __('1 block found', 'maxi-blocks')
		: sprintf(__('%d blocks found', 'maxi-blocks'), count);

const renderCurrentBadge = () => (
	<span className='maxi-block-select-control__current-badge'>
		{__('Current', 'maxi-blocks')}
	</span>
);

/**
 * BlockSelectControl - Accessible custom dropdown with hover events and search
 */
const BlockSelectControl = ({
	label,
	value,
	options = [],
	onChange,
	onOptionHover,
	onOptionReveal,
	className,
	newStyle = false,
	multiple = false,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeIndex, setActiveIndex] = useState(-1);
	const [expandedGroups, setExpandedGroups] = useState({});
	const [expandedColumns, setExpandedColumns] = useState({});
	const dropdownRef = useRef(null);
	const searchInputRef = useRef(null);
	const triggerRef = useRef(null);
	const listRef = useRef(null);
	const lastHoveredValue = useRef(null);

	// Generate unique IDs for ARIA
	const instanceId = useId();
	const triggerId = `${instanceId}-trigger`;
	const listboxId = `${instanceId}-listbox`;

	const selectedValues = useMemo(() => {
		if (multiple) {
			if (Array.isArray(value)) return value.filter(Boolean);
			return value ? [value] : [];
		}

		return value ? [value] : [];
	}, [multiple, value]);

	const debugDropdown = useCallback(
		(event, details = {}) => {
			debugRelationPreview(
				`relation-control:block-select:${event}`,
				{
					instanceId,
					label,
					multiple,
					isOpen,
					searchQuery,
					selectedValues,
					expandedGroups,
					expandedColumns,
					...details,
				}
			);
		},
		[
			expandedColumns,
			expandedGroups,
			instanceId,
			isOpen,
			label,
			multiple,
			searchQuery,
			selectedValues,
		]
	);

	useEffect(() => {
		debugDropdown('mount');

		return () => {
			debugDropdown('unmount');
		};
	}, []);

	const selectableOptions = useMemo(
		() => (multiple ? options.filter(option => option.value) : options),
		[multiple, options]
	);

	const filteredOptions = useMemo(
		() =>
			selectableOptions.filter(option => {
				const normalizedSearchQuery = searchQuery.toLowerCase();

				return [
					option.label,
					option.groupLabel,
					option.columnLabel,
				].some(value =>
					String(value || '')
						.toLowerCase()
						.includes(normalizedSearchQuery)
				);
			}),
		[selectableOptions, searchQuery]
	);

	const optionGroups = useMemo(
		() =>
			filteredOptions.reduce((groups, option) => {
				const groupLabel = option.groupLabel || '';
				const lastGroup = groups[groups.length - 1];
				let group;

				if (lastGroup?.label === groupLabel) {
					group = lastGroup;
					group.value = group.value || option.groupValue || '';
					group.hoverValue =
						group.hoverValue || option.groupHoverValue || '';
					lastGroup.isCurrentGroup =
						lastGroup.isCurrentGroup || !!option.isCurrentGroup;
				} else {
					group = {
						label: groupLabel,
						value: option.groupValue || '',
						hoverValue: option.groupHoverValue || '',
						columns: [],
						isCurrentGroup: !!option.isCurrentGroup,
					};
					groups.push(group);
				}

				const columnLabel = option.columnLabel || '';
				const lastColumn = group.columns[group.columns.length - 1];

				if (lastColumn?.label === columnLabel) {
					lastColumn.options.push(option);
					lastColumn.value =
						lastColumn.value || option.columnValue || '';
					lastColumn.hoverValue =
						lastColumn.hoverValue || option.columnHoverValue || '';
					lastColumn.isCurrentColumn =
						lastColumn.isCurrentColumn || !!option.isCurrentColumn;
					return groups;
				}

				group.columns.push({
					label: columnLabel,
					value: option.columnValue || '',
					hoverValue: option.columnHoverValue || '',
					options: [option],
					isCurrentColumn: !!option.isCurrentColumn,
				});

				return groups;
			}, []),
		[filteredOptions]
	);

	const defaultExpandedGroups = useMemo(
		() =>
			optionGroups.reduce((acc, group) => {
				if (group.label && group.isCurrentGroup)
					acc[group.label] = true;
				return acc;
			}, {}),
		[optionGroups]
	);

	const defaultExpandedColumns = useMemo(
		() =>
			optionGroups.reduce((acc, group) => {
				group.columns.forEach(column => {
					if (column.label && column.isCurrentColumn) {
						acc[getColumnKey(group.label, column.label)] = true;
					}
				});

				return acc;
			}, {}),
		[optionGroups]
	);

	const isGroupExpanded = useCallback(
		groupLabel => {
			if (!groupLabel || searchQuery) return true;

			return getExpandedState({
				overrides: expandedGroups,
				defaults: defaultExpandedGroups,
				key: groupLabel,
			});
		},
		[defaultExpandedGroups, expandedGroups, searchQuery]
	);

	const isColumnExpanded = useCallback(
		(groupLabel, columnLabel) => {
			if (!columnLabel || searchQuery) return true;

			const columnKey = getColumnKey(groupLabel, columnLabel);

			return getExpandedState({
				overrides: expandedColumns,
				defaults: defaultExpandedColumns,
				key: columnKey,
			});
		},
		[defaultExpandedColumns, expandedColumns, searchQuery]
	);

	const visibleOptions = useMemo(
		() =>
			optionGroups.reduce((options, group) => {
				if (!isGroupExpanded(group.label)) return options;

				return group.columns.reduce(
					(acc, column) =>
						isColumnExpanded(group.label, column.label)
							? [...acc, ...column.options]
							: acc,
					options
				);
			}, []),
		[isColumnExpanded, isGroupExpanded, optionGroups]
	);

	const visibleOptionIndexes = useMemo(
		() =>
			visibleOptions.reduce((acc, option, index) => {
				acc.set(option.value, index);
				return acc;
			}, new Map()),
		[visibleOptions]
	);

	const clearHover = useCallback(() => {
		if (onOptionHover && lastHoveredValue.current) {
			onOptionHover(lastHoveredValue.current, false);
			lastHoveredValue.current = null;
		}
	}, [onOptionHover]);

	const handleHover = useCallback(
		(optionValue, isHighlighting) => {
			if (!onOptionHover || !optionValue) return;

			if (isHighlighting) {
				if (
					lastHoveredValue.current &&
					lastHoveredValue.current !== optionValue
				) {
					onOptionHover(lastHoveredValue.current, false);
				}

				lastHoveredValue.current = optionValue;
				onOptionHover(optionValue, true);
				return;
			}

			onOptionHover(optionValue, false);
			if (lastHoveredValue.current === optionValue) {
				lastHoveredValue.current = null;
			}
		},
		[onOptionHover]
	);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (!isOpen) return;

			const isInside =
				dropdownRef.current &&
				dropdownRef.current.contains(event.target);

			debugDropdown('document-mousedown', {
				isInside,
				willClose: !isInside,
				target: getEventTargetDebug(event.target),
			});

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
	}, [clearHover, debugDropdown, isOpen]);

	useEffect(() => {
		debugDropdown('open-state');
	}, [debugDropdown, isOpen]);

	// Focus search input when dropdown opens and keep the active option aligned.
	useEffect(() => {
		if (!isOpen) return;

		searchInputRef.current?.focus();
		setActiveIndex(getSelectedVisibleIndex(visibleOptions, selectedValues));
	}, [isOpen, selectedValues, visibleOptions]);

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
	const selectedOptions = options.filter(option =>
		selectedValues.includes(option.value)
	);
	const selectedOptionGroups = useMemo(
		() =>
			selectedOptions.reduce((groups, option) => {
				const groupLabel = option.groupLabel || '';
				const groupKey = getSelectedGroupKey(option);
				const existingGroup = groups.find(
					group => group.key === groupKey
				);

				if (existingGroup) {
					existingGroup.options.push(option);
					return groups;
				}

				groups.push({
					key: groupKey,
					label: groupLabel,
					options: [option],
				});

				return groups;
			}, []),
		[selectedOptions]
	);
	const displayLabel = multiple
		? selectedOptions.length
			? `${selectedOptions.length} ${
					selectedOptions.length === 1
						? __('block selected', 'maxi-blocks')
						: __('blocks selected', 'maxi-blocks')
			  }`
			: __('Add blocks...', 'maxi-blocks')
		: selectedOption?.label || __('Select block…', 'maxi-blocks');

	const classes = classnames(
		'maxi-block-select-control',
		{ 'maxi-block-select-control--new-style': newStyle },
		className
	);

	const handleToggle = () => {
		const newIsOpen = !isOpen;
		debugDropdown('toggle', {
			nextIsOpen: newIsOpen,
		});
		setIsOpen(newIsOpen);
		if (!newIsOpen) {
			clearHover();
			setSearchQuery('');
			setActiveIndex(-1);
		}
	};

	const handleOpen = useCallback(() => {
		debugDropdown('open');
		setIsOpen(true);
		setSearchQuery('');
		searchInputRef.current?.focus();
	}, [debugDropdown]);

	const handleClose = useCallback(
		({ restoreFocus = true, reason } = {}) => {
			debugDropdown('close', {
				reason,
				restoreFocus,
			});
			clearHover();
			setIsOpen(false);
			setSearchQuery('');
			setActiveIndex(-1);
			if (restoreFocus) {
				triggerRef.current?.focus();
			}
		},
		[clearHover, debugDropdown]
	);

	const toggleGroup = useCallback(
		groupLabel => {
			setExpandedGroups(prev => {
				const currentlyExpanded = getExpandedState({
					overrides: prev,
					defaults: defaultExpandedGroups,
					key: groupLabel,
				});

				return {
					...prev,
					[groupLabel]: !currentlyExpanded,
				};
			});
			debugDropdown('toggle-group', {
				groupLabel,
			});
		},
		[debugDropdown, defaultExpandedGroups]
	);

	const revealOption = useCallback(
		optionValue => {
			if (!onOptionReveal || !optionValue) return;
			onOptionReveal(optionValue);
		},
		[onOptionReveal]
	);

	const toggleColumn = useCallback(
		(groupLabel, columnLabel) => {
			const columnKey = getColumnKey(groupLabel, columnLabel);

			setExpandedColumns(prev => {
				const currentlyExpanded = getExpandedState({
					overrides: prev,
					defaults: defaultExpandedColumns,
					key: columnKey,
				});

				return {
					...prev,
					[columnKey]: !currentlyExpanded,
				};
			});
			debugDropdown('toggle-column', {
				groupLabel,
				columnLabel,
				columnKey,
			});
		},
		[debugDropdown, defaultExpandedColumns]
	);

	const handleSelect = useCallback(
		optionValue => {
			clearHover();
			const option = selectableOptions.find(
				item => item.value === optionValue
			);
			if (multiple) {
				const nextValue = selectedValues.includes(optionValue)
					? selectedValues.filter(item => item !== optionValue)
					: [...selectedValues, optionValue];

				debugDropdown('select', {
					optionValue,
					option,
					nextValue,
					willClose: false,
				});
				onChange(nextValue);
				setIsOpen(true);
				return;
			}

			debugDropdown('select', {
				optionValue,
				option,
				nextValue: optionValue,
				willClose: true,
			});
			onChange(optionValue);
			handleClose({ reason: 'single-select' });
		},
		[
			clearHover,
			debugDropdown,
			handleClose,
			multiple,
			onChange,
			selectableOptions,
			selectedValues,
		]
	);

	const handleRemoveSelected = useCallback(
		optionValue => {
			clearHover();
			if (onOptionHover) onOptionHover(optionValue, false);
			onChange(selectedValues.filter(item => item !== optionValue));
		},
		[clearHover, onChange, onOptionHover, selectedValues]
	);

	const handleClearSelected = useCallback(() => {
		clearHover();
		onChange([]);
	}, [clearHover, onChange]);

	// Keyboard handler for the trigger button
	const handleTriggerKeyDown = event => {
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
			case 'Home':
			case 'End':
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
			default:
				break;
		}
	};

	const setActiveOption = useCallback(
		index => {
			setActiveIndex(index);
		},
		[setActiveIndex]
	);

	// Keyboard handler for search input and list navigation
	const handleSearchKeyDown = event => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				setActiveOption(
					activeIndex < visibleOptions.length - 1
						? activeIndex + 1
						: activeIndex
				);
				break;
			case 'ArrowUp':
				event.preventDefault();
				setActiveOption(
					activeIndex > 0 ? activeIndex - 1 : activeIndex
				);
				break;
			case 'Home':
				event.preventDefault();
				setActiveOption(visibleOptions.length ? 0 : -1);
				break;
			case 'End':
				event.preventDefault();
				setActiveOption(
					visibleOptions.length ? visibleOptions.length - 1 : -1
				);
				break;
			case 'Enter':
				event.preventDefault();
				if (activeIndex >= 0 && visibleOptions[activeIndex]) {
					handleSelect(visibleOptions[activeIndex].value);
				}
				break;
			case 'Escape':
				event.preventDefault();
				handleClose();
				break;
			case 'Tab':
				handleClose({ restoreFocus: false });
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (!isOpen || !onOptionHover) return;

		const activeOption = visibleOptions[activeIndex];
		if (!activeOption?.value) return;

		handleHover(activeOption.hoverValue || activeOption.value, true);
	}, [activeIndex, handleHover, isOpen, onOptionHover, visibleOptions]);

	// Get the active descendant ID
	const getOptionId = index => `${instanceId}-option-${index}`;
	const activeDescendant =
		activeIndex >= 0 ? getOptionId(activeIndex) : undefined;
	const isSelected = optionValue => selectedValues.includes(optionValue);

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
				{multiple && selectedOptions.length > 0 && (
					<div className='maxi-block-select-control__selected'>
						{selectedOptionGroups.map(group => (
							<div
								key={group.key}
								className='maxi-block-select-control__selected-group'
							>
								{group.label && (
									<div className='maxi-block-select-control__selected-group-label'>
										{group.label}
									</div>
								)}
								<div className='maxi-block-select-control__selected-group-items'>
									{group.options.map(option => (
										<span
											key={option.value}
											className='maxi-block-select-control__selected-item'
											onMouseEnter={() =>
												handleHover(
													option.hoverValue ||
														option.value,
													true
												)
											}
											onMouseLeave={() =>
												handleHover(
													option.hoverValue ||
														option.value,
													false
												)
											}
										>
											<button
												type='button'
												className='maxi-block-select-control__selected-locate'
												title={sprintf(
													__(
														'Find %s on canvas',
														'maxi-blocks'
													),
													option.label
												)}
												aria-label={sprintf(
													__(
														'Find %s on canvas',
														'maxi-blocks'
													),
													option.label
												)}
												onMouseDown={event => {
													event.preventDefault();
													event.stopPropagation();
												}}
												onClick={event => {
													event.stopPropagation();
													revealOption(
														option.hoverValue ||
															option.value
													);
												}}
											>
												<span className='maxi-block-select-control__selected-label'>
													{option.label}
												</span>
											</button>
											<button
												type='button'
												className='maxi-block-select-control__selected-remove'
												title={__(
													'Remove target',
													'maxi-blocks'
												)}
												aria-label={sprintf(
													__(
														'Remove %s',
														'maxi-blocks'
													),
													option.label
												)}
												onMouseDown={event => {
													event.preventDefault();
													event.stopPropagation();
												}}
												onClick={event => {
													event.stopPropagation();
													handleRemoveSelected(
														option.value
													);
												}}
											>
												x
											</button>
										</span>
									))}
								</div>
							</div>
						))}
						<div className='maxi-block-select-control__selected-actions'>
							<button
								type='button'
								className='maxi-block-select-control__selected-add'
								aria-label={__(
									'Add blocks to interaction',
									'maxi-blocks'
								)}
								onClick={event => {
									event.stopPropagation();
									handleOpen();
								}}
							>
								<span
									className='maxi-block-select-control__selected-add-icon'
									aria-hidden='true'
								>
									+
								</span>
								<span>{__('Add blocks', 'maxi-blocks')}</span>
							</button>
							{selectedOptions.length > 1 && (
								<button
									type='button'
									className='maxi-block-select-control__selected-clear'
									onClick={event => {
										event.stopPropagation();
										handleClearSelected();
									}}
								>
									{__('Clear all', 'maxi-blocks')}
								</button>
							)}
						</div>
					</div>
				)}
				{isOpen && (
					<div className='maxi-block-select-control__dropdown'>
						<div className='maxi-block-select-control__search'>
							<input
								ref={searchInputRef}
								type='text'
								className='maxi-block-select-control__search-input'
								placeholder={__(
									'Search blocks…',
									'maxi-blocks'
								)}
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
							<button
								type='button'
								className='maxi-block-select-control__close'
								title={__('Close block picker', 'maxi-blocks')}
								aria-label={__(
									'Close block picker',
									'maxi-blocks'
								)}
								onMouseDown={event => {
									event.preventDefault();
									event.stopPropagation();
								}}
								onClick={event => {
									event.stopPropagation();
									handleClose({ reason: 'close-button' });
								}}
							/>
							<div className='maxi-block-select-control__search-count'>
								{getSearchCountLabel(filteredOptions.length)}
							</div>
						</div>
						<ul
							ref={listRef}
							id={listboxId}
							className='maxi-block-select-control__options'
							role='listbox'
							aria-label={label}
							aria-multiselectable={multiple || undefined}
							onMouseLeave={clearHover}
						>
							{filteredOptions.length > 0 ? (
								optionGroups.map((group, groupIndex) => {
									const groupExpanded = isGroupExpanded(
										group.label
									);

									return (
										<Fragment
											key={`${
												group.label || 'blocks'
											}-${groupIndex}`}
										>
											{group.label && (
												<li
													className='maxi-block-select-control__option-group'
													role='presentation'
												>
													<button
														type='button'
														className='maxi-block-select-control__option-group-button'
														aria-expanded={
															groupExpanded
														}
														onClick={event => {
															event.stopPropagation();
															revealOption(
																group.hoverValue ||
																	group.value
															);
															toggleGroup(
																group.label
															);
														}}
														onMouseEnter={() =>
															handleHover(
																group.hoverValue ||
																	group.value,
																true
															)
														}
														onMouseLeave={() =>
															handleHover(
																group.hoverValue ||
																	group.value,
																false
															)
														}
													>
														<span className='maxi-block-select-control__option-group-content'>
															<span className='maxi-block-select-control__option-group-label'>
																{group.label}
															</span>
															{group.isCurrentGroup && (
																<span className='maxi-block-select-control__option-meta'>
																	{renderCurrentBadge()}
																</span>
															)}
														</span>
														<span
															className='maxi-block-select-control__option-group-arrow'
															aria-hidden='true'
														/>
													</button>
												</li>
											)}
											{groupExpanded &&
												group.columns.map(
													(column, columnIndex) => {
														const columnExpanded =
															isColumnExpanded(
																group.label,
																column.label
															);

														return (
															<Fragment
																key={`${
																	column.label ||
																	'blocks'
																}-${columnIndex}`}
															>
																{column.label && (
																	<li
																		className='maxi-block-select-control__option-column'
																		role='presentation'
																	>
																		<button
																			type='button'
																			className='maxi-block-select-control__option-column-button'
																			aria-expanded={
																				columnExpanded
																			}
																			onClick={event => {
																				event.stopPropagation();
																				revealOption(
																					column.hoverValue ||
																						column.value
																				);
																				toggleColumn(
																					group.label,
																					column.label
																				);
																			}}
																			onMouseEnter={() =>
																				handleHover(
																					column.hoverValue ||
																						column.value,
																					true
																				)
																			}
																			onMouseLeave={() =>
																				handleHover(
																					column.hoverValue ||
																						column.value,
																					false
																				)
																			}
																		>
																			<span className='maxi-block-select-control__option-column-content'>
																				<span className='maxi-block-select-control__option-column-label'>
																					{
																						column.label
																					}
																				</span>
																				{column.isCurrentColumn && (
																					<span className='maxi-block-select-control__option-meta'>
																						{renderCurrentBadge()}
																					</span>
																				)}
																			</span>
																			<span
																				className='maxi-block-select-control__option-column-arrow'
																				aria-hidden='true'
																			/>
																		</button>
																	</li>
																)}
																{columnExpanded &&
																	column.options.map(
																		option => {
																			const currentIndex =
																				visibleOptionIndexes.get(
																					option.value
																				);

																			return (
																				<li
																					key={
																						option.value ||
																						`fallback-${currentIndex}`
																					}
																					id={getOptionId(
																						currentIndex
																					)}
																					value={
																						option.value
																					}
																					role='option'
																					aria-selected={isSelected(
																						option.value
																					)}
																					className={classnames(
																						'maxi-block-select-control__option',
																						{
																							'maxi-block-select-control__option--nested':
																								!!column.label,
																							'maxi-block-select-control__option--selected':
																								isSelected(
																									option.value
																								),
																							'maxi-block-select-control__option--active':
																								currentIndex ===
																								activeIndex,
																						}
																					)}
																					onFocus={() => {
																						setActiveOption(
																							currentIndex
																						);
																						handleHover(
																							option.hoverValue ||
																								option.value,
																							true
																						);
																					}}
																					onMouseEnter={() => {
																						setActiveOption(
																							currentIndex
																						);
																						handleHover(
																							option.hoverValue ||
																								option.value,
																							true
																						);
																					}}
																					onMouseLeave={() => {
																						handleHover(
																							option.hoverValue ||
																								option.value,
																							false
																						);
																					}}
																					onClick={() =>
																						handleSelect(
																							option.value
																						)
																					}
																				>
																					<span
																						className='maxi-block-select-control__option-check'
																						aria-hidden='true'
																					/>
																					{option.blockType && (
																						<span
																							className={classnames(
																								'maxi-block-select-control__option-type-icon',
																								`maxi-block-select-control__option-type-icon--${option.blockType}`
																							)}
																							aria-label={getOptionTypeLabel(
																								option
																							)}
																							title={getOptionTypeLabel(
																								option
																							)}
																						/>
																					)}
																					<span className='maxi-block-select-control__option-label'>
																						{
																							option.label
																						}
																					</span>
																					{option.isCurrentBlock &&
																						renderCurrentBadge()}
																				</li>
																			);
																		}
																	)}
															</Fragment>
														);
													}
												)}
										</Fragment>
									);
								})
							) : (
								<li
									className='maxi-block-select-control__no-results'
									role='option'
									aria-disabled='true'
									aria-selected='false'
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
