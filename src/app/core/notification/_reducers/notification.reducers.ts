// NGRX
import { createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
// Actions
import * as notificationAction from '../_actions/notification.actions';
// Models
import { Notification } from '../../Notification/_models/Notification.model';

// tslint:disable-next-line:no-empty-interface
export interface notificationState extends EntityState<Notification> {
    //Notification
    notificationLoading: boolean;
    notificationLoaded: boolean;
    notificationError: string;
}

export interface approvalState extends EntityState<Notification> {
    //Approval
    approvalLoading: boolean;
    approvalLoaded: boolean;
    approvalError: string;
}

export interface myPendingApprovalState extends EntityState<Notification> {
    //My pending approval
    myPendingApprovalLoading: boolean;
    myPendingApprovalLoaded: boolean;
    myPendingApprovalError: string;
}

export const adapter: EntityAdapter<Notification> = createEntityAdapter<Notification>({
    selectId: (Notification: Notification) => Notification.ID,
});

export const initialNotificationsState: notificationState = adapter.getInitialState({
    ids: [],
    entities: {},
    selectedNotificationId: null,
    notificationLoading: false,
    notificationLoaded: false,
    notificationError: ""
});

export const initialApprovalsState: approvalState = adapter.getInitialState({
    ids: [],
    entities: {},
    selectedApprovalId: null,
    approvalLoading: false,
    approvalLoaded: false,
    approvalError: ""
});

export const initialMyPendingApprovalsState: myPendingApprovalState = adapter.getInitialState({
    ids: [],
    entities: {},
    selectedMyPendingApprovalId: null,
    myPendingApprovalLoading: false,
    myPendingApprovalLoaded: false,
    myPendingApprovalError: ""
});

export function notificationReducer(state = initialNotificationsState, action: notificationAction.Action): notificationState {
    switch (action.type) {
        case notificationAction.NotificationActionType.LOAD_NOTIFICATION: {
            return {
                ...state,
                notificationLoading: true,
                notificationLoaded: false,
            };
        }
        case notificationAction.NotificationActionType.LOAD_NOTIFICATION_SUCCESS: {
            return adapter.addAll(action.payload.data, {
                ...state,
                notificationLoading: false,
                notificationLoaded: true
            });
        }
        case notificationAction.NotificationActionType.LOAD_NOTIFICATION_FAIL: {
            return {
                ...state,
                entities: {},
                notificationLoading: false,
                notificationLoaded: false,
                notificationError: action.payload
            };
        }

        default: return state;
    }
}

//Approval
export function approvalReducer(state = initialApprovalsState, action: notificationAction.Action): approvalState {
    switch (action.type) {
        case notificationAction.NotificationActionType.LOAD_APPROVAL: {
            return {
                ...state,
                approvalLoading: true,
                approvalLoaded: false,
            };
        }
        case notificationAction.NotificationActionType.LOAD_APPROVAL_SUCCESS: {
            return adapter.addAll(action.payload.data, {
                ...state,
                approvalLoading: false,
                approvalLoaded: true
            });
        }
        case notificationAction.NotificationActionType.LOAD_APPROVAL_FAIL: {
            return {
                ...state,
                entities: {},
                approvalLoading: false,
                approvalLoaded: false,
                approvalError: action.payload
            };
        }

        default: return state;
    }
}

//Mypending approval
export function myPendingApprovalReducer(state = initialMyPendingApprovalsState, action: notificationAction.Action): myPendingApprovalState {
    switch (action.type) {
        case notificationAction.NotificationActionType.LOAD_MYPENDINGAPPROVAL: {
            return {
                ...state,
                myPendingApprovalLoading: true,
                myPendingApprovalLoaded: false,
            };
        }
        case notificationAction.NotificationActionType.LOAD_MYPENDINGAPPROVAL_SUCCESS: {
            return adapter.addAll(action.payload.data, {
                ...state,
                myPendingApprovalLoading: false,
                myPendingApprovalLoaded: true
            });
        }
        case notificationAction.NotificationActionType.LOAD_MYPENDINGAPPROVAL_FAIL: {
            return {
                ...state,
                entities: {},
                myPendingApprovalLoading: false,
                myPendingApprovalLoaded: false,
                myPendingApprovalError: action.payload
            };
        }

        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
} = adapter.getSelectors();