import SetupForm from './component/SetupForm';
import { RootState } from './app/store/store';
import { useAppSelector } from './app/hooks/hooks';
import Exam from './component/Exam';
import { Box } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  const navigate = useNavigate();
  const isConfiged = useAppSelector(
    (state: RootState) => state.setup.isConfiged
  );
  // console.log(isConfiged);
  useEffect(() => {
    isConfiged ? navigate('/exam') : navigate('/setup');
  }, [isConfiged]);
  return (
    <Box className="flex items-center justify-center w-full h-screen">
      <Outlet />
    </Box>
  );
}

export default App;
