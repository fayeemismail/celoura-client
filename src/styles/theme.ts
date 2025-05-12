// Define color constants type
interface ColorScheme {
    bg: string;
    border: string;
    text: string;
    secondaryText: string;
    accent: string;
    inputBg: string;
    cardBg: string;
    hoverBg: string;
}

export const COLORS: ColorScheme = {
    bg: '#F5F3EE',
    border: '#E2DFD6',
    text: '#1A1A1A',
    secondaryText: '#6D6459',
    accent: '#9B8759',
    inputBg: '#FCFAF6',
    cardBg: '#FCFAF6',
    hoverBg: '#F5F3EE',
};

export const ADMIN_COLORS: ColorScheme = {
    bg: '#1A1F2C',          // Deep navy background
    border: '#2D3446',      // Subtle dark border
    text: '#FFFFFF',        // Crisp white text
    secondaryText: '#B3B9C5', // Soft silver for secondary text
    accent: '#D4AF37',      // Rich gold accent
    inputBg: '#242A38',     // Slightly lighter than bg for inputs
    cardBg: '#242A38',      // Matching input background for cards
    hoverBg: '#2F374A',     // Subtle hover state
};


export const GUIDE_COLORS = {
  bg: '#0A322E',          // Deep forest green background
  border: '#1E4542',      // Subtle darker border
  text: '#FFFFFF',        // Crisp white text
  secondaryText: '#A9C6C3', // Soft teal for secondary text
  accent: '#4CAF50',      // Vibrant emerald accent
  inputBg: '#144541',     // Slightly lighter than bg for inputs
  cardBg: '#144541',      // Matching input background for cards
  hoverBg: '#1C524E',     // Subtle hover state
};




export default COLORS;