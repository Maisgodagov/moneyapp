import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { store } from './store';
import { GlobalStyles, theme } from './styles/GlobalStyles';

// Components
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Upload from './pages/Upload';
import Statistics from './pages/Statistics';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Layout
import { AppContainer, MainContent } from './styles/Layout.ts';

const AppLayout = () => (
  <AppContainer>
    <Sidebar />
    <MainContent>
      <Outlet />
    </MainContent>
  </AppContainer>
);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/statistics" element={<Statistics />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
