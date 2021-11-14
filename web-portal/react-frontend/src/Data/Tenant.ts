import { wait, waitFor } from "@testing-library/dom";
import { http } from "./http";

export interface TenantData {
    id: number;
    tenantName: string;
}

export interface TenantDataFromServer {
    id: number;
    tenantName: string;
}

const mapTenantDataFromServer = (
    tenant: TenantDataFromServer,
) : TenantData => ({
    ...tenant
});

export const getTenants = async(accessToken: string): Promise<TenantData[]> => {
    console.log('Inside getTenants with an accessToken of ' + accessToken);
    const result = await http<TenantDataFromServer[]>({
        path: '/tenants',
        accessToken: accessToken
    }); 
    console.log('After call to /tenants');
    if (result.ok && result.body) {
        return result.body.map(mapTenantDataFromServer);
    } else {
        return [];
    }
};

export const postTenant = async(accessToken: string, tenant: TenantData): Promise<TenantData | undefined> => {
    console.log('Inside postTenant with an accessToken of ' + accessToken);
    const result = await http<TenantDataFromServer, TenantData>({
        path: '/tenants',
        method: 'post',
        body: tenant,
        accessToken: accessToken
    });
    if (result.ok && result.body) {
        return mapTenantDataFromServer(result.body);
    } else {
        return undefined;
    }
};

