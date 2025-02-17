//This is a function to get text items from the pdf and merge into a single string for TTS functionality
export function mergeTextItems(textItems: Array<{ str: string }>) {
    const filterCharacters = ["•", "|"];
    return textItems.map(item => item.str.replace("|", "\n")).join("")
}