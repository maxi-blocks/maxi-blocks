/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */

/**
 * Component
 */
const TopbarFilter = props => {
	const { filters, onChange } = props;

	return (
		<div className='maxi-cloud-topbar'>
			<div className='maxi-cloud-topbar__styles'>
				<Button
					onClick={() => {
						filters.styles = 'light';
						onChange(filters);
					}}
				>
					Light
				</Button>
				<Button
					onClick={() => {
						filters.styles = 'dark';
						onChange(filters);
					}}
				>
					Dark
				</Button>
			</div>
			<div className='maxi-cloud-topbar__cost'>
				<Button
					onClick={() => {
						filters.cost = 'free';
						onChange(filters);
					}}
				>
					Free
				</Button>
				<Button
					onClick={() => {
						filters.cost = 'pro';
						onChange(filters);
					}}
				>
					Pro
				</Button>
			</div>
		</div>
	);
};

export default TopbarFilter;
