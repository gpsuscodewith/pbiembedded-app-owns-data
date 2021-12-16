package com.gpsuscodewith.powerbiembedded.appownsdata.aggregators;

import com.gpsuscodewith.powerbiembedded.appownsdata.commands.DeleteDatasetCommand;
import com.gpsuscodewith.powerbiembedded.appownsdata.repositories.DatasetRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

public class DatasetAggregate{

    private DatasetRepository repository;

    public DatasetAggregate(DatasetRepository datasetRepository) {
        this.repository = datasetRepository;
    }

    public void handle(DeleteDatasetCommand command) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + command.getAccessToken()));
        // HTTP entity object - holds header and body
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);
        ResponseEntity resp = restTemplate.exchange(command.getUri(), HttpMethod.DELETE, httpEntity, String.class);

        repository.deleteById(command.getDatasetId());
    }
}
