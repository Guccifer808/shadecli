# ShadeCLI

**Note**: This tool is currently in **beta**. It is still under active development, and features may change. Please report any issues you encounter.

## Description

`shadecli` is a CLI tool for generating color palettes and updating Tailwind CSS configuration files with custom color shades. It allows developers to easily generate lighter and darker shades for a primary color and directly insert them into a Tailwind configuration file.

## Features

- Generate a range of color shades from a base color (light to dark).
- Seamlessly integrate generated shades into your Tailwind configuration.
- **Merges** with the existing Tailwind config file (if it exists).
- Creates a **backup** of the original Tailwind config file before making changes.
- Prompts the user before overwriting existing colors in the Tailwind config (with an option to skip).
- Simple CLI interface for easy usage.

## Installation

You can install `shadecli` globally via npm:

```bash
npm install -g shadecli
```

Alternatively, you can install it as a development dependency in your project:

```bash
npm install --save-dev shadecli
```

## Usage

Once `shadecli` is installed, you can run it directly from the command line using the following syntax:

```bash
npx shadecli --color <base-color> --name <color-name>
```

## Arguments:

- `--color` (required): The base color in HEX or RGB format. Example: `#3490dc`.

- `--name` (optional): The name for the color (default is primary). This is used to generate the names for the shades (e.g., primary-50, primary-100, etc.).

By default, `shadecli` will look for a `tailwind.config.js` or `tailwind.config.cjs` file in your project and update it with the new color shades. If no such file is found, it will create new `tailwind.config.js` file with the new color shades.

## Example:

To generate color shades for a `#ab6655` base color and add them to the Tailwind config as customPrimary, run:

```bash
npx shadecli --color "#ab6655" --name "customPrimary"
```

This will generate shades for the color and add them to the tailwind.config.js file. If the file exists, `shadecli` will merge the new shades with the existing configuration. It will also create a backup of the original config file, named tailwind.config.backup.js

## CLI Example:

To generate a Tailwind color palette with custom shades, run:

```bash
npx shadecli --color "#ab6655" --name "customPrimary"
```

This will output a Tailwind configuration with custom color shades. The behavior differs based on whether a tailwind.config.js (or tailwind.config.cjs) file already exists:

1. If a Tailwind config file exists:

- The CLI will automatically detect the existing configuration and attempt to append the new shades to the colors object.
- If a color with the name you specified (e.g., customPrimary) already exists, `shadecli` will prompt you in the console with a yes/no question. This allows you to decide whether to replace the existing color or keep the current configuration intact.
- Selecting "yes" will replace the existing customPrimary shades; selecting "no" will leave the current configuration unchanged.

2. If no config file is found:

- `shadecli` will create a new tailwind.config.js file in the project root and add the custom color palette automatically.

Here’s an example output for the configuration:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        customPrimary: '#ab6655',
        'customPrimary-50': '#eee0dd',
        'customPrimary-100': '#e1c4bd',
        'customPrimary-200': '#d3a99e',
        'customPrimary-300': '#c48e80',
        'customPrimary-400': '#b37363',
        'customPrimary-500': '#9a5c4d',
        'customPrimary-600': '#7a493d',
        'customPrimary-700': '#5a362e',
        'customPrimary-800': '#3d241f',
        'customPrimary-900': '#221411',
      },
    },
  },
};
```

If customPrimary already exists in the config, `shadecli` will detect it and prevent overwriting by asking. This ensures existing color configurations remain intact, while new shades are added as specified.

## How It Works

The `shadecli` tool takes a base color and generates 10 shades, ranging from lighter to darker.
It updates your Tailwind config file to include these shades, merging them with any existing color configurations.
If a tailwind.config.js file exists, `shadecli` creates a backup of the original file (named tailwind.config.backup.js) before making changes.

## Contributing

We welcome contributions to `shadecli`! If you'd like to contribute, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

GitHub Repository: https://github.com/Guccifer808/shadecli
Issues: https://github.com/Guccifer808/shadecli/issues
