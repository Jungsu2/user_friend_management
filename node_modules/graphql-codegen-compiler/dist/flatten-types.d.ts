import { FlattenDocument, FlattenModel } from './types';
import { Document, SelectionSetItem } from 'graphql-codegen-core';
export declare const handleNameDuplications: (name: string, existing: FlattenModel[]) => string;
export declare function flattenSelectionSet(selectionSet: SelectionSetItem[], result?: FlattenModel[]): FlattenModel[];
export declare function flattenTypes(document: Document): FlattenDocument;
