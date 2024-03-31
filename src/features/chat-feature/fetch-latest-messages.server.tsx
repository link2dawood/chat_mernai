import { createBackendFunction, data, useFunctionContext } from "@magicjs.dev/backend";
import { ObjectId } from "mongodb";

export default createBackendFunction(async function (threadId, latestMsgId) {
    try {
        const messageCollection = data("messages");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id

        if (!userId) {
            throw new Error(`Authentication failed`);
        }
        const messages = await messageCollection.find({
            threadId,
            _id: { $gt: new ObjectId(latestMsgId) }
        }).toArray();
        return messages
    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
})