// randomFunctions.ts  

/**  
 * Generates a random integer between two values (inclusive).  
 * @param min - The minimum value.  
 * @param max - The maximum value.  
 * @returns A random integer between min and max.  
 */  
function getRandomInt(min: number, max: number): number {  
    return Math.floor(Math.random() * (max - min + 1)) + min;  
}  

/**  
 * Returns a random element from an array.  
 * @param array - The array from which to pick a random element.  
 * @returns A random element from the array.  
 */  
function getRandomElement<T>(array: T[]): T {  
    const randomIndex = getRandomInt(0, array.length - 1);  
    return array[randomIndex];  
}  

/**  
 * Generates a random color in hex format.  
 * @returns A string representing a random hex color.  
 */  
function getRandomColor(): string {  
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;  
    return randomColor;  
}  

/**  
 * Reverses a given string.  
 * @param input - The string to reverse.  
 * @returns The reversed string.  
 */  
function reverseString(input: string): string {  
    return input.split('').reverse().join('');  
}  

/**  
 * Waits for a specified amount of time and then resolves a promise.  
 * @param ms - The number of milliseconds to wait.  
 * @returns A promise that resolves after the specified time.  
 */  
function delay(ms: number): Promise<void> {  
    return new Promise(resolve => setTimeout(resolve, ms));  
}  

/**  
 * Logs a random "fact" to the console after a delay.  
 */  
async function logRandomFact() {  
    const facts: string[] = [  
        "Honey never spoils.",  
        "Bananas are berries.",  
        "Wombat poop is cube-shaped.",  
        "Octopuses have three hearts.",  
        "A day on Venus is longer than a year on Venus!"  
    ];  

    await delay(2000); // Wait for 2 seconds  
    const randomFact = getRandomElement(facts);  
    console.log(`Random Fact: ${randomFact}`);  
}  

// Example usage  
const randomInt = getRandomInt(1, 100);  
const randomElement = getRandomElement(['apple', 'banana', 'orange']);  
const randomColor = getRandomColor();  
const reversedString = reverseString("Hello, TypeScript!");  

console.log(`Random Integer: ${randomInt}`);  
console.log(`Random Element: ${randomElement}`);  
console.log(`Random Color: ${randomColor}`);  
console.log(`Reversed String: ${reversedString}`);  

logRandomFact();