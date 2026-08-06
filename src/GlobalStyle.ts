import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Wanted Sans Variable';
    src: url('/fonts/WantedSansVariable.ttf') format('truetype');
    font-weight: 100 900;
    font-display: swap;
  }

  * {
    font-family: 'Wanted Sans Variable', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
  }

  body, input, button, textarea, select {
    font-family: 'Wanted Sans Variable', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
  }
`;
