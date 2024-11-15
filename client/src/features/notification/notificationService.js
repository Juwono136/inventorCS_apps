import axios from "axios";

const API_URL = '/service/notification';

// get user notification
const getNotificationByUser = async (token) => {
    const response = await axios.get(API_URL + '/user_notification', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// mark a notification as read
const markNotificationAsRead = async (notificationId, token) => {
    const response = await axios.patch(API_URL + `/read_notification/${notificationId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
};

const notificationService = {
    getNotificationByUser,
    markNotificationAsRead
};

export default notificationService;
