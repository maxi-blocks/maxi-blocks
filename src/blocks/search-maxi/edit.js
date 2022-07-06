/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar, RawHTML } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';

import { getIconPositionClass } from '../../extensions/styles';
import getStyles from './styles';
// import copyPasteMapping from './copy-paste-mapping';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Edit
 */
const SearchBlock = props => {
	const { attributes, maxiSetAttributes } = props;
	const {
		'icon-content': searchButtonIcon,
		placeholder,
		searchButtonContent,
		searchButtonSkin,
		skin,
	} = attributes;

	let typingTimeout = 0;

	const [isInputOpen, setIsInputOpen] = useState(skin !== 'icon-reveal');

	const onInputToggle = () => {
		skin === 'icon-reveal' && setIsInputOpen(!isInputOpen);
	};

	const inputClasses = classnames(
		'maxi-search-block__input',
		!isInputOpen && 'maxi-search-block__input--hidden'
	);

	const buttonIconClasses = classnames(
		'maxi-search-block__button__icon',
		skin === 'icon-reveal'
			? isInputOpen
				? [
						'maxi-search-block__button__icon--open',
						'maxi-search-block__button__close-icon',
				  ]
				: 'maxi-search-block__button__icon--closed'
			: 'maxi-search-block__button__icon--open'
	);

	return (
		<>
			<RichText
				className={inputClasses}
				value={placeholder}
				onChange={placeholder => {
					if (typingTimeout) {
						clearTimeout(typingTimeout);
					}

					typingTimeout = setTimeout(() => {
						maxiSetAttributes({ placeholder });
					}, 100);
				}}
				identifier='content'
				withoutInteractiveFormatting
			/>

			<div className='maxi-search-block__button' onClick={onInputToggle}>
				{searchButtonSkin === 'icon' ? (
					searchButtonIcon && (
						<div className={buttonIconClasses}>
							<RawHTML>
								{skin === 'icon-reveal'
									? isInputOpen
										? attributes['close-icon-content']
										: searchButtonIcon
									: searchButtonIcon}
							</RawHTML>
						</div>
					)
				) : (
					<RichText
						className='maxi-search-block__button__content'
						value={searchButtonContent}
						identifier='content'
						onChange={searchButtonContent => {
							if (typingTimeout) {
								clearTimeout(typingTimeout);
							}

							typingTimeout = setTimeout(() => {
								maxiSetAttributes({ searchButtonContent });
							}, 100);
						}}
						withoutInteractiveFormatting
					/>
				)}
			</div>
		</>
	);
};

class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const {
			'icon-content': iconContent,
			'close-icon-content': closeIconContent,
			skin,
			uniqueID,
		} = attributes;

		return {
			search: {
				[uniqueID]: {
					iconContent,
					closeIconContent,
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
				// copyPasteMapping={copyPasteMapping}
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
