const TEMPLATES = [
    {
        name: 'Full size column',
        buttonName: 'Full Size Column',
        content: [
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 100
                }
            ],
        ],
        attributes: {
            columnGap: 0,
            syncColumns: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '2 half columns',
        buttonName: '2 Half Columns',
        content: [
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 47.5,
                    sizeTablet: 47.5,
                    sizeMobile: 47.5
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 47.5,
                    sizeTablet: 47.5,
                    sizeMobile: 47.5
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    },
    {
        name: '3 columns',
        buttonName: '3 Columns',
        content: [
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 30,
                    sizeTablet: 30,
                    sizeMobile: 30
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 30,
                    sizeTablet: 30,
                    sizeMobile: 30
                }
            ],
            [
                'gutenberg-extra/block-column-extra',
                {
                    sizeDesktop: 30,
                    sizeTablet: 30,
                    sizeMobile: 30
                }
            ],
        ],
        attributes: {
            columnGap: 2.5,
            syncColumns: true,
            horizontalAlign: 'flex-start',
            verticalAlign: 'stretch'
        }
    }
]

export default TEMPLATES;