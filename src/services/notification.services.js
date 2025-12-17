import notificationHelper from "../helpers/notificationHelper.js";
import NotificationSocket from "../Socket/NotificationSocket.js";

export const createNotificationService = async (data) => {
    // Save Notification
    console.log(data)
    const notification = await notificationHelper.addObject(data);

    // Re-fetch with populate
    const populated = await notificationHelper.getObjectById({
        id: notification._id,
        populatedQuery: [
            {
                path: "relatedVisitor",
                select: "name photo phone",
            },
            {
                path: "relatedHost",
                select: "name photo department",
                populate: {
                    path: "floor",
                    select: "_id buildingName floorNumber floorLabel",
                },
            },
            {
                path: "relatedAppointment",
                select: "time purpose",
            },
        ],
    });

    const payload = {
        id: populated._id,
        title: populated.title,
        message: populated.message,
        type: populated.type,
        time: populated.createdAt,
        forUser: {
            id: populated.user?._id,
            name: populated.user?.name,
            photo: populated.user?.photo,
            role: populated.user?.role,
        },
        visitor: populated.relatedVisitor
            ? {
                  id: populated.relatedVisitor._id,
                  name: populated.relatedVisitor.name,
                  photo: populated.relatedVisitor.photo,
                  phone: populated.relatedVisitor.phone,
              }
            : null,
        host: populated.relatedHost
            ? {
                  id: populated.relatedHost._id,
                  name: populated.relatedHost.name,
                  photo: populated.relatedHost.photo,
                  department: populated.relatedHost.department,
              }
            : null,
        appointment: populated.relatedAppointment
            ? {
                  id: populated.relatedAppointment._id,
                  time: populated.relatedAppointment.appointmentTime,
                  purpose: populated.relatedAppointment.purpose,
              }
            : null,
    };

    // SOCKET PUSH
    const socket = NotificationSocket.getInstance();
    if (socket) {
        const socketId = socket.getSocketId(notification.user.toString());
        if (socketId) {
            socket.sendToUser(notification.user.toString(), populated);
        }
    }

    return populated; // return usable object
};
