"use client";
import { Category, Forum } from "@/api/forum/interfaces";
import categories from "./categories.module.scss";
import Image from "next/image";
import { BaseSyntheticEvent, useState } from "react";
import { createNewForumCategory } from "@/api/admin/config/post";
import { postNotification } from "@/components/notifications/notification";
import { updateForumCategory } from "@/api/admin/config/put";

const Categories = (props: {forum: Forum}) => {
    const [fCategories, fSetCategories] = useState<Category[]>(props.forum.categories || []);
    const [runningTotal, setRunningTotal] = useState<number>(-1);

    const createCategory = async (e: BaseSyntheticEvent, newCategory: Category) => {
        const res = await createNewForumCategory({
            "name": newCategory.name,
            "color": newCategory.color,
            "about": newCategory.about
        });

        fSetCategories(fCategories.filter((value, index) => value.category_id !== newCategory.category_id));       
        fSetCategories(old => [...old, res.category]); 

        postNotification("Created new category with ID " + res.category.category_id);
        props.forum.categories = fCategories;
    }
    
    const updateCategory = async (e: BaseSyntheticEvent, category: Category) => {
        const res = await updateForumCategory({
            "name": category.name,
            "color": category.color,
            "about": category.about,
            "category_id": category.category_id
        });

        fSetCategories(fCategories.filter((value, index) => value.category_id !== category.category_id));       
        fSetCategories(old => [...old, res.category]); 

        postNotification("Updated category with ID " + res.category.category_id);
    }

    return (
        <>
            <h1>Categories</h1>
            <div className={categories.categories}>
                <button className={categories.category} id ={categories.new} style={{"position": "relative", "alignItems": "center", "justifyContent": "center"}} onClick={() => {
                    const newCategory: Category = {
                        "name": "New Category",
                        "about": "No information provided...",
                        "category_id": runningTotal,
                        "color": "FFFFFF",
                    }

                    setRunningTotal(runningTotal - 1);

                    fSetCategories(old => [...old, newCategory]);
                }}>
                    <Image src="/svgs/plus.svg" alt="New Usergroup" sizes="100%" width={0} height={0} style={{
                        "width": "1.5rem",
                        "height": "1.5rem",
                        "filter": "invert(1)"
                    }}></Image>
                </button>
                {(fCategories === undefined || fCategories.length <= 0) && <h2>There are no active categories</h2>}
                {fCategories.map((value, index: number) => {
                    return (
                        <div key={index} className={categories.category}>
                            <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="name">Name</label>
                                    <input onChange={(e: BaseSyntheticEvent) => value.name = e.target.value} type="text" placeholder="Category Name" defaultValue={value.name} />
                                </div>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="color">Color</label>
                                    <input onChange={(e: BaseSyntheticEvent) => value.color = e.target.value.replace("#", "")} type="color" name="color" defaultValue={value.color !== undefined ? `#${value.color}` : "#ffffff"} />
                                </div>
                            </section>
                            <section style={{"display": "grid", "gridTemplateColumns": "50% 50%"}}>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="about">About</label>
                                    <input onChange={(e: BaseSyntheticEvent) => value.about = e.target.value} type="text" placeholder="Category About" defaultValue={value.about} />
                                </div>
                                <div style={{"display": "flex", "alignItems": "center", "gap": "1rem"}}>
                                    <label htmlFor="id">Category ID</label>
                                    <span>{value.category_id >= 0 ? value.category_id : "will be shown once created"}</span>
                                </div>
                            </section>
                            {value.category_id <= -1 && <button onClick={(e: BaseSyntheticEvent) => createCategory(e, value)}>Create</button>}
                            {value.category_id >= 0 && <button onClick={(e: BaseSyntheticEvent) => updateCategory(e, value)}>Update</button>}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Categories;