import "../styles/foodcard.css";

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
    console.log("LOADED");
    return <Component {...pageProps} />
}
