/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { RichText } from '@wordpress/block-editor';
import { RawHTML, createRef, forwardRef, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
import getStyles from './styles';
import IconToolbar from '../../components/toolbar/iconToolbar';
import { addMotion, removeMotion } from '../../extensions/motions/maxi-motions';
import motionData from '../../extensions/motions';

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
		ref.current.ownerDocument.addEventListener(
			'mousedown',
			handleClickOutside
		);

		return () => {
			// Unbind the event listener on clean up
			ref.current.ownerDocument.removeEventListener(
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

		const motionPreviewStatus =
			this.props.attributes['motion-preview-status'];

		this.state = {
			currentMotion: motionPreviewStatus,
			isIconSelected: false,
		};
	}

	typingTimeout = 0;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	render() {
		const { attributes, setAttributes } = this.props;
		const { uniqueID, blockFullWidth, fullWidth } = attributes;
		const { currentMotion, isIconSelected } = this.state;

		const buttonClasses = classnames(
			'maxi-button-block__button',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'left' &&
				'maxi-button-block__button--icon-left',
			attributes['icon-content'] &&
				attributes['icon-position'] === 'right' &&
				'maxi-button-block__button--icon-right',
			currentMotion && 'maxi-block-motion'
		);

		currentMotion ? addMotion() : removeMotion(uniqueID);

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
				propsToAvoid={['buttonContent', 'formatValue']}
			/>,
			<MaxiBlock
				key={`maxi-button--${uniqueID}`}
				ref={this.blockRef}
				blockFullWidth={blockFullWidth}
				{...motionData(this.props)}
				{...getMaxiBlockBlockAttributes(this.props)}
				disableBackground
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
									setAttributes({ buttonContent });
								}, 100);
							}}
							placeholder={__('Set some text…', 'maxi-blocks')}
							withoutInteractiveFormatting
							__unstableDisableFormats
						/>
					)}
					{attributes['icon-content'] && (
						<>
							<IconToolbar
								key={`icon-toolbar-${uniqueID}`}
								ref={this.iconRef}
								{...this.props}
								propsToAvoid={['buttonContent', 'formatValue']}
								isSelected={isIconSelected}
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

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect)(edit);
