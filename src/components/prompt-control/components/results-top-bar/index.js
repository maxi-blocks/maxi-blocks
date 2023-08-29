/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	Button,
	ReactSelectControl,
	TextareaControl,
} from '../../../../components';
import { MODIFY_OPTIONS, LANGUAGES } from '../../constants';

/**
 * External dependencies
 */
import { isEmpty, capitalize } from 'lodash';

/**
 * Styles
 */
import './editor.scss';

const ResultsTopBar = ({
	results,
	selectedResultId,
	modifyOption,
	modifyContent,
	customValue,
	defaultLanguage,
	setModifyOption,
	setCustomValue,
	switchToGenerateTab,
}) => {
	const className = 'maxi-prompt-control-results-top-bar';

	return (
		<div className={className}>
			{(!isEmpty(results) || selectedResultId) && (
				<div className={`${className}__modification-options`}>
					<ReactSelectControl
						value={{
							label: __(capitalize(modifyOption), 'maxi-blocks'),
							value: modifyOption,
						}}
						defaultValue={{
							label: __(capitalize(modifyOption), 'maxi-blocks'),
							value: modifyOption,
						}}
						options={MODIFY_OPTIONS.map(option => ({
							label: __(capitalize(option), 'maxi-blocks'),
							value: option,
						}))}
						onChange={({ value }) => {
							setModifyOption(value);
							setCustomValue(
								value === 'translate' ? defaultLanguage : ''
							);
						}}
						isDisabled={isEmpty(results)}
						menuIsOpen
					/>
					<Button
						className={`${className}__button maxi-prompt-control__button`}
						onClick={modifyContent}
						disabled={isEmpty(results) && !selectedResultId}
					>
						{__('Go!', 'maxi-blocks')}
					</Button>
				</div>
			)}
			{modifyOption === 'custom' && (
				<TextareaControl
					className={`${className}__textarea`}
					placeholder={__(
						'More information gives better results',
						'maxi-blocks'
					)}
					value={customValue}
					onChange={value => setCustomValue(value)}
					disableResize
				/>
			)}
			{modifyOption === 'translate' && (
				<ReactSelectControl
					labelText={__('Translate to', 'maxi-blocks')}
					value={{
						label: __(customValue, 'maxi-blocks'),
						value: customValue,
					}}
					defaultValue={{
						label: __(customValue, 'maxi-blocks'),
						value: customValue,
					}}
					options={LANGUAGES.filter(
						language => language !== 'Language of the prompt'
					).map(option => ({
						label: __(option, 'maxi-blocks'),
						value: option,
					}))}
					onChange={({ value }) => setCustomValue(value)}
				/>
			)}
		</div>
	);
};

export default ResultsTopBar;
