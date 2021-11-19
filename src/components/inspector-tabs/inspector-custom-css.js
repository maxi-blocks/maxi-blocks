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
const customCss = ({ props, breakpoint = 'general' }) => {
	const { attributes, setAttributes, blockName } = props;

	const customCssValue = getLastBreakpointAttribute(
		'custom-css',
		breakpoint,
		attributes
	);
	const customCssCategory = attributes['custom-css-category'];

	const isCanvasBackgroundEnabled = !isEmpty(attributes['background-layers']);
	const isIconEnabled = !isEmpty(attributes['icon-content']);

	let selectorsCanvas;
	let selectorsButton;
	let selectorsCanvasBefore;
	let selectorsCanvasAfter;
	let selectorsButtonBefore;
	let selectorsButtonAfter;
	let selectorsCanvasBackground;
	let selectorsIcon;
	let selectorsContent;
	let selectorsTitle;
	let selectorsAddress;
	let selectorsMap;
	let selectorsMapBefore;
	let selectorsMapAfter;

	// TODO: add all blocks
	switch (blockName) {
		case 'maxi-blocks/button-maxi':
			selectorsCanvas = ['', ':hover'];
			selectorsButton = [
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
			selectorsButtonBefore = [
				'.maxi-button-block__button:before',
				'.maxi-button-block__button:hover:before',
			];
			selectorsButtonAfter = [
				'.maxi-button-block__button:after',
				'.maxi-button-block__button:hover:after',
			];
			break;
		case 'maxi-blocks/map-maxi':
			selectorsMap = ['', ':hover'];
			selectorsMapBefore = [':before', ':hover:before'];
			selectorsMapAfter = [':after', ':hover:after'];
			selectorsTitle = [
				' .map-marker-info-window__title',
				':hover .map-marker-info-window__title',
			];
			selectorsAddress = [
				'  .map-marker-info-window__address',
				':hover .map-marker-info-window__address',
			];
			break;
		default:
			break;
	}

	let customCssCategories = [];

	// TODO: add other blocks here
	switch (blockName) {
		case 'maxi-blocks/button-maxi':
			customCssCategories.push('canvas', 'before canvas', 'after canvas');
			isCanvasBackgroundEnabled &&
				customCssCategories.push('canvas background');

			customCssCategories.push('button', 'before button', 'after button');
			isIconEnabled && customCssCategories.push('icon');

			break;
		case 'maxi-blocks/map-maxi':
			customCssCategories.push(
				'map',
				'before map',
				'after map',
				'title',
				'address'
			);
			break;

		default:
			customCssCategories = ['canvas', 'before canvas', 'after canvas'];
	}

	const getOptions = () => {
		const options = [
			{
				label: 'Choose',
				value: 'none',
			},
		];

		const isEmptyObject = obj => {
			if (obj)
				return Object.keys(obj).every(key => {
					return obj[key] === '' || obj[key] === null;
				});
			return true;
		};

		customCssCategories.forEach(category => {
			const optionClass = !isEmptyObject(customCssValue?.[category])
				? 'maxi-option__in-use'
				: 'maxi-option__not-in-use';

			options.push({
				label: capitalize(category),
				value: category,
				className: optionClass,
			});
		});
		return options;
	};

	const generateComponent = (label, index, category) => {
		const labelForCss = label.replaceAll(' ', '_');
		const id = `maxi-additional__css-error-text__${labelForCss}`;

		async function validateCss(textarea) {
			const messageDiv = document.getElementById(id);
			if (!isEmpty(textarea.target.value)) {
				const validMessage = await validateCSS(textarea.target.value);
				if (typeof validMessage === 'string' && messageDiv) {
					messageDiv.innerHTML = validMessage;
					messageDiv.classList.remove('valid');
					messageDiv.classList.add('not-valid');
				} else if (messageDiv) {
					messageDiv.innerHTML = __('Valid', 'maxi-blocks');
					messageDiv.classList.remove('not-valid');
					messageDiv.classList.add('valid');
				}
			} else if (messageDiv) {
				messageDiv.innerHTML = '';
				messageDiv.classList.remove('not-valid');
				messageDiv.classList.remove('valid');
			}
		}

		return (
			<BaseControl
				key={`${label}`}
				label={`${__('Custom CSS for', 'maxi-blocks')} ${label}`}
				className={`maxi-additional__css maxi-additional__css-${labelForCss}`}
			>
				{!isEmpty(customCssValue?.[category]?.[index]) && (
					<Button
						aria-label={__('Validate', 'maxi-blocks')}
						className='maxi-default-styles-control__button'
						onClick={el => {
							console.log(el);
							console.log(el.target);
						}}
					>
						{__('Validate', 'maxi-blocks')}
					</Button>
				)}
				<CodeEditor
					language='css'
					value={customCssValue?.[category]?.[index]}
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
				<ResponsiveTabsControl
					className='maxi-typography-control__text-options-tabs'
					breakpoint={breakpoint}
				>
					<>
						<SelectControl
							label={__('Add CSS for', 'maxi-blocks')}
							className='maxi-custom-css-control__category'
							id='maxi-custom-css-control__category'
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
								if (element === ':hover')
									label = ' canvas on hover';
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
							selectorsButton.map((element, index) => {
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
							selectorsButtonBefore.map((element, index) => {
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
							selectorsButtonAfter.map((element, index) => {
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
						{customCssCategory === 'map' &&
							selectorsMap.map((element, index) => {
								let label = ' map';
								if (element.includes(':hover'))
									label = ' map on hover';
								return generateComponent(
									label,
									index,
									customCssCategory
								);
							})}
						{customCssCategory === 'before map' &&
							selectorsMapBefore.map((element, index) => {
								let label = ' map :before';
								if (element.includes(':hover'))
									label = ' map :before on hover';
								return generateComponent(
									label,
									index,
									customCssCategory
								);
							})}
						{customCssCategory === 'after map' &&
							selectorsMapAfter.map((element, index) => {
								let label = ' map :after';
								if (element.includes(':hover'))
									label = ' map :after on hover';
								return generateComponent(
									label,
									index,
									customCssCategory
								);
							})}
						{customCssCategory === 'title' &&
							selectorsTitle.map((element, index) => {
								let label = ` ${customCssCategory}`;
								if (element.includes(':hover'))
									label = ` ${customCssCategory} on hover`;
								return generateComponent(
									label,
									index,
									customCssCategory
								);
							})}
						{customCssCategory === 'address' &&
							selectorsAddress.map((element, index) => {
								let label = ` ${customCssCategory}`;
								if (element.includes(':hover'))
									label = ` ${customCssCategory} on hover`;
								return generateComponent(
									label,
									index,
									customCssCategory
								);
							})}
					</>
				</ResponsiveTabsControl>
			</>
		),
	};
};

export default customCss;
