
// Mock test for message interception logic
const checkInterception = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Original Logic (Simulated)
    // if (lowerMessage.includes('border') && !lowerMessage.includes('radius') ... )
    
    // New Logic
    if (lowerMessage.includes('border') && !lowerMessage.includes('radius') && !lowerMessage.includes('round') && !lowerMessage.includes('corner') && !lowerMessage.includes('square') && !lowerMessage.includes('subtle') && !lowerMessage.includes('strong') && !lowerMessage.includes('brand') && !lowerMessage.includes('remove')) {
        return "INTERCEPTED_AS_BORDER_COLOR";
    }
    
    // Fallback implies it goes to next checks (which include rounded corners)
    return "PASSED_TO_NEXT_HANDLERS";
};

const testCases = [
    "make the button border round",
    "change border color to red",
    "add rounded corners",
    "round the corners",
    "make border square",
    "give me a strong border"
];

testCases.forEach(msg => {
    console.log(`"${msg}" -> ${checkInterception(msg)}`);
});
