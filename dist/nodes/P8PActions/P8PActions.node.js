"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P8PActions = void 0;
// WAŻNE: Nazwa klasy to P8PActions (z "s" na końcu), bo tak nazywa się Twój plik!
class P8PActions {
    constructor() {
        this.description = {
            displayName: "P8P Action",
            name: "p8pAction",
            icon: "fa:bolt",
            group: ["transform"],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: "Send commands, notifications, and UI updates to P8P Mobile App",
            defaults: {
                name: "P8P Action",
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: "p8pApi",
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: "Resource",
                    name: "resource",
                    type: "options",
                    noDataExpression: true,
                    options: [
                        { name: "Notification", value: "notification" },
                        { name: "Interaction (Ask)", value: "interaction" },
                        { name: "Device", value: "device" },
                        { name: "UI Builder", value: "ui" },
                    ],
                    default: "notification",
                },
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    displayOptions: { show: { resource: ["notification"] } },
                    options: [
                        { name: "Send Push", value: "sendPush" },
                        { name: "Send Toast", value: "sendToast" },
                    ],
                    default: "sendPush",
                },
                {
                    displayName: "Title",
                    name: "title",
                    type: "string",
                    default: "",
                    displayOptions: {
                        show: { resource: ["notification"], operation: ["sendPush"] },
                    },
                },
                {
                    displayName: "Message",
                    name: "message",
                    type: "string",
                    default: "",
                    displayOptions: { show: { resource: ["notification"] } },
                },
                {
                    displayName: "Type",
                    name: "notificationType",
                    type: "options",
                    options: [
                        { name: "Info", value: "info" },
                        { name: "Success", value: "success" },
                        { name: "Warning", value: "warning" },
                        { name: "Error", value: "error" },
                    ],
                    default: "info",
                    displayOptions: {
                        show: { resource: ["notification"], operation: ["sendToast"] },
                    },
                },
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    displayOptions: { show: { resource: ["interaction"] } },
                    options: [
                        { name: "Ask Question", value: "askQuestion" },
                        { name: "Request Input", value: "requestInput" },
                    ],
                    default: "askQuestion",
                },
                {
                    displayName: "Question Text",
                    name: "message",
                    type: "string",
                    default: "Do you approve?",
                    displayOptions: { show: { resource: ["interaction"] } },
                },
                {
                    displayName: "Options",
                    name: "options",
                    type: "string",
                    default: "Yes,No",
                    displayOptions: {
                        show: { resource: ["interaction"], operation: ["askQuestion"] },
                    },
                },
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    displayOptions: { show: { resource: ["device"] } },
                    options: [
                        { name: "Get Location", value: "getLocation" },
                        { name: "Take Photo", value: "takePhoto" },
                        { name: "Scan QR", value: "scanQr" },
                    ],
                    default: "getLocation",
                },
                {
                    displayName: "Operation",
                    name: "operation",
                    type: "options",
                    noDataExpression: true,
                    displayOptions: { show: { resource: ["ui"] } },
                    options: [
                        { name: "Render Dashboard", value: "renderDashboard" },
                        { name: "Update Element", value: "updateElement" },
                    ],
                    default: "renderDashboard",
                },
                {
                    displayName: "UI Configuration JSON",
                    name: "uiConfig",
                    type: "json",
                    default: "{}",
                    displayOptions: { show: { resource: ["ui"] } },
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            const resource = this.getNodeParameter("resource", i);
            const operation = this.getNodeParameter("operation", i);
            const params = {};
            if (resource === "notification") {
                params.message = this.getNodeParameter("message", i);
                if (operation === "sendPush") {
                    params.title = this.getNodeParameter("title", i);
                }
                else {
                    params.type = this.getNodeParameter("notificationType", i);
                }
            }
            else if (resource === "interaction") {
                params.prompt = this.getNodeParameter("message", i);
                if (operation === "askQuestion") {
                    const optionsStr = this.getNodeParameter("options", i);
                    params.options = optionsStr.split(",").map((o) => o.trim());
                }
            }
            else if (resource === "ui") {
                const uiConfig = this.getNodeParameter("uiConfig", i);
                if (typeof uiConfig === "string") {
                    try {
                        params.config = JSON.parse(uiConfig);
                    }
                    catch (e) {
                        params.config = { error: "Invalid JSON", raw: uiConfig };
                    }
                }
                else {
                    params.config = uiConfig;
                }
            }
            const payload = {
                p8p_command: resource,
                p8p_action: operation,
                timestamp: new Date().toISOString(),
                params: params,
            };
            returnData.push({ json: payload });
        }
        return [returnData];
    }
}
exports.P8PActions = P8PActions;
