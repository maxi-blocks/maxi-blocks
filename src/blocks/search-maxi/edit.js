/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RawHTML from '@components/raw-html';
import Toolbar from '@components/toolbar';
import MaxiBlock from '@components/maxi-block/maxiBlock';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { getMaxiBlockAttributes } from '@components/maxi-block';
import { getIconPositionClass } from '@extensions/styles';
import getStyles from './styles';
import { prefixes, copyPasteMapping } from './data';
import withMaxiDC from '@extensions/DC/withMaxiDC';

/**
 * Search block
 */
const SearchBlock = props => {
	const { closeIconPrefix } = prefixes;
	const { attributes, isSelected } = props;
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

	const [isInputOpen, setIsInputOpen] = useState(skin !== 'icon-reveal');

	useEffect(() => {
		setIsInputOpen(skin !== 'icon-reveal');
	}, [skin]);

	useEffect(() => {
		!isSelected && skin === 'icon-reveal' && setIsInputOpen(false);
	}, [isSelected]);

	const onInputToggle = () =>
		skin === 'icon-reveal' && setIsInputOpen(prev => !prev);

	const onInputChange = val => {
		setIsInputOpen(val);
	};

	const onInputChangeByHover = val => {
		iconRevealAction === 'hover' && onInputChange(val);
	};

	const inputClasses = classnames(
		'maxi-search-block__input',
		skin,
		skin === 'icon-reveal' &&
			!isInputOpen &&
			'maxi-search-block__input--hidden'
	);

	const buttonIconClasses = classnames(
		'maxi-search-block__button__icon',
		`maxi-search-block__button__${
			skin === 'icon-reveal' && isInputOpen
				? 'close-icon'
				: 'default-icon'
		}`
	);

	const renderButtonContent = () => {
		if (buttonSkin === 'icon' && buttonIcon)
			return (
				<div className={buttonIconClasses}>
					<RawHTML>
						{skin === 'icon-reveal'
							? isInputOpen
								? closeButtonIcon
								: buttonIcon
							: buttonIcon}
					</RawHTML>
				</div>
			);

		if (buttonSkin === 'text')
			return (
				<div className='maxi-search-block__button__content'>
					{isInputOpen && skin === 'icon-reveal'
						? buttonContentClose
						: buttonContent}
				</div>
			);

		return null;
	};

	return (
		<>
			<input
				className={inputClasses}
				type='text'
				placeholder={placeholder}
				onMouseOver={() => onInputChangeByHover(true)}
				onMouseOut={event =>
					event.target !== event.target.ownerDocument.activeElement &&
					onInputChangeByHover(false)
				}
			/>
			<div
				className='maxi-search-block__button'
				onClick={() => iconRevealAction === 'click' && onInputToggle()}
				onMouseOver={() => onInputChangeByHover(true)}
				onMouseOut={() => onInputChangeByHover(false)}
			>
				{renderButtonContent()}
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
		const { closeIconPrefix } = prefixes;
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
			[uniqueID]: {
				buttonIconContent,
				buttonCloseIconContent,
				buttonContent,
				buttonContentClose,
				buttonSkin,
				iconRevealAction,
				skin,
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
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				setShowLoader={value => this.setState({ showLoader: value })}
			/>,
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
				showLoader={this.state.showLoader}
			>
				<SearchBlock {...this.props} />
			</MaxiBlock>,
		];
	}
}

export default withMaxiDC(withMaxiProps(edit));
