/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { compose } from '@wordpress/compose';
import { Fragment, RawHTML } from '@wordpress/element';
import { Button, Modal } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';
import { __experimentalBlock } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	BackgroundDisplayer,
	MaxiBlock,
	MotionPreview,
	Toolbar,
} from '../../components';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
	getPaletteClasses,
} from '../../extensions/styles';
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
		isOpenSvgModal: false,
	};

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus =
			!!this.props.attributes['motion-status'] ||
			!isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, [
						'motion',
						'entrance',
					]),
				}),
			},
		};
	}

	render() {
		const { className, attributes, clientId, deviceType } = this.props;
		const {
			uniqueID,
			blockStyle,
			extraClassName,
			fullWidth,
			parentBlockStyle,
		} = attributes;

		const classes = classnames(
			'maxi-block',
			'maxi-block--backend',
			'maxi-svg-icon-block',
			getLastBreakpointAttribute(
				'display',
				deviceType,
				attributes,
				false,
				true
			) === 'none' && 'maxi-block-display-none',
			blockStyle,
			getPaletteClasses(
				attributes,
				[
					'background',
					'background-hover',
					'border',
					'border-hover',
					'box-shadow',
					'box-shadow-hover',
					'svgColorFill',
					'svgColorLine',
				],
				'maxi-blocks/svg-icon-maxi',
				parentBlockStyle
			),
			extraClassName,
			uniqueID,
			className
		);

		const onClick = () => {
			this.setState({
				isOpenSvgModal: true,
			});
		};

		const onClose = () => {
			this.setState({
				isOpenSvgModal: false,
			});
		};

		const { isOpenSvgModal } = this.state;

		return [
			!isEmpty(attributes.content) && (
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
			),
			!isEmpty(attributes.content) && (
				<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />
			),
			<MotionPreview
				key={`motion-preview-${uniqueID}`}
				{...getGroupAttributes(attributes, 'motion')}
			>
				<__experimentalBlock
					className={classes}
					data-align={fullWidth}
					key={clientId}
				>
					<Fragment>
						{isEmpty(attributes.content) && (
							<Fragment>
								<div className='maxi-svg-icon-block__placeholder'>
									<Button
										isPrimary
										isLarge
										key={`maxi-block-library__modal-button--${clientId}`}
										className='maxi-block-library__modal-button'
										onClick={onClick}
									>
										{__('Select SVG Icon', 'maxi-blocks')}
									</Button>
								</div>
							</Fragment>
						)}
						{isOpenSvgModal && (
							<Modal
								key={`maxi-block-library__modal--${clientId}`}
								className={`maxi-block-library__modal maxi-block-id-${clientId}`}
								title={__(
									'Maxi Cloud Icons Library',
									'maxi-blocks'
								)}
								shouldCloseOnEsc
								shouldCloseOnClickOutside={false}
								onRequestClose={onClose}
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
			</MotionPreview>,
		];
	}
}

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
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

			setAttributes({
				content: newContent,
			});
		}
	};

	const changeSVGContent = (color, colorNumber) => {
		let [regexLineToChange, changeTo, regexLineToChange2, changeTo2] = '';

		if (colorNumber === 1) {
			regexLineToChange = new RegExp('fill:[^n]+?(?=})', 'g');
			changeTo = `fill:${color}`;

			regexLineToChange2 = new RegExp('[^-]fill="[^n]+?(?=")', 'g');
			changeTo2 = ` fill="${color}`;
		}
		if (colorNumber === 2) {
			regexLineToChange = new RegExp('stroke:[^n]+?(?=})', 'g');
			changeTo = `stroke:${color}`;

			regexLineToChange2 = new RegExp('[^-]stroke="[^n]+?(?=")', 'g');
			changeTo2 = ` stroke="${color}`;
		}

		const newContent = content
			.replace(regexLineToChange, changeTo)
			.replace(regexLineToChange2, changeTo2);
		setAttributes({ content: newContent });
	};

	return {
		changeSVGSize,
		changeSVGStrokeWidth,
		changeSVGContent,
	};
});

export default compose(editSelect, editDispatch)(edit);
