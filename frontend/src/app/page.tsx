import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { UsergroupFlags } from "@/api/admin/usergroup/interface";
import { fetchForumInfo } from "@/api/forum/fetch";
import { Category, Forum } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "./index.module.scss";

const Index = async () => {
	const user = await fetchPersonalInformation();
	const forum: Forum = await fetchForumInfo();
	let perms: number = 0;
	if (user !== undefined) {
		perms = await fetchPermissionLevel(user.usergroups);
	}

	return (
		<>
			<Header forum={forum} user={user} perms={perms}></Header>
			<main className="container">
				<div className={style.categories}>
					{forum.categories?.map((value: Category, index: number) => {
						return (
							<>
								<div className={style.category}>
									<section className={style.about} style={{"borderBottom": `1px solid #${value.color}`}}>
										<h1 style={{"color": `#${value.color}`}}>{value.name}</h1>
										<span>{value.about}</span>
									</section>
									{(value.topics === undefined || value.topics.length <= 0) && <h1>No subtopics found</h1>}
									{(value.topics !== undefined && value.topics.length > 0) && 
										<>
										
										</>
									}
								</div>
							</>
						);
					})}
				</div>
			</main>
		</>
	);
}

export default Index;