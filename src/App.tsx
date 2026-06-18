import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Layout from '@/components/Layout';
import ToastContainer from '@/components/ToastContainer';
import Dashboard from '@/pages/Dashboard';
import Files from '@/pages/Files';
import Scan from '@/pages/Scan';
import AiPanelPage from '@/pages/AiPanel';
import Knowledge from '@/pages/Knowledge';
import Settings from '@/pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
        <Outlet />
      </Layout>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'files', element: <Files /> },
      { path: 'scan', element: <Scan /> },
      { path: 'ai', element: <AiPanelPage /> },
      { path: 'knowledge', element: <Knowledge /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
