import { Navigate } from 'react-router-dom';
import { WelcomePage } from './pages/welcomePage';
import { HomePage } from './pages/homePage';

interface CreateRoutesArgs {
  showWelcome: boolean;
  handleSkip: () => void;
}

export const createRoutes = ({ showWelcome, handleSkip }: CreateRoutesArgs) => {
  return [
    {
      path: '/',
      element: showWelcome ? (
        <WelcomePage onSkip={handleSkip} />
      ) : (
        <Navigate to="/home" replace />
      ),
    },
    {
      path: '/home',
      element: <HomePage />,
    },
  ];
};
