export interface IPrismaQuery {
  where: any;
  select?: any;
  include?: any;
  skip?: number;
  take?: number;
}

export interface IPrismaCursor {
  skip: number;
  take: number;
}
