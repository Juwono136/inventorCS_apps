import HistoryLogs from "../models/historyLog.js";

/**
 * Function to create a history log entry:
 * @param {object} logData - Data to log.
 * @param {string} logData.actorId - ID of the user who performed the action.
 * @param {string} logData.actorName - User name.
 * @param {Array<number>} logData.role - User role.
 * @param {string} logData.actionType - Action type from an enum in the schema.
 * @param {string} logData.entityType - Entity type ('Inventory', 'LoanTransaction', etc.).
 * @param {string} logData.entityId - ID of the entity document.
 * @param {string} [logData.ipAddress] - User IP address.
 * @param {object} [logData.changes] - Object containing { before, after }.
 * @param {string} [logData.details] - Additional details.
 * @param {string} [logData.status='SUCCESS'] - 'SUCCESS' or 'FAILURE'.
 * @param {string} [logData.failureReason] - Reason for failure.
 */

// create history log
export const createLog = async (logData) => {
  try {
    const logEntry = new HistoryLogs({
      actor: {
        userId: logData.actorId,
        name: logData.actorName,
        role: logData.role,
      },
      actionType: logData.actionType,
      entity: {
        entityType: logData.entityType,
        entityId: logData.entityId,
      },
      changes: logData.changes || {},
      details: logData.details || "",
      status: logData.status || "SUCCESS",
      failureReason: logData.failureReason || null,
      ipAddress: logData.ipAddress || "",
    });

    await logEntry.save();
    console.log("Log created successfully.");
  } catch (error) {
    console.error("Failed to create history log:", error);
  }
};

// get all history logs
export const getHistoryLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) - 1 || 0;
    const limit = parseInt(req.query.limit) || 25;
    const sort = req.query.sort || "-createdAt";

    const query = {};
    const { actionType, actorId, entityType, entityId, startDate, endDate } = req.query;

    if (actionType) query.actionType = actionType;
    if (actorId) query["actor.userId"] = actorId;
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate); // $gte = greater than or equal
      if (endDate) query.createdAt.$lte = new Date(endDate); // $lte = less than or equal
    }

    const logs = await HistoryLogs.find(query)
      .sort(sort)
      .skip(page * limit)
      .limit(limit)
      .lean();

    const totalLogs = await HistoryLogs.countDocuments(query);

    res.status(200).json({
      totalLogs,
      totalPages: Math.ceil(totalLogs / limit),
      currentPage: page + 1,
      limit,
      logs,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve history logs.", error: error.message });
  }
};
