import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getInitialRoute() {
    return {
      status: 'up',
      message:
        "The application is running. In order to access its documentation, access the path presented in 'docs'.",
      docs: '/docs',
    };
  }
}
