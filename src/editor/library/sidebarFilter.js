/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { Button } = wp.components;

/**
 * Component
 */
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
			{options.map(option => (
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
