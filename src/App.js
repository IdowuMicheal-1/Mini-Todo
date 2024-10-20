import logo from "./logo.svg";
import "./App.css";

// import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import Home from "./Home";


// const queryClient = new QueryClient();

function App() {
  return (
    // <QueryClientProvider client={queryClient}>
    <>
   {/* <Book /> */}
   {/* <Repo /> */}
   <Home />
  
    {/* </QueryClientProvider> */}
    </>
  );
}

export default App;
