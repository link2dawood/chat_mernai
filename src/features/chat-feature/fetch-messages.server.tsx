import { createBackendFunction, data, useFunctionContext } from "@magicjs.dev/backend";

export default createBackendFunction(async function (threadId) {
    try {
        const messageCollection = data("messages");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id

        if (!userId) {
            throw new Error(`Authentication failed`);
        }
        const messages = await messageCollection.find({ threadId }).toArray();
        return messages
    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
})