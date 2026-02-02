interface Props {
    text: string;
    onButtonClick: () => void;
}

export function ScanButton(props: Props) {
    return (
        <button className="btn btn-primary" onClick={props.onButtonClick}>
            {props.text}
        </button>
    );
}