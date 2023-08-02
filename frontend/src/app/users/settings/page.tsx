import UserSettingsClient from "./client"
import UserSettingsServer from "./server"

const UserSettingsPage = () => {
    return (
        <>
            <UserSettingsClient>
                <UserSettingsServer />
            </UserSettingsClient>
        </>
    );
}

export default UserSettingsPage;