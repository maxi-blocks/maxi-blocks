/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { RawHTML, createRef, forwardRef } from '@wordpress/element';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Toolbar from '@components/toolbar';
import { MaxiBlockComponent, withMaxiProps } from '@extensions/maxi-block';
import { MaxiBlock, getMaxiBlockAttributes } from '@components/maxi-block';
import { getGroupAttributes, getIconPositionClass } from '@extensions/styles';
import { getSVGWidthHeightRatio } from '@extensions/svg';
import getStyles from './styles';
import { copyPasteMapping, maxiAttributes } from './data';
import { getDCValues, withMaxiContextLoopContext } from '@extensions/DC';
import withMaxiDC from '@extensions/DC/withMaxiDC';
import getAreaLabel from './utils';

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

		// Track if this is a new block with no xxl padding values set yet
		this.initialBlockSetupDone = false;
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
				this.blockRef?.current?.querySelector(
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

	// Apply xxl padding only for new button blocks
	maxiBlockDidMount() {
		const { attributes, maxiSetAttributes } = this.props;

		// First check if this is a new button (empty content and empty icon)
		const isNewButton =
			attributes.buttonContent === undefined &&
			!attributes['dc-status'] &&
			attributes['icon-content'] === '';

		// Only set xxl padding for new buttons
		if (isNewButton && !this.initialBlockSetupDone) {
			this.initialBlockSetupDone = true;

			// Check if xxl padding attributes exist, use defaults if not
			const xxlPaddingTop = attributes['button-padding-top-xxl']
				? attributes['button-padding-top-xxl']
				: '23';
			const xxlPaddingRight = attributes['button-padding-right-xxl']
				? attributes['button-padding-right-xxl']
				: '55';
			const xxlPaddingBottom = attributes['button-padding-bottom-xxl']
				? attributes['button-padding-bottom-xxl']
				: '23';
			const xxlPaddingLeft = attributes['button-padding-left-xxl']
				? attributes['button-padding-left-xxl']
				: '55';

			// Set the xxl padding values
			maxiSetAttributes({
				'button-padding-top-xxl': xxlPaddingTop,
				'button-padding-right-xxl': xxlPaddingRight,
				'button-padding-bottom-xxl': xxlPaddingBottom,
				'button-padding-left-xxl': xxlPaddingLeft,
			});
		}
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const { uniqueID } = attributes;
		const {
			status: dcStatus,
			content: dcContent,
			field: dcField,
			containsHtml: dcContainsHTML,
			subField,
		} = getDCValues(
			getGroupAttributes(attributes, 'dynamicContent'),
			this.props.contextLoopContext?.contextLoop
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
		const showDCContent =
			dcStatus && dcField !== 'static_text' && subField !== 'static_text';

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				propsToAvoid={['buttonContent', 'formatValue']}
				inlineStylesTargets={inlineStylesTargets}
				scValues={scValues}
				setShowLoader={value => this.setState({ showLoader: value })}
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
				showLoader={this.state.showLoader}
			>
				<div className={buttonClasses}>
					{!attributes['icon-only'] && (
						<>
							{showDCContent && (
								<div className='maxi-button-block__content'>
									{dcContainsHTML ? (
										<RawHTML>{dcContent}</RawHTML>
									) : (
										dcContent
									)}
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
											// Preserve blockStyle during typing if it exists
											const preservedBlockStyle =
												attributes.blockStyle;

											maxiSetAttributes({
												buttonContent,
											});

											// If blockStyle was lost during the setAttribute operation, restore it
											if (
												preservedBlockStyle &&
												attributes.blockStyle !==
													preservedBlockStyle
											) {
												maxiSetAttributes({
													blockStyle:
														preservedBlockStyle,
												});
											}
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
						<IconWrapper
							ref={this.iconRef}
							uniqueID={uniqueID}
							className='maxi-button-block__icon'
						>
							<RawHTML>{attributes['icon-content']}</RawHTML>
						</IconWrapper>
					)}
				</div>
			</MaxiBlock>,
		];
	}
}

export default withMaxiContextLoopContext(withMaxiDC(withMaxiProps(edit)));
