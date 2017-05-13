export class DBTreeRoot {
  constructor(
    public userSchemas : SchemaTreeNode[],
    public otherUsers  : UserTreeNode[]
  ){}
}

export class UserTreeNode {

  constructor(
    public user : string,
    public schemas : SchemaTreeNode[]
  ) {}

}

export class SchemaTreeNode {

  constructor(
    public schema : string,
    public constants : string[],
    public constraints : string[],
    public functions : string[],
    public indexes : string[],
    public sequences : string[],
    public tables : string[],
    public triggers : string[],
    public views : string[]
  ) {}

}

export function orderObjs(dbTree : DBTreeRoot) {
  const orderSchema = (s : SchemaTreeNode) => {
    const objs = Object.keys(s).filter(k => k !== 'schema');
    objs.map(o => s[o].sort());
  };

  dbTree.userSchemas.map(orderSchema);
  dbTree.otherUsers.map(u => u.schemas.map(orderSchema));
}
