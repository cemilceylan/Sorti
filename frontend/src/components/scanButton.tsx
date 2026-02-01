
interface Props {
    text: string;
    onButtonClick: () => void;
}

export function ScanButton(props: Props) {
    return (
        <button className="ScanButton" onClick={props.onButtonClick}>
            {props.text}
        </button>
    );
}