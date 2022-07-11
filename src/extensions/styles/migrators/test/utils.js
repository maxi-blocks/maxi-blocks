import { cloneElement, renderToString } from '@wordpress/element';

import { getMigratorsCombinations, migratorGenerator } from '../utils';

describe('getMigratorsCombinations', () => {
	it('Should return a one element array', () => {
		const baseMigrator = {
			isEligible: null,
			attributes: {},
			migrate: null,
		};

		const migrators = [
			{ ...baseMigrator, saveMigrator: 1 },
			{ ...baseMigrator, saveMigrator: 2 },
			{ ...baseMigrator, saveMigrator: 3 },
			{ ...baseMigrator, saveMigrator: 4 },
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

describe('migratorGenerator', () => {
	it('Should return a one element array', () => {
		const baseMigrator = {
			isEligible: null,
			attributes: {},
			migrate: null,
			save: () => null,
		};

		const migrators = [
			{
				...baseMigrator,
				// Modifies content
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						content: 'Modified content',
					});

					return newInstance;
				},
			},
			{
				...baseMigrator,
				// Add a new attribute
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						'data-align': 'full',
					});

					return newInstance;
				},
			},
			{
				...baseMigrator,
				// Add a new className
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						className: `${saveInstance.props.className} new-class`,
					});

					return newInstance;
				},
			},
			{
				...baseMigrator,
				// Change tagName
				saveMigrator: saveInstance => {
					const newInstance = cloneElement(saveInstance, {
						tagName: 'p',
					});

					return newInstance;
				},
			},
		];

		const saveMigrators = getMigratorsCombinations(migrators);

		const finalMigrators = migratorGenerator({
			baseMigrator,
			saveMigrators,
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
