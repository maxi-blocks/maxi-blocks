/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { isEmpty, cloneDeep, capitalize } from 'lodash';
import CodeEditor from '@uiw/react-textarea-code-editor';
import cssValidator from 'w3c-css-validator';

/**
 * Internal dependencies
 */
import BaseControl from '../base-control';
import SelectControl from '../select-control';
import ResponsiveTabsControl from '../responsive-tabs-control';
import { getLastBreakpointAttribute } from '../../extensions/styles';
import Button from '../button';

const validateCSS = async code => {
	let responseFinal = '';
	try {
		const codeToCheck = `body {${code}}`;
		const response = await cssValidator.validateText(codeToCheck, {
			lang: 'en',
			warningLevel: 0,
		});

		if (!response.valid) {
			response.errors.forEach(error => {
				responseFinal = `${responseFinal} ${__(
					'line',
					'maxi-blocks'
				)} ${error?.line} - ${error?.message}<br>`;
			});
			return responseFinal;
		}
		return true;
	} catch (err) {
		console.error(__(`Error validating css: ${err}`, 'maxi-blocks'));
	}
	return responseFinal;
};

/**
 * Component
 */
const customCss = ({ props, breakpoint = 'general', blockName }) => {
	const { attributes, setAttributes } = props;
	//	const { customCssSelectors } = attributes;

	const customCssValue = getLastBreakpointAttribute(
		'custom-css',
		breakpoint,
		attributes
	);
	const customCssCategory = attributes['custom-css-category'];

	const isCanvas = blockName.includes('button-maxi') === true;

	const isCanvasBackgroundEnabled = !isEmpty(attributes['background-layers']);

	const isIconEnabled = !isEmpty(attributes['icon-content']);

	let selectorsCanvas;
	let selectorsBlock;
	let selectorsCanvasBefore;
	let selectorsCanvasAfter;
	let selectorsBlockBefore;
	let selectorsBlockAfter;
	let selectorsCanvasBackground;
	let selectorsIcon;
	let selectorsContent;

	const customCssSelectors = [];

	switch (blockName) {
		case 'maxi-blocks/button-maxi':
			selectorsCanvas = ['', ':hover'];
			selectorsBlock = [
				'.maxi-button-block__button',
				'.maxi-button-block__button:hover',
			];
			selectorsContent = [
				'.maxi-button-block__content',
				'.maxi-button-block__content:hover',
			];
			selectorsCanvasBackground = ['', ':hover'];
			selectorsIcon = [
				'.maxi-button-block__icon',
				'.maxi-button-block__icon svg',
				'.maxi-button-block__icon svg > *',
				'.maxi-button-block__icon svg path',
				'.maxi-button-block__icon:hover',
				'.maxi-button-block__icon:hover svg',
				'.maxi-button-block__icon:hover svg > *',
				'.maxi-button-block__icon:hover svg path',
			];
			selectorsCanvasBefore = [':before', ':hover:before'];
			selectorsCanvasAfter = [':after', ':hover:after'];
			selectorsBlockBefore = [
				'.maxi-button-block__button:before',
				'.maxi-button-block__button:hover:before',
			];
			selectorsBlockAfter = [
				'.maxi-button-block__button:after',
				'.maxi-button-block__button:hover:after',
			];
			break;
		default:
	}

	let customCssCategories = [];

	switch (blockName) {
		case 'maxi-blocks/button-maxi':
			isCanvas &&
				customCssCategories.push(
					'canvas',
					'before canvas',
					'after canvas'
				);
			isCanvas &&
				isCanvasBackgroundEnabled &&
				customCssCategories.push('canvas background');

			customCssCategories.push('button', 'before button', 'after button');
			isIconEnabled && customCssCategories.push('icon');

			break;

		default:
			customCssCategories = ['canvas', 'before canvas', 'after canvas'];
	}

	const getOptions = () => {
		const options = [
			{
				label: 'None',
				value: 'none',
			},
		];
		customCssCategories.forEach(category => {
			options.push({
				label: capitalize(category),
				value: category,
			});
		});
		return options;
	};

	const generateComponent = (label, index, category) => {
		const getValue = () => {
			if (
				customCssValue &&
				customCssValue[category] &&
				customCssValue[category][index]
			)
				return customCssValue[category][index];
			return '';
		};

		const labelForCss = label.replaceAll(' ', '_');
		const id = `maxi-additional__css-error-text__${labelForCss}`;

		async function validateCss(textarea) {
			const validMessage = await validateCSS(textarea.target.value);
			const messageDiv = document.getElementById(id);
			if (typeof validMessage === 'string' && messageDiv) {
				messageDiv.innerHTML = validMessage;
				messageDiv.classList.remove('valid');
				messageDiv.classList.add('not-valid');
			} else if (messageDiv) {
				messageDiv.innerHTML = __('Valid', 'maxi-blocks');
				messageDiv.classList.remove('not-valid');
				messageDiv.classList.add('valid');
			}
		}
		return (
			<BaseControl
				key={`${label}`}
				label={`${__('Custom CSS for', 'maxi-blocks')} ${label}`}
				className={`maxi-additional__css maxi-additional__css-${labelForCss}`}
			>
				<Button
					aria-label={__('Validate', 'maxi-blocks')}
					className='maxi-default-styles-control__button'
				>
					{__('Validate', 'maxi-blocks')}
				</Button>
				<CodeEditor
					language='css'
					value={getValue()}
					onChange={textarea => {
						const newCustomCss = !isEmpty(customCssValue)
							? cloneDeep(customCssValue)
							: {};
						if (isEmpty(newCustomCss[category]))
							newCustomCss[category] = {};

						newCustomCss[category][index] = textarea.target.value;
						setAttributes({
							[`custom-css-${breakpoint}`]: newCustomCss,
						});
					}}
					onBlur={textarea => {
						validateCss(textarea);
					}}
				/>
				<div className='maxi-additional__css-error' id={id} />
			</BaseControl>
		);
	};

	return {
		label: __('Custom CSS', 'maxi-blocks'),
		content: (
			<>
				{/* <ResponsiveTabsControl
					className='maxi-typography-control__text-options-tabs'
					breakpoint={breakpoint}
				> */}
				<SelectControl
					label={__('Add CSS for', 'maxi-blocks')}
					className='maxi-custom-css-control__category'
					value={customCssCategory || 'none'}
					options={getOptions()}
					onChange={val => {
						setAttributes({
							'custom-css-category': val,
						});
					}}
				/>
				{customCssCategory === 'canvas' &&
					selectorsCanvas.map((element, index) => {
						let label = element;
						if (isEmpty(element)) label = ' canvas';
						if (element === ':hover') label = ' canvas on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'before canvas' &&
					selectorsCanvasBefore.map((element, index) => {
						let label = ' canvas :before';
						if (element.includes(':hover'))
							label = ' canvas :before on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'after canvas' &&
					selectorsCanvasAfter.map((element, index) => {
						let label = ' canvas :after';
						if (element.includes(':hover'))
							label = ' canvas :after on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'canvas background' &&
					selectorsCanvasBackground.map((element, index) => {
						let label = ' canvas background';
						if (element.includes(':hover'))
							label = ' canvas background on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'button' &&
					selectorsBlock.map((element, index) => {
						let label = ' button';
						if (element.includes(':hover'))
							label = ' button on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'before button' &&
					selectorsBlockBefore.map((element, index) => {
						let label = ' button :before';
						if (element.includes(':hover'))
							label = ' button :before on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'after button' &&
					selectorsBlockAfter.map((element, index) => {
						let label = ' button :after';
						if (element.includes(':hover'))
							label = ' button :after on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'text' &&
					selectorsContent.map((element, index) => {
						let label = ' button text';
						if (element.includes(':hover'))
							label = ' button text on hover';
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}
				{customCssCategory === 'icon' &&
					selectorsIcon.map((element, index) => {
						let label = ' icon';
						if (element.includes('icon:hover'))
							label = ' icon on hover';
						if (element.includes('svg'))
							label = element.replace(
								'.maxi-button-block__icon',
								' '
							);
						return generateComponent(
							label,
							index,
							customCssCategory
						);
					})}

				{/* </ResponsiveTabsControl> */}
			</>
		),
	};
};

export default customCss;
