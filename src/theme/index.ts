import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Colors as LightColors } from './colors';
import { DarkColors } from './darkColors';

export { Colors } from './colors';
export { DarkColors } from './darkColors';
export { FontFamily, Typography, Spacing, BorderRadius } from './typography';

/**
 * Returns the active color palette (light or dark) based on global isDarkMode state.
 * Call this inside a component: `const Colors = useColors();`
 * Then pass to makeStyles: `const styles = useMemo(() => makeStyles(Colors), [Colors]);`
 *
 * The static `Colors` export above is kept for the App.tsx loading spinner,
 * which runs before any hook can be called.
 */
export function useColors(): typeof LightColors {
  const { isDarkMode } = useAppContext();
  return useMemo(
    () => (isDarkMode ? DarkColors : LightColors) as typeof LightColors,
    [isDarkMode],
  );
}
