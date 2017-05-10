import { Injectable } from '@angular/core';

import { Message } from 'primeng/primeng';

@Injectable()
export class UtilsService {

  success(summary : string, detail : string) : Message {
    return { severity: 'success', summary, detail };
  }

  error(summary : string, detail : string) : Message {
    return { severity: 'error', summary, detail };
  }

}
