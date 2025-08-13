import defaultConfig from '@/config/default';

function MyApp({ Component, pageProps }) {
  const config = pageProps.merchantConfig || defaultConfig;
  return <ThemeProvider theme={config}><Component {...pageProps} /></ThemeProvider>;
}
