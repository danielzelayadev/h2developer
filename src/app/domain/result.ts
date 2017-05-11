export class Entry {
  constructor(
    public field : string,
    public value : string
  ){}
}

export const RS_SUCCESS            : string = "SUCCESS";
export const RS_SUCCESS_AND_UPDATE : string = "SUCCESS_AND_UPDATE";
export const RS_FAILED             : string = "FAILED";

export class Result {
  constructor(
    public statement : string,
    public resultSet : Entry[],
    public status    : string,
    public msg       : string
  ){}
}
