#!/usr/bin/env node
import { generateColorShades } from './colorGenerator';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { updateTailwindConfig } from './tailwindConfigUpdater';

interface CLIArgs {
  color: string;
  name: string;
  output: string;
}

export function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);

  const argsMap: Record<string, string> = {};

  for (let i = 0; i < args.length; i++) {
    const key = args[i];
    const value = args[i + 1];
    if (key.startsWith('--') && value) {
      argsMap[key] = value;
    }
  }

  // Set default values or use parsed arguments
  return {
    color: argsMap['--color'] || '#3490dc',
    name: argsMap['--name'] || 'primary',
    output: argsMap['--output'] || 'tailwind.config.js',
  };
}

// Create a basic tailwind.config.js template for color extension
export function createTailwindConfigTemplate(): string {
  return `/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  theme: {
    extend: {
      colors: {}
    }
  }
};`;
}

// Prompt user for yes/no input
export function askQuestion(query: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

export async function main() {
  try {
    const { color, name, output } = parseArgs();
    const shades = generateColorShades(color);

      // Check if either 'tailwind.config.js' or 'tailwind.config.cjs' exists
      const configPathJS = path.resolve(process.cwd(), 'tailwind.config.js');
      const configPathCJS = path.resolve(process.cwd(), 'tailwind.config.cjs');
  
      let configPath = configPathJS;

   // If the .js file doesn't exist, check for .cjs file
   if (!fs.existsSync(configPathJS) && fs.existsSync(configPathCJS)) {
    console.log('Found tailwind.config.cjs file instead of tailwind.config.js.');
    configPath = configPathCJS;
  }

     // If neither exists, ask the user to create one
     if (!fs.existsSync(configPath)) {
      console.log('No config file found, asking user to create one...');
      const userWantsToCreate = await askQuestion(
        'No tailwind.config.js or tailwind.config.cjs found. Do you want to create a new one? (y/n): '
      );
      if (userWantsToCreate) {
        console.log('Creating a new tailwind.config.js...');
        const configContent = createTailwindConfigTemplate();
        fs.writeFileSync(configPathJS, configContent, 'utf-8');
        console.log(`New tailwind.config.js created.`);
        configPath = configPathJS; // Use the JS file after creation
      } else {
        console.log('Aborting. No config file was created.');
        return; // Ensure that nothing happens after rejecting
      }
    }

    // Update the Tailwind config with the new colors and the base color
    await updateTailwindConfig(configPath, name, shades, color);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    } else {
      console.error('An unknown error occurred');
    }
  }
}

main();
