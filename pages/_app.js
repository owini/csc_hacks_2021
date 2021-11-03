import "../styles/globals.css";
import GlobalStyles from "./../components/GlobalStyles";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "../helpers/UserContext";
import { AnimatePresence } from "framer-motion";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GlobalStyles />
          <AnimatePresence
            exitBeforeEnter
            initial={false}
            onExitComplete={() => window.scrollTo(0, 0)}
          >
            <Component {...pageProps} />
          </AnimatePresence>
        </UserProvider>
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
