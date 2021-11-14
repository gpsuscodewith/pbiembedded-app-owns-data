/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { TenantData, getTenants } from "./Data/Tenant";
import { styled } from '@mui/material/styles';
import { NewTenantForm } from './NewTenant';
import { BootstrapButton } from './BootstrapButton';
import { TenantGrid } from './TenantGrid';

export const TenantsPage = () => {
    const [tenants, setTenants] = useState<TenantData[]>([]);
    const [tenantsLoading, setTenantsLoading] = useState(true);
    const [creatingNewTenant, setCreatingNewtenant] = useState(false);
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();

    useEffect(() => {
        const doGetTenants = async() => {
            const accessToken = await getAccessTokenSilently();
            const tenants = await getTenants(accessToken);
            setTenants(tenants);
            setTenantsLoading(false);
        };
        if (isAuthenticated) {
            doGetTenants();
        } else {
            console.log(`The value of isAuthenticated in TenantsPage useEffect() is ${isAuthenticated}`);
        }
    }, [isAuthenticated, creatingNewTenant]);

    const addTenant = () => {
        setCreatingNewtenant(true);
    }

    const tenantAdded = (tenant: TenantData) => {
        setCreatingNewtenant(false);
    }

    return (
        <div>
            {tenantsLoading ? (
                <div
                css={css`
                    font-size: 16px;
                    font-style: italic;
                `}
                >
                Loading...
            </div>) : creatingNewTenant ? (
                <NewTenantForm tenantCreated={(tenant) => tenantAdded(tenant)} />
            ) : (
                <div>
                    <TenantGrid data={tenants || []} />
                    <div>
                        <BootstrapButton variant="contained" color="primary" onClick={ () => { addTenant(); } }>Add Tenant</BootstrapButton>
                    </div>
                </div>
            )}
        </div>
    );
};
