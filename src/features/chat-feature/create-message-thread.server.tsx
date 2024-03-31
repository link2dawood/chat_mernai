import { createBackendFunction, data, io, useFunctionContext } from "@magicjs.dev/backend";
import moment from "moment";
import { ObjectId } from "mongodb";

export default createBackendFunction(async function (recipientIds: any[]) {
    try {
        const threadCollection = data("message_threads");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id
        const userName = context.currentUser.name

        if (!userId) {
            throw new Error(`Authentication failed`);
        }

        const users = data('users');
        let recipients = [{
            recipientId: userId,
            recipientName: userName,
        }]

        for (const recipientId of recipientIds) {
            const recipient: any = await users.findOne({ _id: new ObjectId(recipientId) });
            recipients.push({ recipientName: recipient.name, recipientId })
        }
        const threads = await threadCollection.find({ "recipients.recipientId": userId }).toArray();

        const existingMessageThread = threads.find((thread) => {
            const newRecipientIds = recipients.map((recipient) => recipient.recipientId);
            const existingThreadRecipientIds = thread.recipients.map((recipient) => recipient.recipientId);
            if (newRecipientIds.length !== existingThreadRecipientIds.length) {
                return false;
            } else {
                return JSON.stringify(newRecipientIds) === JSON.stringify(existingThreadRecipientIds);
            }
        });

        let thread
        if (!existingMessageThread) {
            const result = await threadCollection.insertOne(
                {
                    recipients,
                    createdAt: moment.utc().toDate()
                }
            );
            thread = await threadCollection.findOne({ _id: result.insertedId });
            const recipientId = thread?.recipients.find(recipient => recipient.recipientId !== userId)?.recipientId;
            io().to(`public/thread-${recipientId}`).emit(`refresh-thread-${recipientId}`);
        } else {
            thread = existingMessageThread
        }

        return thread;

    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
})