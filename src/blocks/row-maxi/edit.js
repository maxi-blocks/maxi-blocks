/**
 * WordPress dependencies
 */
import { compose, withInstanceId } from '@wordpress/compose';
import { withSelect, useDispatch } from '@wordpress/data';
import { Button, Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import RowContext from './context';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import { getTemplates } from '../../extensions/column-templates';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';

/**
 * External dependencies
 */
import { uniqueId } from 'lodash';
import loadColumnsTemplate from '../../extensions/column-templates/loadColumnsTemplate';

/**
 * Edit
 */
const RowBlockTemplate = ({
	clientId,
	instanceId,
	maxiSetAttributes,
	deviceType,
	removeColumnGap,
}) => {
	const { selectBlock } = useDispatch('core/block-editor');

	return (
		<div
			className='maxi-row-block__template'
			onClick={() => selectBlock(clientId)}
			key={`maxi-row-block--${instanceId}`}
		>
			{getTemplates().map(template => {
				return (
					<Button
						key={uniqueId(`maxi-row-block--${instanceId}--`)}
						className='maxi-row-block__template__button'
						onClick={() => {
							maxiSetAttributes({
								'row-pattern-general': template.name,
								'row-pattern-m': template.responsiveLayout,
							});
							loadColumnsTemplate(
								template.name,
								removeColumnGap,
								clientId,
								deviceType
							);
						}}
					>
						<Icon
							className='maxi-row-block__template__icon'
							icon={template.icon}
						/>
					</Button>
				);
			})}
		</div>
	);
};

class edit extends MaxiBlockComponent {
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	state = {
		displayHandlers: false,
	};

	maxiBlockDidUpdate() {
		if (this.state.displayHandlers && !this.props.isSelected) {
			this.setState({
				displayHandlers: false,
			});
		}
	}

	render() {
		const {
			attributes,
			blockFullWidth,
			clientId,
			deviceType,
			hasInnerBlocks,
			instanceId,
			maxiSetAttributes,
		} = this.props;
		const { uniqueID, removeColumnGap } = attributes;

		const ALLOWED_BLOCKS = ['maxi-blocks/column-maxi'];

		const emptyRowClass = !hasInnerBlocks
			? 'maxi-row-block__empty'
			: 'maxi-row-block__has-innerBlock';

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				toggleHandlers={() => {
					this.setState({
						displayHandlers: !this.state.displayHandlers,
					});
				}}
				{...this.props}
			/>,
			<RowContext.Provider
				key={`row-content-${uniqueID}`}
				value={{
					displayHandlers: this.state.displayHandlers,
					rowPattern: getGroupAttributes(attributes, 'rowPattern'),
				}}
			>
				<MaxiBlock
					key={`maxi-row--${uniqueID}`}
					ref={this.blockRef}
					blockFullWidth={blockFullWidth}
					classes={emptyRowClass}
					{...getMaxiBlockAttributes(this.props)}
					useInnerBlocks
					innerBlocksSettings={{
						...(hasInnerBlocks && { templateLock: 'insert' }),
						allowedBlocks: ALLOWED_BLOCKS,
						orientation: 'horizontal',
						renderAppender: !hasInnerBlocks
							? () => (
									<RowBlockTemplate
										clientId={clientId}
										instanceId={instanceId}
										maxiSetAttributes={maxiSetAttributes}
										deviceType={deviceType}
										removeColumnGap={removeColumnGap}
									/>
							  )
							: false,
					}}
				/>
			</RowContext.Provider>,
		];
	}
}

export default compose(withInstanceId, withMaxiProps)(edit);
