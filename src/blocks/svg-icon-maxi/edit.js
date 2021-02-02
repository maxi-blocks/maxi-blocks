/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;
const { compose } = wp.compose;
const { Fragment, RawHTML } = wp.element;
const { Button, Modal } = wp.components;
const { withSelect, withDispatch } = wp.data;
const { __experimentalBlock } = wp.blockEditor;

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlock, Toolbar } from '../../components';
import MotionPreview from '../../components/motion-preview/newMotionPreview';
import BackgroundDisplayer from '../../components/background-displayer/newBackgroundDisplayer';
import getGroupAttributes from '../../extensions/styles/getGroupAttributes';
import getLastBreakpointAttribute from '../../extensions/styles/getLastBreakpointValue';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';
import Iframe from 'react-iframe';

/**
 * Icons
 */
import { toolbarReplaceImage } from '../../icons';

/**
 * Content
 */
class edit extends MaxiBlock {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		styles: {},
		breakpoints: this.getBreakpoints,
		isOpen: false,
	};

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, 'motion'),
					...getGroupAttributes(this.props.attributes, 'entrance'),
				}),
			},
		};
	}

	render() {
		const { className, attributes, clientId, deviceType } = this.props;
		const {
			uniqueID,
			blockStyle,
			defaultBlockStyle,
			blockStyleBackground,
			extraClassName,
		} = attributes;

		const { isOpen } = this.state;

		const onClick = () => {
			this.setState({ isOpen: !isOpen });
		};

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-svg-icon-block',
			getLastBreakpointAttribute('display', deviceType, attributes) ===
				'none' && 'maxi-block-display-none',
			blockStyle,
			blockStyle !== 'maxi-custom' &&
				`maxi-background--${blockStyleBackground}`,
			!!attributes['background-highlight'] &&
				'maxi-highlight--background',
			!!attributes['border-highlight'] && 'maxi-highlight--border',
			!!attributes['color1-highlight'] && 'maxi-highlight--color1',
			!!attributes['color2-highlight'] && 'maxi-highlight--color2',
			extraClassName,
			uniqueID,
			className
		);

		return [
			<Fragment>
				<Inspector {...this.props} />
				<Toolbar {...this.props} />
				<MotionPreview {...getGroupAttributes(attributes, 'motion')}>
					<__experimentalBlock
						className={classes}
						data-maxi_initial_block_class={defaultBlockStyle}
						key={clientId}
					>
						<Fragment>
							{isOpen && (
								<Modal
									key={`maxi-block-library__modal--${clientId}`}
									className='maxi-block-library__modal'
									title={__(
										'Maxi Cloud Icons Library',
										'maxi-blocks'
									)}
									shouldCloseOnEsc
									shouldCloseOnClickOutside={false}
									onRequestClose={onClick}
								>
									<Iframe
										url='https://ge-library.dev700.com/svg-search/'
										width='100%'
										height='90%'
										id='maxi-block-library__modal-iframe'
										className='maxi-block-library__modal-iframe'
										display='initial'
										position='relative'
									/>

									<div className='maxi-block-library__modal__loading_message maxi-block__item--hidden'>
										<p>{__('Saving…', 'maxi-blocks')}</p>
									</div>
								</Modal>
							)}
							{isEmpty(attributes.content) && (
								<Fragment>
									<div className='maxi-svg-icon-block__placeholder'>
										<Button
											key={`maxi-block-library__modal-button--${clientId}`}
											className='maxi-block-library__modal-button'
											onClick={onClick}
										>
											{__(
												'Select SVG Icon',
												'maxi-blocks'
											)}
										</Button>
									</div>
								</Fragment>
							)}
							{!isEmpty(attributes.content) && (
								<Fragment>
									<Button
										className='maxi-svg-icon-block__replace-icon'
										onClick={onClick}
										icon={toolbarReplaceImage}
									/>
									<BackgroundDisplayer
										{...getGroupAttributes(attributes, [
											'background',
											'backgroundColor',
											'backgroundHover',
											'backgroundColorHover',
										])}
									/>
									<RawHTML className='maxi-svg-icon-block__icon'>
										{attributes.content}
									</RawHTML>
								</Fragment>
							)}
						</Fragment>
					</__experimentalBlock>
				</MotionPreview>
			</Fragment>,
		];
	}
}

const editSelect = withSelect((select, ownProps) => {
	const {
		attributes: { content },
		setAttributes,
	} = ownProps;

	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	const isAnimatedSVG = () => {
		if (
			content.indexOf('<animate') !== -1 ||
			content.indexOf('<!--animate') !== -1
		) {
			if (content.indexOf('animateTransform') === -1) {
				const newContent = content.replace(
					/animateTransform'/g,
					'animatetransform'
				);

				setAttributes({ content: newContent });
			}
			return true;
		}
		return false;
	};

	const hasThirdColour =
		(content.indexOf('maxi-svg-color-third') !== -1 && true) || false;

	return {
		deviceType,
		isAnimatedSVG: isAnimatedSVG(),
		hasThirdColour,
	};
});

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: { content },
		setAttributes,
	} = ownProps;

	const changeSVGSize = width => {
		const regexLineToChange = new RegExp('width=".+?(?=")');
		const changeTo = `width="${width}`;

		const regexLineToChange2 = new RegExp('height=".+?(?=")');
		const changeTo2 = `height="${width}`;

		let newContent = content
			.replace(regexLineToChange, changeTo)
			.replace(regexLineToChange2, changeTo2);

		if (newContent.indexOf('viewBox') === -1) {
			const changeTo3 = ' viewBox="0 0 64 64"><defs>';
			newContent = newContent.replace(/><defs>/, changeTo3);
		}

		if (!isEmpty(newContent))
			setAttributes({
				content: newContent,
			});
	};

	const changeSVGAnimationDuration = duration => {
		const regexLineToChange = new RegExp('dur=".+?(?= )', 'g');
		const changeTo = `dur="${duration}s"`;
		const newContent = content.replace(regexLineToChange, changeTo);

		if (!isEmpty(newContent))
			setAttributes({
				content: newContent,
			});
	};

	const changeSVGAnimation = animation => {
		let newContent = '';

		switch (animation) {
			case 'loop':
				newContent = content.replace(
					/repeatCount="1"/g,
					'repeatCount="indefinite"'
				);
				newContent = newContent.replace(/dur="0"/g, 'dur="3.667s"');
				break;
			case 'load-once':
				newContent = content.replace(
					/repeatCount="indefinite"/g,
					'repeatCount="1"'
				);
				newContent = newContent.replace(/dur="0"/g, 'dur="3.667s"');
				break;
			case 'hover-loop':
				newContent = content.replace(
					new RegExp('dur=".+?(?= )', 'g'),
					'dur="0"'
				);
				break;
			case 'off':
				newContent = content.replace(
					new RegExp('dur=".+?(?= )', 'g'),
					'dur="0"'
				);
				break;
			case 'hover-once':
			case 'hover-off':
			default:
				return;
		}

		if (!isEmpty(newContent))
			setAttributes({
				content: newContent,
			});
	};

	const changeSVGStrokeWidth = width => {
		if (width) {
			const regexLineToChange = new RegExp('stroke-width=".+?(?= )', 'g');
			const changeTo = `stroke-width="${width}"`;
			const newContent = content.replace(regexLineToChange, changeTo);

			setAttributes({
				content: newContent,
			});
		}
	};

	const changeSVGContent = (color, colorNumber) => {
		let colorClass = '';
		switch (colorNumber) {
			case 1:
				colorClass = 'maxi-svg-color-first';
				break;
			case 2:
				colorClass = 'maxi-svg-color-second';
				break;
			case 3:
				colorClass = 'maxi-svg-color-third';
				break;
			default:
				return;
		}

		if (colorClass !== '') {
			const regexLineToChange = new RegExp(
				`${colorClass}" fill=".+?(?= )`,
				'g'
			);
			const regexLineToChange2 = new RegExp(
				`${colorClass}" stroke=".+?(?= )`,
				'g'
			);

			/// ^rgba?\(|\s+|\)$/g
			const changeTo = `${colorClass}" fill="${color}"`;
			const changeTo2 = `${colorClass}" stroke="${color}"`;
			const newContent = content
				.replace(regexLineToChange, changeTo)
				.replace(regexLineToChange2, changeTo2);

			setAttributes({ content: newContent });
		}
	};

	return {
		changeSVGSize,
		changeSVGAnimationDuration,
		changeSVGAnimation,
		changeSVGStrokeWidth,
		changeSVGContent,
	};
});

export default compose(editSelect, editDispatch)(edit);
