import { createBackendFunction, data, io, useFunctionContext } from "@magicjs.dev/backend";
import moment from "moment";
import { ObjectId } from "mongodb";

export default createBackendFunction(async function (message, threadId) {
    try {
        const messageCollection = data("messages");
        const threadCollection = data("message_threads");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id
        const userName = context.currentUser.name

        if (!userId) {
            throw new Error(`Authentication failed`);
        }

        const messageItem = await messageCollection.insertOne(
            {
                senderId: userId,
                senderName: userName,
                message,
                threadId,
                isViewed: false,
                createdAt: moment.utc().toDate()
            }
        );
        const thread = await threadCollection.findOne({ _id: ObjectId.createFromHexString(threadId) });
        const recipientId = thread?.recipients.find(recipient => recipient.recipientId !== userId)?.recipientId;
        io().to(`public/thread-${recipientId}`).emit(`refresh-thread-${recipientId}`);

        return messageItem
    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
})