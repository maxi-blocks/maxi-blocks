/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	Button,
	DialogBox,
	ReactSelectControl,
	TextareaControl,
} from '../../../../components';
import { MODIFY_OPTIONS } from '../../constants';

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
	customText,
	cleanHistory,
	setModifyOption,
	setCustomText,
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
						onChange={({ value }) => setModifyOption(value)}
						isDisabled={isEmpty(results)}
					/>
					<Button
						className={`${className}__button`}
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
					value={customText}
					onChange={val => setCustomText(val)}
					disableResize
				/>
			)}
			<div className='maxi-prompt-control-modify-tab__buttons'>
				{results.every(result => !result.isSelectedText) && (
					<Button
						className='maxi-prompt-control-modify-tab__button'
						onClick={switchToGenerateTab}
					>
						{__('Back', 'maxi-blocks')}
					</Button>
				)}
				{!isEmpty(results) && (
					<DialogBox
						message={__(
							'Are you sure you want to clean the history?',
							'maxi-blocks'
						)}
						cancelLabel={__('Cancel', 'maxi-blocks')}
						confirmLabel={__('Clean', 'maxi-blocks')}
						onConfirm={cleanHistory}
						buttonClassName={`maxi-prompt-control-modify-tab__button ${className}__clean-history-button`}
						buttonChildren={__('Clean history', 'maxi-blocks')}
					/>
				)}
			</div>
		</div>
	);
};

export default ResultsTopBar;
