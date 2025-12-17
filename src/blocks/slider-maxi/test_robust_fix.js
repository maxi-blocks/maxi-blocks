
const props = {
    // Mock attributes: Border Status False
    'navigation-arrow-both-icon-status-border': false,
    'navigation-arrow-both-icon-status-hover': false,
    // Add other necessary props
    uniqueID: 'test-id',
    blockStyle: {},
};

// Mock getMockStyles mirroring styles.js logic
function getMockStyles(props) {
    const iconPrefix = 'navigation-arrow-both-icon-';

    const hasBorder = props[`${iconPrefix}status-border`];
    
    // Logic from styles.js
    const result = {
        border: hasBorder ? "MockBorderObject" : {
					general: {
						border: 'none !important',
						'border-style': 'none !important',
						'border-width': '0 !important',
						'border-radius': '0 !important',
					},
			  },
    };
    
    return result;
}

console.log("Status Border:", props['navigation-arrow-both-icon-status-border']);
console.log("Result:", JSON.stringify(getMockStyles(props), null, 2));
