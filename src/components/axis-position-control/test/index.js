import AxisPositionControl from '@components/axis-position-control';

jest.mock('@components/setting-tabs-control', () => 'SettingTabsControl');

describe('AxisPositionControl', () => {
	it('renders for responsive breakpoints when responsive support is enabled', () => {
		const result = AxisPositionControl({
			label: 'Button',
			onChange: jest.fn(),
			selected: 'left',
			breakpoint: 'm',
			responsive: true,
		});

		expect(result).toBeTruthy();
		expect(result.props.selected).toBe('left');
	});
});
