import { wait, waitFor } from "@testing-library/dom";

export interface ReportConfigData {
    id: string;
    reportId: string;
    embedUrl: string;
    accessToken: string;
    reportName: string;
    isEffectiveIdentityRolesRequired: boolean;
    isEffectiveIdentityRequired: boolean;
    enableRLS: boolean;
    userName: string;
    roles: string;
}