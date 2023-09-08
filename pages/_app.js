import '../styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: 'white',
      },
    },
  }
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} /> 
    </ChakraProvider>
  )
}

export default MyApp
