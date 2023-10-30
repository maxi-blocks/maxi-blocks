/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { capitalize } from 'lodash';
import classnames from 'classnames';
import loadable from '@loadable/component';

/**
 * Internal dependencies
 */
const Button = loadable(() => import('../../../button'));
const DialogBox = loadable(() => import('../../../dialog-box'));
const ResultModifyBar = loadable(() => import('../result-modify-bar'));
const Icon = loadable(() => import('../../../icon'));
import { CONTENT_LIMIT, MODIFICATION_MODIFICATORS } from '../../constants';

/**
 * Styles
 */
import './editor.scss';

/**
 * Icons
 */
import { promptDelete, promptCopy } from '../../../../icons';

const ResultCard = ({
	result,
	isSelected,
	isSelectedText,
	modifyOption,
	customValue,
	AISettingsLanguage,
	isRefExist,
	isModifyTab = false,
	disableScrollIntoView = false,
	setModifyOption,
	setCustomValue,
	onModifyContent,
	onInsert,
	onSelect,
	onUseSettings,
	onModify,
	onDelete,
}) => {
	const className = 'maxi-prompt-control-results-card';

	const classes = classnames(
		className,
		isSelected && `${className}--selected`,
		result.error && `${className}--error`
	);

	const ref = useRef();
	const endOfContentRef = useRef();

	const limitContent = (content, limit = CONTENT_LIMIT) => {
		if (content.length <= limit) {
			return content;
		}

		const lastSpaceIndex = content.lastIndexOf(' ', limit);

		return `${content.slice(0, lastSpaceIndex)}...`;
	};

	const [isLimited, setIsLimited] = useState(
		result.content.length > CONTENT_LIMIT
	);

	const handleScrollIntoEndOfContent = () => {
		endOfContentRef.current.scrollIntoView({
			behavior: 'instant',
			block: 'end',
		});
	};

	useEffect(() => {
		if (result.loading) {
			setIsLimited(false);
		}
	}, [result.loading]);

	useEffect(() => {
		if (result.loading) {
			handleScrollIntoEndOfContent();
		}
	}, [result.content, result.loading]);

	const handleScrollIntoView = () => {
		if (disableScrollIntoView) {
			return;
		}
		ref.current.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	};

	useEffect(() => {
		if (isSelected) {
			handleScrollIntoView();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSelected]);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(result.content);
		} catch (err) {
			console.error('MaxiBlocks. Failed to copy text: ', err);
		}
	};

	const getContent = () => {
		if (isLimited) {
			return limitContent(result.content);
		}

		return result.content;
	};

	const getSelectTextLabel = () => {
		if (result.isSelectedText) {
			return `${isSelected ? 'Text' : 'Select text'} selection`;
		}

		return `${isSelected ? 'Output' : 'Select'} result`;
	};

	return (
		<div className={classes} onClick={isSelected ? null : () => onSelect()}>
			<div className={`${className}__scroll-to`}>
				<div
					ref={ref}
					className={classnames(`${className}__scroll-to__inner`)}
				/>
			</div>
			<p className={`${className}__content`}>
				{result.error && (
					<span className={`${className}__content__error`}>
						{__('Error: ', 'maxi-blocks')}
					</span>
				)}
				{result.content === '' ? '\u00A0' : getContent()}
			</p>
			<div className={`${className}__end-of-content`}>
				<div
					ref={endOfContentRef}
					className={`${className}__end-of-content__inner`}
				/>
			</div>
			{result.content.length > CONTENT_LIMIT && !result.loading && (
				<Button
					className={`${className}__show-more`}
					onClick={() => {
						const newIsLimited = !isLimited;

						setIsLimited(newIsLimited);
						handleScrollIntoView();
					}}
				>
					{__(`Show ${isLimited ? 'more' : 'less'}`, 'maxi-blocks')}
				</Button>
			)}
			<div className={`${className}__top-bar`}>
				<div className={`${className}__top-bar__select-row`}>
					<div>
						{!result.isSelectedText && (
							<span
								className={`${className}__top-bar__select-row__id ${className}__top-bar__select-row__id_${
									isSelected ? 'output' : 'select'
								}`}
							>
								#{result.id}
							</span>
						)}{' '}
						<span
							className={`${className}__top-bar__select-row__select-text ${className}__top-bar__select-row__select-text_${
								isSelected ? 'output' : 'select'
							}`}
						>
							{__(
								// isSelected
								// 	? 'Output result'
								// 	: result.isSelectedText
								// 	? 'Select text selection'
								// 	: 'Select result',
								getSelectTextLabel(),
								'maxi-blocks'
							)}
						</span>
					</div>
					<div className={`${className}__content-length`}>
						{result.content.length}{' '}
						{__('characters', 'maxi-blocks')}
					</div>
				</div>
				{!isModifyTab && result.modificationType && (
					<div
						className={`${className}__modificator`}
						onClick={() => onSelect(result.refId)}
					>
						{__(
							`${capitalize(
								MODIFICATION_MODIFICATORS[
									result.modificationType
								]
							)} from`,
							'maxi-blocks'
						)}{' '}
						{result.refId && isRefExist && (
							<label
								className={classnames(
									isSelected &&
										`${className}__modificator__id`
								)}
							>
								#{result.refId}
							</label>
						)}
						{result.refId && !isRefExist && (
							<span
								className={`${className}__modificator__deleted`}
							>
								{__('deleted', 'maxi-blocks')}
							</span>
						)}
						{result.refFromSelectedText && (
							<span
								className={`${className}__modificator__from-selected-text`}
							>
								{__('selected text', 'maxi-blocks')}
							</span>
						)}
					</div>
				)}
			</div>
			{!isModifyTab && !result.isSelectedText && (
				<div className={`${className}__options`}>
					<Button
						className='maxi-prompt-control__button has-tooltip'
						onClick={handleCopy}
					>
						<span className='tooltip'>
							{__('Copy', 'maxi-blocks')}
						</span>
						<Icon icon={promptCopy} />
					</Button>
					<Button
						className='maxi-prompt-control__button'
						onClick={onInsert}
					>
						{__(
							isSelectedText ? 'Replace selection' : 'Insert',
							'maxi-blocks'
						)}
					</Button>
					{!result.refFromSelectedText && (
						<Button
							className='maxi-prompt-control__button'
							onClick={onUseSettings}
						>
							{__('Regenerate', 'maxi-blocks')}
						</Button>
					)}
					<Button
						className='maxi-prompt-control__button'
						onClick={onModify}
					>
						{__('Modify', 'maxi-blocks')}
					</Button>
					<DialogBox
						message={__(
							'Are you sure you want to delete the result?',
							'maxi-blocks'
						)}
						cancelLabel={__('Cancel', 'maxi-blocks')}
						confirmLabel={__('Delete', 'maxi-blocks')}
						onConfirm={onDelete}
						buttonClassName={`${className}__clean-history-button maxi-prompt-control__button has-tooltip`}
						buttonChildren={
							<>
								<span className='tooltip'>
									{__('Delete', 'maxi-blocks')}
								</span>
								<Icon icon={promptDelete} />
							</>
						}
					/>
				</div>
			)}
			{isSelected && isModifyTab && (
				<ResultModifyBar
					modifyOption={modifyOption}
					onModifyContent={onModifyContent}
					customValue={customValue}
					defaultLanguage={
						AISettingsLanguage !== 'Language of the prompt'
							? AISettingsLanguage
							: 'English (United Kingdom)'
					}
					setModifyOption={setModifyOption}
					setCustomValue={setCustomValue}
				/>
			)}
			{isModifyTab && !result.isSelectedText && onDelete && (
				<Button
					className={`${className}__clean-history-button`}
					onClick={onDelete}
				>
					Remove
				</Button>
			)}
		</div>
	);
};

export default ResultCard;
