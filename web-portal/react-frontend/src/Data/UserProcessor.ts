import { ProcessorResult, UnitOfWork } from "./UnitOfWork";
import { UserData,putUser } from "./User";
import { deleteWorkspaceUser, postWorkspaceForUser } from "./WorkspaceUser";


export const UserProcessor = async (
    accessToken: string,
    user: UserData, 
    userGroups: UnitOfWork<number>): Promise<ProcessorResult> => {

    let processorResult: ProcessorResult = {
        isSuccessful: true
    };

    const result = await putUser(accessToken, user);
    if (result === undefined) {
        processorResult.errorMessage = "There was a failure updated the user resource";
        return processorResult;
    }

    for (var i of userGroups.deletes) {
        const innerResult = await deleteWorkspaceUser(accessToken, user.id, i);
        if (!innerResult.successful) {
            processorResult.isSuccessful = false;
        }
    }

    for (var j of userGroups.adds) {
        const innerResult = await postWorkspaceForUser(accessToken, user.id, j);
        if (!innerResult.successful) {
            processorResult.isSuccessful = false;
        }
    }

    return processorResult;

}