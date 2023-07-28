/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Button from '../../../button';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Styles
 */
import './editor.scss';

const ResultCard = ({
	result,
	isSelected,
	isRefOfSelected,
	onInsert,
	onSelect,
}) => {
	const className = 'maxi-prompt-control-results-card';

	const classes = classnames(
		className,
		isSelected && `${className}--selected`
	);

	const handleCopy = () => {
		navigator.clipboard.writeText(result.content);
	};

	return (
		<div className={classes}>
			<div
				id={`maxi-prompt-${result.id}`}
				className={`${className}__top-bar`}
			>
				<div
					className={`${className}__top-bar__select-row`}
					onClick={() => onSelect()}
				>
					<span
						className={`${className}__top-bar__select-row__select-text`}
					>
						{__(
							isSelected
								? `Selected${
										result.isSelectedText ? ' text' : ''
								  }`
								: result.isSelectedText
								? 'Selected text'
								: 'Select',
							'maxi-blocks'
						)}
					</span>
					<span className={`${className}__top-bar__select-row__id`}>
						#{result.id}
					</span>
				</div>
				{result.modificationType && (
					<div
						className={`${className}__modificator`}
						onClick={() => onSelect(result.refId)}
					>
						{__(`${result.modificationType}d from`, 'maxi-blocks')}{' '}
						<label className={`${className}__modificator__id`}>
							#{result.refId}
						</label>
					</div>
				)}
			</div>
			{result.content}
			{!result.isSelectedText && (
				<>
					<hr />
					<div>
						<Button onClick={onInsert}>
							{__(
								isRefOfSelected ? 'Replace selection' : 'Insert'
							)}
						</Button>
						<Button onClick={handleCopy}>{__('Copy')}</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default ResultCard;
