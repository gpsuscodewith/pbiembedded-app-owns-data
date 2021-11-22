import { ProcessorResult, UnitOfWork } from "./UnitOfWork";
import { UserData,putUser } from "./User";
import { deleteWorkspaceUser, postWorkspaceForUser } from "./WorkspaceUser";


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
        const innerResult = await postWorkspaceForUser(accessToken, userId, j);
        if (!innerResult.successful) {
            processorResult.isSuccessful = false;
        }
    }

    return processorResult;

}