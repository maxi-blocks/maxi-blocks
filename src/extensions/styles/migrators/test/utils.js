/**
 * WordPress dependencies
 */
import { cloneElement, renderToString } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	getBlockNameFromUniqueID,
	getBlockSelectorsByUniqueID,
	getMigratorsCombinations,
} from '../utils';
// import { handleBlockMigrator } from '../blockMigrator';

jest.mock('src/components/index.js', () => jest.fn());

describe.skip('getMigratorsCombinations', () => {
	it('Should return a one element array', () => {
		const mainMigrator = {
			isEligible: null,
			attributes: {},
			migrate: null,
		};

		const migrators = [
			{ ...mainMigrator, saveMigrator: 1 },
			{ ...mainMigrator, saveMigrator: 2 },
			{ ...mainMigrator, saveMigrator: 3 },
			{ ...mainMigrator, saveMigrator: 4 },
		];

		expect(getMigratorsCombinations(migrators)).toMatchSnapshot();
	});
});

const TestComponent = ({
	content = 'Testing',
	className = 'random',
	tagName: TagName = 'h1',
	...restProps
}) => (
	<TagName className={className} {...restProps}>
		{content}
	</TagName>
);

describe.skip('handleBlockMigrator', () => {
	it('Should return a one element array', () => {
		const mainMigrator = {
			isEligible: null,
			attributes: () => {},
			migrate: null,
			save: () => null,
		};

		const migrators = [
			{
				...mainMigrator,
				// Modifies content
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						content: 'Modified content',
					});

					return newInstance;
				},
			},
			{
				...mainMigrator,
				// Add a new attribute
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						'data-align': 'full',
					});

					return newInstance;
				},
			},
			{
				...mainMigrator,
				// Add a new className
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						className: `${saveInstance.props.className} new-class`,
					});

					return newInstance;
				},
			},
			{
				...mainMigrator,
				// Change tagName
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						tagName: 'p',
					});

					return newInstance;
				},
			},
		];

		const finalMigrators = handleBlockMigrator({
			migrators,
			save: props => (
				<TestComponent className='test-migrators' {...props} />
			),
		});

		const result = finalMigrators.map(migrator =>
			renderToString(migrator.save({ content: 'test' }))
		);

		expect(result).toMatchSnapshot();
	});
});

describe('getBlockNameFromUniqueID', () => {
	it('Should return the block name', () =>
		expect(getBlockNameFromUniqueID('button-maxi-5')).toMatchSnapshot());

	it('Should return the block name, when uniqueID is big digit', () =>
		expect(getBlockNameFromUniqueID('text-maxi-123456')).toMatchSnapshot());
});

describe('getBlockSelectorsByUniqueID', () => {
	[
		'accordion',
		'button',
		'column',
		'container',
		'divider',
		'group',
		'image',
		'map',
		'number-counter',
		'pane',
		'row',
		'search',
		'svg-icon',
		'text',
		'video',
	].forEach(blockName => {
		it(`Should return ${blockName} selectors`, () =>
			expect(
				getBlockSelectorsByUniqueID(`${blockName}-maxi-5`)
			).toMatchSnapshot());
	});
});
