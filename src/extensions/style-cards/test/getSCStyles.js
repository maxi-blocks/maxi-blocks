import getSCStyles from '../getSCStyles';
import standardSC from '../../../../core/defaults/defaultSC.json';
import getSCVariablesObject from '../getSCVariablesObject';

jest.mock('@wordpress/data', () => {
	return {
		resolveSelect: jest.fn(() => {
			return {
				receiveMaxiSettings: jest.fn(() => true),
			};
		}),
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
				receiveMaxiDeviceType: jest.fn(() => 'general'),
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
			};
		}),
	};
});

describe('getSCStyles', () => {
	it('Should return a correct frontend styles for SC', async () => {
		const SCVariables = {
			'--maxi-light-button-font-family-general': '',
			'--maxi-light-button-font-size-general': '16px',
			'--maxi-light-button-font-size-xxl': '20px',
			'--maxi-light-button-font-size-xl': '16px',
			'--maxi-light-button-font-style-general': 'normal',
			'--maxi-light-button-font-weight-general': 400,
			'--maxi-light-button-line-height-general': '100%',
			'--maxi-light-button-line-height-xl': '100%',
			'--maxi-light-button-text-decoration-general': 'unset',
			'--maxi-light-button-text-transform-general': 'none',
			'--maxi-light-button-letter-spacing-general': '0px',
			'--maxi-light-button-letter-spacing-xxl': '0px',
			'--maxi-light-button-letter-spacing-xl': '0px',
			'--maxi-light-button-white-space-general': 'normal',
			'--maxi-light-button-word-spacing-general': '0px',
			'--maxi-light-button-text-indent-general': '0px',
			'--maxi-light-p-font-family-general': 'Roboto',
			'--maxi-light-p-font-size-general': '16px',
			'--maxi-light-p-font-size-xxl': '20px',
			'--maxi-light-p-font-size-xl': '16px',
			'--maxi-light-p-font-style-general': 'normal',
			'--maxi-light-p-font-weight-general': 400,
			'--maxi-light-p-line-height-general': '26px',
			'--maxi-light-p-line-height-xxl': '30px',
			'--maxi-light-p-line-height-xl': '26px',
			'--maxi-light-p-text-decoration-general': 'unset',
			'--maxi-light-p-text-transform-general': 'none',
			'--maxi-light-p-letter-spacing-general': '0px',
			'--maxi-light-p-letter-spacing-xxl': '0px',
			'--maxi-light-p-letter-spacing-xl': '0px',
			'--maxi-light-p-white-space-general': 'normal',
			'--maxi-light-p-word-spacing-general': '0px',
			'--maxi-light-p-margin-bottom-general': '20px',
			'--maxi-light-p-text-indent-general': '0px',
			'--maxi-light-h1-font-family-general': 'Roboto',
			'--maxi-light-h1-font-size-general': '45px',
			'--maxi-light-h1-font-size-xxl': '60px',
			'--maxi-light-h1-font-size-xl': '45px',
			'--maxi-light-h1-font-size-l': '40px',
			'--maxi-light-h1-font-size-m': '36px',
			'--maxi-light-h1-font-size-s': '34px',
			'--maxi-light-h1-font-size-xs': '32px',
			'--maxi-light-h1-font-style-general': 'normal',
			'--maxi-light-h1-font-weight-general': 500,
			'--maxi-light-h1-line-height-general': '55px',
			'--maxi-light-h1-line-height-xxl': '70px',
			'--maxi-light-h1-line-height-xl': '55px',
			'--maxi-light-h1-line-height-l': '50px',
			'--maxi-light-h1-line-height-m': '46px',
			'--maxi-light-h1-line-height-s': '44px',
			'--maxi-light-h1-line-height-xs': '42px',
			'--maxi-light-h1-text-decoration-general': 'unset',
			'--maxi-light-h1-text-transform-general': 'none',
			'--maxi-light-h1-letter-spacing-general': '0px',
			'--maxi-light-h1-letter-spacing-xxl': '0px',
			'--maxi-light-h1-letter-spacing-xl': '0px',
			'--maxi-light-h1-white-space-general': 'normal',
			'--maxi-light-h1-word-spacing-general': '0px',
			'--maxi-light-h1-margin-bottom-general': '20px',
			'--maxi-light-h1-text-indent-general': '0px',
			'--maxi-light-h2-font-family-general': 'Roboto',
			'--maxi-light-h2-font-size-general': '38px',
			'--maxi-light-h2-font-size-xxl': '50px',
			'--maxi-light-h2-font-size-xl': '38px',
			'--maxi-light-h2-font-size-l': '36px',
			'--maxi-light-h2-font-size-m': '32px',
			'--maxi-light-h2-font-size-s': '30px',
			'--maxi-light-h2-font-size-xs': '28px',
			'--maxi-light-h2-font-style-general': 'normal',
			'--maxi-light-h2-font-weight-general': 500,
			'--maxi-light-h2-line-height-general': '48px',
			'--maxi-light-h2-line-height-xxl': '60px',
			'--maxi-light-h2-line-height-xl': '48px',
			'--maxi-light-h2-line-height-l': '46px',
			'--maxi-light-h2-line-height-m': '42px',
			'--maxi-light-h2-line-height-s': '40px',
			'--maxi-light-h2-line-height-xs': '38px',
			'--maxi-light-h2-text-decoration-general': 'unset',
			'--maxi-light-h2-text-transform-general': 'none',
			'--maxi-light-h2-letter-spacing-general': '0px',
			'--maxi-light-h2-letter-spacing-xxl': '0px',
			'--maxi-light-h2-letter-spacing-xl': '0px',
			'--maxi-light-h2-white-space-general': 'normal',
			'--maxi-light-h2-word-spacing-general': '0px',
			'--maxi-light-h2-margin-bottom-general': '20px',
			'--maxi-light-h2-text-indent-general': '0px',
			'--maxi-light-h3-font-family-general': 'Roboto',
			'--maxi-light-h3-font-size-general': '30px',
			'--maxi-light-h3-font-size-xxl': '40px',
			'--maxi-light-h3-font-size-xl': '30px',
			'--maxi-light-h3-font-size-m': '26px',
			'--maxi-light-h3-font-size-s': '24px',
			'--maxi-light-h3-font-style-general': 'normal',
			'--maxi-light-h3-font-weight-general': 500,
			'--maxi-light-h3-line-height-general': '40px',
			'--maxi-light-h3-line-height-xxl': '50px',
			'--maxi-light-h3-line-height-xl': '40px',
			'--maxi-light-h3-line-height-m': '36px',
			'--maxi-light-h3-line-height-s': '34px',
			'--maxi-light-h3-text-decoration-general': 'unset',
			'--maxi-light-h3-text-transform-general': 'none',
			'--maxi-light-h3-letter-spacing-general': '0px',
			'--maxi-light-h3-letter-spacing-xxl': '0px',
			'--maxi-light-h3-letter-spacing-xl': '0px',
			'--maxi-light-h3-white-space-general': 'normal',
			'--maxi-light-h3-word-spacing-general': '0px',
			'--maxi-light-h3-margin-bottom-general': '20px',
			'--maxi-light-h3-text-indent-general': '0px',
			'--maxi-light-h4-font-family-general': 'Roboto',
			'--maxi-light-h4-font-size-general': '26px',
			'--maxi-light-h4-font-size-xxl': '38px',
			'--maxi-light-h4-font-size-xl': '26px',
			'--maxi-light-h4-font-size-l': '24px',
			'--maxi-light-h4-font-size-s': '22px',
			'--maxi-light-h4-font-style-general': 'normal',
			'--maxi-light-h4-font-weight-general': 500,
			'--maxi-light-h4-line-height-general': '36px',
			'--maxi-light-h4-line-height-xxl': '48px',
			'--maxi-light-h4-line-height-xl': '36px',
			'--maxi-light-h4-line-height-l': '34px',
			'--maxi-light-h4-line-height-s': '32px',
			'--maxi-light-h4-text-decoration-general': 'unset',
			'--maxi-light-h4-text-transform-general': 'none',
			'--maxi-light-h4-letter-spacing-general': '0px',
			'--maxi-light-h4-letter-spacing-xxl': '0px',
			'--maxi-light-h4-letter-spacing-xl': '0px',
			'--maxi-light-h4-white-space-general': 'normal',
			'--maxi-light-h4-word-spacing-general': '0px',
			'--maxi-light-h4-margin-bottom-general': '20px',
			'--maxi-light-h4-text-indent-general': '0px',
			'--maxi-light-h5-font-family-general': 'Roboto',
			'--maxi-light-h5-font-size-general': '22px',
			'--maxi-light-h5-font-size-xxl': '30px',
			'--maxi-light-h5-font-size-xl': '22px',
			'--maxi-light-h5-font-size-m': '20px',
			'--maxi-light-h5-font-style-general': 'normal',
			'--maxi-light-h5-font-weight-general': 500,
			'--maxi-light-h5-line-height-general': '32px',
			'--maxi-light-h5-line-height-xxl': '40px',
			'--maxi-light-h5-line-height-xl': '32px',
			'--maxi-light-h5-line-height-m': '30px',
			'--maxi-light-h5-text-decoration-general': 'unset',
			'--maxi-light-h5-text-transform-general': 'none',
			'--maxi-light-h5-letter-spacing-general': '0px',
			'--maxi-light-h5-letter-spacing-xxl': '0px',
			'--maxi-light-h5-letter-spacing-xl': '0px',
			'--maxi-light-h5-white-space-general': 'normal',
			'--maxi-light-h5-word-spacing-general': '0px',
			'--maxi-light-h5-margin-bottom-general': '20px',
			'--maxi-light-h5-text-indent-general': '0px',
			'--maxi-light-h6-font-family-general': 'Roboto',
			'--maxi-light-h6-font-size-general': '20px',
			'--maxi-light-h6-font-size-xxl': '26px',
			'--maxi-light-h6-font-size-xl': '20px',
			'--maxi-light-h6-font-size-m': '18px',
			'--maxi-light-h6-font-style-general': 'normal',
			'--maxi-light-h6-font-weight-general': 500,
			'--maxi-light-h6-line-height-general': '30px',
			'--maxi-light-h6-line-height-xxl': '36px',
			'--maxi-light-h6-line-height-xl': '30px',
			'--maxi-light-h6-line-height-m': '28px',
			'--maxi-light-h6-text-decoration-general': 'unset',
			'--maxi-light-h6-text-transform-general': 'none',
			'--maxi-light-h6-letter-spacing-general': '0px',
			'--maxi-light-h6-letter-spacing-xxl': '0px',
			'--maxi-light-h6-letter-spacing-xl': '0px',
			'--maxi-light-h6-white-space-general': 'normal',
			'--maxi-light-h6-word-spacing-general': '0px',
			'--maxi-light-h6-margin-bottom-general': '20px',
			'--maxi-light-h6-text-indent-general': '0px',
			'--maxi-light-color-1': '201,22,22',
			'--maxi-light-color-2': '242,249,253',
			'--maxi-light-color-3': '155,155,155',
			'--maxi-light-color-4': '255,74,23',
			'--maxi-light-color-5': '0,0,0',
			'--maxi-light-color-6': '201,52,10',
			'--maxi-light-color-7': '8,18,25',
			'--maxi-light-color-8': '150,176,203',
			'--maxi-dark-button-font-family-general': '',
			'--maxi-dark-button-font-size-general': '16px',
			'--maxi-dark-button-font-size-xxl': '20px',
			'--maxi-dark-button-font-size-xl': '16px',
			'--maxi-dark-button-font-style-general': 'normal',
			'--maxi-dark-button-font-weight-general': 400,
			'--maxi-dark-button-line-height-general': '100%',
			'--maxi-dark-button-line-height-xl': '100%',
			'--maxi-dark-button-text-decoration-general': 'unset',
			'--maxi-dark-button-text-transform-general': 'none',
			'--maxi-dark-button-letter-spacing-general': '0px',
			'--maxi-dark-button-letter-spacing-xxl': '0px',
			'--maxi-dark-button-letter-spacing-xl': '0px',
			'--maxi-dark-button-white-space-general': 'normal',
			'--maxi-dark-button-word-spacing-general': '0px',
			'--maxi-dark-button-text-indent-general': '0px',
			'--maxi-dark-p-font-family-general': 'Roboto',
			'--maxi-dark-p-font-size-general': '16px',
			'--maxi-dark-p-font-size-xxl': '20px',
			'--maxi-dark-p-font-size-xl': '16px',
			'--maxi-dark-p-font-style-general': 'normal',
			'--maxi-dark-p-font-weight-general': 400,
			'--maxi-dark-p-line-height-general': '26px',
			'--maxi-dark-p-line-height-xxl': '30px',
			'--maxi-dark-p-line-height-xl': '26px',
			'--maxi-dark-p-text-decoration-general': 'unset',
			'--maxi-dark-p-text-transform-general': 'none',
			'--maxi-dark-p-letter-spacing-general': '0px',
			'--maxi-dark-p-letter-spacing-xxl': '0px',
			'--maxi-dark-p-letter-spacing-xl': '0px',
			'--maxi-dark-p-white-space-general': 'normal',
			'--maxi-dark-p-word-spacing-general': '0px',
			'--maxi-dark-p-margin-bottom-general': '20px',
			'--maxi-dark-p-text-indent-general': '0px',
			'--maxi-dark-h1-font-family-general': 'Roboto',
			'--maxi-dark-h1-font-size-general': '45px',
			'--maxi-dark-h1-font-size-xxl': '60px',
			'--maxi-dark-h1-font-size-xl': '45px',
			'--maxi-dark-h1-font-size-l': '40px',
			'--maxi-dark-h1-font-size-m': '36px',
			'--maxi-dark-h1-font-size-s': '34px',
			'--maxi-dark-h1-font-size-xs': '32px',
			'--maxi-dark-h1-font-style-general': 'normal',
			'--maxi-dark-h1-font-weight-general': 500,
			'--maxi-dark-h1-line-height-general': '55px',
			'--maxi-dark-h1-line-height-xxl': '70px',
			'--maxi-dark-h1-line-height-xl': '55px',
			'--maxi-dark-h1-line-height-l': '50px',
			'--maxi-dark-h1-line-height-m': '46px',
			'--maxi-dark-h1-line-height-s': '44px',
			'--maxi-dark-h1-line-height-xs': '42px',
			'--maxi-dark-h1-text-decoration-general': 'unset',
			'--maxi-dark-h1-text-transform-general': 'none',
			'--maxi-dark-h1-letter-spacing-general': '0px',
			'--maxi-dark-h1-letter-spacing-xxl': '0px',
			'--maxi-dark-h1-letter-spacing-xl': '0px',
			'--maxi-dark-h1-white-space-general': 'normal',
			'--maxi-dark-h1-word-spacing-general': '0px',
			'--maxi-dark-h1-margin-bottom-general': '20px',
			'--maxi-dark-h1-text-indent-general': '0px',
			'--maxi-dark-h2-font-family-general': 'Roboto',
			'--maxi-dark-h2-font-size-general': '38px',
			'--maxi-dark-h2-font-size-xxl': '50px',
			'--maxi-dark-h2-font-size-xl': '38px',
			'--maxi-dark-h2-font-size-l': '36px',
			'--maxi-dark-h2-font-size-m': '32px',
			'--maxi-dark-h2-font-size-s': '30px',
			'--maxi-dark-h2-font-size-xs': '28px',
			'--maxi-dark-h2-font-style-general': 'normal',
			'--maxi-dark-h2-font-weight-general': 500,
			'--maxi-dark-h2-line-height-general': '48px',
			'--maxi-dark-h2-line-height-xxl': '60px',
			'--maxi-dark-h2-line-height-xl': '48px',
			'--maxi-dark-h2-line-height-l': '46px',
			'--maxi-dark-h2-line-height-m': '42px',
			'--maxi-dark-h2-line-height-s': '40px',
			'--maxi-dark-h2-line-height-xs': '38px',
			'--maxi-dark-h2-text-decoration-general': 'unset',
			'--maxi-dark-h2-text-transform-general': 'none',
			'--maxi-dark-h2-letter-spacing-general': '0px',
			'--maxi-dark-h2-letter-spacing-xxl': '0px',
			'--maxi-dark-h2-letter-spacing-xl': '0px',
			'--maxi-dark-h2-white-space-general': 'normal',
			'--maxi-dark-h2-word-spacing-general': '0px',
			'--maxi-dark-h2-margin-bottom-general': '20px',
			'--maxi-dark-h2-text-indent-general': '0px',
			'--maxi-dark-h3-font-family-general': 'Roboto',
			'--maxi-dark-h3-font-size-general': '30px',
			'--maxi-dark-h3-font-size-xxl': '40px',
			'--maxi-dark-h3-font-size-xl': '30px',
			'--maxi-dark-h3-font-size-m': '26px',
			'--maxi-dark-h3-font-size-s': '24px',
			'--maxi-dark-h3-font-style-general': 'normal',
			'--maxi-dark-h3-font-weight-general': 500,
			'--maxi-dark-h3-line-height-general': '40px',
			'--maxi-dark-h3-line-height-xxl': '50px',
			'--maxi-dark-h3-line-height-xl': '40px',
			'--maxi-dark-h3-line-height-m': '36px',
			'--maxi-dark-h3-line-height-s': '34px',
			'--maxi-dark-h3-text-decoration-general': 'unset',
			'--maxi-dark-h3-text-transform-general': 'none',
			'--maxi-dark-h3-letter-spacing-general': '0px',
			'--maxi-dark-h3-letter-spacing-xxl': '0px',
			'--maxi-dark-h3-letter-spacing-xl': '0px',
			'--maxi-dark-h3-white-space-general': 'normal',
			'--maxi-dark-h3-word-spacing-general': '0px',
			'--maxi-dark-h3-margin-bottom-general': '20px',
			'--maxi-dark-h3-text-indent-general': '0px',
			'--maxi-dark-h4-font-family-general': 'Roboto',
			'--maxi-dark-h4-font-size-general': '26px',
			'--maxi-dark-h4-font-size-xxl': '38px',
			'--maxi-dark-h4-font-size-xl': '26px',
			'--maxi-dark-h4-font-size-l': '24px',
			'--maxi-dark-h4-font-size-s': '22px',
			'--maxi-dark-h4-font-style-general': 'normal',
			'--maxi-dark-h4-font-weight-general': 500,
			'--maxi-dark-h4-line-height-general': '36px',
			'--maxi-dark-h4-line-height-xxl': '48px',
			'--maxi-dark-h4-line-height-xl': '36px',
			'--maxi-dark-h4-line-height-l': '34px',
			'--maxi-dark-h4-line-height-s': '32px',
			'--maxi-dark-h4-text-decoration-general': 'unset',
			'--maxi-dark-h4-text-transform-general': 'none',
			'--maxi-dark-h4-letter-spacing-general': '0px',
			'--maxi-dark-h4-letter-spacing-xxl': '0px',
			'--maxi-dark-h4-letter-spacing-xl': '0px',
			'--maxi-dark-h4-white-space-general': 'normal',
			'--maxi-dark-h4-word-spacing-general': '0px',
			'--maxi-dark-h4-margin-bottom-general': '20px',
			'--maxi-dark-h4-text-indent-general': '0px',
			'--maxi-dark-h5-font-family-general': 'Roboto',
			'--maxi-dark-h5-font-size-general': '22px',
			'--maxi-dark-h5-font-size-xxl': '30px',
			'--maxi-dark-h5-font-size-xl': '22px',
			'--maxi-dark-h5-font-size-m': '20px',
			'--maxi-dark-h5-font-style-general': 'normal',
			'--maxi-dark-h5-font-weight-general': 500,
			'--maxi-dark-h5-line-height-general': '32px',
			'--maxi-dark-h5-line-height-xxl': '40px',
			'--maxi-dark-h5-line-height-xl': '32px',
			'--maxi-dark-h5-line-height-m': '30px',
			'--maxi-dark-h5-text-decoration-general': 'unset',
			'--maxi-dark-h5-text-transform-general': 'none',
			'--maxi-dark-h5-letter-spacing-general': '0px',
			'--maxi-dark-h5-letter-spacing-xxl': '0px',
			'--maxi-dark-h5-letter-spacing-xl': '0px',
			'--maxi-dark-h5-white-space-general': 'normal',
			'--maxi-dark-h5-word-spacing-general': '0px',
			'--maxi-dark-h5-margin-bottom-general': '20px',
			'--maxi-dark-h5-text-indent-general': '0px',
			'--maxi-dark-h6-font-family-general': 'Roboto',
			'--maxi-dark-h6-font-size-general': '20px',
			'--maxi-dark-h6-font-size-xxl': '26px',
			'--maxi-dark-h6-font-size-xl': '20px',
			'--maxi-dark-h6-font-size-m': '18px',
			'--maxi-dark-h6-font-style-general': 'normal',
			'--maxi-dark-h6-font-weight-general': 500,
			'--maxi-dark-h6-line-height-general': '30px',
			'--maxi-dark-h6-line-height-xxl': '36px',
			'--maxi-dark-h6-line-height-xl': '30px',
			'--maxi-dark-h6-line-height-m': '28px',
			'--maxi-dark-h6-text-decoration-general': 'unset',
			'--maxi-dark-h6-text-transform-general': 'none',
			'--maxi-dark-h6-letter-spacing-general': '0px',
			'--maxi-dark-h6-letter-spacing-xxl': '0px',
			'--maxi-dark-h6-letter-spacing-xl': '0px',
			'--maxi-dark-h6-white-space-general': 'normal',
			'--maxi-dark-h6-word-spacing-general': '0px',
			'--maxi-dark-h6-margin-bottom-general': '20px',
			'--maxi-dark-h6-text-indent-general': '0px',
			'--maxi-dark-color-1': '0,0,0',
			'--maxi-dark-color-2': '5,23,33',
			'--maxi-dark-color-3': '155,155,155',
			'--maxi-dark-color-4': '255,74,23',
			'--maxi-dark-color-5': '255,255,255',
			'--maxi-dark-color-6': '201,52,10',
			'--maxi-dark-color-7': '245,245,245',
			'--maxi-dark-color-8': '9,60,88',
			'--maxi-active-sc-color': '255,74,23',
		};

		const result = await getSCStyles(SCVariables);

		expect(result).toMatchSnapshot();
	});

	it('Should return correct frontend styles for SC from default SC', async () => {
		const cleanVarSC = getSCVariablesObject(standardSC.sc_maxi, null, true);
		const cleanSCStyles = await getSCStyles(cleanVarSC, true);

		expect(cleanSCStyles).toMatchSnapshot();
	});

	it('Should return correct frontend styles for SC from default SC for backend', async () => {
		const cleanVarSC = getSCVariablesObject(standardSC.sc_maxi, null, true);
		const cleanSCStyles = await getSCStyles(cleanVarSC, true, true);

		expect(cleanSCStyles).toMatchSnapshot();
	});

	const styleCardWithTurnedOffGutenbergBlocks = {
		...standardSC,
		sc_maxi: {
			...standardSC.sc_maxi,
			gutenberg_blocks_status: false,
		},
	};

	it('Should return correct frontend styles for SC from default SC (without gutenberg blocks styles)', async () => {
		const cleanVarSC = getSCVariablesObject(
			styleCardWithTurnedOffGutenbergBlocks.sc_maxi,
			null,
			true
		);
		const cleanSCStyles = await getSCStyles(cleanVarSC, false);

		expect(cleanSCStyles).toMatchSnapshot();
	});

	it('Should return correct frontend styles for SC from default SC for backend (without gutenberg blocks styles)', async () => {
		const cleanVarSC = getSCVariablesObject(
			styleCardWithTurnedOffGutenbergBlocks.sc_maxi,
			null,
			true
		);
		const cleanSCStyles = await getSCStyles(cleanVarSC, false, true);

		expect(cleanSCStyles).toMatchSnapshot();
	});
});
