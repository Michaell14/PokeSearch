import '../styles/globals.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { useState } from "react";
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
//linear-gradient(to right, #362039, #36213e, #352343, #332549, #30274e)
const theme = extendTheme({
  styles: {
    global: {
      // styles for the `body`
      body: {
        bg: 'white',
      },
    },
  },
  fonts: {
    heading: `'Open Sans', sans-serif`,
    body: `'Open Sans', sans-serif`,
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
