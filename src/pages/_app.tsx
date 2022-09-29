import { withTRPC } from "@trpc/next";
import { ThemeProvider, useTheme } from 'next-themes'
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "rsuite/dist/rsuite.min.css";
import { CustomProvider } from "rsuite";
import { appWithTranslation } from "next-i18next";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/router";
import Head from 'next/head'

import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'

import {APP_NAME} from "../constants/global"
import { ReactNode } from "react";

const MyApp = ({ Component, pageProps: { session, ...pageProps } }:any) => {
  function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }
  return (
    <Web3ReactProvider getLibrary={getLibrary}>

    <SessionProvider session={session}>
      <ThemeProvider defaultTheme="system" enableSystem={true}>
        <Head>
          <title>{APP_NAME}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <App>
        <Component {...pageProps} />
        </App>
      </ThemeProvider>
    </SessionProvider>

    </Web3ReactProvider>
  );
};

const App = ({children}:{children:ReactNode}) => {
  const router = useRouter();
  const { theme } = useTheme()

  return <CustomProvider  theme={theme||'light' as any}>
   {children}
    <ToastContainer
      theme={theme=='dark' ? 'dark' : 'light'}
      newestOnTop={true}
      position="top-center"
      rtl={router.locale === "ar" ? true : false}
    />
  </CustomProvider>
}

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC({
  config() {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseUrl()}/api/trpc`;

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(appWithTranslation(MyApp));
