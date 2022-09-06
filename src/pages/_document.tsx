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
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
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