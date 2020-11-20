/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { useState, useEffect } = wp.element;

/**
 * Internal dependencies
 */
import SidebarFilter from './sidebarFilter';
import TopbarFilter from './topbarFilter';
import Searcher from './searcher';
import Masonry from './masonry';
import Pagination from './pagination';

/**
 * Component
 */
const LibraryContainer = props => {
	const { cloudData, onRequestClose } = props;

	const [filteredData, setFilteredData] = useState(cloudData);
	const [searchFilter, setSearchFilter] = useState('');
	const [sidebarFilter, setSidebarFilter] = useState('');
	const [topbarFilter, setTopbarFilter] = useState('');

	useEffect(() => {
		setFilteredData(
			cloudData.filter(el => {
				return Object.values(el).some(val => {
					return !!val && val.includes(searchFilter);
				});
			})
		);
	}, [searchFilter]);

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
					onRequestClose={onRequestClose}
				/>
				<Pagination />
			</div>
		</div>
	);
};

export default LibraryContainer;
