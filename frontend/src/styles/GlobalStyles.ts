import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#2563eb',
    secondary: '#64748b',
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.6;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  input, textarea, select {
    font-family: inherit;
  }
`; 