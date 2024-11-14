import * as fs from 'fs';
import * as path from 'path';
import { askQuestion } from './cli';

/**
 * Safely loads and parses an existing Tailwind CSS configuration file.
 *
 * @param {string} configPath - The path to the Tailwind configuration file.
 * @returns {any} The parsed Tailwind configuration object.
 * @throws {Error} If there is an error reading or parsing the configuration file.
 */
function loadTailwindConfig(configPath: string): any {
  try {
    const configFile = fs.readFileSync(configPath, 'utf-8');

    // Safely evaluate the JavaScript config
    // Handle the case where the file is empty or doesn't have the expected format
    if (!configFile.trim()) {
      return {}; // If the file is empty, return an empty object
    }

    return eval(configFile); // This safely evaluates the JavaScript config.
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error reading the config file: ${error.message}`);
    } else {
      throw new Error(
        'An unknown error occurred while reading the config file'
      );
    }
  }
}

/**
 * Creates a backup of the original Tailwind CSS configuration file.
 *
 * @param {string} configPath - The path to the Tailwind configuration file.
 * @returns {void}
 */
function createBackup(configPath: string): void {
  const backupPath = path.join(
    path.dirname(configPath),
    `tailwind.config.backup.${Date.now()}.js`
  );

  try {
    fs.copyFileSync(configPath, backupPath);
    console.log(`Backup created at: ${backupPath}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating backup file:', error.message);
    } else {
      console.error('An unknown error occurred while creating the backup');
    }
  }
}

/**
 * Updates the Tailwind CSS configuration file with a new color and its shades.
 *
 * @param {string} configPath - The path to the Tailwind configuration file.
 * @param {string} colorName - The name of the new color to be added.
 * @param {Record<string, string>} shades - An object containing the color shades and their corresponding hex values.
 * @param {string} baseColor - The base color to be added.
 * @returns {Promise<void>}
 */
export async function updateTailwindConfig(
  configPath: string,
  colorName: string,
  shades: Record<string, string>,
  baseColor: string // Accept the base color as a parameter
): Promise<void> {
  try {
    // Create a backup of the original config
    createBackup(configPath);

    const config = loadTailwindConfig(configPath);

    // Ensure that the 'theme' section exists in the config
    if (!config.theme) {
      config.theme = {};
    }

    // Ensure the 'extend' section inside 'theme' exists
    if (!config.theme.extend) {
      config.theme.extend = {};
    }

    // Ensure the 'colors' section inside 'extend' exists
    if (!config.theme.extend.colors) {
      config.theme.extend.colors = {};
    }

    //  Graceful Failure for Missing or Invalid CLI Arguments
    if (!colorName || !shades) {
      console.error('Missing required arguments: --color and --name');
      process.exit(1);
    }

    // Check if the color name already exists in the configuration
    if (config.theme.extend.colors[colorName]) {
      // Prompt the user for confirmation to overwrite
      const shouldOverwrite = await askQuestion(
        `The color "${colorName}" already exists in the config. Do you want to overwrite it? (y/n): `
      );

      if (!shouldOverwrite) {
        console.log(`Skipped updating "${colorName}" in the Tailwind config.`);
        return; // Exit if the user chooses not to overwrite
      }
    }

    // Handle adding the base color
    // Add or overwrite the base color
    config.theme.extend.colors[colorName] = baseColor;
    console.log(`Added base color: ${colorName} => ${baseColor}`);

    // Add or overwrite the generated color shades
    Object.keys(shades).forEach((shadeKey) => {
      const colorKey = `${colorName}-${shadeKey}`;
      config.theme.extend.colors[colorKey] = shades[shadeKey];
      console.log(`Added/Updated shade: ${colorKey} => ${shades[shadeKey]}`);
    });

    // Write the updated config back to the file, preserving module exports
    fs.writeFileSync(
      configPath,
      `module.exports = ${JSON.stringify(config, null, 2)};\n`,
      'utf-8'
    );
    console.log(`Tailwind config updated with new shades for "${colorName}".`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error updating the Tailwind config:', error.message);
    } else {
      console.error(
        'An unknown error occurred while updating the Tailwind config'
      );
    }
  }
}
