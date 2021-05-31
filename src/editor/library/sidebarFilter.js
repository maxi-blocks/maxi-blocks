/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../../components/button';

/**
 * Component
 */
import { isNil } from 'lodash';

const SidebarFilterButton = props => {
	const { label, onClick } = props;

	return (
		<Button className='maxi-cloud-sidebar__button' onClick={onClick}>
			{label}
		</Button>
	);
};

const SidebarFilter = props => {
	const { options, filters, onChange, onReset } = props;

	return (
		<div className='maxi-cloud-sidebar'>
			{!isNil(options) &&
				options.map(option => (
					<SidebarFilterButton
						key={`maxi-cloud-sidebar--${option.value}`}
						label={option.label}
						onClick={() => onChange(option.value)}
					/>
				))}
			<Button className='maxi-cloud-sidebar__remover' onClick={onReset}>
				{__('CLEAR ALL FILTERS', 'maxi-blocks')}
			</Button>
		</div>
	);
};

export default SidebarFilter;
