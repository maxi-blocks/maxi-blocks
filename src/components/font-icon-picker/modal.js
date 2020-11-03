/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const { Button, Modal, TextControl } = wp.components;

/**
 * External dependencies.
 */
import classnames from 'classnames';
import ReactPaginate from 'react-paginate';

/**
 * Internal dependencies.
 */
import jsonData from './fa-icons.json';

const MaxiModalIcon = props => {
	// Number of icons to display per page
	const perPage = 55;

	const { onChange, btnText = 'Choose an Icon' } = props;

	// Component State
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [iconsList, setIconsList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);
	const [pageCount, setPageCount] = useState();
	const [range, setRange] = useState({ start: 0, end: perPage });
	const [filters, setFilters] = useState({ search: '', cat: '' });
	const [currentPage, setCurrentPage] = useState(0);

	// Icons to display
	const displayedList =
		filters.search || filters.cat ? filteredList : iconsList;

	const onClick = () => setOpen(!open);

	// Fetch icons' list and store it in localStorage
	const fetchFaIcons = async () => {
		const iconsEndpoint =
			'https://raw.githubusercontent.com/FortAwesome/Font-Awesome/master/metadata/icons.json';

		const response = await fetch(iconsEndpoint);

		if (response.ok) {
			const data = await response.text();
			const value = {
				value: data,
				timestamp: new Date().getTime(),
			};

			localStorage.setItem('maxi-fa-icons', JSON.stringify(value));

			setIconsState(JSON.parse(data));
		}

		if (!response.ok) {
			let message = `Unable to load icons remotely: ${response.status}, Icons have been loaded from the local backup file`;

			const iconsData = localStorage.getItem('maxi-fa-icons');

			if (!iconsData) {
				const value = {
					value: JSON.stringify(jsonData),
					timestamp: new Date().getTime(),
				};

				localStorage.setItem('maxi-fa-icons', JSON.stringify(value));

				setIconsState(jsonData);

				message = `Unable to load icons remotely: ${response.status}, We've used the localStorage version`;
			}

			console.error(message);
		}
	};

	/**
	 *
	 * Updates the full list of icons state
	 *
	 * @param {Array} icons Retrieved from localStorage
	 *
	 */
	function setIconsState(icons) {
		const iconsList = [];

		Object.keys(icons).forEach(iconName => {
			const iconObject = { iconName, content: icons[iconName] };
			icons[iconName].free.forEach(cat => {
				iconObject.cat = cat;
				if (!iconsList.includes(iconObject)) {
					iconsList.push(iconObject);
				}
			});
		});

		setIconsList(iconsList);
	}

	// Load icons List
	useEffect(() => {
		async function loadIcons() {
			// Check if we have iconsData in localStorage
			const iconsData = localStorage.getItem('maxi-fa-icons');

			if (!iconsData) {
				fetchFaIcons();
				setIsLoading(false);
			} else {
				// Check if the localStorage data is expired
				const object = JSON.parse(
					localStorage.getItem('maxi-fa-icons')
				);

				const date = object.timestamp;
				const now = new Date().getTime();
				const day = 1000 * 60 * 60 * 24;

				if (now - date > day) {
					fetchFaIcons();
					setIsLoading(false);
				} else {
					setIconsState(JSON.parse(object.value));
					setIsLoading(false);
				}
			}
		}
		if (open) loadIcons();
	}, [open]);

	// Sets Page count when the displayed list changes
	useEffect(() => {
		setPageCount(Math.round(displayedList.length / perPage));
	}, [displayedList]);

	// Filtering
	useEffect(() => {
		if (filters.cat) {
			const filteredList = iconsList.filter(
				icon => icon.cat === filters.cat
			);
			setFilteredList(filteredList);
		}

		if (filters.search) {
			const filteredList = iconsList.filter(icon => {
				let result = false;

				if (
					icon.content.label
						.toLowerCase()
						.search(filters.search.toLowerCase()) !== -1
				) {
					result = true;
				}

				icon.content.search.terms.forEach(term => {
					if (
						term
							.toLowerCase()
							.search(filters.search.toLowerCase()) !== -1
					) {
						result = true;
					}
				});

				return result;
			});

			setFilteredList(filteredList);
		}

		setRange({ start: 0, end: perPage });

		setCurrentPage(0);
	}, [filters]);

	return (
		<Fragment>
			<Button onClick={onClick}>{btnText}</Button>
			{open && (
				<Modal
					className='maxi-font-icon-picker__modal'
					title={__('Maxi Font Icons', 'maxi-blocks')}
					shouldCloseOnEsc
					shouldCloseOnClickOutside={false}
					onRequestClose={onClick}
				>
					<div className='maxi-font-icon-picker__main-content'>
						<div className='maxi-font-icon-picker__categories'>
							<ul>
								<li>
									<button
										type='button'
										onClick={() =>
											setFilters({ cat: 'regular' })
										}
										className={classnames(
											'maxi-font-icon-picker__category-button',
											filters.cat === 'regular' &&
												'maxi-font-icon-picker__category-button--active'
										)}
									>
										Font-Awesome - Regular
									</button>
								</li>
								<li>
									<button
										type='button'
										onClick={() =>
											setFilters({ cat: 'solid' })
										}
										className={classnames(
											'maxi-font-icon-picker__category-button',
											filters.cat === 'solid' &&
												'maxi-font-icon-picker__category-button--active'
										)}
									>
										Font-Awesome - Solid
									</button>
								</li>
								<li>
									<button
										type='button'
										onClick={() =>
											setFilters({ cat: 'brands' })
										}
										className={classnames(
											'maxi-font-icon-picker__category-button',
											filters.cat === 'brands' &&
												'maxi-font-icon-picker__category-button--active'
										)}
									>
										Font-Awesome - Brands
									</button>
								</li>
							</ul>
							<button
								type='button'
								onClick={() => {
									setFilters({ search: '', cat: '' });
								}}
								className='maxi-font-icon-picker__clear-filters'
							>
								Clear All Filters
							</button>
						</div>
						{!isLoading ? (
							<Fragment>
								<div className='maxi-font-icon-picker__icons'>
									<TextControl
										value={filters.search}
										onChange={value => {
											setFilters({ search: value });
										}}
										placeholder={__('Search for Icons…')}
									/>
									<div className='maxi-font-icon-picker__icons-list'>
										{displayedList.length ? (
											displayedList
												.slice(range.start, range.end)
												.map(icon => (
													<span className='maxi-font-icon-picker__card'>
														<i
															className={`fa${icon.cat.charAt(
																0
															)} fa-${
																icon.iconName
															}`}
														/>
														<button
															type='button'
															className='maxi-font-icon-picker__insert'
															onClick={() => {
																onChange(
																	`fa${icon.cat.charAt(
																		0
																	)} fa-${
																		icon.iconName
																	}`
																);
																setOpen(!open);
															}}
														>
															Insert
														</button>
													</span>
												))
										) : (
											<span className='maxi-font-icon-picker__no-icons'>
												No Icons Found
											</span>
										)}
									</div>
									{pageCount > 1 && (
										<ReactPaginate
											previousLabel='Previous'
											nextLabel='Next'
											breakLabel='...'
											breakClassName='maxi-font-icon-picker__pagination-break'
											pageCount={pageCount}
											marginPagesDisplayed={2}
											pageRangeDisplayed={5}
											onPageChange={data => {
												const { selected } = data;
												const offset = Math.ceil(
													selected * perPage
												);
												setRange({
													start: offset,
													end: offset + perPage,
												});
												setCurrentPage(selected);
											}}
											containerClassName='maxi-font-icon-picker__pagination'
											activeClassName='maxi-font-icon-picker__pagination--active'
											forcePage={currentPage}
											disableInitialCallback
										/>
									)}
								</div>
							</Fragment>
						) : (
							<span>Loading...</span>
						)}
					</div>
				</Modal>
			)}
		</Fragment>
	);
};
export default MaxiModalIcon;
