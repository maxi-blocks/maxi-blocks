import AxisPositionControl from '@components/axis-position-control';
import { getResponsiveIconPosition } from '@blocks/search-maxi/utils';

const SearchPositionControl = ({ attributes, breakpoint, onChange, skin }) => (
	<AxisPositionControl
		label='Button'
		selected={getResponsiveIconPosition(attributes, breakpoint)}
		onChange={val => {
			onChange(val, breakpoint);
		}}
		breakpoint={breakpoint}
		responsive
		disableY
		enableCenter={skin === 'icon-reveal'}
		buttonClasses={{
			left: 'maxi-search-control__left',
			center: 'maxi-search-control__center',
			right: 'maxi-search-control__right',
		}}
	/>
);

export default SearchPositionControl;
