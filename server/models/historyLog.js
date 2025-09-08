import mongoose from "mongoose";

const historyLogSchema = mongoose.Schema(
  {
    // Information about the user who performed the action
    actor: {
      userId: {
        type: String, // storing user ID from User schema
        required: true,
        index: true,
      },
      name: {
        type: String, // save user names for easy display, without needing to join
        required: true,
      },
      role: {
        type: [Number], // saves user roles [0], [1], [2], ... at the time the action is performed
        required: true,
      },
    },

    // the type of action performed
    actionType: {
      type: String,
      required: true,
      index: true,
      enum: [
        // inventory related actions
        "CREATE_INVENTORY",
        "UPDATE_INVENTORY",
        "DELETE_INVENTORY_REQUEST",
        "DELETE_INVENTORY_APPROVE",

        // loan transaction related actions
        "CREATE_LOAN",
        "APPROVE_LOAN",
        "PICKUP_CONFIRMED_BY_STAFF",
        "PICKUP_CONFIRMED_BY_USER",
        "RETURN_CONFIRMED_BY_STAFF",
        "RETURN_CONFIRMED_BY_USER",
        "CANCEL_LOAN",
        "UPDATE_LOAN_STATUS",

        // meeting related actions
        "SCHEDULE_MEETING",
        "APPROVE_MEETING",
        "CANCEL_MEETING",

        // user related actions
        "USER_LOGIN",
        "USER_LOGOUT",
        "USER_REGISTER",
        "UPDATE_USER_PROFILE",
        "UPDATE_USER_ROLE",

        // general actions
        "OTHER",
      ],
    },

    // affected entities/documents
    entity: {
      entityType: {
        type: String,
        required: true,
        enum: ["Inventory", "LoanTransaction", "Meeting", "User"],
      },
      entityId: {
        type: String, // stores the _id or unique ID of the affected document.
        required: true,
        index: true,
      },
    },

    // change details: saves before and after conditions (for UPDATE only)
    changes: {
      before: {
        type: Object,
        default: null,
      },
      after: {
        type: Object,
        default: null,
      },
    },

    // additional details: notes or other contextual information
    details: {
      type: String,
      maxlength: 500,
      default: "",
    },

    // action status: Success or Failure
    status: {
      type: String,
      enum: ["SUCCESS", "FAILURE"],
      required: true,
    },

    // failure reason: error message if status 'FAILURE'
    failureReason: {
      type: String,
      default: null,
    },

    // technical information
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

historyLogSchema.index({ "actor.userId": 1, createdAt: -1 });
historyLogSchema.index({ "entity.entityId": 1, createdAt: -1 });
historyLogSchema.index({ actionType: 1, createdAt: -1 });

export default mongoose.model("HistoryLogs", historyLogSchema);
