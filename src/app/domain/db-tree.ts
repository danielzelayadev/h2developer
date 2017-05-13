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
