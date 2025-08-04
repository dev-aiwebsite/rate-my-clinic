import { Users } from "./models"
import { connectToDb } from "./utils"

export const fetchData = async (query?:{[key:string]:any}) => {
    try {
        await connectToDb()
        const users = await Users.find()

        return JSON.parse(JSON.stringify(users)) as typeof users
    } catch (err) {
        if (err instanceof Error){
            console.log(err.message)
        }
        throw new Error("failed to fetch user")
    }
}