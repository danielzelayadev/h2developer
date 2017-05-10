import { Injectable } from '@angular/core';

import { Message } from 'primeng/primeng';

@Injectable()
export class UtilsService {

  error(summary : string, detail : string) : Message {
    return { severity: 'error', summary, detail };
  }

}
