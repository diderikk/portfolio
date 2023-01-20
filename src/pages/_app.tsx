import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.css";
import { ThemeProvider } from "../context/theme";

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    hljs.highlightAll();
  });
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
