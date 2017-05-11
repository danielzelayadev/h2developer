import { Connection } from './connection';
import { UserTreeNode } from './db-tree';

export class SessionData {
  constructor(
    public conn   : Connection,
    public dbTree : UserTreeNode[]
  ){}
}
