import { Connection } from './connection';
import { DBTreeRoot } from './db-tree';

export class SessionData {
  constructor(
    public conn   : Connection,
    public dbTree : DBTreeRoot
  ){}
}
