// Define font constants type
interface FontScheme {
    primary: string;
    secondary: string;
    heading: string;
    body: string;
    accent: string;
    sizes: {
        xs: string;
        sm: string;
        base: string;
        md: string;
        lg: string;
        xl: string;
        xxl: string;
        display: string;
    };
    weights: {
        light: string;
        normal: string;
        medium: string;
        semibold: string;
        bold: string;
    };
}

// Default modern, clean font scheme
export const FONTS: FontScheme = {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    accent: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        md: '1.125rem',     // 18px
        lg: '1.25rem',      // 20px
        xl: '1.5rem',       // 24px
        xxl: '2rem',        // 32px
        display: '2.5rem'   // 40px
    },
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    }
};

// Elegant serif font scheme
export const SERIF_FONTS: FontScheme = {
    primary: "'Playfair Display', Georgia, serif",
    secondary: "'Lora', Georgia, serif",
    heading: "'Playfair Display', Georgia, serif",
    body: "'Lora', Georgia, serif",
    accent: "'Cormorant Garamond', Georgia, serif",
    sizes: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        md: '1.125rem',     // 18px
        lg: '1,25rem',      // 20px
        xl: '1.5rem',       // 24px
        xxl: '2.25rem',     // 36px
        display: '3rem'     // 48px
    },
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    }
};

// Modern minimalist font scheme
export const MINIMAL_FONTS: FontScheme = {
    primary: "'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    accent: "'Work Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        md: '1.125rem',     // 18px
        lg: '1.25rem',      // 20px
        xl: '1.5rem',       // 24px
        xxl: '2rem',        // 32px
        display: '2.75rem'  // 44px
    },
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    }
};

// Professional corporate font scheme
export const CORPORATE_FONTS: FontScheme = {
    primary: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    secondary: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    heading: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    body: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    accent: "'Roboto Condensed', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    sizes: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        md: '1.125rem',     // 18px
        lg: '1.25rem',      // 20px
        xl: '1.5rem',       // 24px
        xxl: '1.875rem',    // 30px
        display: '2.25rem'  // 36px
    },
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    }
};

// Creative modern font scheme
export const CREATIVE_FONTS: FontScheme = {
    primary: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    secondary: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    accent: "'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        md: '1.125rem',     // 18px
        lg: '1.35rem',      // 21.6px
        xl: '1.5rem',       // 24px
        xxl: '2.25rem',     // 36px
        display: '3.25rem'  // 52px
    },
    weights: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
    }
};

export default FONTS;