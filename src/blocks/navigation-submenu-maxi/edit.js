/**
 * Wordpress dependencies
 */
import { RichText, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getStyles from './styles';
import Inspector from './inspector';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { copyPasteMapping } from './data';
import NavigationContext from '../navigation-menu-maxi/context';

const DropDown = () => {
	const ALLOWED_BLOCKS = [
		'maxi-blocks/navigation-link-maxi',
		'maxi-blocks/navigation-submenu-maxi',
	];

	return (
		<ul
			{...useInnerBlocksProps(
				{
					className: 'maxi-navigation-submenu-block__dropdown',
				},
				{
					allowedBlocks: ALLOWED_BLOCKS,
				}
			)}
		/>
	);
};

/**
 * Content
 */
class edit extends MaxiBlockComponent {
	static contextType = NavigationContext;

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const response = {
			navigation_menu: {
				[uniqueID]: {},
			},
		};

		return response;
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const { uniqueID, label, url } = attributes;

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-navigation-submenu--${uniqueID}`}
				ref={this.blockRef}
				{...getMaxiBlockAttributes(this.props)}
			>
				<div className='maxi-navigation-submenu-block__content-wrapper'>
					<RichText
						className='maxi-navigation-submenu-block__content menu-item__content'
						href={url}
						value={label}
						identifier='content'
						onChange={label => {
							if (this.typingTimeout) {
								clearTimeout(this.typingTimeout);
							}

							this.typingTimeout = setTimeout(() => {
								maxiSetAttributes({ label });
							}, 100);
						}}
						placeholder={__('Add link', 'maxi-blocks')}
						withoutInteractiveFormatting
						tagName='a'
					/>
					<RawHTML>{this.context.submenuIcon}</RawHTML>
				</div>
				<DropDown />
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
