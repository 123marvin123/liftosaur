import { ILogUtil } from "../../lambda/utils/log";
import { ISesUtil } from "../../lambda/utils/ses";

export class MockSesUtil implements ISesUtil {
  constructor(public readonly log: ILogUtil) {}

  public async sendEmail(args: {
    destination: string;
    source: string;
    subject: string;
    body: string;
  }): Promise<AWS.SES.Types.SendEmailResponse | undefined> {
    return undefined;
  }
}
