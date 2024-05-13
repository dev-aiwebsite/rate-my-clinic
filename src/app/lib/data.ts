import { Users } from "./models"
import { connectToDb } from "./utils"

export const fetchData = async () => {
    connectToDb()
    try {
        const users = await Users.find()
        return users
    } catch (err) {
        console.log(err)
        throw new Error("failed to fetch user")
    }
}