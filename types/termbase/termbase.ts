import {TermbaseEntity} from "./termbase-entity";

export type CreateTermbaseReq = Omit<TermbaseEntity, 'termbaseId'>;

export interface GetSingleTermbaseRes {
    entry: TermbaseEntity,
}