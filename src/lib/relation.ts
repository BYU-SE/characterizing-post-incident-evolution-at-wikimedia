type DTORelation = {
  gen_hash: String;
  gen_link: string;
  link_redirect?: string;
  gen_relation?: string;
};
export class Relation<T> {
  constructor(public actual: T, public dto: DTORelation) {}
}
