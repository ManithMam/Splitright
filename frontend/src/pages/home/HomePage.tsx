import React from 'react';
import LastSplits from './components/LastSplits';
import './HomePage.css';
import CreateGameDialog from './components/CreateGameDialog';
import JoinGameDialog from './components/JoinGameDialog';
import '../../App.css'
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC<{ setIsLoggendIn: (isLoggendIn: boolean) => void }> = ({ setIsLoggendIn }) => {

  const navigate = useNavigate();

  window.onpopstate = () => {
    navigate("");
  }
  
  return (
    <div className='PageContainer'>
      <img alt="Split Right Logo" src={process.env.PUBLIC_URL + '/splitRightLogo.png'} className='splitright-logo' />
      <LastSplits />
      <div className='BtnGroup'>
        <CreateGameDialog />
        <JoinGameDialog />
      </div>
    </div>
  )
}

export default HomePage