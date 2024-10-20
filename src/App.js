import logo from "./logo.svg";
import "./App.css";
import Main from "./pages/Main";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Repo } from "./pages/Media";
import Book from "./pages/Book";
import Home from "./Home";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
   {/* <Book /> */}
   {/* <Repo /> */}
   <Home />
    </QueryClientProvider>
  );
}

export default App;
