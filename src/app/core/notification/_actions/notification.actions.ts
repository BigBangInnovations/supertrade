import { Action } from '@ngrx/store'

// Models
import { CommonResponse, CommonResponseDirectData } from '../../common/common.model'

export enum NotificationActionType {
    LOAD_NOTIFICATION = '[Notification] load notification',
    LOAD_NOTIFICATION_SUCCESS = '[Notification] load notification Success',
    LOAD_NOTIFICATION_FAIL = '[Notification] load notification Fail',
}

export class LoadNotification implements Action {
    readonly type = NotificationActionType.LOAD_NOTIFICATION;
    constructor(public payload) { }
}

export class LoadNotificationSuccess implements Action {
    readonly type = NotificationActionType.LOAD_NOTIFICATION_SUCCESS;
    constructor(public payload: CommonResponseDirectData) { }
}

export class LoadNotificationFail implements Action {
    readonly type = NotificationActionType.LOAD_NOTIFICATION_FAIL;
    constructor(public payload: string) {}
}
export type Action = LoadNotification | LoadNotificationSuccess | LoadNotificationFail;