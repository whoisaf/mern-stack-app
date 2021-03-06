import { Request } from "express";

import env from "../lib/env";
import { getBaseUrl } from "../lib/utils";
import { IUser } from "../models/user.model";
import { IMailService, MailService } from "../services/email";

interface IEmailController {
  sendWelcomeEmail(req: Request, user: IUser): any;
  sendVerificationEmail(req: Request, user: IUser, token: string): any;
}

class EmailController implements IEmailController {
  public service: IMailService;

  constructor(service: IMailService) {
    this.service = service;
  }

  public sendWelcomeEmail(req: Request, user: IUser) {
    /**
     *  Template data
     */
    const data = {
      ...this.service.config,
      name: user.profile.name,
      link: `${getBaseUrl(req)}/login`
    };

    /**
     *  Send mail
     */
    return this.service.send({
      to: {
        name: user.profile.name,
        email: user.email
      },
      subject: `Welcome to ${env.get("APP_NAME")}`,
      html: this.service.template("welcome", data)
    });
  }

  public sendVerificationEmail(req: Request, user: IUser, token: string) {
    /**
     *  Template data
     */
    const data = {
      ...this.service.config,
      name: user.profile.name,
      link: `${getBaseUrl(req)}/verify/${token}`
    };

    /**
     *  Send mail
     */
    return this.service.send({
      to: {
        name: user.profile.name,
        email: user.email
      },
      subject: `Welcome! Confirm your ${env.get("APP_NAME")} account`,
      html: this.service.template("verifyUser", data)
    });
  }
}

export default new EmailController(MailService);
