/**
 * WordPress dependencies
 */
import { RichText } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar, RawHTML } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

import { getIconPositionClass } from '../../extensions/styles';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';
import { closeIconPrefix } from './attributes';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Search block
 */
const SearchBlock = props => {
	const { attributes, isSelected, maxiSetAttributes } = props;
	const {
		'icon-content': buttonIcon,
		[`${closeIconPrefix}icon-content`]: closeButtonIcon,
		buttonContent,
		buttonContentClose,
		buttonSkin,
		iconRevealAction,
		placeholder,
		skin,
	} = attributes;

	let typingTimeout = 0;

	const [isInputOpen, setIsInputOpen] = useState(skin !== 'icon-reveal');

	useEffect(() => {
		setIsInputOpen(skin !== 'icon-reveal');
	}, [skin]);

	useEffect(() => {
		!isSelected && skin === 'icon-reveal' && setIsInputOpen(false);
	}, [isSelected]);

	const onInputToggle = () => {
		skin === 'icon-reveal' && setIsInputOpen(!isInputOpen);
	};

	const onInputChange = val => {
		setIsInputOpen(val);
	};

	const onInputChangeByHover = val => {
		iconRevealAction === 'hover' && onInputChange(val);
	};

	const onButtonContentChange = buttonContent => {
		if (typingTimeout) {
			clearTimeout(typingTimeout);
		}

		typingTimeout = setTimeout(() => {
			maxiSetAttributes({
				buttonContent,
			});
		}, 100);
	};

	const inputClasses = classnames(
		'maxi-search-block__input',
		!isInputOpen && 'maxi-search-block__input--hidden'
	);

	const buttonIconClasses = classnames(
		'maxi-search-block__button__icon',
		`maxi-search-block__button__${
			skin === 'icon-reveal' && isInputOpen
				? 'close-icon'
				: 'default-icon'
		}`
	);

	return (
		<>
			<input
				className={inputClasses}
				placeholder={placeholder}
				onMouseOver={() => onInputChangeByHover(true)}
				onMouseOut={event =>
					event.target !==
						document.querySelector('.editor-styles-wrapper')
							.ownerDocument.activeElement &&
					onInputChangeByHover(false)
				}
			/>
			<div
				className='maxi-search-block__button'
				onClick={() => iconRevealAction === 'click' && onInputToggle()}
				onMouseOver={() => onInputChangeByHover(true)}
				onMouseOut={() => onInputChangeByHover(false)}
			>
				{buttonSkin === 'icon' ? (
					buttonIcon && (
						<div className={buttonIconClasses}>
							<RawHTML>
								{skin === 'icon-reveal'
									? isInputOpen
										? closeButtonIcon
										: buttonIcon
									: buttonIcon}
							</RawHTML>
						</div>
					)
				) : skin !== 'icon-reveal' ? (
					<RichText
						className='maxi-search-block__button__content'
						value={buttonContent}
						identifier='content'
						onChange={onButtonContentChange}
						withoutInteractiveFormatting
					/>
				) : (
					<div className='maxi-search-block__button__content'>
						{isInputOpen ? buttonContentClose : buttonContent}
					</div>
				)}
			</div>
		</>
	);
};

/**
 * Edit
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const {
			'icon-content': buttonIconContent,
			[`${closeIconPrefix}icon-content`]: buttonCloseIconContent,
			buttonContent,
			buttonContentClose,
			buttonSkin,
			iconRevealAction,
			skin,
			uniqueID,
		} = attributes;

		return {
			search: {
				[uniqueID]: {
					buttonIconContent,
					buttonCloseIconContent,
					buttonContent,
					buttonContentClose,
					buttonSkin,
					iconRevealAction,
					skin,
				},
			},
		};
	}

	render() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const classes = classnames(
			'maxi-search-block',
			getIconPositionClass(
				attributes['icon-position'],
				'maxi-search-block'
			)
		);

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				{...getMaxiBlockAttributes(this.props)}
				classes={classes}
				key={`maxi-search--${uniqueID}`}
				ref={this.blockRef}
			>
				<SearchBlock {...this.props} />
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
