import React from 'react';
import LastSplits from './components/LastSplits';
import './HomePage.css';
import CreateGameDialog from './components/CreateGameDialog';
import JoinGameDialog from './components/JoinGameDialog';

const HomePage = () => {
  
  return (
    <div className='PageContainer'>
      <img src={process.env.PUBLIC_URL + '/splitRightLogo.png'} className='splitright-logo' />
      <LastSplits />
      <div className='BtnGroup'>
        <CreateGameDialog />
        <JoinGameDialog />
      </div>
    </div>
  )
}

export default HomePage