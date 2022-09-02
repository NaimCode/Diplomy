import {  NextPageContext } from "next";
import Document, { Html, Main, NextScript, Head, DocumentContext } from "next/document";
import { APP_NAME } from "../constants/global";



class MyDocument extends Document {
  static async getInitialProps(ctx:NextPageContext) {
    const initialProps = await Document.getInitialProps(ctx as DocumentContext);
    return { ...initialProps, locale: ctx?.locale || "fr" };
  }

  render() {
    return (
      <Html
    
   
        dir={this.props.locale === "ar" ? "rtl" : "ltr"}

        lang={this.props.locale}
      >
        <Head>
          <title>{APP_NAME}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body >
          <Main />
       
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;