import { useState, useRef, useEffect } from 'react';
import '@assets/css/partials/loadingScreen.css';


interface LoadingProp{
  handleLoading: () => void;
  timeout?: number
}

function LoadingScreen({handleLoading, timeout = 300}:LoadingProp){
  const[progress, setProgress] = useState<number>(15)
  const intervalID = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      const rand = Math.floor(Math.random() * 5) + 9;

      setProgress(prev => {
        const current = prev + rand;
        if(current >= 100){
          handleLoading()
          setTimeout(() => handleLoading(), 100);
          clearInterval(intervalID.current as NodeJS.Timeout);
          return 100;
        }
        return current
      })
    }, timeout)


    return () => {
      if (intervalID.current) 
        clearInterval(intervalID.current);
    };
  },[])


  return(
    <div className="loading">
      <div className='loading-content'>
        <div className='company-brand mb-5'>
          <p className='company-name '>mioym</p>
          <p className='company-motto '>Maximizing Investment offering you more</p>
        </div>
        <h3 className='fs-5 opacity-75 fw-normal'>Loading...</h3>
        <progress className="progress-bar" value={progress} max="100"></progress>
      </div>
      <div className='loading-feedback fixed-bottoms'>
        <p className={`${progress <=30 ? 'current' : ''}  ${progress >= 70 ? 'fs-11' : '' } `}>connecting...</p>
        <p className={(progress >30 && progress <= 70) ? 'current' : '' }>fetching projects ...</p>
        <p className={progress >=70 ? 'current' : '' }>preparing dashboard...</p>
      </div>
    </div>
  )
}


export default LoadingScreen;

