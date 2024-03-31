import { createBackendFunction, data, useFunctionContext } from "@magicjs.dev/backend";
import { ObjectId } from "mongodb";

export default createBackendFunction(async function () {
    try {
        const userCollection = data("users");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id

        if (!userId) {
            throw new Error(`Authentication failed`);
        }
        const contacts = await userCollection.find({ _id: { $ne: new ObjectId(userId) } }).toArray();

        return contacts
    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
})