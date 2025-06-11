import './App.css';
import MainPage from "./pages/common/MainPage";
import {Route, Routes} from "react-router-dom";

function App() {
  return (
      <div className="main-page-container">
        <Routes>
            <Route path="/" element={<MainPage/>} />
        </Routes>
      </div>
  );
}

export default App;
