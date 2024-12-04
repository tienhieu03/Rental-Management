import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <Provider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </Provider>
  //</StrictMode>
);
