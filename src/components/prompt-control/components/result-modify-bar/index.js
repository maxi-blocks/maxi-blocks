/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';

/**
 * Internal dependencies
 */
import Button from '@components/button';
import ReactSelectControl from '@components/react-select-control';
import TextareaControl from '@components/textarea-control';
import { MODIFY_OPTIONS, LANGUAGES } from '@components/prompt-control/constants';

/**
 * Styles
 */
import './editor.scss';

const ResultModifyBar = ({
	modifyOption,
	onModifyContent,
	customValue,
	defaultLanguage,
	setModifyOption,
	setCustomValue,
}) => {
	const className = 'maxi-prompt-control-result-modify-bar';

	return (
		<div className={className}>
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
				/>
				<Button
					className={`${className}__button maxi-prompt-control__button`}
					onClick={onModifyContent}
				>
					{__('Modify', 'maxi-blocks')}
				</Button>
			</div>
			{modifyOption === 'custom' && (
				<TextareaControl
					className={`${className}__textarea`}
					placeholder={__(
						'More information gives better results',
						'maxi-blocks'
					)}
					value={customValue}
					onChange={value => setCustomValue(value)}
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

export default ResultModifyBar;
