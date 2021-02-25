/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;

/**
 * Internal dependencies
 */
import HierarchicalTermSelector from './hierarchical-term-selector';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

/**
 * Component
 */
const SidebarFilter = props => {
	const { categories, filters, onChange, onReset } = props;

	return (
		<div className='maxi-cloud-sidebar'>
			{!isEmpty(categories) && (
				<HierarchicalTermSelector
					label='testing'
					terms={categories}
					selectedTerms={filters}
					onUpdateTerms={filters => onChange(filters)}
				/>
			)}
			<Button className='maxi-cloud-sidebar__remover' onClick={onReset}>
				{__('CLEAR ALL FILTERS', 'maxi-blocks')}
			</Button>
		</div>
	);
};

export default SidebarFilter;
