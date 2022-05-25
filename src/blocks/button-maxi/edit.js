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

import getStyles from './styles';
import IconToolbar from '../../components/toolbar/iconToolbar';
import copyPasteMapping from './copy-paste-mapping';
import transitionDefault from '../../extensions/styles/transitions/transitionDefault';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Content
 */
export const transitionObj = {
	...transitionDefault,
	block: {
		typography: {
			title: 'Typography',
			target: ' .maxi-button-block__content',
			limitless: true,
		},
		'button background': {
			title: 'Button background',
			target: ' .maxi-button-block__button',
			property: 'background',
		},
		border: {
			title: 'Border',
			target: ' .maxi-button-block__button',
			property: 'border',
		},
		'box shadow': {
			title: 'Box shadow',
			target: ' .maxi-button-block__button',
			property: 'box-shadow',
		},
	},
};

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

	get getStylesObject() {
		const { attributes } = this.props;
		const { scValues } = this.state;

		return getStyles(attributes, scValues, transitionObj);
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const { uniqueID, blockFullWidth, fullWidth } = attributes;
		const { scValues } = this.state;

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right'
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
