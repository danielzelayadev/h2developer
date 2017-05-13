export class DBTreeRoot {
  constructor(
    public userSchemas : SchemaTreeNode[],
    public otherUsers  : UserTreeNode[],
    public templates   : any
  ){}
}

export class UserTreeNode {

  constructor(
    public user        : string,
    public ddl         : string,
    public query       : string,
    public schemas     : SchemaTreeNode[],
    public templates   : any
  ) {}

}

export class SchemaTreeNode {

  constructor(
    public schema : string,
    public ddl    : string,
    public query  : string,
    public templates : any,
    public constants : DBObject[],
    public constraints : DBObject[],
    public functions : DBObject[],
    public indexes : DBObject[],
    public sequences : DBObject[],
    public tables : DBObject[],
    public triggers : DBObject[],
    public views : DBObject[]
  ) {}

}

export class DBObject {
  constructor(
    public name      : string,
    public ddl       : string,
    public query     : string,
    public templates : any
  ){}
}

export const nonarrs = [ 'schema', 'ddl', 'query', 'templates' ];

export function orderObjs(dbTree : DBTreeRoot) {
  const orderSchema = (s : SchemaTreeNode) => {
    const objs = Object.keys(s).filter(k => !nonarrs.includes(k));
    objs.map(o => s[o].sort((a : DBObject, b : DBObject) => {
      if (a.name < b.name)
        return -1;
      if (a.name > b.name)
        return 1;

      return 0;
    }));
  };

  dbTree.userSchemas.map(orderSchema);
  dbTree.otherUsers.map(u => u.schemas.map(orderSchema));
}
