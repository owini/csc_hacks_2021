import "../styles/globals.css";
import GlobalStyles from "./../components/GlobalStyles";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "../helpers/UserContext";

function MyApp({ Component, pageProps }) {
  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <GlobalStyles />
          <Component {...pageProps} />
        </UserProvider>
      </QueryClientProvider>
    </div>
  );
}

export default MyApp;
