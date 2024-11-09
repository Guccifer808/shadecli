import * as fs from 'fs';
import * as path from 'path';

// Function to safely load and parse an existing tailwind.config.js file
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

// Function to create a backup of the original tailwind.config.js file
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

    // Handle adding the base color
    config.theme.extend.colors[colorName] = baseColor;
    console.log(`Added base color: ${colorName} => ${baseColor}`);

    // Handle adding the generated color shades
    Object.keys(shades).forEach((shadeKey) => {
      const colorKey = `${colorName}-${shadeKey}`;
      config.theme.extend.colors[colorKey] = shades[shadeKey];
      console.log(`Added shade: ${colorKey} => ${shades[shadeKey]}`);
    });

    // Write the updated config back to the file as JavaScript, preserving module exports
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
