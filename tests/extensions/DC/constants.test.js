import * as constants from '../../../src/extensions/DC/constants';

describe('Constants', () => {
  it('should have correct sourceOptions', () => {
    expect(constants.sourceOptions).toEqual([
      {
        label: 'WordPress',
        value: 'wp',
      },
    ]);
  });

  it('should have correct generalTypeOptions', () => {
    expect(constants.generalTypeOptions).toEqual([
      { label: 'Post', value: 'posts' },
      { label: 'Page', value: 'pages' },
      { label: 'Site', value: 'settings' },
      { label: 'Media', value: 'media' },
      { label: 'Author', value: 'users' },
      { label: 'Categories', value: 'categories' },
      { label: 'Tags', value: 'tags' },
    ]);
  });

  // Continue with the rest of the constants in a similar manner...
});
