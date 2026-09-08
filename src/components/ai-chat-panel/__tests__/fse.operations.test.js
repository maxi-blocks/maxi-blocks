import {
	routeFSEOperations,
	extractTemplatePartHint,
	extractInlineTitle,
	extractPatternQuery,
} from '../ai/utils/fseOperations';

// ── routeFSEOperations ────────────────────────────────────────────────────────

describe('routeFSEOperations', () => {
	// add_template_part
	describe('add_template_part', () => {
		test('add the header', () => {
			const r = routeFSEOperations('Add the header');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('header');
		});
		test('add a footer template part', () => {
			const r = routeFSEOperations('Add a footer template part');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('footer');
		});
		test('insert the navigation', () => {
			const r = routeFSEOperations('Insert the navigation');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('navigation');
		});
		test('insert the nav', () => {
			const r = routeFSEOperations('Insert the nav');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('nav');
		});
		test('add the sidebar template part', () => {
			const r = routeFSEOperations('Add the sidebar template part');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('sidebar');
		});
		test('add the search bar template part', () => {
			const r = routeFSEOperations('Add the search bar template part');
			expect(r?.params.operation).toBe('add_template_part');
		});
		test('add the announcement template part', () => {
			const r = routeFSEOperations('Add the announcement template part');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('announcement');
		});
		test('case insensitive', () => {
			const r = routeFSEOperations('ADD THE FOOTER');
			expect(r?.params.operation).toBe('add_template_part');
			expect(r?.params.hint).toBe('footer');
		});
	});

	// remove_template_part
	describe('remove_template_part', () => {
		test('remove the footer', () => {
			const r = routeFSEOperations('Remove the footer');
			expect(r?.params.operation).toBe('remove_template_part');
			expect(r?.params.hint).toBe('footer');
		});
		test('delete the header', () => {
			const r = routeFSEOperations('Delete the header');
			expect(r?.params.operation).toBe('remove_template_part');
			expect(r?.params.hint).toBe('header');
		});
		test('remove the navigation template part', () => {
			const r = routeFSEOperations('Remove the navigation template part');
			expect(r?.params.operation).toBe('remove_template_part');
			expect(r?.params.hint).toBe('navigation');
		});
		test('hide the sidebar', () => {
			const r = routeFSEOperations('Hide the sidebar');
			expect(r?.params.operation).toBe('remove_template_part');
			expect(r?.params.hint).toBe('sidebar');
		});
	});

	// save_as_reusable
	describe('save_as_reusable', () => {
		test('save this as reusable - no title', () => {
			const r = routeFSEOperations('Save this as reusable');
			expect(r?.params.operation).toBe('save_as_reusable');
			expect(r?.params.title).toBeNull();
		});
		test('save as a reusable block - no title', () => {
			const r = routeFSEOperations('Save as a reusable block');
			expect(r?.params.operation).toBe('save_as_reusable');
			expect(r?.params.title).toBeNull();
		});
		test('create a reusable block - no title', () => {
			const r = routeFSEOperations('Create a reusable block');
			expect(r?.params.operation).toBe('save_as_reusable');
			expect(r?.params.title).toBeNull();
		});
		test('create a synced pattern - no title', () => {
			const r = routeFSEOperations('Create a synced pattern');
			expect(r?.params.operation).toBe('save_as_reusable');
			expect(r?.params.title).toBeNull();
		});
		test('create a reusable block called Hero Section', () => {
			const r = routeFSEOperations('Create a reusable block called Hero Section');
			expect(r?.params.operation).toBe('save_as_reusable');
			expect(r?.params.title).toBe('Hero Section');
		});
		test("make this a reusable named 'My Banner'", () => {
			const r = routeFSEOperations("Make this a reusable named 'My Banner'");
			expect(r?.params.operation).toBe('save_as_reusable');
			expect(r?.params.title).toBe('My Banner');
		});
		test('add this block to reusable blocks', () => {
			const r = routeFSEOperations('Add this block to reusable blocks');
			expect(r?.params.operation).toBe('save_as_reusable');
		});
		test('add it to reusable blocks', () => {
			const r = routeFSEOperations('Add it to reusable blocks');
			expect(r?.params.operation).toBe('save_as_reusable');
		});
		test('convert this to a synced pattern', () => {
			const r = routeFSEOperations('Convert this to a synced pattern');
			expect(r?.params.operation).toBe('save_as_reusable');
		});
	});

	// detach_reusable — must take priority over save_as_reusable
	describe('detach_reusable', () => {
		test('detach this reusable block', () => {
			const r = routeFSEOperations('Detach this reusable block');
			expect(r?.params.operation).toBe('detach_reusable');
		});
		test('convert this reusable block to regular blocks', () => {
			const r = routeFSEOperations('Convert this reusable block to regular blocks');
			expect(r?.params.operation).toBe('detach_reusable');
		});
		test('unlink this synced pattern', () => {
			const r = routeFSEOperations('Unlink this synced pattern');
			expect(r?.params.operation).toBe('detach_reusable');
		});
		test('convert to static blocks', () => {
			const r = routeFSEOperations('Convert to static blocks');
			expect(r?.params.operation).toBe('detach_reusable');
		});
	});

	// add_wp_pattern
	describe('add_wp_pattern', () => {
		test('add a newsletter pattern', () => {
			const r = routeFSEOperations('Add a newsletter pattern');
			expect(r?.params.operation).toBe('add_wp_pattern');
			expect(r?.params.query).toBe('newsletter');
		});
		test('add a wordpress pattern', () => {
			const r = routeFSEOperations('Add a wordpress pattern');
			expect(r?.params.operation).toBe('add_wp_pattern');
		});
		test('insert a testimonial pattern', () => {
			const r = routeFSEOperations('Insert a testimonial pattern');
			expect(r?.params.operation).toBe('add_wp_pattern');
			expect(r?.params.query).toBe('testimonial');
		});
		test('add a core hero pattern', () => {
			const r = routeFSEOperations('Add a core hero pattern');
			expect(r?.params.operation).toBe('add_wp_pattern');
			expect(r?.params.query).toBe('hero');
		});
		test('add a pricing pattern', () => {
			const r = routeFSEOperations('Add a pricing pattern');
			expect(r?.params.operation).toBe('add_wp_pattern');
			expect(r?.params.query).toBe('pricing');
		});
	});

	// no match
	describe('no match (falls through)', () => {
		test('set font size to 16px', () => {
			expect(routeFSEOperations('Set font size to 16px')).toBeNull();
		});
		test('change the background color to blue', () => {
			expect(routeFSEOperations('Change the background color to blue')).toBeNull();
		});
		test('publish the page', () => {
			expect(routeFSEOperations('Publish the page')).toBeNull();
		});
		test('add a container', () => {
			expect(routeFSEOperations('Add a container')).toBeNull();
		});
		test('add padding 20px', () => {
			expect(routeFSEOperations('Add padding 20px')).toBeNull();
		});
		test('remove border', () => {
			expect(routeFSEOperations('Remove border')).toBeNull();
		});
	});
});

// ── extractTemplatePartHint ────────────────────────────────────────────────────

describe('extractTemplatePartHint', () => {
	test('header', () => expect(extractTemplatePartHint('Add the header')).toBe('header'));
	test('footer', () => expect(extractTemplatePartHint('Remove the footer template part')).toBe('footer'));
	test('navigation', () => expect(extractTemplatePartHint('Insert the navigation')).toBe('navigation'));
	test('nav', () => expect(extractTemplatePartHint('Add the nav')).toBe('nav'));
	test('sidebar', () => expect(extractTemplatePartHint('Add the sidebar')).toBe('sidebar'));
	test('custom slug', () => {
		const h = extractTemplatePartHint('Add the announcement-bar template part');
		expect(h).toBe('announcement-bar');
	});
	test('no hint', () => expect(extractTemplatePartHint('Add a template part')).toBeNull());
});

// ── extractInlineTitle ────────────────────────────────────────────────────────

describe('extractInlineTitle', () => {
	test('called <title>', () => {
		expect(extractInlineTitle('Create a reusable block called Hero Section')).toBe('Hero Section');
	});
	test('named <title>', () => {
		expect(extractInlineTitle("Make this reusable named 'My Banner'")).toBe('My Banner');
	});
	test('titled <title>', () => {
		expect(extractInlineTitle('Save as reusable titled Card Layout')).toBe('Card Layout');
	});
	test('no title', () => {
		expect(extractInlineTitle('Save this as reusable')).toBeNull();
	});
});

// ── extractPatternQuery ───────────────────────────────────────────────────────

describe('extractPatternQuery', () => {
	test('newsletter', () => expect(extractPatternQuery('Add a newsletter pattern')).toBe('newsletter'));
	test('testimonial', () => expect(extractPatternQuery('Insert a testimonial pattern')).toBe('testimonial'));
	test('strips wp/core/gutenberg', () => {
		expect(extractPatternQuery('Add a core hero pattern')).toBe('hero');
		expect(extractPatternQuery('Add a gutenberg gallery pattern')).toBe('gallery');
	});
	test('empty for bare pattern', () => {
		expect(extractPatternQuery('Add a wordpress pattern')).toBe('');
	});
});
