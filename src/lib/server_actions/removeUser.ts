"use server"

import { Users } from "lib/models"
import { connectToDb } from "lib/utils"

connectToDb()

export const removeUser = async (query = { "useremail": "string" }) => {
    try {
        // Connect to the database
        await connectToDb(); // Ensure this is awaited for a successful connection
        // Update the isDeleted field to true for the specified user
        let user = await Users.findOneAndUpdate(
            query,                // Query to find the user
            { isDeleted: true },  // Update operation to set isDeleted to true
            { new: true }        // Option to return the updated document
        );

        // Check if the user was found and updated
        if (!user) {
            return {
                user: null,
                success: false,
                message: 'User not found',
            };
        }

        // Response if successful
        let response = {
            user: JSON.parse(JSON.stringify(user)), // Return the updated user data
            success: true,
            message: 'User is deleted successfully',
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