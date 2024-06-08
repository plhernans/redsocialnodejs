const Follow = require("../models/Follow")

const followUsersId = async (identityUserId) => {
    try {
        //Sacar info de seguimiento
        let following = await Follow.find({ "user": identityUserId })
            .select({ "followed": 1, "_id": 0 })
            .exec();

        let followers = await Follow.find({ "followed": identityUserId })
            .select({ "user": 1, "_id": 0 })
            .exec();

        //Procesar array de identificadores
        let followingClean = [];

        following.forEach(follow => {
            followingClean.push(follow.followed)
        })

        let followerClean = [];

        followers.forEach(follow => {
            followerClean.push(follow.user)
        })
        return {
            following: followingClean,
            followers: followerClean
        }
    }
    catch (error) {
        return {}
    }
}

//
const followThisUser = async (identityUserId, profileUserId) => {
    let following = await Follow.findOne({ "user": identityUserId, "followed": profileUserId })
        // .select({ "followed": 1, "_id": 0 })
        // .exec();

    let followers = await Follow.findOne ({"user":profileUserId, "followed": identityUserId })
        // .select({ "user": 1, "_id": 0 })
        // .exec();
    
        return {
            following,
            followers
        };
}

module.exports = {
    followUsersId,
    followThisUser
}