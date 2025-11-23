import welcomeImage from '../assets/WelcomeImage.png'
import { ScanButton } from '../components/scanButton';


interface Props {
    onSkip: () => void;
}

export function WelcomePage(prop: Props) {
    return (
    <div className="WelcomePage">
    <img className='WelcomeImage' src={welcomeImage}></img>
    <div>
      <h1>Recycle Smarter, Not Harder</h1>
      <p>Unsure how to recycle an item? Just scan it with your camera to get instant sorting instructions.</p>
    </div>
    <div>
      <ScanButton text={'Scan Your First Item'} onButtonClick={prop.onSkip}/>
    </div>
    </div>
    );
}