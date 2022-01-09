import { Fragment } from "react";
import Footer from "components/Footer";
import "../styles/styles.scss";

function MyApp({ Component, pageProps }) {
  return (
    <Fragment>
      <Component {...pageProps} />
      <Footer />
    </Fragment>
  )
}

export default MyApp
