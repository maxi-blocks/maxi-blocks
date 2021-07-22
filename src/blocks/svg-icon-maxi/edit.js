/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { RawHTML } from '@wordpress/element';
import { withSelect, withDispatch, dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import { getGroupAttributes } from '../../extensions/styles';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import MaxiModal from '../../editor/library/modal';
import getStyles from './styles';

/**
 * External dependencies
 */
import { isEmpty, uniqueId } from 'lodash';

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		isOpen: false,
	};

	componentDidUpdate(prevProps) {
		this.displayStyles();

		if (
			this.props.name === 'maxi-blocks/svg-icon-maxi' &&
			prevProps.attributes.uniqueID !== this.props.attributes.uniqueID
		) {
			const { updateBlockAttributes } = dispatch('core/block-editor');

			const svgCode = this.props.attributes.content;

			const svgClass = svgCode.match(/ class="(.+?(?=))"/)[1];
			const newSvgClass = `${svgClass}__${uniqueId()}`;
			const replaceIt = `${svgClass}`;

			const finalSvgCode = svgCode.replaceAll(replaceIt, newSvgClass);

			updateBlockAttributes(this.props.clientId, {
				content: finalSvgCode,
			});
		}
	}

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
		const { uniqueID, parentBlockStyle, content, openFirstTime } =
			attributes;

		const isEmptyContent = isEmpty(content);

		return [
			!isEmptyContent && (
				<Inspector key={`block-settings-${uniqueID}`} {...this.props} />
			),
			!isEmptyContent && (
				<Toolbar
					key={`toolbar-${uniqueID}`}
					ref={this.blockRef}
					{...this.props}
				/>
			),
			<MaxiBlock
				key={`maxi-svg-icon--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<>
					<MaxiModal
						clientId={clientId}
						type='svg'
						empty={isEmptyContent}
						style={parentBlockStyle}
						openFirstTime={openFirstTime}
					/>
					{!isEmptyContent && (
						<RawHTML className='maxi-svg-icon-block__icon'>
							{content}
						</RawHTML>
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

	const changeSVGContentWithBlockStyle = (fillColor, strokeColor) => {
		const fillRegExp = new RegExp('fill:([^none])([^\\}]+)', 'g');
		const fillStr = `fill:${fillColor}`;

		const fillRegExp2 = new RegExp('fill=[^-]([^none])([^\\"]+)', 'g');
		const fillStr2 = ` fill="${fillColor}`;

		const strokeRegExp = new RegExp('stroke:([^none])([^\\}]+)', 'g');
		const strokeStr = `stroke:${strokeColor}`;

		const strokeRegExp2 = new RegExp('stroke=[^-]([^none])([^\\"]+)', 'g');
		const strokeStr2 = ` stroke="${strokeColor}`;

		const newContent = ownProps.attributes.content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		setAttributes({ content: newContent });
	};

	const changeSVGContent = (color, type) => {
		const fillRegExp = new RegExp(`${type}:([^none])([^\\}]+)`, 'g');
		const fillStr = `${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=[^-]([^none])([^\\"]+)`, 'g');
		const fillStr2 = ` ${type}="${color}`;

		const newContent = ownProps.attributes.content
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		setAttributes({ content: newContent });
	};

	return {
		changeSVGSize,
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
	};
});

export default compose(editSelect, editDispatch)(edit);
