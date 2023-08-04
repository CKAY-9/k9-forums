import { fetchPermissionLevel } from "@/api/admin/usergroup/fetch";
import { fetchCategoryTopics, fetchForumInfo } from "@/api/forum/fetch";
import { Category, Forum, Topic } from "@/api/forum/interfaces";
import { fetchPersonalInformation } from "@/api/user/fetch";
import Header from "@/components/header/header";
import style from "./index.module.scss";
import HomeTopicsClient from "./client";

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
					{forum.categories === undefined || forum.categories?.length <= 0 && <h1>There are no available categories</h1>}
					{forum.categories?.map(async (value: Category, index: number) => {
						const topics = await fetchCategoryTopics(value.category_id);
						return (
							<>
								<div className={style.category}>
									<section className={style.about} style={{"borderBottom": `1px solid #${value.color}`}}>
										<h1 style={{"color": `#${value.color}`}}>{value.name}</h1>
										<span>{value.about}</span>
									</section>
									{(topics === undefined ||topics.topics.length <= 0) && <h1>No subtopics found</h1>}
									{(topics !== undefined && topics.topics.length > 0) && 
										<div className={style.topics}>
											<HomeTopicsClient topics={topics.topics}></HomeTopicsClient>
										</div>
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