import { ICredentialType, INodeProperties } from "n8n-workflow";

export class P8PApi implements ICredentialType {
  name = "p8pApi";
  displayName = "P8P App Token";
  documentationUrl = "https://ghosty.app";
  properties: INodeProperties[] = [
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
