# ShadeCLI

**Note**: This tool is currently in **beta**. It is still under active development, and features may change. Please report any issues you encounter.

## Description

`shadecli` is a CLI tool for generating color palettes and updating Tailwind CSS configuration files with custom color shades. It allows developers to easily generate lighter and darker shades for a primary color and directly insert them into a Tailwind configuration file.

## Features

- Generate a range of color shades from a base color (light to dark).
- Seamlessly integrate generated shades into your Tailwind configuration.
- **Merges** with the existing Tailwind config file (if it exists).
- Creates a **backup** of the original Tailwind config file before making changes.
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

- --color (required): The base color in HEX or RGB format. Example: `#3490dc`.`<br>`
- --name (optional): The name for the color (default is primary). This is used to generate the names for the shades (e.g., primary-50, primary-100, etc.).`<br>`
  By default, `shadecli` will look for a tailwind.config.js file in your project and update it with the new color shades (by default, it looks for tailwind.config.js or tailwind.config.cjs).

## Example:

To generate color shades for a `#ab6655` base color and add them to the Tailwind config as customPrimary, run:

```bash
npx shadecli --color "#ab6655" --name "customPrimary"
```

This will generate shades for the color and add them to the tailwind.config.js file. If the file exists, `shadecli` will merge the new shades with the existing configuration. It will also create a backup of the original config file, named tailwind.config.backup.js

## CLI Example:

```bash
npx shadecli --color "#ab6655" --name "customPrimary"
```

This will output a Tailwind configuration with custom color shades like:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        customMain: '#ab6655',
        'customMain-50': '#eee0dd',
        'customMain-100': '#e1c4bd',
        'customMain-200': '#d3a99e',
        'customMain-300': '#c48e80',
        'customMain-400': '#b37363',
        'customMain-500': '#9a5c4d',
        'customMain-600': '#7a493d',
        'customMain-700': '#5a362e',
        'customMain-800': '#3d241f',
        'customMain-900': '#221411',
      },
    },
  },
};
```

## How It Works

The `shadecli` tool takes a base color and generates 10 shades, ranging from lighter to darker.
It updates your Tailwind config file to include these shades, merging them with any existing color configurations.
If a tailwind.config.js file exists, `shadecli` creates a backup of the original file (named tailwind.config.js.bak) before making changes.

## Contributing

We welcome contributions to `shadecli`! If you'd like to contribute, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

GitHub Repository: https://github.com/Guccifer808/shadecli
Issues: https://github.com/Guccifer808/shadecli/issues
