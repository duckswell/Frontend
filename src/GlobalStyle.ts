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
    user-select: none;
    -webkit-user-select: none;
    -webkit-tap-highlight-color: transparent;
  }

  body, input, button, textarea, select {
    font-family: 'Wanted Sans Variable', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif !important;
  }

  input, textarea {
    user-select: auto;
    -webkit-user-select: auto;
  }
  
* {
  scrollbar-width: none;
}


*::-webkit-scrollbar {
  display: none;
}
`;
