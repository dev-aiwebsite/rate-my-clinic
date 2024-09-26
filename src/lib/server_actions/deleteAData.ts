"use server"
import { DB_ClientSurveyData, DB_OwnerSurveyData, DB_TeamSurveyData } from "lib/models";
import { connectToDb } from "lib/utils"
import mongoose from "mongoose";

connectToDb()

export const deleteAData = async (ids:string[],dbName:string) => {
    try {
        // Connect to the database
        await connectToDb(); // Ensure this is awaited for a successful connection
        // Update the isDeleted field to true for the specified user
        const objectIds = ids.map(id => new mongoose.Types.ObjectId(id));

        // Update the isDeleted field to true for all matching documents
        let result:any= ""
        console.log(objectIds,'objectIds')
        console.log(dbName, 'dbName')
        switch (dbName) {
            case "client":
                result =  await DB_ClientSurveyData.updateMany(
                    { _id: { $in: objectIds } }, // Query to find the documents with IDs in the array
                    { isDeleted: true }           // Update operation to set isDeleted to true
                );
                break;
            case "team":
                result =  await DB_TeamSurveyData.updateMany(
                    { _id: { $in: objectIds } }, // Query to find the documents with IDs in the array
                    { isDeleted: true }           // Update operation to set isDeleted to true
                );
                break;
            case "owner":
                result =  await DB_OwnerSurveyData.updateMany(
                    { _id: { $in: objectIds } }, // Query to find the documents with IDs in the array
                    { isDeleted: true }           // Update operation to set isDeleted to true
                );
                break;
        
            default:
                break;
        }
       console.log(result,'result')
        // Check how many documents were modified
        if (result.modifiedCount === 0) {
            return {
                success: false,
                message: 'No users found to update.',
            };
        }

        // Response if successful
        let response = {
            success: true,
            message: `${result.modifiedCount} user(s) deleted successfully.`,
        };

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