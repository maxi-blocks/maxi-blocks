/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * External dependencies
 */
import { pull } from 'lodash';

/**
 * Component
 */
const TopbarFilter = props => {
	const { onChange } = props;

	const filters = [...props.filters];

	const handleOnChange = item => {
		filters.includes(item) ? pull(filters, item) : filters.push(item);

		onChange(filters);
	};

	return (
		<div className='maxi-cloud-topbar'>
			<div className='maxi-cloud-topbar__styles'>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						handleOnChange('light');
					}}
					aria-pressed={filters.includes('light')}
				>
					Light
				</Button>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						handleOnChange('dark');
					}}
					aria-pressed={filters.includes('dark')}
				>
					Dark
				</Button>
			</div>
			<div className='maxi-cloud-topbar__cost'>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						handleOnChange('free');
					}}
					aria-pressed={filters.includes('free')}
				>
					Free
				</Button>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						handleOnChange('pro');
					}}
					aria-pressed={filters.includes('pro')}
				>
					Pro
				</Button>
			</div>
		</div>
	);
};

export default TopbarFilter;