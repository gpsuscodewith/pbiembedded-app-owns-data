package com.gpsuscodewith.powerbiembedded.appownsdata.projections;

import com.gpsuscodewith.powerbiembedded.appownsdata.domain.Dataset;
import com.gpsuscodewith.powerbiembedded.appownsdata.queries.DatasetByIdQuery;
import com.gpsuscodewith.powerbiembedded.appownsdata.repositories.DatasetRepository;

public class DatasetProjection {
    private DatasetRepository repository;

    public DatasetProjection(DatasetRepository repository) {
        this.repository = repository;
    }

    public Dataset handle(DatasetByIdQuery query) {
        return repository.findById(query.getId()).orElseThrow(RuntimeException::new);
    }
}
