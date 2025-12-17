"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P8PTrigger = void 0;
class P8PTrigger {
    constructor() {
        this.description = {
            displayName: "P8P Trigger",
            name: "p8pTrigger",
            icon: "fa:play-circle",
            group: ["trigger"],
            version: 1,
            description: "Starts the workflow when a button is pressed in the P8P App",
            defaults: {
                name: "P8P Trigger",
            },
            inputs: [],
            outputs: ["main"],
            credentials: [
                {
                    name: "p8pApi",
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: "default",
                    httpMethod: "POST",
                    responseMode: "onReceived",
                    path: "p8p-execute",
                },
            ],
            properties: [
                {
                    displayName: "Information",
                    name: "notice",
                    type: "notice",
                    default: 'This node listens for the "Execute" signal from the P8P mobile app.',
                },
            ],
        };
    }
    async webhook() {
        const req = this.getRequestObject();
        const headers = req.headers;
        const body = req.body;
        const credentials = await this.getCredentials("p8pApi");
        const validToken = credentials.apiToken;
        const appToken = headers["x-p8p-token"];
        if (!appToken || appToken !== validToken) {
            return {
                workflowData: [
                    [
                        {
                            json: {
                                error: "Access Denied: Invalid or missing P8P App Token",
                            },
                        },
                    ],
                ],
            };
        }
        return {
            workflowData: [
                [
                    {
                        json: {
                            ...body,
                            _p8p_metadata: {
                                timestamp: new Date().toISOString(),
                                source: "mobile_app",
                            },
                        },
                    },
                ],
            ],
        };
    }
}
exports.P8PTrigger = P8PTrigger;
