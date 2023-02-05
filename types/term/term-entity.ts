export interface TermEntity {
    id?: string;
    readonly createdAt?: Date;
    lastModifiedAt?: Date;
    term: string;
    termSource?: string;
    termDefinition?: string;
    termDefinitionSource?: string;
    termCollocations?: string;
    equivalent: string;
    equivalentSource?: string;
    equivalentDefinition?: string;
    equivalentDefinitionSource?: string;
    equivalentCollocations?: string;
}