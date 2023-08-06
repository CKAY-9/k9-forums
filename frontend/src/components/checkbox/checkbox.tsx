import {useState, useEffect, BaseSyntheticEvent} from "react";
import style from "./checkbox.module.scss";

const Checkbox = (props: {defaultValue: boolean, onClick: Function}) => {
    const [checked, setChecked] = useState<boolean>(props.defaultValue);

    return (
        <div className={style.checkbox} onClick={() => {
            setChecked(!checked);
            props.onClick(!checked);
        }}>
            <div className={style.container} style={{"backgroundColor": checked ? "rgb(100, 255, 100)" : "rgb(0, 0, 0, 0.5)"}}>
                <div className={style.tick} style={{
                    "backgroundColor": checked ? "rgb(255, 255, 255)" : "rgb(255, 255, 255, 0.5)",
                    "left": checked ? "calc(100% - 1rem)" : "0%"
                }}></div>
            </div>
        </div>       
    );
}

export default Checkbox;
