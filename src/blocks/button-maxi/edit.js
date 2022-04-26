/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { RawHTML, createRef, forwardRef } from '@wordpress/element';

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
import copyPasteMapping from './copy-paste-mapping';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Content
 */
const IconWrapper = forwardRef((props, ref) => {
	const { children, className } = props;

	return (
		<div ref={ref} className={className}>
			{children}
		</div>
	);
});
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.iconRef = createRef(null);
	}

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
				copyPasteMapping={copyPasteMapping}
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
		const fillRegExp = new RegExp(
			`(((?<!hover )\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))`,
			'g'
		);
		const fillStr = `$2{${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
		const fillStr2 = ` ${type}="${color}`;

		const newContent = content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		maxiSetAttributes({ 'icon-content': newContent });
	};

	const changeSVGContentHover = (color, type) => {
		let newContent = ownProps.attributes['icon-content'];

		if (newContent.includes(`data-hover-${type}`)) return;

		const svgRegExp = new RegExp(`( ${type}=[^-]([^none])([^\\"]+))`, 'g');
		const svgStr = ` data-hover-${type}$1`;

		const cssRegExpOld = new RegExp(
			`((\.maxi-button-block__button:hover \.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))(})`,
			'g'
		);
		const cssStrOld = '';

		const cssRegExp = new RegExp(
			`(((?<!hover)\\.-?[_a-zA-Z]+[_a-zA-Z0-9-]* \.-?[_a-zA-Z]+[_a-zA-Z0-9-]*\s*)\{${type}:([^none])([^\\}]+))`,
			'g'
		);
		const cssStr = `$1}.maxi-button-block__button:hover $2{${type}:${color}`;

		newContent = newContent
			.replace(svgRegExp, svgStr)
			.replace(cssRegExpOld, cssStrOld)
			.replace(cssRegExp, cssStr);

		newContent !== ownProps.attributes['icon-content'] &&
			maxiSetAttributes({ 'icon-content': newContent });
	};

	return {
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentHover,
		changeSVGContentWithBlockStyle,
	};
});

export default compose(editSelect, withMaxiProps, editDispatch)(edit);
