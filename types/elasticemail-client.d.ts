declare module '@elasticemail/elasticemail-client' {
    interface ApiClientInstance {
      authentications: {
        apikey: { apiKey: string };
      };
    }
  
    interface EmailRecipient {
      Email: string;
      Fields?: Record<string, string>;
    }
  
    interface BodyPart {
      ContentType: string;
      Content: string;
    }
  
    interface EmailMessageData {
      Recipients: EmailRecipient[];
      Content: {
        Body: BodyPart[];
        Subject: string;
        From: string;
        TemplateName?: string;
      };
    }
  
    interface EmailsApi {
      emailsPost(
        emailMessageData: EmailMessageData,
        callback: (error: any, data: any, response: any) => void
      ): void;
    }
  
    const ApiClient: {
      instance: ApiClientInstance;
    };
    const EmailsApi: new () => EmailsApi;
    const EmailRecipient: new (email: string, name?: string) => EmailRecipient;
    const BodyPart: {
      constructFromObject(data: { ContentType: string; Content: string }): BodyPart;
    };
    const EmailMessageData: {
      constructFromObject(data: {
        Recipients: EmailRecipient[];
        Content: {
          Body: BodyPart[];
          Merge?: {
            [key: string]: string;
          };
          Subject: string;
          From: string;
          TemplateName?: string;
        };
      }): EmailMessageData;
    };
  }
  