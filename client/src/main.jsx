import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    {/* <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate> */}
  </Provider>
);
