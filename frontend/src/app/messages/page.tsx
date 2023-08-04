import MessagesClientWrapper from "./client";
import MessagesServer from "./server";

const MessagesPage = () => {
    return (
        <>
            <MessagesClientWrapper>
                <MessagesServer />
            </MessagesClientWrapper>
        </>
    );
}

export default MessagesPage;