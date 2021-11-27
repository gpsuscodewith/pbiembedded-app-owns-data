package com.gpsuscodewith.powerbiembedded.appownsdata.powerbi.commands;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

public class DeleteDatasetCommand {
    private String uri;

    private String accessToken;
    private String groupId;
    private String datasetId;

    public DeleteDatasetCommand(String accessToken, String groupId, String datasetId) {
        this.accessToken = accessToken;
        this.groupId = groupId;
        this.datasetId = datasetId;
        this.uri = "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/datasets/" + datasetId;
    }

    public void execute() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));
        // HTTP entity object - holds header and body
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);
        ResponseEntity resp = restTemplate.exchange(uri, HttpMethod.DELETE, httpEntity, String.class);
    }
}
