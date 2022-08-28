import { withTRPC } from "@trpc/next";

import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import "rsuite/dist/rsuite.min.css";
import { CustomProvider } from "rsuite";
import { appWithTranslation } from "next-i18next";
import "/node_modules/flag-icons/css/flag-icons.min.css";


const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  return (
    <SessionProvider session={session}>
      <CustomProvider theme="light">
        <Component {...pageProps} />
      </CustomProvider>
    </SessionProvider>
  );
};

const getBaseUrl = () => {
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
