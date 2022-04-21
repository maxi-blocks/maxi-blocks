/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { RawHTML, createRef, forwardRef, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import getStyles from './styles';
import IconToolbar from '../../components/toolbar/iconToolbar';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Content
 */
const IconWrapper = forwardRef((props, ref) => {
	const { children, className, changeIsSelected, uniqueID } = props;

	useEffect(() => {
		const handleClickOutside = event => {
			if (ref.current && !ref.current.contains(event.target)) {
				changeIsSelected(
					document
						.querySelector(`.${uniqueID}`)
						.classList.contains('is-selected')
				);
			}
		};

		// Bind the event listener
		ref?.current?.ownerDocument.addEventListener(
			'mousedown',
			handleClickOutside
		);

		return () => {
			// Unbind the event listener on clean up
			ref?.current?.ownerDocument.removeEventListener(
				'mousedown',
				handleClickOutside
			);
		};
	}, [ref]);

	return (
		<div
			onClick={() => changeIsSelected(true)}
			ref={ref}
			className={className}
		>
			{children}
		</div>
	);
});
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.iconRef = createRef(null);
	}

	state = {
		isIconSelected: false,
	};

	typingTimeout = 0;

	get getStylesObject() {
		const { attributes, scValues } = this.props;

		return getStyles(attributes, scValues);
	}

	render() {
		const { attributes, maxiSetAttributes, changeSVGContent } = this.props;
		const { uniqueID, blockFullWidth, fullWidth } = attributes;

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
		);

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['buttonContent', 'formatValue']}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				prefix='button-'
				backgroundGlobalProps={{
					target: 'background',
					type: 'button',
				}}
				backgroundAdvancedOptions='button background'
				propsToAvoid={['buttonContent', 'formatValue']}
			/>,
			<MaxiBlock
				key={`maxi-button--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				{...getMaxiBlockAttributes(this.props)}
			>
				<div data-align={fullWidth} className={buttonClasses}>
					{!attributes['icon-only'] && (
						<RichText
							className='maxi-button-block__content'
							value={attributes.buttonContent}
							identifier='content'
							onChange={buttonContent => {
								if (this.typingTimeout) {
									clearTimeout(this.typingTimeout);
								}

								this.typingTimeout = setTimeout(() => {
									maxiSetAttributes({ buttonContent });
								}, 100);
							}}
							placeholder={__('Set some text…', 'maxi-blocks')}
							withoutInteractiveFormatting
						/>
					)}
					{attributes['icon-content'] && (
						<>
							<IconToolbar
								key={`icon-toolbar-${uniqueID}`}
								ref={this.iconRef}
								{...this.props}
								propsToAvoid={['buttonContent', 'formatValue']}
								changeSVGContent={changeSVGContent}
							/>
							<IconWrapper
								ref={this.iconRef}
								uniqueID={uniqueID}
								className='maxi-button-block__icon'
								changeIsSelected={isIconSelected =>
									this.setState({ isIconSelected })
								}
							>
								<RawHTML>{attributes['icon-content']}</RawHTML>
							</IconWrapper>
						</>
					)}
				</div>
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const {
		attributes: { parentBlockStyle },
	} = ownProps;

	const { receiveStyleCardValue } = select('maxiBlocks/style-cards');
	const scElements = [
		'hover-border-color-global',
		'hover-border-color-all',
		'hover-color-global',
		'hover-color-all',
		'hover-background-color-global',
		'hover-background-color-all',
	];
	const scValues = receiveStyleCardValue(
		scElements,
		parentBlockStyle,
		'button'
	);

	return {
		scValues,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: { 'icon-content': content },
		maxiSetAttributes,
	} = ownProps;

	const changeSVGStrokeWidth = width => {
		if (width) {
			const regexLineToChange = new RegExp('stroke-width:.+?(?=})', 'g');
			const changeTo = `stroke-width:${width}`;

			const regexLineToChange2 = new RegExp(
				'stroke-width=".+?(?=")',
				'g'
			);
			const changeTo2 = `stroke-width="${width}`;

			const newContent = content
				.replace(regexLineToChange, changeTo)
				.replace(regexLineToChange2, changeTo2);

			maxiSetAttributes({
				'icon-content': newContent,
			});
		}
	};

	const changeSVGContentWithBlockStyle = (fillColor, strokeColor) => {
		const fillRegExp = new RegExp('fill:([^none])([^\\}]+)', 'g');
		const fillStr = `fill:${fillColor}`;

		const fillRegExp2 = new RegExp('fill=[^-]([^none])([^\\"]+)', 'g');
		const fillStr2 = ` fill="${fillColor}`;

		const strokeRegExp = new RegExp('stroke:([^none])([^\\}]+)', 'g');
		const strokeStr = `stroke:${strokeColor}`;

		const strokeRegExp2 = new RegExp('stroke=[^-]([^none])([^\\"]+)', 'g');
		const strokeStr2 = ` stroke="${strokeColor}`;

		const newContent = content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		maxiSetAttributes({ 'icon-content': newContent });
	};

	const changeSVGContent = (color, type) => {
		const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
		const fillStr = `${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
		const fillStr2 = ` ${type}="${color}`;

		const newContent = content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		maxiSetAttributes({ 'icon-content': newContent });
	};

	return {
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
	};
});

export default compose(editSelect, withMaxiProps, editDispatch)(edit);
