import { createBackendFunction, data, useFunctionContext } from "@magicjs.dev/backend";
import { ObjectId } from "mongodb";

export default createBackendFunction(async function (latestMessageId) {
    try {
        const messageCollection = data("messages");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id;

        if (!userId) {
            throw new Error(`Authentication failed`);
        }

        await messageCollection.updateOne(
            { _id: new ObjectId(latestMessageId), senderId: { $ne: userId } },
            { $set: { isViewed: true } }
        );

        return true;
    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
});