import './App.css';
import MainPage from "./pages/common/MainPage";
import {Route, Routes} from "react-router-dom";
import MainLayout from "./components/common/Layout";
import MenuListPage from "./pages/menu/MenuListPage";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import SignupPage from "./pages/member/SignupPage";
import LoginPage from "./pages/member/LoginPage";
import {AuthProvider} from "./utils/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>
              <div className="main-page-container">
                  <MainLayout>
                    <Routes>

                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        <Route path="/" element={<MainPage/>} />
                        <Route path="/menu/:category" element={<MenuListPage />} />

                    </Routes>
                  </MainLayout>
              </div>
              <ReactQueryDevtools initialIsOpen={false} />
          </AuthProvider>
      </QueryClientProvider>
  );
}

export default App;
