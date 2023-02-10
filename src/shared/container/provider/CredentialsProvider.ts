import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

interface IResponse {
  success: boolean;
}

export class CredentialsProvider {
  async verify(
    type: 'google.com' | 'facebook.com',
    token: string,
  ): Promise<IResponse> {
    if (type === 'google.com') {
      return this.google(token);
    }

    if (type === 'facebook.com') {
      return this.facebook(token);
    }

    return {
      success: false,
    };
  }

  private async facebook(token: string): Promise<IResponse> {
    try {
      const response = await axios.get(
        `https://graph.facebook.com/me?access_token=${token}`,
      );

      return {
        success: response.data.id !== undefined,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }

  private async google(token: string): Promise<IResponse> {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    try {
      const response = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_AUDIENCE,
      });

      return {
        success: response.getPayload().email !== undefined,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  }
}
