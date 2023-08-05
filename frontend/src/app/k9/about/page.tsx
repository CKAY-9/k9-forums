import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchForumInfo } from "@/api/forum/fetch";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import Image from "next/image";
import Link from "next/link";

const K9About = async () => {
	const user = await fetchPersonalInformation();
	const forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>
            <main className="container">
                <h1>About K9 Forums</h1>
                <p>
                    K9 Forums is a free and open-source forum software built on NextJS and NestJS.
                    It&apos;s original repository can be found on <Link href="https://github.com/CKAY-9/k9-forums">Github</Link>.
                    K9 Forums uses the <Link href="https://www.gnu.org/licenses/agpl-3.0.txt">AGPL-V3.0 License</Link>.  
                </p>

                <h1>Contributors</h1>
                <div style={{"position": "relative"}}>
                    <Image src="https://contrib.rocks/image?repo=CKAY-9/k9-forums" alt="Contributors Github" sizes="100%" width={0} height={0} style={{
                        "width": "auto",
                        "height": "4rem",
                    }}></Image>
                </div>
            </main>
		</>
	);
}

export default K9About;