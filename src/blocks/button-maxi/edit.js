/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { RawHTML, createRef, forwardRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getIconPositionClass } from '../../extensions/styles';
import getStyles from './styles';
import IconToolbar from '../../components/toolbar/iconToolbar';
import { copyPasteMapping, maxiAttributes } from './data';

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

	scProps = {
		scElements: [
			'hover-border-color-global',
			'hover-border-color-all',
			'hover-color-global',
			'hover-color-all',
			'hover-background-color-global',
			'hover-background-color-all',
		],
		scType: 'button',
	};

	typingTimeout = 0;

	// eslint-disable-next-line class-methods-use-this
	getMaxiAttributes() {
		return maxiAttributes;
	}

	get getStylesObject() {
		const { attributes } = this.props;
		const { scValues } = this.state;

		return getStyles(attributes, scValues);
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const { uniqueID } = attributes;
		const { scValues } = this.state;

		const buttonClasses = classnames(
			'maxi-button-block__button',
			getIconPositionClass(
				attributes['icon-position'],
				'maxi-button-block__button'
			)
		);

		const inlineStylesTargets = {
			background: '.maxi-button-block__button',
			border: '.maxi-button-block__button',
			boxShadow: '.maxi-button-block__button',
		};

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['buttonContent', 'formatValue']}
				inlineStylesTargets={inlineStylesTargets}
				scValues={scValues}
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
				inlineStylesTargets={inlineStylesTargets}
				scValues={scValues}
			/>,
			<MaxiBlock
				key={`maxi-button--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				<div className={buttonClasses}>
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
								ref={
									attributes['icon-position'] === 'top' ||
									attributes['icon-position'] === 'bottom'
										? this.blockRef
										: this.iconRef
								}
								{...this.props}
								propsToAvoid={['buttonContent', 'formatValue']}
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

export default withMaxiProps(edit);
