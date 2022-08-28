import {  NextPageContext } from "next";
import Document, { Html, Main, NextScript, Head, DocumentContext } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx:NextPageContext) {
    const initialProps = await Document.getInitialProps(ctx as DocumentContext);
    return { ...initialProps, locale: ctx?.locale || "en" };
  }

  render() {
    return (
      <Html
        dir={this.props.locale === "ar" ? "rtl" : "ltr"}
        lang={this.props.locale}
      >
        <Head></Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;