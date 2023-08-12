import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import { MessagesClient } from "./client";
import { fetchChatHistory } from "@/api/messages/fetch";

const MessagesServer = async () => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

    if (user === undefined) {
        return (
            <>
                <Header user={user} forum={forum} perms={perms}></Header>
                <main className="container">
                    <h1>You must be signed in to see messages!</h1>
                </main>
            </>
        )
    }

    const chatHistory = await fetchChatHistory();

    return (
        <>
            <Header user={user} forum={forum} perms={perms}></Header>
            <MessagesClient channels={chatHistory?.channels} rChannels={chatHistory?.receiverChannels} user={user} forum={forum} perms={perms}></MessagesClient>
        </>
    );
}

export default MessagesServer;
