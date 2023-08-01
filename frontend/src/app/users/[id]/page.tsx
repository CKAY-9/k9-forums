import ProflieClient from "./client";
import ProfileServer from "./server";

const ProfilePage = async ({ params }: { params: { id: string } }) => {
	return (
		<>
			<ProflieClient>
                <ProfileServer params={params}/>
            </ProflieClient>
        </>
    );
}

export default ProfilePage;