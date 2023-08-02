// this file is seperated from `utils.server.ts` because that relies on cookies from next/server

import { Vote } from "../forum/interfaces"
import { PublicUser } from "./interfaces";

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

export enum VotedResult {
    NO_VOTE = 0,
    DOWN_VOTE = 1,
    UP_VOTE = 2
}

export const userHasVoted = (user_id: number, votes: Vote[]): VotedResult => {
    let currResult = VotedResult.NO_VOTE;
    for (let i = 0; i < votes.length; i++) {
        if (votes[i].user_id === user_id) {
            if (votes[i].type === -1) {
                currResult = VotedResult.DOWN_VOTE
            } else {
                currResult = VotedResult.UP_VOTE
            }
        }
    }
    return currResult;
}

export const calcRunningTotalVotes = (votes: Vote[]) => {
    let runningTotal = 0;
    for (let i = 0; i < votes.length; i++) {
        runningTotal += votes[i].type
    }
    return runningTotal;
}