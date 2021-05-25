/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

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
 * Component
 */
const LibraryContainer = props => {
	const { cloudData, type, onRequestClose } = props;

	const [filteredData, setFilteredData] = useState(cloudData);
	const [searchFilter, setSearchFilter] = useState('');
	const [sidebarFilter, setSidebarFilter] = useState('');
	const [topbarFilter, setTopbarFilter] = useState([]);

	console.log('cloudData');
	console.log(cloudData);

	useEffect(() => {
		setFilteredData(
			cloudData.filter(el => {
				return Object.values(el).some(val => {
					if (val) {
						let res = false;
						// returns all elements when there's no search or filter
						if (
							isEmpty(searchFilter) &&
							isEmpty(sidebarFilter) &&
							isEmpty(topbarFilter)
						)
							res = true;

						if (
							!isEmpty(searchFilter) &&
							val.includes(searchFilter)
						)
							res = true;

						if (
							!isEmpty(sidebarFilter) &&
							val.includes(sidebarFilter)
						)
							res = true;

						if (
							!isEmpty(topbarFilter) &&
							topbarFilter.includes(val)
						)
							res = true;

						return res;
					}

					return false;
				});
			})
		);
	}, [searchFilter, sidebarFilter, topbarFilter]);

	const sidebarFilters = [
		{ label: __('Hero'), value: 'hero' },
		{ label: __('Testimonial'), value: 'testimonial' },
		{ label: __('Text Content'), value: 'text-content' },
		{ label: __('Style'), value: 'style' },
	];

	return (
		<div className='maxi-cloud-container'>
			<div className='maxi-cloud-container__sidebar'>
				<SidebarFilter
					options={sidebarFilters}
					filters={sidebarFilter}
					onChange={filters => setSidebarFilter(filters)}
					onReset={() => setSidebarFilter('')}
				/>
			</div>
			<div className='maxi-cloud-container__content'>
				<TopbarFilter
					filters={topbarFilter}
					onChange={filters => setTopbarFilter(filters)}
				/>
				<Searcher
					value={searchFilter}
					onChange={value => setSearchFilter(value)}
				/>
				<Masonry
					elements={filteredData}
					type={type}
					onRequestClose={onRequestClose}
				/>
				<Pagination />
			</div>
		</div>
	);
};

export default LibraryContainer;
