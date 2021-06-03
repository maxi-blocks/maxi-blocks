/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import { compose } from '@wordpress/compose';
import { RawHTML } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { withSelect, withDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import CloudLibrary from '../../editor/library';
import { MaxiBlockComponent, Toolbar } from '../../components';
import { getGroupAttributes, getPaletteClasses } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import getStyles from './styles';

/**
 * External dependencies
 */
import classnames from 'classnames';
import { isEmpty } from 'lodash';

/**
 * Icons
 */
import { toolbarReplaceImage } from '../../icons';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
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
		const { attributes, clientId } = this.props;
		const { uniqueID, parentBlockStyle } = attributes;

		const classes = classnames(
			'maxi-svg-icon-block',
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
			)
		);

		const onClick = () => {
			this.setState({
				isOpenSvgModal: true,
			});
		};

		const { isOpenSvgModal } = this.state;

		return [
			!isEmpty(attributes.content) && (
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
			),
			!isEmpty(attributes.content) && (
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
				/>
			),
			<MaxiBlock
				key={`maxi-svg-icon--${uniqueID}`}
				ref={this.blockRef}
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<>
					{isEmpty(attributes.content) && (
						<>
							<div className='maxi-svg-icon-block__placeholder'>
								<Button
									isPrimary
									key={`maxi-block-library__modal-button--${clientId}`}
									className='maxi-block-library__modal-button'
									onClick={onClick}
								>
									{__('Select SVG Icon', 'maxi-blocks')}
								</Button>
							</div>
						</>
					)}
					{isOpenSvgModal && (
						<CloudLibrary
							cloudType='svg'
							onClose={() =>
								this.setState({
									isOpenSvgModal: !isOpenSvgModal,
								})
							}
						/>
					)}
					{!isEmpty(attributes.content) && (
						<>
							<Button
								className='maxi-svg-icon-block__replace-icon'
								onClick={onClick}
								icon={toolbarReplaceImage}
							/>
							<RawHTML className='maxi-svg-icon-block__icon'>
								{attributes.content}
							</RawHTML>
						</>
					)}
				</>
			</MaxiBlock>,
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
