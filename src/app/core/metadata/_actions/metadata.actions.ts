// NGRX
import { Action } from '@ngrx/store';

export enum MetadataActionTypes {
    LOAD_METADATA = '[MetadataHome] All Metadata Requested',
    LOAD_METADATA_SUCCESS = '[Metadata API] All Metadata Loaded successfully',
    LOAD_METADATA_FAIL = '[Metadata API] All Metadata Load Error',
    LOAD_METADATA_ACTION_TOGGLE_LOADING = '[Metadata API] All Metadata Load Togg',
}

export class LoadMetadata implements Action {
    readonly type = MetadataActionTypes.LOAD_METADATA;
    constructor(public payload) { }
}

export class LoadMetadataSuccess implements Action {
    readonly type = MetadataActionTypes.LOAD_METADATA_SUCCESS;
    constructor(public payload) { }
}

export class LoadMetadataFail implements Action {
    readonly type = MetadataActionTypes.LOAD_METADATA_FAIL;
    constructor(public payload: string) {}
}
export class LoadMetadataActionToggleLoading implements Action {
    readonly type = MetadataActionTypes.LOAD_METADATA_ACTION_TOGGLE_LOADING;
    constructor(public payload: { isLoading: boolean }) { }
}

export type MetadataActions = LoadMetadata
| LoadMetadataSuccess
| LoadMetadataFail
| LoadMetadataActionToggleLoading;
