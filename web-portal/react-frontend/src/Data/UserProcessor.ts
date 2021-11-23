import { ProcessorResult, UnitOfWork } from "./UnitOfWork";
import { UserData,putUser } from "./User";
import { WorkspaceData } from "./Workspace";
import { deleteWorkspaceUser, postWorkspaceUser, WorkspaceUserData } from "./WorkspaceUser";

export const processUserWorkspaceUpdates = async (
    accessToken: string,
    userId: number, 
    userGroups: UnitOfWork<number>): Promise<ProcessorResult> => {

    console.log(`Inside processUserWorkspaceUpdates with countAdds: ${userGroups.adds.length} and countDeletes: ${userGroups.deletes.length}`);
    let processorResult: ProcessorResult = {
        isSuccessful: true
    };

    for (var i of userGroups.deletes) {
        const innerResult = await deleteWorkspaceUser(accessToken, userId, i);
        console.log(`Reuturned from deleteWorkspaceUser with a value of ${innerResult.successful}`);
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
        const postedUser = await postWorkspaceUser(accessToken, workspaceUser);
        console.log(`Reuturned from postWorkspaceUser with a value of ${postedUser?.id}`);
        if (postedUser === undefined) {
            processorResult.isSuccessful = false;
        }
    }

    return processorResult;

}