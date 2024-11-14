import * as fs from 'fs';
import * as path from 'path';
import { updateTailwindConfig } from '../src/tailwindConfigUpdater';
import { generateColorShades } from '../src/colorGenerator';
import {
  main,
  parseArgs,
  askQuestion,
  createTailwindConfigTemplate,
} from '../src/cli';

// Mocking external modules
jest.mock('fs', () => ({
  ...jest.requireActual('fs'), // Keep other fs methods intact
  existsSync: jest.fn(), // Mock existsSync method
  writeFileSync: jest.fn(), // Mock writeFileSync method
}));

jest.mock('path');

jest.mock('readline', () => ({
  createInterface: () => ({
    question: jest.fn().mockImplementation((query, callback) => {
      callback('y'); // Resolve with 'y' as the user's answer
    }),
    close: jest.fn(), // Mock the close method
  }),
}));

jest.mock('../src/cli', () => ({
  ...jest.requireActual('../src/cli'),
  askQuestion: jest.fn(), // Mock the askQuestion function
}));

jest.mock('../src/tailwindConfigUpdater');
jest.mock('../src/colorGenerator');

describe('CLI Tool Tests', () => {
  // Test for argument parsing
  describe('parseArgs()', () => {
    it('should parse valid arguments correctly', () => {
      process.argv = [
        'node',
        'cli.js',
        '--color',
        '#ff0000',
        '--name',
        'custom',
        '--output',
        'config.js',
      ] as unknown as string[]; // Casting process.argv to string[]
      const args = parseArgs();
      expect(args.color).toBe('#ff0000');
      expect(args.name).toBe('custom');
      expect(args.output).toBe('config.js');
    });

    it('should set default values when no arguments are passed', () => {
      process.argv = ['node', 'cli.js'];
      const args = parseArgs();
      expect(args.color).toBe('#3490dc');
      expect(args.name).toBe('primary');
      expect(args.output).toBe('tailwind.config.js');
    });
  });

  // Test for file existence and prompt to create a new config file
  describe('File Handling', () => {
    beforeEach(() => {
      jest.resetAllMocks(); // Ensure mocks are reset
    });

    it('should create a new config file if it does not exist and user agrees', async () => {
      jest.setTimeout(15000);

      // Mocking fs.existsSync to simulate no existing config file
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

      // Mocking askQuestion to simulate the user agreeing to create the file
      (askQuestion as jest.Mock).mockResolvedValueOnce('y'); // Simulating 'yes' answer

      const configPath = path.resolve(process.cwd(), 'tailwind.config.js');

      // Spy on console.log to check if the correct logs appear
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Call the main function
      await main();

      // Check if writeFileSync is called with the correct arguments
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        configPath,
        expect.any(String), // Expect any string (i.e., the content of the new config file)
        'utf-8'
      );

      // Ensure it was called only once
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1);

      // Verify that the console logs the appropriate messages
      expect(logSpy).toHaveBeenCalledWith(
        'Creating a new tailwind.config.js...'
      );
      expect(logSpy).toHaveBeenCalledWith('New tailwind.config.js created.');

      // Clean up the spy
      logSpy.mockRestore();
    });

    it('should not create a new config file if it does not exist and user disagrees', async () => {
      jest.setTimeout(15000);

      // Mock fs.existsSync to simulate no existing config file
      (fs.existsSync as jest.Mock).mockReturnValueOnce(false);

      // Mocking askQuestion to simulate the user rejecting (answering 'n')
      (askQuestion as jest.Mock).mockResolvedValueOnce('n'); // Simulate 'no' answer (as string)

      const configPath = path.resolve(process.cwd(), 'tailwind.config.js');

      // Spy on console.log to check if the correct logs appear
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      // Call the main function
      await main();

      // Verify that the config file does not exist (since the user rejected)
      expect(fs.existsSync(configPath)).toBeFalsy();

      // Clean up the spy
      logSpy.mockRestore();
    });
  });

  // Test for updating the Tailwind config
  describe('Tailwind Config Update', () => {
    it('should call updateTailwindConfig with correct parameters', async () => {
      const configPath = path.resolve(process.cwd(), 'tailwind.config.js');
      const color = '#ff0000';
      const name = 'customColor';
      const shades: Record<string, string> = {
        '100': '#ffcccc',
        '200': '#ff9999',
        '300': '#ff6666',
      }; // Simulated shades as a Record<string, string>

      (fs.existsSync as jest.Mock).mockReturnValueOnce(true); // Simulate an existing config file
      (generateColorShades as jest.Mock).mockReturnValueOnce(shades); // Mock color shade generation
      await updateTailwindConfig(configPath, name, shades, color);

      expect(updateTailwindConfig).toHaveBeenCalledWith(
        configPath,
        name,
        shades,
        color
      );
    });
  });

  // Test for creating the Tailwind config template
  describe('createTailwindConfigTemplate()', () => {
    it('should create a valid Tailwind config template', () => {
      const configTemplate = createTailwindConfigTemplate();
      expect(configTemplate).toContain('module.exports = {');
      expect(configTemplate).toContain('colors: {}');
    });
  });
});

// To do:
// Test to check if the user is prompted when the color variable name already exists in the tailwind.config.js
