import SearchPositionControl from '@blocks/search-maxi/components/position-control';

jest.mock('@components/axis-position-control', () => 'AxisPositionControl');

describe('SearchPositionControl', () => {
	it('passes responsive breakpoint state to the axis position control', () => {
		const onChange = jest.fn();
		const result = SearchPositionControl({
			attributes: {
				'icon-position': 'right',
				'icon-position-general': 'right',
				'icon-position-m': 'left',
			},
			breakpoint: 'm',
			onChange,
			skin: 'icon-reveal',
		});

		expect(result.props.breakpoint).toBe('m');
		expect(result.props.selected).toBe('left');
		expect(result.props.responsive).toBe(true);
		expect(result.props.enableCenter).toBe(true);

		result.props.onChange('center');

		expect(onChange).toHaveBeenCalledWith('center', 'm');
	});
});
