import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from "n8n-workflow";

export class P8PResponse implements INodeType {
  description: INodeTypeDescription = {
    displayName: "P8P Response",
    name: "p8pResponse",
    icon: "fa:flag-checkered",
    group: ["transform"],
    version: 1,
    description: "Sends the final status and data back to the P8P App UI",
    defaults: {
      name: "P8P Response",
    },
    inputs: ["main"],
    outputs: ["main"],
    properties: [
      {
        displayName: "App Status Indicator",
        name: "status",
        type: "options",
        options: [
          { name: "Success (Green)", value: "success" },
          { name: "Error (Red)", value: "error" },
          { name: "Info (Blue)", value: "info" },
          { name: "Warning (Orange)", value: "warning" },
        ],
        default: "success",
        description:
          "Determines the color and icon of the notification in the mobile app",
      },
      {
        displayName: "UI Message",
        name: "uiMessage",
        type: "string",
        default: "Workflow completed successfully",
        description:
          "The text message displayed to the user on the phone screen",
      },
      {
        displayName: "Include Workflow Data?",
        name: "sendData",
        type: "boolean",
        default: true,
        description:
          "If enabled, the JSON output from the previous node will be sent to the app",
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const status = this.getNodeParameter("status", i) as unknown as string;
      const uiMessage = this.getNodeParameter(
        "uiMessage",
        i
      ) as unknown as string;
      const sendData = this.getNodeParameter("sendData", i) as boolean;

      const responseToApp = {
        p8p_status: status,
        ui_message: uiMessage,
        payload: sendData ? items[i].json : {},
        timestamp: new Date().toISOString(),
      };

      returnData.push({ json: responseToApp });
    }

    return [returnData];
  }
}
