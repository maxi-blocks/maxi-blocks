/**
 * Internal dependencies
 */
import {
	getBlockBackgroundStyles,
	getBackgroundStyles,
} from '../getBackgroundStyles';

/**
 * External dependencies
 */
import { isNaN, merge } from 'lodash';

jest.mock('src/extensions/style-cards/getActiveStyleCard.js', () => {
	return jest.fn(() => {
		return {
			value: {
				name: 'Maxi (Default)',
				status: 'active',
				light: {
					styleCard: {},
					defaultStyleCard: {
						color: {
							1: '255,255,255',
							2: '242,249,253',
							3: '155,155,155',
							4: '255,74,23',
							5: '0,0,0',
							6: '201,52,10',
							7: '8,18,25',
							8: '150,176,203',
						},
					},
				},
			},
		};
	});
});

const getGeneralSizeAndPositionAttributes = ({
	type,
	isHover = false,
	isResponsive = false,
}) => {
	const typeString = `${type[0]}${type === 'svg' ? 'v' : 'w'}`;

	const generalAttributes = {
		[`b${typeString}_pos.b-general`]: '10',
		[`b${typeString}_pos.b.u-general`]: 'px',
		[`b${typeString}_pos-general`]: 'inherit',
		[`b${typeString}_pos.l-general`]: '10',
		[`b${typeString}_pos.l.u-general`]: 'px',
		[`b${typeString}_pos.r-general`]: '10',
		[`b${typeString}_pos.r.u-general`]: 'px',
		[`b${typeString}_pos.sy-general`]: 'all',
		[`b${typeString}_pos.t-general`]: '10',
		[`b${typeString}_pos.t.u-general`]: 'px',
		[`b${typeString}_w-general`]: 100,
		[`b${typeString}_w.u-general`]: '%',
		[`b${typeString}_h-general`]: 100,
		[`b${typeString}_h.u-general`]: '%',
	};

	if (!isResponsive) return generalAttributes;

	const response = {};
	const units = ['px', '%', 'em', 'vw', 'vh'];
	Object.entries(generalAttributes).forEach(([rawKey, rawValue]) => {
		['', ...(isHover ? ['.h'] : [])].forEach((suffix, suffixIndex) => {
			['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'].forEach(
				(breakpoint, index) => {
					let value;
					if (!isNaN(+rawValue))
						value = +rawValue + index + suffixIndex;
					else if (units.includes(rawValue))
						switch (rawValue) {
							case 'px':
								value = '%';
								break;
							case '%':
								value = 'px';
								break;
							case 'em':
								value = 'px';
								break;
							case 'vw':
								value = 'vh';
								break;
							case 'vh':
								value = 'vw';
								break;
							default:
								value = 'px';
								break;
						}
					else value = rawValue;

					const key = `${rawKey.replace(
						'general',
						breakpoint
					)}${suffix}`;
					response[key] = value;
				}
			);
		});
	});

	return response;
};

describe('getBackgroundStyles', () => {
	const target = 'maxi-test';

	const getBlockBackgroundNormalAndHoverStyles = attributes =>
		merge(
			getBlockBackgroundStyles({
				target,
				isHover: false,
				...attributes,
			}),
			getBlockBackgroundStyles({
				target,
				isHover: true,
				...attributes,
			})
		);

	it('Get correct block background styles for color layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 0.07,
					'bc_cc-general': '',
					'bc_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bc_ps-xl': true,
					'bc_pc-xl': 1,
					'bc_po-xl': 0.07,
					'bc_cc-xl': '',
					'bc_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bc_cp-xxl': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bc_ps-xxl': true,
					'bc_pc-xxl': 2,
					'bc_po-xxl': 0.2,
					'bc_cc-xxl': '',
					'bc_ps-l': true,
					'bc_pc-l': 4,
					'bc_po-l': 0.3,
					'bc_cc-l': '',
					'bc_cp-l': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'bc_ps-m': true,
					'bc_pc-m': 5,
					'bc_po-m': 0.59,
					'bc_cc-m': '',
					'bc_cp-m':
						'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
					'bc_ps-s': false,
					'bc_pc-s': 5,
					'bc_po-s': 0.59,
					'bc_cc-s': 'rgba(204,68,68,0.59)',
					'bc_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bc_cp-xs':
						'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
					...getGeneralSizeAndPositionAttributes({
						type: 'color',
						isResponsive: true,
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'image',
					order: 0,
					'_d-general': 'block',
					bi_mi: 302,
					bi_mu: 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bi_si-general': 'cover',
					'bi_w-general': 470,
					'bi_w.u-general': '%',
					'bi_h-general': 300,
					'bi_h.u-general': '%',
					'bi_co-general': null,
					'bi_re-general': 'repeat-x',
					'bi_pos-general': 'left top',
					'bi_pos_w.u-general': '%',
					'bi_pos_w-general': 0,
					'bi_pos_h.u-general': '%',
					'bi_pos_h-general': 0,
					'bi_ori-general': 'border-box',
					'bi_clp-general': 'padding-box',
					'bi_at-general': 'local',
					'bi_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bi_o-general': 0.52,
					'bi_w-xl': 470,
					'bi_h-xl': 300,
					'bi_o-xl': 0.52,
					'bi_si-xl': 'cover',
					'bi_re-xl': 'repeat-x',
					'bi_pos-xl': 'left top',
					'bi_at-xl': 'local',
					'bi_ori-xl': 'border-box',
					'bi_clp-xl': 'padding-box',
					'bi_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bi_w-l': 2560,
					'bi_h-l': 1920,
					'bi_si-l': 'contain',
					'bi_re-l': 'space',
					'bi_pos-l': 'right top',
					'bi_at-l': 'fixed',
					'bi_ori-l': 'content-box',
					'bi_clp-l': 'padding-box',
					'bi_cp-l': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bi_o-m': 0.91,
					'bi_o-xxl': 0.11,
					'bi_cp-xxl':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'bi_re-s': 'repeat-x',
					'bi_at-s': 'scroll',
					'bi_pos-s': 'center top',
					'bi_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bi_w-xs': 600,
					'bi_h-xs': 600,
					'bi_si-xs': 'auto',
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with parallax and different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'image',
					order: 0,
					'_d-general': 'block',
					'bi_pa.s': true,
					bi_mi: 302,
					bi_mu: 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bi_si-general': 'cover',
					'bi_w-general': 470,
					'bi_w.u-general': '%',
					'bi_h-general': 300,
					'bi_h.u-general': '%',
					'bi_co-general': null,
					'bi_re-general': 'repeat-x',
					'bi_pos-general': 'left top',
					'bi_pos_w.u-general': '%',
					'bi_pos_w-general': 0,
					'bi_pos_h.u-general': '%',
					'bi_pos_h-general': 0,
					'bi_ori-general': 'border-box',
					'bi_clp-general': 'padding-box',
					'bi_at-general': 'local',
					'bi_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bi_o-general': 0.52,
					'bi_w-xl': 470,
					'bi_h-xl': 300,
					'bi_o-xl': 0.52,
					'bi_si-xl': 'cover',
					'bi_re-xl': 'repeat-x',
					'bi_pos-xl': 'left top',
					'bi_at-xl': 'local',
					'bi_ori-xl': 'border-box',
					'bi_clp-xl': 'padding-box',
					'bi_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bi_w-l': 2560,
					'bi_h-l': 1920,
					'bi_si-l': 'contain',
					'bi_re-l': 'space',
					'bi_pos-l': 'right top',
					'bi_at-l': 'fixed',
					'bi_ori-l': 'content-box',
					'bi_clp-l': 'padding-box',
					'bi_cp-l': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bi_o-m': 0.91,
					'bi_o-xxl': 0.11,
					'bi_cp-xxl':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'bi_re-s': 'repeat-x',
					'bi_at-s': 'scroll',
					'bi_pos-s': 'center top',
					'bi_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bi_w-xs': 600,
					'bi_h-xs': 600,
					'bi_si-xs': 'auto',
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for video layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'video',
					order: 0,
					'_d-general': 'block',
					'bv_mi-general': null,
					'bv_mu-general':
						'https://www.youtube.com/watch?v=y1dbbrfekAM',
					bv_sti: 285,
					bv_et: 625,
					bv_loo: false,
					'bv_fi-general': 302,
					'bv_fu-general':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bv_o-general': 0.11,
					'bv_o-xl': 0.11,
					'bv_fi-xl': 302,
					'bv_fu-xl':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bv_o-xxl': 0.37,
					'bv_fi-xxl': 227,
					'bv_fu-xxl':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
					'bv_o-l': 0.65,
					'bv_fi-l': 226,
					'bv_fu-l':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'bv_o-s': 0.25,
					'bv_o-xs': 0.9,
					...getGeneralSizeAndPositionAttributes({
						type: 'video',
						isResponsive: true,
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for gradient layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'gradient',
					order: 0,
					'_d-general': 'block',
					'bg_c-general':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'bg_o-general': 0.15,
					'bg_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bg_o-xl': 0.15,
					'bg_c-xl':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'bg_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bg_o-xxl': 0.48,
					'bg_cp-xxl': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bg_cp-l':
						'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
					'bg_o-l': 0.8,
					'bg_c-l':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'bg_c-s':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
					'bg_o-s': 0.17,
					'bg_cp-s':
						'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for shape layer with different values on different responsive stages', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'shape',
					order: 0,
					'_d-general': 'block',
					'bsv_ps-general': true,
					'bsv_pc-general': 5,
					'bsv.t.u-general': '%',
					'bsv.t-general': 0,
					'bsv.l.u-general': '%',
					'bsv.l-general': 50,
					'bsv.t-xl': 0,
					'bsv_ps-xxl': true,
					'bsv_pc-xxl': 2,
					'bsv_po-xxl': 0.37,
					'bsv.t-xxl': 72,
					'bsv.l-xxl': 14,
					_se: '<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><pattern xmlns="http://www.w3.org/1999/xhtml" id="group-maxi-12__30__img" class="maxi-svg-block__pattern" width="100%" height="100%" x="0" y="0" patternunits="userSpaceOnUse"><image class="maxi-svg-block__pattern__image" width="100%" height="100%" x="0" y="0" href="http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg" preserveaspectratio="xMidYMid"></image></pattern><path fill="url(#group-maxi-12__30__img)" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z" style="fill: url(#group-maxi-12__30__img)"/></svg>',
					_sd: {
						'group-maxi-12__30': {
							color: '',
							imageID: 7,
							imageURL:
								'http://localhost:8888/wp-content/uploads/2021/08/IMG_9344-2.jpeg',
						},
					},
					'bsv_ps-l': true,
					'bsv_pc-l': 3,
					'bsv_po-l': 0.37,
					'bsv.t-l': 82,
					'bsv.l-l': 62,
					'bsv_ps-s': true,
					'bsv_pc-s': 7,
					'bsv_po-s': 0.37,
					'bsv.t-s': 23,
					'bsv.l-s': 31,
					'bsv-is_fx-general': false,
					'bsv-is_fy-general': false,
					'bsv-is_rot-general': 104,
					'bsv-is_sc-general': 72,
					...getGeneralSizeAndPositionAttributes({
						type: 'svg',
						isResponsive: true,
					}),
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for general responsive stage', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_cc-general': '',
				},
				{
					type: 'image',
					order: 1,
					'_d-general': 'block',
					bi_mi: '',
					bi_mu: '',
					'bi_si-general': '',
					'bi_w-general': 100,
					'bi_w.u-general': '%',
					'bi_h-general': 100,
					'bi_h.u-general': '%',
					'bi_co-general': null,
					'bi_re-general': 'no-repeat',
					'bi_pos-general': 'center center',
					'bi_pos_w.u-general': '%',
					'bi_pos_w-general': 0,
					'bi_pos_h.u-general': '%',
					'bi_pos_h-general': 0,
					'bi_ori-general': 'padding-box',
					'bi_clp-general': 'border-box',
					'bi_at-general': 'scroll',
					'bi_o-general': 1,
					...getGeneralSizeAndPositionAttributes({
						type: 'image',
						isResponsive: false,
					}),
				},
				{
					type: 'video',
					order: 2,
					'_d-general': 'block',
					'bv_mi-general': null,
					'bv_mu-general': '',
					'bv_sti-general': '',
					'bv_et-general': '',
					'bv_loo-general': false,
					'bv_fi-general': null,
					'bv_fu-general': '',
					'bv_pm-general': false,
					'bv_o-general': 1,
				},
				{
					type: 'gradient',
					order: 3,
					'_d-general': 'block',
					'bg-general': '',
					'bg_o-general': 1,
				},
				{
					type: 'shape',
					order: 4,
					'_d-general': 'block',
					'bsv_ps-general': true,
					'bsv_pc-general': 5,
					'bsv_se-general': '',
					'bsv.t.u-general': '%',
					'bsv.t-general': null,
					'bsv.l.u-general': '%',
					'bsv.l-general': null,
					'bsv_w-general': 100,
					'bsv_w.u-general': '%',
				},
			],
			'bo_ps-general': true,
			'bo_pc-general': 2,
			'bo_w.sy-general': true,
			'bo_w.u-general': 'px',
			'bo.ra.sy-general': true,
			'bo.ra.u-general': 'px',
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct simple background styles', () => {
		const result = getBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			'b_am-general': 'color',
			'b_am-l': 'gradient',
			'b_am-m': 'color',
			'b_am-xs': 'gradient',
			'bc_cc-general': 'rgba(255,255,255,0.39)',
			'bc_cc-m': 'rgba(255,255,255,0.39)',
			'bc_cc-s': 'rgba(43,43,179,0.39)',
			'bc_cc-xl': 'rgba(255,255,255,0.39)',
			'bc_cc-xxl': 'rgba(255,255,255,0.39)',
			'bg_c-l':
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(155,81,224) 100%)',
			'bg_o-general': 1,
			'bg_o-l': 0.29,
			'bg_c-xs':
				'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(102,186,223) 67%,rgb(155,81,224) 100%)',
			'b_ly.s-general': false,
			'b_ly.s-general.h': false,
			'bc_pc-general': 1,
			'bc_pc-general.h': 6,
			'bc_pc-m': 4,
			'bc_pc-s': 4,
			'bc_ps-general': true,
			'bc_ps-general.h': true,
			'bc_ps-m': true,
			'bc_ps-s': false,
			'bc_ps-xl': true,
			'bc_ps-xxl': true,
			'bc_pc-xl': 1,
			'bc_pc-xxl': 2,
			'bc_po-general': 0.39,
			'bc_po-m': 0.39,
			'bc_po-s': 0.39,
			'bc_po-xl': 0.39,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with different values on different responsive stages and hover', () => {
		const attributes = {
			blockStyle: 'light',
			'bb.sh': true,
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 0.07,
					'bc_cc-general': '',
					'bc_cp-general': true,
					'bc_ps-xl': true,
					'bc_pc-xl': 1,
					'bc_po-xl': 0.07,
					'bc_cc-xl': '',
					'bc_cp-xl': true,
					'bc_cp-xxl': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bc_ps-xxl': true,
					'bc_pc-xxl': 2,
					'bc_po-xxl': 0.2,
					'bc_cc-xxl': '',
					'bc_ps-l': true,
					'bc_pc-l': 4,
					'bc_po-l': 0.3,
					'bc_cc-l': '',
					'bc_cp-l': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'bc_ps-m': true,
					'bc_pc-m': 5,
					'bc_po-m': 0.59,
					'bc_cc-m': '',
					'bc_cp-m':
						'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
					'bc_ps-s': false,
					'bc_pc-s': 5,
					'bc_po-s': 0.59,
					'bc_cc-s': 'rgba(204,68,68,0.59)',
					'bc_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bc_cp-xs':
						'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
					'bc_ps-xl.h': true,
					'bc_pc-xl.h': 4,
					'bc_po-xl.h': 0.59,
					'bc_cc-xl.h': '',
					'bc_ps-general.h': true,
					'bc_pc-general.h': 4,
					'bc_po-general.h': 0.59,
					'bc-general.h': '',
					'bc_ps-xxl.h': true,
					'bc_pc-xxl.h': 7,
					'bc_po-xxl.h': 0.22,
					'bc_cc-xxl.h': '',
					'bc_ps-l.h': true,
					'bc_pc-l.h': 1,
					'bc_po-l.h': 0.59,
					'bc_cc-l.h': '',
					'bc_ps-s.h': true,
					'bc_pc-s.h': 8,
					'bc_po-s.h': 0.59,
					'bc_cc-s.h': 'rgba(204,68,68,0.59)',
					'bc_cp-l.h':
						'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
					'bc_cp-s.h':
						'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
					...getGeneralSizeAndPositionAttributes({
						type: 'color',
						isResponsive: true,
						isHover: true,
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for image layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			'bb.sh': true,
			b_ly: [
				{
					type: 'image',
					order: 0,
					'_d-general': 'block',
					bi_mi: 302,
					bi_mu: 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bi_si-general': 'cover',
					'bi_w-general': 470,
					'bi_w.u-general': '%',
					'bi_h-general': 300,
					'bi_h.u-general': '%',
					'bi_co-general': null,
					'bi_re-general': 'repeat-x',
					'bi_pos-general': 'left top',
					'bi_pos_w.u-general': '%',
					'bi_pos_w-general': 0,
					'bi_pos_h.u-general': '%',
					'bi_pos_h-general': 0,
					'bi_ori-general': 'border-box',
					'bi_clp-general': 'padding-box',
					'bi_at-general': 'local',
					'bi_cp.s-general': true,
					'bi_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bi_o-general': 0.52,
					'bi_w-xl': 470,
					'bi_h-xl': 300,
					'bi_o-xl': 0.52,
					'bi_si-xl': 'cover',
					'bi_re-xl': 'repeat-x',
					'bi_pos-xl': 'left top',
					'bi_at-xl': 'local',
					'bi_ori-xl': 'border-box',
					'bi_clp-xl': 'padding-box',
					'bi_cp.s-xl': true,
					'bi_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bi_w-l': 2560,
					'bi_h-l': 1920,
					'bi_si-l': 'contain',
					'bi_re-l': 'space',
					'bi_pos-l': 'right top',
					'bi_at-l': 'fixed',
					'bi_ori-l': 'content-box',
					'bi_clp-l': 'padding-box',
					'bi_cp.s-l': true,
					'bi_cp-l': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bi_o-m': 0.91,
					'bi_o-xxl': 0.11,
					'bi_cp.s-xxl': true,
					'bi_cp-xxl':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'bi_re-s': 'repeat-x',
					'bi_at-s': 'scroll',
					'bi_pos-s': 'center top',
					'bi_cp.s-s': true,
					'bi_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bi_w-xs': 600,
					'bi_h-xs': 600,
					'bi_si-xs': 'auto',
					'bi_w-xl.h': 600,
					'bi_h-xl.h': 600,
					'bi_w-general.h': 600,
					'bi_h-general.h': 600,
					'bi_o-xl.h': 0.17,
					'bi_o-general.h': 0.17,
					'bi_cp.s-xl.h': true,
					'bi_cp-xl.h': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bi_cp.s-general.h': true,
					'bi_cp-general.h':
						'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bi_w-xxl.h': 788,
					'bi_h-xxl.h': 732,
					'bi_o-xxl.h': 0.79,
					'bi_w-l.h': 470,
					'bi_h-l.h': 300,
					'bi_o-l.h': 0.81,
					'bi_cp.s-s.h': true,
					'bi_cp-s.h': 'ellipse(25% 40% at 50% 50%)',
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for video layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			'bb.sh': true,
			b_ly: [
				{
					type: 'video',
					order: 0,
					'_d-general': 'block',
					'bv_mi-general': null,
					'bv_mu-general':
						'https://www.youtube.com/watch?v=y1dbbrfekAM',
					bv_sti: 285,
					bv_et: 625,
					bv_loo: false,
					'bv_fi-general': 302,
					'bv_fu-general':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bv_o-general': 0.11,
					'bv_o-xl': 0.11,
					'bv_fi-xl': 302,
					'bv_fu-xl':
						'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
					'bv_o-xxl': 0.37,
					'bv_fi-xxl': 227,
					'bv_fu-xxl':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
					'bv_o-l': 0.65,
					'bv_fi-l': 226,
					'bv_fu-l':
						'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
					'bv_o-s': 0.25,
					'bv_o-xs': 0.9,
					'bv_o-xl.h': 0.82,
					'bv_o-general.h': 0.82,
					'bv_o-xxl.h': 0.21,
					'bv_o-m.h': 0.06,
					'bv_o-s.h': 1,
					...getGeneralSizeAndPositionAttributes({
						type: 'video',
						isResponsive: true,
						isHover: true,
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for gradient layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			'bb.sh': true,
			b_ly: [
				{
					type: 'gradient',
					order: 0,
					'_d-general': 'block',
					'bg_c-general':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'bg_o-general': 0.15,
					'bg_cp.s-general': true,
					'bg_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bg_o-xl': 0.15,
					'bg_c-xl':
						'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'bg_cp.s-xl': true,
					'bg_cp-xl': 'polygon(50% 0%, 0% 100%, 100% 100%)',
					'bg_o-xxl': 0.48,
					'bg_cp.s-xxl': true,
					'bg_cp-xxl': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bg_cp.s-l': true,
					'bg_cp-l':
						'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
					'bg_o-l': 0.8,
					'bg_c-l':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
					'bg_c-s':
						'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
					'bg_o-s': 0.17,
					'bg_cp.s-s': true,
					'bg_cp-s':
						'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
					'bg_c-xl.h':
						'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
					'bg_c-general.h':
						'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
					'bg_o-xl.h': 0.71,
					'bg_o-general.h': 0.71,
					'bg_c-xxl.h':
						'linear-gradient(205deg,rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
					'bg_cp.s-xxl.h': true,
					'bg_cp-xxl.h':
						'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
					'bg_cp.s-xl.h': true,
					'bg_cp-xl.h':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'bg_cp.s-general.h': true,
					'bg_cp-general.h':
						'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
					'bg_cp.s-l.h': true,
					'bg_cp-l.h': 'circle(50% at 50% 50%)',
					'bg_c-l.h':
						'radial-gradient(rgb(26,229,6) 0%,rgb(89,136,156) 25%,rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
					'bg_o-l.h': 0.37,
					'bg_c-s.h':
						'radial-gradient(rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
					'bg_cp.s-s.h': true,
					'bg_cp-s.h': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'bg_o-s.h': 0.91,
					...getGeneralSizeAndPositionAttributes({
						type: 'gradient',
						isResponsive: true,
						isHover: true,
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for shape layer with different values on different responsive stages and hovers', () => {
		const attributes = {
			blockStyle: 'light',
			'bb.sh': true,
			b_ly: [
				{
					type: 'shape',
					order: 0,
					'_d-general': 'block',
					'bsv_ps-general': true,
					'bsv_pc-general': 5,
					bsv_se: '<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z"></path></svg>',
					bsv_sd: {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'bsv.t.u-general': '%',
					'bsv.t-general': 0,
					'bsv.l.u-general': '%',
					'bsv.l-general': 50,
					'bsv.t-xl': 0,
					'_se-xxl':
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; bc: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					'_sd-xxl': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'bsv_ps-xxl': true,
					'bsv_pc-xxl': 2,
					'bsv_po-xxl': 0.37,
					'bsv.t-xxl': 72,
					'bsv.l-xxl': 14,
					_se: '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-1718__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; bc: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					_sd: {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'_se-l':
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; bc: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					'_sd-l': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'bsv_ps-l': true,
					'bsv_pc-l': 3,
					'bsv_po-l': 0.37,
					'bsv.t-l': 82,
					'bsv.l-l': 62,
					'_se-s':
						'<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; bc: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
					'_sd-s': {
						'group-maxi-12__30': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'bsv_ps-s': true,
					'bsv_pc-s': 7,
					'bsv_po-s': 0.37,
					'bsv.t-s': 23,
					'bsv.l-s': 31,
					'bsv_ps-xl.h': true,
					'bsv_pc-xl.h': 4,
					'bsv_po-xl.h': 0.92,
					'bsv_ps-general.h': true,
					'bsv_pc-general.h': 4,
					'bsv_po-general.h': 0.92,
					'bsv.t-xl.h': 57,
					'bsv.t-general.h': 57,
					'bsv.l-xl.h': 39,
					'bsv.l-general.h': 39,
					'bsv_ps-xxl.h': true,
					'bsv_pc-xxl.h': 3,
					'bsv_po-xxl.h': 0.17,
					'bsv.t-xxl.h': 16,
					'bsv.l-xxl.h': 11,
					'bsv_ps-s.h': true,
					'bsv_pc-s.h': 8,
					'bsv_po-s.h': 0.92,
					'bsv.t-s.h': 10,
					'bsv.l-s.h': 72,
					...getGeneralSizeAndPositionAttributes({
						type: 'svg',
						isResponsive: true,
						isHover: true,
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for different layers, onces created on normal and other on hover', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 2,
					isHover: false,
					'isHover-general': false,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_ps-xl.h': true,
					'bc_pc-xl.h': 4,
					'bc_ps-general.h': true,
					'bc_pc-general.h': 4,
				},
				{
					type: 'shape',
					order: 3,
					isHover: false,
					'isHover-general': false,
					'_d-general': 'block',
					'bsv_ps-general': true,
					'bsv_pc-general': 4,
					bsv_se: '<svg fill="undefined" data-fill="" viewBox="2.1999988555908203, 2.5000007152557373, 31.674436569213867, 31" class="tick-5-maxi-svg" data-item="group-maxi-12__svg"><path d="M31.2 14.4c.3 1.2.5 2.4.5 3.6 0 7.7-6.3 13.9-14 13.9C10.1 32 3.8 25.7 3.8 18s6.3-13.9 14-13.9c2.2 0 4.2.5 6 1.4l1-1.3c-2.1-1.1-4.5-1.7-7-1.7-8.6 0-15.6 7-15.6 15.5 0 8.6 7 15.5 15.5 15.5 8.6 0 15.5-7 15.5-15.5 0-1.8-.3-3.5-.9-5.1l-1.1 1.5zm2.3-8.2l-3.9-2.9a.95.95 0 0 0-1.3.2l-1.5 1.9-1 1.3L18 16.9a.97.97 0 0 1-1.4.1l-4.5-4.5a.85.85 0 0 0-1.3 0L7.5 16c-.3.3-.3.9 0 1.2l9 9.8c.4.4 1 .4 1.4 0l12.3-15.2 1.1-1.3 2.4-2.9c.3-.5.2-1.1-.2-1.4z" fill=""/></svg>',
					bsv_sd: {
						'group-maxi-12__81': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'bsv.t.u-general': '%',
					...getGeneralSizeAndPositionAttributes({
						type: 'svg',
						isResponsive: false,
					}),
					'bsv_ps-xl': true,
					'bsv_pc-xl': 4,
				},
				{
					type: 'video',
					order: 4,
					isHover: false,
					'isHover-general': false,
					'_d-general': 'block',
					'bv_mu-general':
						'https://www.youtube.com/watch?v=CXSV98tr51A',
					bv_loo: false,
					'bv_pm-general': false,
					'bv_o-general': 1,
					'bv_rb-general': false,
				},
			],
			'b_ly.h': [
				{
					type: 'image',
					isHover: true,
					'isHover-general.h': false,
					'isHover-general': false,
					order: 0,
					'_d-general': 'none',
					'_d-general.h': 'block',
					'bi_si-general': 'auto',
					'bi_si-general.h': 'auto',
					'bi_w-general': 100,
					'bi_w-general.h': 600,
					'bi_w.u-general': '%',
					'bi_w.u-general.h': '%',
					'bi_h-general': 100,
					'bi_h-general.h': 600,
					'bi_h.u-general': '%',
					'bi_h.u-general.h': '%',
					'bi_re-general': 'no-repeat',
					'bi_re-general.h': 'no-repeat',
					'bi_pos-general': 'center center',
					'bi_pos-general.h': 'center center',
					'bi_pos_w.u-general': '%',
					'bi_pos_w.u-general.h': '%',
					'bi_pos_w-general': 0,
					'bi_pos_w-general.h': 0,
					'bi_pos_h.u-general': '%',
					'bi_pos_h.u-general.h': '%',
					'bi_pos_h-general': 0,
					'bi_pos_h-general.h': 0,
					'bi_ori-general': 'padding-box',
					'bi_ori-general.h': 'padding-box',
					'bi_clp-general': 'border-box',
					'bi_clp-general.h': 'border-box',
					'bi_at-general': 'scroll',
					'bi_at-general.h': 'scroll',
					'bi_o-general': 1,
					'bi_o-general.h': 1,
					'bi_pa.s': false,
					bi_psp: 4,
					bi_pd: 'up',
					'bi_w-xl.h': 600,
					'bi_h-xl.h': 600,
				},
				{
					type: 'shape',
					order: 1,
					isHover: true,
					'isHover-general': false,
					'isHover-general.h': false,
					'_d-general': 'none',
					'_d-general.h': 'block',
					'bsv_ps-general': true,
					'bsv_ps-general.h': true,
					'bsv_pc-general': 5,
					'bsv_pc-general.h': 2,
					bsv_se: '<svg viewBox="2.590501546859741, 2.455554962158203, 30.95997428894043, 31.187908172607422" class="tick-12-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M32.4 16.4c.4-.6.7-1.4.6-2.3-.1-1.3-1-2.3-2.1-2.8.2-.8.1-1.6-.3-2.3-.6-1.2-1.7-1.8-2.9-1.9-.1-.8-.5-1.5-1.1-2.1-1-.9-2.3-1.1-3.4-.7-.4-.7-1-1.3-1.8-1.6-1.2-.5-2.5-.2-3.4.6-.6-.5-1.4-.8-2.2-.8-1.5 0-2.7.9-3.2 2.3-.9-.4-1.9-.5-2.8 0-1.2.5-1.9 1.6-2 2.8-.8.2-1.6.5-2.2 1.1-.9.9-1.2 2.2-.9 3.4-.7.3-1.3.9-1.6 1.7-.5 1.2-.3 2.5.4 3.5-.5.6-.9 1.3-.9 2.2-.1 1.3.6 2.4 1.6 3.1-.3.7-.4 1.6-.1 2.4.4 1.2 1.4 2.1 2.6 2.3 0 .8.2 1.6.8 2.2.8 1 2.1 1.4 3.3 1.2.3.7.8 1.4 1.5 1.8 1.1.6 2.5.6 3.5-.1.5.6 1.2 1 2.1 1.2 1.3.2 2.5-.3 3.2-1.3.7.4 1.5.5 2.3.3 1.3-.3 2.2-1.2 2.6-2.4.8.1 1.6-.1 2.3-.5 1.1-.7 1.6-1.9 1.5-3.1.8-.2 1.5-.6 2-1.3.8-1 .8-2.4.3-3.5.6-.4 1.1-1.1 1.4-1.9.2-1.4-.2-2.6-1.1-3.5zM25.7 14l-9.5 10.1-5.4-5.4 1.7-1.7 3.7 3.7 7.8-8.3 1.7 1.6z"/></svg>',
					bsv_sd: {
						'group-maxi-12__69': {
							color: '',
							imageID: '',
							imageURL: '',
						},
					},
					'bsv.t.u-general': '%',
					'bsv.t.u-general.h': '%',
					'bsv_pos.t-general': 0,
					'bsv_pos.t-general.h': 0,
					'bsv_pos.r-general': 0,
					'bsv_pos.r-general.h': 0,
					'bsv_pos.b-general': 0,
					'bsv_pos.b-general.h': 0,
					'bsv_pos.l-general': 0,
					'bsv_pos.t.u-general': '%',
					'bsv_pos.r.u-general': '%',
					'bsv_pos.b.u-general': '%',
					'bsv_pos.l.u-general': '%',
					'bsv_w-general': 100,
					'bsv_w-general.h': 100,
					'bsv_w.u-general': '%',
					'bsv_w.u-general.h': '%',
					'bsv_h-general': 100,
					'bsv_h-general.h': 100,
					'bsv_h.u-general': '%',
					'bsv_h.u-general.h': '%',
					'bsv_ps-xl.h': true,
					'bsv_pc-xl.h': 2,
					'bsv_po-xl.h': 0.38,
					'bsv_po-general.h': 0.38,
				},
			],
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with border', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 0.07,
					'bc_cc-general': '',
					'bc_cp.s-general': true,
					'bc_cp-general': 'polygon(50% 0%, 0% 100%, 100% 100%)',
				},
			],
			'bo.ra.bl-general': 180,
			'bo.ra.br-general': 180,
			'bo_w.b-general': 2,
			'bo_w.l-general': 2,
			'bo_pc-general': 5,
			'bo_pc-general.h': 6,
			'bo_ps-general': true,
			'bo_ps-general.h': true,
			'bo_w.r-general': 2,
			'bo.sh': false,
			'bo_s-general': 'solid',
			'bo.ra.sy-general': 'all',
			'bo_w.sy-general': 'all',
			'bo.ra.tl-general': 180,
			'bo.ra.tr-general': 180,
			'bo_w.t-general': 2,
			'bo.ra.u-general': 'px',
			'bo.ra.u-general.h': 'px',
			'bo_w.u-general': 'px',
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer different values for border on different responsive stages and hovers', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					isHover: false,
					order: 1,
					id: 1,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 4,
					'bc_cp.s-general': false,
					'bcw_pos.sy-general': 'all',
					'bcw_pos.t.u-general': 'px',
					'bcw_pos.r.u-general': 'px',
					'bcw_pos.b.u-general': 'px',
					'bcw_pos.l.u-general': 'px',
					'bcw_w-general': 100,
					'bcw_w.u-general': '%',
				},
			],
			'bb.sh': false,
			'bo_ps-general': true,
			'bo_pc-general': 5,
			'bo_s-general': 'solid',
			'bo_w.t-general': 5,
			'bo_w.t-l': 10,
			'bo_w.t-m': 0,
			'bo_w.r-general': 10,
			'bo_w.r-l': 15,
			'bo_w.b-general': 15,
			'bo_w.b-l': 20,
			'bo_w.l-general': 20,
			'bo_w.l-l': 5,
			'bo_w.l-m': 0,
			'bo_w.sy-general': 'none',
			'bo_w.u-general': 'px',
			'bo.ra.sy-general': 'all',
			'bo.ra.u-general': 'px',
			'bo_ps-general.h': true,
			'bo_pc-general.h': 3,
			'bo_s-general.h': 'solid',
			'bo_s-m.h': 'solid',
			'bo.sh': true,
			'bo_w.t-general.h': 5,
			'bo_w.t-l.h': 10,
			'bo_w.t-m.h': 2,
			'bo_w.r-general.h': 10,
			'bo_w.r-l.h': 15,
			'bo_w.r-m.h': 15,
			'bo_w.b-general.h': 15,
			'bo_w.b-l.h': 20,
			'bo_w.b-m.h': 20,
			'bo_w.l-general.h': 20,
			'bo_w.l-l.h': 5,
			'bo_w.l-m.h': 2,
			'bo_w.sy-general.h': 'none',
			'bo_w.sy-m.h': 'all',
			'bo_w.u-general.h': 'px',
			'bo_w.u-m.h': 'px',
			'bo.ra.sy-general.h': 'all',
			'bo.ra.u-general.h': 'px',
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with row border radius', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 0.07,
					'bc_cc-general': '',
				},
			],
			rowBorderRadius: {
				'bo.ra.bl-general': 181,
				'bo.ra.br-general': 182,
				'bo.ra.tl-general': 183,
				'bo.ra.tr-general': 184,
			},
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles for color layer with border radius and row border radius', () => {
		const result = getBlockBackgroundStyles({
			target,
			isHover: false,
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 0.07,
					'bc_cc-general': '',
				},
			],
			rowBorderRadius: {
				'bo.ra.bl-general': 180,
				'bo.ra.br-general': 181,
				'bo.ra.tl-general': 182,
				'bo.ra.tr-general': 183,
			},
			'bo.ra.bl-general': 160,
			'bo.ra.br-general': 200,
		});

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles when hover status is disabled, but hover attributes are set', () => {
		const attributes = {
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					order: 0,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_po-general': 0.07,
					'bc_cc-general': '',
					'bc_cp-general': true,
					'bc_ps-xl': true,
					'bc_pc-xl': 1,
					'bc_po-xl': 0.07,
					'bc_cc-xl': '',
					'bc_cp-xl': true,
					'bc_cp-xxl': 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
					'bc_ps-xxl': true,
					'bc_pc-xxl': 2,
					'bc_po-xxl': 0.2,
					'bc_cc-xxl': '',
					'bc_ps-l': true,
					'bc_pc-l': 4,
					'bc_po-l': 0.3,
					'bc_cc-l': '',
					'bc_cp-l': 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
					'bc_ps-m': true,
					'bc_pc-m': 5,
					'bc_po-m': 0.59,
					'bc_cc-m': '',
					'bc_cp-m':
						'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
					'bc_ps-s': false,
					'bc_pc-s': 5,
					'bc_po-s': 0.59,
					'bc_cc-s': 'rgba(204,68,68,0.59)',
					'bc_cp-s':
						'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
					'bc_cp-xs':
						'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
					'bc_ps-xl.h': true,
					'bc_pc-xl.h': 4,
					'bc_po-xl.h': 0.59,
					'bc_cc-xl.h': '',
					'bc_ps-general.h': true,
					'bc_pc-general.h': 4,
					'bc_po-general.h': 0.59,
					'bc-general.h': '',
					'bc_ps-xxl.h': true,
					'bc_pc-xxl.h': 7,
					'bc_po-xxl.h': 0.22,
					'bc_cc-xxl.h': '',
					'bc_ps-l.h': true,
					'bc_pc-l.h': 1,
					'bc_po-l.h': 0.59,
					'bc_cc-l.h': '',
					'bc_ps-s.h': true,
					'bc_pc-s.h': 8,
					'bc_po-s.h': 0.59,
					'bc_cc-s.h': 'rgba(204,68,68,0.59)',
					'bc_cp-l.h':
						'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
					'bc_cp-s.h':
						'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
					...getGeneralSizeAndPositionAttributes({
						type: 'color',
						isResponsive: true,
						isHover: true,
					}),
				},
			],
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles when border attributes are default, so the source is the normal attributes', () => {
		const attributes = {
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					isHover: false,
					order: 1,
					id: 1,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_cp.s-general': false,
					'bc_ps-general.h': true,
					'bc_pc-general.h': 1,
					'bc_po-general.h': 0,
					'bcw_pos.t.u-general': 'px',
					'bcw_pos.l.u-general': 'px',
					'bcw_pos.b.u-general': 'px',
					'bcw_pos.r.u-general': 'px',
				},
			],
			'bb.sh': true,
			'bo_ps-general': true,
			'bo_pc-general': 2,
			'bo_s-general': 'solid',
			'bo_w.t-general': 2,
			'bo_w.t-xxl': 4,
			'bo_w.t-xl': 2,
			'bo_w.r-general': 2,
			'bo_w.r-xxl': 4,
			'bo_w.r-xl': 2,
			'bo_w.b-general': 2,
			'bo_w.b-xxl': 4,
			'bo_w.b-xl': 2,
			'bo_w.l-general': 2,
			'bo_w.l-xxl': 4,
			'bo_w.l-xl': 2,
			'bo_w.sy-general': 'all',
			'bo_w.u-general': 'px',
			'bo.ra.sy-general': 'all',
			'bo.ra.u-general': 'px',
			'bo.sh': true,
			'bo_ps-general.h': true,
			'bo_pc-general.h': 6,
			'bo_po-general.h': 0,
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});

	it('Get correct block background styles when most border attributes are default, so the source is the normal attributes and the one different', () => {
		const attributes = {
			blockStyle: 'light',
			b_ly: [
				{
					type: 'color',
					isHover: false,
					order: 1,
					id: 1,
					'_d-general': 'block',
					'bc_ps-general': true,
					'bc_pc-general': 1,
					'bc_cp.s-general': false,
					'bc_ps-general.h': true,
					'bc_pc-general.h': 1,
					'bc_po-general.h': 0,
					'bcw_pos.t.u-general': 'px',
					'bcw_pos.l.u-general': 'px',
					'bcw_pos.b.u-general': 'px',
					'bcw_pos.r.u-general': 'px',
				},
			],
			'bb.sh': true,
			'bo_ps-general': true,
			'bo_pc-general': 2,
			'bo_s-general': 'solid',
			'bo_w.t-general': 2,
			'bo_w.t-xxl': 4,
			'bo_w.t-xl': 2,
			'bo_w.r-general': 2,
			'bo_w.r-xxl': 4,
			'bo_w.r-xl': 2,
			'bo_w.b-general': 2,
			'bo_w.b-xxl': 4,
			'bo_w.b-xl': 2,
			'bo_w.l-general': 2,
			'bo_w.l-xxl': 4,
			'bo_w.l-xl': 2,
			'bo_w.sy-general': 'all',
			'bo_w.u-general': 'px',
			'bo.ra.sy-general': 'all',
			'bo.ra.u-general': 'px',
			'bo.sh': true,
			'bo_ps-general.h': true,
			'bo_pc-general.h': 6,
			'bo_po-general.h': 0,
			'bo_w.t-general.h': 3,
		};

		const result = getBlockBackgroundNormalAndHoverStyles(attributes);

		expect(result).toMatchSnapshot();
	});
});
