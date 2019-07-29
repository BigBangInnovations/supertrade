// NGRX
import { createFeatureSelector, createSelector } from '@ngrx/store';

// State
import { notificationState, myPendingApprovalState, approvalState, adapter } from '../_reducers/notification.reducers';

export const selectNotificationState = createFeatureSelector<notificationState>('notification');
export const selectApprovalState = createFeatureSelector<approvalState>('approval');
export const selectMyPendingApprovalState = createFeatureSelector<myPendingApprovalState>('myPendingApproval');

//notification
export const getNotification = createSelector(
  selectNotificationState,
  adapter.getSelectors().selectAll
);

export const getNotificationLoading = createSelector(
  selectNotificationState,
  (state: notificationState) => state.notificationLoading
);

export const getNotificationLoaded = createSelector(
  selectNotificationState,
  (state: notificationState) => state.notificationLoaded
);
export const getNotificationError = createSelector(
  selectNotificationState,
  (state: notificationState) => state.notificationError
);

//Approval
export const getApproval = createSelector(
  selectApprovalState,
  adapter.getSelectors().selectAll
);

export const getApprovalLoading = createSelector(
  selectApprovalState,
  (state: approvalState) => state.approvalLoading
);

export const getApprovalLoaded = createSelector(
  selectApprovalState,
  (state: approvalState) => state.approvalLoaded
);
export const getApprovalError = createSelector(
  selectApprovalState,
  (state: approvalState) => state.approvalError
);

//My pending Approval
export const getMyPendingApproval = createSelector(
  selectMyPendingApprovalState,
  adapter.getSelectors().selectAll
);

export const getMyPendingApprovalLoading = createSelector(
  selectMyPendingApprovalState,
  (state: myPendingApprovalState) => state.myPendingApprovalLoading
);

export const getMyPendingApprovalLoaded = createSelector(
  selectMyPendingApprovalState,
  (state: myPendingApprovalState) => state.myPendingApprovalLoaded
);
export const getMyPendingApprovalError = createSelector(
  selectMyPendingApprovalState,
  (state: myPendingApprovalState) => state.myPendingApprovalError
);