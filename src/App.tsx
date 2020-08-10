import React from "react";
import { Provider } from "react-redux";
import configureStore from "./store";
import { MainScreen } from "./screens/main";
import "bootstrap/dist/css/bootstrap.min.css"

const store = configureStore();

const App = () => {
  console.log(window.location.protocol + "://" + window.location.host);
  return (
    <Provider store={store}>
      <MainScreen />
    </Provider>
  );
};

export default App;
