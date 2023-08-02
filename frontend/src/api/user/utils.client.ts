import { PublicUser } from "./interfaces"

export const generateEmptyProflie = (): PublicUser => {
    return {
        "comments": [],
        "last_online": "",
        "posts": [],
        "profile_bio": "/default/default.png",
        "profile_picture": "",
        "public_id": 0,
        "reputation": 0,
        "time_created": "",
        "usergroups": [],
        "username": "not found"
    }
}