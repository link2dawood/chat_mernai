import { createBackendFunction, data, io, useFunctionContext } from "@magicjs.dev/backend";

export default createBackendFunction(async function () {
    try {
        const threadCollection = data("message_threads");
        const messageCollection = data("messages");
        const context = useFunctionContext(this);
        const userId = context.currentUser._id;

        if (!userId) {
            throw new Error(`Authentication failed`);
        }

        const threads = await threadCollection.find({ "recipients.recipientId": userId }).toArray();

        const threadsWithUnreadCount = await Promise.all(threads.map(async (thread) => {
            const unreadMessagesCount = await messageCollection
                .aggregate([
                    {
                        $match: {
                            threadId: thread._id.toString(),
                            senderId: { $ne: userId },
                            isViewed: false
                        }
                    },
                    {
                        $group: {
                            _id: "$threadId",
                            count: { $sum: 1 }
                        }
                    }
                ])
                .toArray();

            return {
                ...thread,
                unreadMessagesCount
            };
        }));
        return threadsWithUnreadCount;
    } catch (error) {
        throw new Error(error?.message || "Network error");
    }
});
