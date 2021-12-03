package com.gpsuscodewith.powerbiembedded.appownsdata.commands;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

public class DeleteDatasetCommand {
    private Long datasetId;
    private String uri;
    private String accessToken;
    private String groupId;
    private String powerBiId;

    public DeleteDatasetCommand(String accessToken, Long datasetId, String groupId, String powerBiId) {
        this.datasetId = datasetId;
        this.accessToken = accessToken;
        this.groupId = groupId;
        this.powerBiId = powerBiId;
        this.uri = "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/datasets/" + powerBiId;
    }

    public String getUri() {
        return uri;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getGroupId() {
        return groupId;
    }

    public String getPowerBiId() {
        return powerBiId;
    }

    public Long getDatasetId() {
        return datasetId;
    }
}
