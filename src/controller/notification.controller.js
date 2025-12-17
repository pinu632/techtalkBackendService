// controllers/notification.controller.js

import notificationHelper from "../helpers/notificationHelper.js";
import AppError from "../handlers/AppError.js";
import { successResponse } from "../handlers/responsehandler.js";
import NotificationSocket from "../Socket/NotificationSocket.js";




export const createNotification = async (req, res, next) => {
    try {
        // Save Notification
        const notification = await notificationHelper.addObject(req.body);

        // Re-fetch notification with populated fields for rich UI data
        const populatedNotification = await notificationHelper.getObjectById({
            id: notification._id,
            populatedQuery: [
                {
                    path: "relatedVisitor",
                    select: "name photo phone"
                },
                {
                    path: "relatedHost",
                    select: "name photo department",
                    populate:{
                        path:'floor',
                        select:'_id buildingName floorNumber floorLabel'
                    }
                },
                {
                    path: "relatedAppointment",
                    select: "time purpose"
                },

            ]
        });
      

        // Prepare clean UI payload for socket
        const payload = {
            id: populatedNotification._id,
            title: populatedNotification.title,
            message: populatedNotification.message,
            type: populatedNotification.type,
            time: populatedNotification.createdAt,
            forUser: {
                id: populatedNotification.user?._id,
                name: populatedNotification.user?.name,
                photo: populatedNotification.user?.photo,
                role: populatedNotification.user?.role,
            },
            visitor: populatedNotification.relatedVisitor
                ? {
                    id: populatedNotification.relatedVisitor._id,
                    name: populatedNotification.relatedVisitor.name,
                    photo: populatedNotification.relatedVisitor.photo,
                    phone: populatedNotification.relatedVisitor.phone,
                }
                : null,
            host: populatedNotification.relatedHost
                ? {
                    id: populatedNotification.relatedHost._id,
                    name: populatedNotification.relatedHost.name,
                    photo: populatedNotification.relatedHost.photo,
                    department: populatedNotification.relatedHost.department,
                }
                : null,
            appointment: populatedNotification.relatedAppointment
                ? {
                    id: populatedNotification.relatedAppointment._id,
                    time: populatedNotification.relatedAppointment.appointmentTime,
                    purpose: populatedNotification.relatedAppointment.purpose,
                }
                : null,
        };

        // WebSocket real-time push
        const socket = NotificationSocket.getInstance();
        if (socket) {
            const socketId = socket.getSocketId(notification.user.toString());
            if (socketId) {
                socket.sendToUser(notification.user.toString(), populatedNotification);
            }
        }

        return successResponse(
            res,
            201,
            "Notification created successfully",
            populatedNotification
        );

    } catch (error) {
        next(error);
    }
};




export const getNotificationById = async (req, res, next) => {
    try {
        const notification = await notificationHelper.getObjectById({
            id: req.params.id,
        });

        if (!notification) {
            throw new AppError("Notification not found", 404);
        }

        return successResponse(
            res,
            200,
            "Notification fetched successfully",
            notification
        );
    } catch (error) {
        next(error);
    }
};

export const getAllNotifications = async (req, res, next) => {
    try {
        const { filter, pageNum, pageSize, select } = req.body;

        let input = { pageNum, pageSize };
        if (filter) input.query = filter;
        if (select) input.selectFrom = select;

        input.populatedQuery = [
            {
                path: "relatedVisitor",
                select: "name photo phone"
            },
            {
                path: "relatedHost",
                select: "name photo department"
            },
            {
                path: "relatedAppointment",
                select: "appointmentTime purpose"
            },

        ];

        const notifications = await notificationHelper.getAllObjects(input);

        return successResponse(
            res,
            200,
            "Notifications fetched successfully",
            notifications
        );
    } catch (error) {
        next(error);
    }
};

export const updateNotification = async (req, res, next) => {
    try {
        const notification = await notificationHelper.updateObject(
            req.params.id,
            req.body
        );

        return successResponse(
            res,
            200,
            "Notification updated successfully",
            notification
        );
    } catch (error) {
        next(error);
    }
};

export const deleteNotification = async (req, res, next) => {
    try {
        await notificationHelper.deleteObjectById(req.params.id);

        return successResponse(
            res,
            200,
            "Notification deleted successfully",
            {}
        );
    } catch (error) {
        next(error);
    }
};
