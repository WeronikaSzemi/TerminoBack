export interface TermEntity {
    id?: string;
    readonly createdAt?: Date;
    lastModifiedAt?: Date;
    readonly term: string;
    readonly termSource?: string;
    readonly termDefinition?: string;
    readonly termDefinitionSource?: string;
    readonly termCollocations?: string[];
    readonly equivalent: string;
    readonly equivalentSource?: string;
    readonly equivalentDefinition?: string;
    readonly equivalentDefinitionSource?: string;
    readonly equivalentCollocations?: string[];
}