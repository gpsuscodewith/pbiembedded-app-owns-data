package com.gpsuscodewith.powerbiembedded.appownsdata.projections;

import com.gpsuscodewith.powerbiembedded.appownsdata.domain.PbiWorkspace;
import com.gpsuscodewith.powerbiembedded.appownsdata.queries.WorkspaceByIdQuery;
import com.gpsuscodewith.powerbiembedded.appownsdata.repositories.PbiWorkspaceRepository;

public class WorkspaceProjection {
    private PbiWorkspaceRepository repository;

    public WorkspaceProjection(PbiWorkspaceRepository repository) {
        this.repository = repository;
    }

    public PbiWorkspace handle(WorkspaceByIdQuery query) {
        return repository.findById(query.getId()).get();
    }
}
