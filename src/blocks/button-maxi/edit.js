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
import IconToolbar from '../../components/toolbar/iconToolbar';
import {
	getGroupAttributes,
	getIconPositionClass,
} from '../../extensions/styles';
import { getSVGWidthHeightRatio } from '../../extensions/svg';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';
import { getDCValues } from '../../extensions/DC';
import withMaxiDC from '../../extensions/DC/withMaxiDC';
import getAreaLabel from './utils';

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

		return getStyles(
			attributes,
			scValues,
			getSVGWidthHeightRatio(
				this.blockRef.current?.querySelector(
					'.maxi-button-block__icon svg'
				)
			)
		);
	}

	maxiBlockDidUpdate() {
		// Ensures white-space is applied from Maxi and not with inline styles
		Array.from(this.blockRef.current.children[0].children).forEach(el => {
			if (el.style.whiteSpace) el.style.whiteSpace = null;
		});
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const { uniqueID } = attributes;
		const {
			status: dcStatus,
			content: dcContent,
			field: dcField,
		} = getDCValues(
			getGroupAttributes(attributes, 'dynamicContent'),
			this.context?.contextLoop
		);
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
		const showDCContent = dcStatus && dcField !== 'static_text';

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
				{...(attributes['icon-only'] && {
					'aria-label': getAreaLabel(attributes['icon-content']),
				})}
			>
				<div className={buttonClasses}>
					{!attributes['icon-only'] && (
						<>
							{showDCContent && (
								<div className='maxi-button-block__content'>
									{dcContent}
								</div>
							)}
							{!showDCContent && (
								<RichText
									className='maxi-button-block__content'
									value={attributes.buttonContent}
									identifier='content'
									onChange={buttonContent => {
										if (this.typingTimeout) {
											clearTimeout(this.typingTimeout);
										}

										this.typingTimeout = setTimeout(() => {
											maxiSetAttributes({
												buttonContent,
											});
										}, 100);
									}}
									placeholder={__(
										'Button text',
										'maxi-blocks'
									)}
									withoutInteractiveFormatting
								/>
							)}
						</>
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

export default withMaxiDC(withMaxiProps(edit));
