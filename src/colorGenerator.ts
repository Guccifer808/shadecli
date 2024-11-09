import chroma from 'chroma-js';

/**
 * Generates a series of color shades from light to dark, including a base color.
 * @param color - The primary color in HEX or RGB format.
 * @returns An object representing the color shades.
 */

export function generateColorShades(color: string): Record<number, string> {
  if (!chroma.valid(color)) {
    throw new Error('Invalid color format');
  }

  // Generate a color scale using the base color and creating a smooth transition from light to dark
  const scale = chroma
    .scale([
      chroma(color).set('hsl.l', 0.9).hex(), // Lighter shade
      color, // Base color
      chroma(color).set('hsl.l', 0.1).hex(), // Darker shade
    ])
    .mode('lab') // Lab mode for smoother color transitions
    .colors(10); // Generate 10 shades in the scale

  // Map the generated scale to the shade values, with base at index 5
  const shades: Record<string, string> = {
    '50': scale[0], // Lightest
    '100': scale[1],
    '200': scale[2],
    '300': scale[3],
    '400': scale[4],
    '500': scale[5], // Base color
    '600': scale[6],
    '700': scale[7],
    '800': scale[8],
    '900': scale[9], // Darkest
  };

  return shades;
}
