/**
 * WordPress dependencies.
 */
const { __ } = wp.i18n;
const { useState, useEffect, Fragment } = wp.element;
const { Button, Modal } = wp.components;

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

	// Component State
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [iconsList, setIconsList] = useState([]);
	const [filteredList, setFilteredList] = useState([]);
	const [pageCount, setPageCount] = useState();
	const [range, setRange] = useState({ start: 0, end: perPage });
	const [filters, setFilters] = useState({});

	// Icons to display
	const displayedList = filteredList.length > 0 ? filteredList : iconsList;

	const { onChange } = props;

	const onClick = () => setOpen(!open);

	// Fetch icons' list and store in in localStorage
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

			console.log('Icons have been loaded from the API');
		}

		if (!response.ok) {
			const message = `Unable to load icons from github repository: ${response.status}, icons have been loaded from the local backup file`;

			const value = {
				value: JSON.stringify(jsonData),
				timestamp: new Date().getTime(),
			};

			localStorage.setItem('maxi-fa-icons', JSON.stringify(value));

			setIconsState(jsonData);

			console.error(message);
		}
	};

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
					console.log(
						'localStorage Data is Expired, fetching again...'
					);
					fetchFaIcons();
					setIsLoading(false);
				} else {
					console.log('localStorage Data is not expired');
					setIconsState(JSON.parse(object.value));
					setIsLoading(false);
				}
			}
		}
		if (open) loadIcons();
	}, [open]);

	useEffect(() => {
		if (open) setPageCount(Math.round(displayedList.length / perPage));
	}, [displayedList]);

	useEffect(() => {
		if (filters.cat) {
			const filteredList = iconsList.filter(
				icon => icon.cat === filters.cat
			);
			setFilteredList(filteredList);
		}
	}, [filters]);

	const onPageChange = data => {
		const { selected } = data;
		const offset = Math.ceil(selected * perPage);
		setRange({ start: offset, end: offset + perPage });
	};

	return (
		<Fragment>
			{/* Launch the layout modal window */}
			<Button onClick={onClick}>
				{__('Choose an icon', 'maxi-blocks')}
			</Button>
			{open && (
				<Modal
					className='maxi-font-icon-control__modal'
					title={__('Maxi Font Icons', 'maxi-blocks')}
					shouldCloseOnEsc
					shouldCloseOnClickOutside={false}
					onRequestClose={onClick}
				>
					<div className='maxi-font-icon-control__main-content'>
						<div className='maxi-font-icon-control__categories'>
							<ul>
								<li>
									<button
										type='button'
										onClick={() =>
											setFilters({ cat: 'regular' })
										}
										className={classnames(
											'maxi-font-icon-control__category-button',
											filters.cat === 'regular' &&
												'maxi-font-icon-control__category-button--active'
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
											'maxi-font-icon-control__category-button',
											filters.cat === 'solid' &&
												'maxi-font-icon-control__category-button--active'
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
											'maxi-font-icon-control__category-button',
											filters.cat === 'brands' &&
												'maxi-font-icon-control__category-button--active'
										)}
									>
										Font-Awesome - Brands
									</button>
								</li>
							</ul>
						</div>
						{!isLoading ? (
							<Fragment>
								<div className='maxi-font-icon-control__icons'>
									<div className='maxi-font-icon-control__icons-list'>
										{displayedList
											.slice(range.start, range.end)
											.map(icon => (
												<span className='maxi-font-icon-control__card'>
													<i
														className={`fa${icon.cat.charAt(
															0
														)} fa-${icon.iconName}`}
													/>
													<button
														type='button'
														className='maxi-font-icon-control__insert'
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
											))}
									</div>
									<ReactPaginate
										previousLabel='Previous'
										nextLabel='Next'
										breakLabel='...'
										breakClassName='maxi-font-icon-control__pagination-break'
										pageCount={pageCount}
										marginPagesDisplayed={2}
										pageRangeDisplayed={5}
										onPageChange={onPageChange}
										containerClassName='maxi-font-icon-control__pagination'
										activeClassName='maxi-font-icon-control__pagination--active'
									/>
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
	// render END
}; // class MaxiModal END
export default MaxiModalIcon;
