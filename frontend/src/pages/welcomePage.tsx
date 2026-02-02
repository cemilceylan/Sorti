import welcomeImage from '../assets/WelcomeImage.png'
import { ScanButton } from '../components/scanButton';
import '../App.css'; // Ensure styles are loaded

interface Props {
    onSkip: () => void;
}

export function WelcomePage(prop: Props) {
    return (
    <div className="app-container">
      <div className="image-wrapper">
        <img className='welcome-image' src={welcomeImage} alt="Friendly recycling bin and items" />
      </div>
      
      <div className="text-content">
        <h1>Recycle Smarter</h1>
        <p>Unsure how to recycle an item? Just scan it with your camera to get instant sorting instructions.</p>
      </div>
      
      <div className="action-area">
        <ScanButton text={'Scan Your First Item'} onButtonClick={prop.onSkip}/>
      </div>
    </div>
    );
}
