import {TermEntity} from "./term-entity";

export type CreateEntryReq = Omit<TermEntity, 'id'>;

export interface GetSingleEntryRes {
    entry: TermEntity,
}