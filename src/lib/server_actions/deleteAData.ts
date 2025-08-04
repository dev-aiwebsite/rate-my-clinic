"use server"
import { DB_ClientSurveyData, DB_OwnerSurveyData, DB_TeamSurveyData, Users } from "lib/models";
import { connectToDb } from "lib/utils"
import mongoose from "mongoose";

connectToDb()

export const deleteAData = async ({ userId, ids, dbName }: { userId?: string, ids: string[], dbName: string }) => {
    try {
        // Connect to the database
        await connectToDb(); // Ensure this is awaited for a successful connection
        // Update the isDeleted field to true for the specified user
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

        // Update the isDeleted field to true for all matching documents
        let result: any = ""
        let response = {
            success: false,
            message: `No item updated`,
        };

        console.log(objectIds, 'objectIds')
        console.log(dbName, 'dbName')
        switch (dbName) {
            case "client":
                result = await DB_ClientSurveyData.updateMany(
                    { _id: { $in: objectIds } }, // Query to find the documents with IDs in the array
                    { isDeleted: true }           // Update operation to set isDeleted to true
                );
                response['message'] = `${result.modifiedCount} item deleted successfully.`,
                    response['success'] = true
                break;
            case "team":
                result = await DB_TeamSurveyData.updateMany(
                    { _id: { $in: objectIds } }, // Query to find the documents with IDs in the array
                    { isDeleted: true }           // Update operation to set isDeleted to true
                );
                response['message'] = `${result.modifiedCount} item deleted successfully.`,
                    response['success'] = true
                break;
            case "owner":
                result = await DB_OwnerSurveyData.updateMany(
                    { _id: { $in: objectIds } }, // Query to find the documents with IDs in the array
                    { isDeleted: true }           // Update operation to set isDeleted to true
                );
                response['message'] = `${result.modifiedCount} item deleted successfully.`,
                    response['success'] = true
                break;

            case "reports":
                if (userId) {
                    result = await Users.updateOne(
                        { _id: new mongoose.Types.ObjectId(userId) }, // Find the specific user
                        { $pull: { reports: { _id: { $in: objectIds } } } }
                    );

                    response['message'] = `${objectIds.length} item deleted successfully.`,
                        response['success'] = true
                }

                break;

            default:
                break;
        }


        return response;

    } catch (error: any) {
        // Handle errors
        let response = {
            user: null,
            success: false,
            message: error.toString(),
        };
        return response;
    }
};