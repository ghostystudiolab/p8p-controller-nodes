"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.P8PApi = void 0;
class P8PApi {
    constructor() {
        this.name = "p8pApi";
        this.displayName = "P8P App Token";
        this.documentationUrl = "https://ghosty.app";
        this.properties = [
            {
                displayName: "Secret App Token",
                name: "apiToken",
                type: "string",
                typeOptions: {
                    password: true,
                },
                default: "",
                required: true,
                description: "Paste your P8P App Secret Token here.",
            },
        ];
    }
}
exports.P8PApi = P8PApi;
