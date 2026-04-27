import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout';
import { HomePage } from './pages/HomePage';
import { WeatherPage } from './pages/WeatherPage';
import { HistoryPage } from './pages/HistoryPage';
import { MonitoringPage } from './pages/MonitoringPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'weather',
        element: <WeatherPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'monitoring',
        element: <MonitoringPage />,
      },
    ],
  },
]);
