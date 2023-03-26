import "../styles/globals.css";
import "../styles/typed-text.css";
import "../styles/swiper.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";
import { ThemeProvider } from "../context/theme";
import { ParallaxProvider } from "react-scroll-parallax";
import Head from "next/head";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    hljs.highlightAll();
  });
  return (
    <ParallaxProvider>
      <ThemeProvider>
        <Head>
          <title>{"diderikk's Blog"}</title>
          <link rel="shortcut icon" href="/favicon.ico" />
        </Head>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ParallaxProvider>
  );
}
