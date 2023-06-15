import React from 'react';
import LastSplits from './LastSplits';
import './HomePage.css';
import CreateGameDialog from './CreateGameDialog';
import JoinGameDialog from './JoinGameDialog';

//TODO: avoid img style repetition
const HomePage = () => {
  
  return (
    <div className='HomePageContainer'>
      <img src={process.env.PUBLIC_URL + '/splitRightLogo.png'} style={{width: '200px', height: 'auto' }} />
      <LastSplits />
      <div className='BtnGroup'>
        <CreateGameDialog />
        <JoinGameDialog />
      </div>
    </div>
  )
}

export default HomePage