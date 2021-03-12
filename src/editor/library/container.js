/**
 * WordPress dependencies
 */
const { useState, useEffect, useRef } = wp.element;
const { dispatch } = wp.data;

/**
 * Internal dependencies
 */
import SidebarFilter from './sidebarFilter';
import TopbarFilter from './topbarFilter';
import Searcher from './searcher';
import Masonry from './masonry';
import Pagination from './pagination';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * General
 */
const ITEMS_PAGE = 20;

/**
 * Component
 */
const LibraryContainer = props => {
	const { type, onRequestClose, categories } = props;

	const [cloudData, setCloudData] = useState(props.cloudData);
	const [filteredData, setFilteredData] = useState(cloudData);
	const [searchFilter, setSearchFilter] = useState('');
	const [sidebarFilter, setSidebarFilter] = useState([]);
	const [styleFilter, setStyleFilter] = useState('');
	const [costFilter, setCostFilter] = useState('');
	const isRequestAvailable = useRef(true);

	const filterData = data => {
		let i = 1;

		const newData = data.filter(el => {
			if (i > ITEMS_PAGE) return false;
			if (
				isEmpty(searchFilter) &&
				isEmpty(sidebarFilter) &&
				isEmpty(styleFilter) &&
				isEmpty(costFilter)
			) {
				i += 1;
				return true;
			}

			const searchVal = searchFilter.toLowerCase();
			// Search filter
			let searchRes = false;
			if (isEmpty(searchVal)) searchRes = true;
			else if (
				(el.cost && el.cost.toLowerCase().includes(searchVal)) ||
				(el.style && el.style.toLowerCase().includes(searchVal)) ||
				(el.serial && el.serial.toLowerCase().includes(searchVal)) ||
				(el.title && el.title.toLowerCase().includes(searchVal))
			)
				searchRes = true;
			else if (
				categories.some(cat => {
					return (
						cat.description.toLowerCase().includes(searchVal) ||
						cat.name.toLowerCase().includes(searchVal)
					);
				})
			)
				searchRes = true;

			// Cost filter
			let costRes = false;
			if (isEmpty(costFilter)) costRes = true;
			else if (el.cost.includes(costFilter)) costRes = true;

			// Style filter
			let styleRes = false;
			if (isEmpty(styleFilter)) styleRes = true;
			else if (el.style.includes(styleFilter)) styleRes = true;

			// Categories filter
			const postCategories = JSON.parse(el.post_categories) || [];
			let categoriesRes = false;
			if (isEmpty(sidebarFilter)) categoriesRes = true;
			else if (!sidebarFilter.some(cat => !postCategories.includes(cat)))
				categoriesRes = true;

			const res = searchRes && costRes && styleRes && categoriesRes;
			if (res) i += 1;
			return res;
		});

		setFilteredData(newData);

		return newData;
	};

	const updateFilters = data => {
		const newData = filterData(data);

		if (isRequestAvailable.current && newData.length < ITEMS_PAGE) {
			const avoidIds = Object.values(data).map(item => item.id);

			const search = {
				type,
				style: styleFilter,
				cost: costFilter,
				category: '',
				search: searchFilter,
				avoid_ids: avoidIds,
			};

			dispatch('maxiBlocks/cloudLibrary')
				.requestMaxiCloudLibrary(search)
				.then(({ newContent }) => {
					const newCloudData = [...data, ...newContent];

					setCloudData(newCloudData);

					if (newContent < ITEMS_PAGE)
						isRequestAvailable.current = false;
					else updateFilters(newCloudData);
				});
		}
	};

	useEffect(() => {
		setCloudData(props.cloudData);
		updateFilters(props.cloudData);
	}, [type]);

	useEffect(() => {
		isRequestAvailable.current = true;
		updateFilters(cloudData);
	}, [searchFilter, sidebarFilter, styleFilter, costFilter]);

	return (
		<div className='maxi-cloud-container'>
			<div className='maxi-cloud-container__sidebar'>
				<SidebarFilter
					categories={categories}
					filters={sidebarFilter}
					onChange={filters => {
						setSidebarFilter(filters);
					}}
					onReset={() => {
						setSidebarFilter([]);
						setCostFilter('');
						setStyleFilter('');
						setSearchFilter('');
					}}
				/>
			</div>
			<div className='maxi-cloud-container__content'>
				<TopbarFilter
					styleFilter={styleFilter}
					onChangeFilter={filter => setStyleFilter(filter)}
					costFilter={costFilter}
					onChangeCost={cost => setCostFilter(cost)}
				/>
				<Searcher
					value={searchFilter}
					onChange={value => setSearchFilter(value)}
				/>
				<Masonry
					elements={filteredData}
					type={type}
					onRequestClose={onRequestClose}
					itemsPage={ITEMS_PAGE}
				/>
				<Pagination />
			</div>
		</div>
	);
};

export default LibraryContainer;
