import { ProcessorResult, UnitOfWork } from "./UnitOfWork";
import { UserData,putUser } from "./User";
import { WorkspaceData } from "./Workspace";
import { deleteWorkspaceUser, postWorkspaceUser, WorkspaceUserData } from "./WorkspaceUser";

export const processUserWorkspaceUpdates = async (
    accessToken: string,
    userId: number, 
    userGroups: UnitOfWork<number>): Promise<ProcessorResult> => {

    let processorResult: ProcessorResult = {
        isSuccessful: true
    };

    for (var i of userGroups.deletes) {
        const innerResult = await deleteWorkspaceUser(accessToken, userId, i);
        if (!innerResult.successful) {
            processorResult.isSuccessful = false;
        }
    }

    for (var j of userGroups.adds) {
        const workspaceUser: WorkspaceUserData = {
            id: 0,
            userId: userId,
            workspaceId: j
        };
        const innerResult = await postWorkspaceUser(accessToken, workspaceUser);
        if (innerResult === undefined) {
            processorResult.isSuccessful = false;
        }
    }

    return processorResult;

}