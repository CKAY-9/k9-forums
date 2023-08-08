import Image from "next/image";
import style from "./loading.module.scss";

const Loading = (props: {message: string | undefined}) => {
    return (
        <div className={style.loading}>
            <Image src="/svgs/loading.svg" className={style.circle} alt="Loading" sizes="100%" width={0} height={0} />
            {props.message !== undefined &&
                <span className={style.message}>{props.message}</span>
            }
        </div>
    );
}

export default Loading;
