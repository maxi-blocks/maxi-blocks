import { editAdvancedNumberControl, editAxisControl } from '../../../utils';

const valuesDictionary = {
	normal: {
		base: {
			size: {
				number: '50',
				unit: 'px',
			},
			position: {
				values: ['1', '2', '3', '5'],
				unit: '%',
			},
		},
		m: {
			size: { number: '35', unit: 'vw' },
			position: { values: ['55', '89', '144', '233'], unit: 'em' },
		},
		s: {
			size: { number: '76', unit: 'px' },
			position: { values: ['67', '37', '12', '7'], unit: 'px' },
		},
		xs: {
			size: { number: '25', unit: 'em' },
			position: { values: ['8', '13', '21', '34'], unit: 'vw' },
		},
	},
	hover: {
		base: {
			size: { number: '75', unit: '%' },
			position: { values: ['2', '4', '7', '13'], unit: 'px' },
		},
		m: {
			size: { number: '23', unit: 'px' },
			position: {
				values: ['23', '29', '31', '37'],
				unit: 'px',
			},
		},
		s: {
			size: { number: '23', unit: 'px' },
			position: { values: ['24', '44', '81', '149'], unit: 'px' },
		},
		xs: {
			size: { number: '23', unit: 'px' },
			position: { values: ['11', '13', '17', '19'], unit: 'px' },
		},
	},
};

const sizeAndPositionChecker = async ({
	page,
	breakpoint = 'base',
	isHover = false,
}) => {
	const sizeClass = '.maxi-background-control__size';
	const positionClass = '.maxi-background-control__position';

	// size
	const size = await page.$(sizeClass);

	const {
		[isHover ? 'hover' : 'normal']: {
			[breakpoint]: {
				size: { number: sizeNumber, unit: sizeUnit },
				position: { values: positionValues, unit: positionUnit },
			},
		},
	} = valuesDictionary;

	await editAdvancedNumberControl({
		page,
		instance: size,
		newNumber: sizeNumber,
		newValue: sizeUnit,
	});

	// position
	const position = await page.$(positionClass);

	await editAxisControl({
		page,
		instance: position,
		syncOption: 'none',
		values: positionValues,
		unit: positionUnit,
	});

	return true;
};

export default sizeAndPositionChecker;
