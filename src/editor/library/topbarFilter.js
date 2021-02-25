/**
 * WordPress dependencies
 */
const { Button } = wp.components;

/**
 * Component
 */
const TopbarFilter = props => {
	const { styleFilter, onChangeFilter, costFilter, onChangeCost } = props;

	return (
		<div className='maxi-cloud-topbar'>
			<div className='maxi-cloud-topbar__styles'>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						if (styleFilter && styleFilter.includes('light'))
							onChangeFilter('');
						else onChangeFilter('light');
					}}
					aria-pressed={styleFilter.includes('light')}
				>
					Light
				</Button>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						if (styleFilter && styleFilter.includes('dark'))
							onChangeFilter('');
						else onChangeFilter('dark');
					}}
					aria-pressed={styleFilter.includes('dark')}
				>
					Dark
				</Button>
			</div>
			<div className='maxi-cloud-topbar__cost'>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						if (costFilter && costFilter.includes('free'))
							onChangeCost('');
						else onChangeCost('free');
					}}
					aria-pressed={costFilter.includes('free')}
				>
					Free
				</Button>
				<Button
					className='maxi-cloud-topbar__button'
					onClick={() => {
						if (costFilter && costFilter.includes('pro'))
							onChangeCost('');
						else onChangeCost('pro');
					}}
					aria-pressed={costFilter.includes('pro')}
				>
					Pro
				</Button>
			</div>
		</div>
	);
};

export default TopbarFilter;
