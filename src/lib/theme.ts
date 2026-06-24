import { createTheme, alpha } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    gradients: {
      primary: string;
    };
  }
  interface PaletteOptions {
    gradients?: {
      primary?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6C63FF',
      light: '#9B94FF',
      dark: '#4A42CC',
    },
    secondary: {
      main: '#FF6584',
      light: '#FF8FA3',
      dark: '#CC4366',
    },
    background: {
      default: '#0F0F1A',
      paper: '#1A1A2E',
    },
    text: {
      primary: '#E8E8F0',
      secondary: '#9B9B9B',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #E8E8F0, #9B94FF)',
    },
    error: {
      main: '#FF4B4B',
    },
    warning: {
      main: '#FFB347',
    },
    success: {
      main: '#4CAF84',
    },
    divider: 'rgba(108, 99, 255, 0.15)',
  },
  typography: {
    fontFamily: 'var(--font-inter), "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.02em' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        * {
          box-sizing: border-box;
        }
        
        html, body {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1A1A2E;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #6C63FF;
          border-radius: 3px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #9B94FF;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 20px rgba(108, 99, 255, 0.4)',
          },
        },
      },
      // MUI v6: use `variants` array for variant+color combinations (containedPrimary key removed)
      variants: [
        {
          props: { variant: 'contained', color: 'primary' },
          style: {
            background: 'linear-gradient(135deg, #6C63FF 0%, #9B94FF 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5A52DD 0%, #8A83EE 100%)',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A2E',
          border: '1px solid rgba(108, 99, 255, 0.15)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          '&:hover': {
            border: '1px solid rgba(108, 99, 255, 0.35)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1A1A2E',
          backgroundImage: 'none',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.6)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(108, 99, 255, 0.25)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(108, 99, 255, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6C63FF',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          '&.MuiOutlinedInput-input': {
            borderColor: 'rgba(108, 99, 255, 0.25)',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderWidth: '1px',
          },
        },
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #1A1A2E inset !important',
            WebkitTextFillColor: '#E8E8F0 !important',
            caretColor: '#E8E8F0 !important',
          },
          '&:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 1000px #1A1A2E inset !important',
            WebkitTextFillColor: '#E8E8F0 !important',
            caretColor: '#E8E8F0 !important',
          },
          '&:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 1000px #1A1A2E inset !important',
            WebkitTextFillColor: '#E8E8F0 !important',
            caretColor: '#E8E8F0 !important',
          },
          '&:-webkit-autofill:active': {
            WebkitBoxShadow: '0 0 0 1000px #1A1A2E inset !important',
            WebkitTextFillColor: '#E8E8F0 !important',
            caretColor: '#E8E8F0 !important',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.7rem',
          letterSpacing: '0.05em',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(108, 99, 255, 0.1)',
        },
        head: {
          backgroundColor: '#0F0F1A',
          fontWeight: 600,
          color: '#9090AA',
          letterSpacing: '0.08em',
          fontSize: '0.7rem',
          textTransform: 'uppercase',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A2E',
          borderBottom: '1px solid rgba(108, 99, 255, 0.15)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#2A2A42',
          border: '1px solid rgba(108, 99, 255, 0.2)',
          fontSize: '0.75rem',
        },
      },
    },
  },
})

export default theme
