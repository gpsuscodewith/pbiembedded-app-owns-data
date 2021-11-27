package com.gpsuscodewith.powerbiembedded.appownsdata.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gpsuscodewith.powerbiembedded.appownsdata.config.Config;
import com.gpsuscodewith.powerbiembedded.appownsdata.domain.*;
import com.gpsuscodewith.powerbiembedded.appownsdata.services.AzureADService;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;
import java.util.*;
import java.util.concurrent.ExecutionException;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

public class PowerBiService {
    static final Logger logger = LoggerFactory.getLogger(PowerBiService.class);
    private static JSONObject responseHeader;

    // Prevent instantiation
    private PowerBiService () {
        throw new IllegalStateException("Power BI service class");
    }

    public static EmbedConfig getEmbedConfig(String accessToken, String workspaceId, String reportId, ArrayList<String> additionalDatasetIds, ArrayList<String> additionalWorkspaces) throws JsonMappingException, JsonProcessingException, JSONException {
        if (reportId == null || reportId.isEmpty()) {
            throw new RuntimeException("Empty Report Id");
        }
        if (workspaceId == null || workspaceId.isEmpty()) {
            throw new RuntimeException("Empty Workspace Id");
        }

        // Get Report In Group API: https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}
        StringBuilder urlStringBuilder = new StringBuilder("https://api.powerbi.com/v1.0/myorg/groups/");
        urlStringBuilder.append(workspaceId);
        urlStringBuilder.append("/reports/");
        urlStringBuilder.append(reportId);

        // Request header
        HttpHeaders reqHeader = new HttpHeaders();
        reqHeader.put("Content-Type", Arrays.asList("application/json"));
        reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

        // HTTP entity object - holds header and body
        HttpEntity<String> reqEntity = new HttpEntity<> (reqHeader);

        // REST API URL to get report details
        String endPointUrl = urlStringBuilder.toString();

        // Rest API get report's details
        RestTemplate getReportRestTemplate = new RestTemplate();
        ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);

        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        // Create embedding configuration object
        EmbedConfig reportEmbedConfig = new EmbedConfig();

        // Create Object Mapper to convert String into Object
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert responseBody string into ReportConfig class object
        ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);

        // Add embed config to client response object
        reportEmbedConfig.embedReports = new ArrayList<ReportConfig>();
        reportEmbedConfig.embedReports.add(embedReport);

        if (Config.DEBUG) {

            // Get the request Id
            List<String> reqIdList = responseHeader.get("RequestId");

            // Log progress
            logger.info("Retrieved report details");

            // Log Request Id
            if (reqIdList != null && !reqIdList.isEmpty()) {
                for (String reqId: reqIdList) {
                    logger.info("Request Id: {}", reqId);
                }
            }
        }

        // Parse string into report object and get Report details
        JSONObject responseObj = new JSONObject(responseBody);

        // Create a list of DatasetIds
        List<String> datasetIds = new ArrayList<String>();
        datasetIds.add(responseObj.getString("datasetId"));

        // Append to existing list of datasetIds to achieve dynamic binding later
        for (String datasetId : additionalDatasetIds) {
            datasetIds.add(datasetId);
            System.out.println(datasetId);
        }

        // Get embed token
        reportEmbedConfig.embedToken = PowerBiService.getEmbedToken(accessToken, reportId, datasetIds, (String[]) additionalWorkspaces.toArray());
        return reportEmbedConfig;
    }
    /**
     * Get embed params for a report for a single workspace
     * @param {string} accessToken
     * @param {string} workspaceId
     * @param {string} reportId
     * @param {string} additionalDatasetIds
     * @return EmbedConfig object
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    public static EmbedConfig getEmbedConfig(String accessToken, String workspaceId, String reportId, String... additionalDatasetIds) throws JsonMappingException, JsonProcessingException, JSONException {
        if (reportId == null || reportId.isEmpty()) {
            throw new RuntimeException("Empty Report Id");
        }
        if (workspaceId == null || workspaceId.isEmpty()) {
            throw new RuntimeException("Empty Workspace Id");
        }

        // Get Report In Group API: https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}
        StringBuilder urlStringBuilder = new StringBuilder("https://api.powerbi.com/v1.0/myorg/groups/");
        urlStringBuilder.append(workspaceId);
        urlStringBuilder.append("/reports/");
        urlStringBuilder.append(reportId);

        // Request header
        HttpHeaders reqHeader = new HttpHeaders();
        reqHeader.put("Content-Type", Arrays.asList("application/json"));
        reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

        // HTTP entity object - holds header and body
        HttpEntity<String> reqEntity = new HttpEntity<> (reqHeader);

        // REST API URL to get report details
        String endPointUrl = urlStringBuilder.toString();

        // Rest API get report's details
        RestTemplate getReportRestTemplate = new RestTemplate();
        ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);

        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        // Create embedding configuration object
        EmbedConfig reportEmbedConfig = new EmbedConfig();

        // Create Object Mapper to convert String into Object
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert responseBody string into ReportConfig class object
        ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);

        // Add embed config to client response object
        reportEmbedConfig.embedReports = new ArrayList<ReportConfig>();
        reportEmbedConfig.embedReports.add(embedReport);

        if (Config.DEBUG) {

            // Get the request Id
            List<String> reqIdList = responseHeader.get("RequestId");

            // Log progress
            logger.info("Retrieved report details");

            // Log Request Id
            if (reqIdList != null && !reqIdList.isEmpty()) {
                for (String reqId: reqIdList) {
                    logger.info("Request Id: {}", reqId);
                }
            }
        }

        // Parse string into report object and get Report details
        JSONObject responseObj = new JSONObject(responseBody);

        // Create a list of DatasetIds
        List<String> datasetIds = new ArrayList<String>();
        datasetIds.add(responseObj.getString("datasetId"));

        // Append to existing list of datasetIds to achieve dynamic binding later
        for (String datasetId : additionalDatasetIds) {
            datasetIds.add(datasetId);
            System.out.println(datasetId);
        }

        // Get embed token
        reportEmbedConfig.embedToken = PowerBiService.getEmbedToken(accessToken, reportId, datasetIds);
        return reportEmbedConfig;
    }

    public static EmbedConfig getReportEmbedConfig(String accessToken, String workspaceId, List<String> reportIds, List<String> datasetIds) throws JsonMappingException, JsonProcessingException, JSONException {
       /*
        if (datasetIds == null || datasetIds.isEmpty()) {
            throw new RuntimeException("Empty Report Ids");
        }
        if (workspaceId == null || workspaceId.isEmpty()) {
            throw new RuntimeException("Empty Workspace Id");
        } */

        // Create embedding configuration object
        EmbedConfig reportEmbedConfig = new EmbedConfig();
        reportEmbedConfig.embedReports = new ArrayList<ReportConfig>();
        reportEmbedConfig.embedDatasets = new ArrayList<DatasetConfig>();

        // Create a list of DatasetIds
        //List<String> datasetIds = new ArrayList<String>();
        for (String datasetId : datasetIds) {
            // Get Report In Group API: https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}
            StringBuilder urlStringBuilder = new StringBuilder("https://api.powerbi.com/v1.0/myorg/groups/");
            // leaving hardcoded.  look below.  this should show you how the dataset is needed here for the embed config as well
            // as the access token.  You will see the same hardcoded value on line 344.  Replace both hardcoded values
            // with the parameters being passed in.
            urlStringBuilder.append("f9ee0ebe-14f2-45ec-af3a-34e4c4a399e3");
            urlStringBuilder.append("/datasets/");
            urlStringBuilder.append(datasetId);

            // Request header
            HttpHeaders reqHeader = new HttpHeaders();
            reqHeader.put("Content-Type", Arrays.asList("application/json"));
            reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

            // HTTP entity object - holds header and body
            HttpEntity<String> reqEntity = new HttpEntity<> (reqHeader);

            // REST API URL to get report details
            String endPointUrl = urlStringBuilder.toString();

            // Rest API get report's details
            RestTemplate getReportRestTemplate = new RestTemplate();
            ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);

            HttpHeaders responseHeader = response.getHeaders();
            String responseBody = response.getBody();

            // Create Object Mapper to convert String into Object
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Convert responseBody string into ReportConfig class object
       //     ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);
            DatasetConfig embedDataset = mapper.readValue(responseBody, DatasetConfig.class);
            reportEmbedConfig.embedDatasets.add(embedDataset);

            // Add embed config to client response object
       //     reportEmbedConfig.embedReports.add(embedReport);

            if (Config.DEBUG) {

                // Get the request Id
                List<String> reqIdList = responseHeader.get("RequestId");

                // Log progress
                logger.info("Retrieved report details");

                // Log Request Id
                if (reqIdList != null && !reqIdList.isEmpty()) {
                    for (String reqId: reqIdList) {
                        logger.info("Request Id: {}", reqId);
                    }
                }
            }

            // Parse JSON and get Report details
            JSONObject responseObj = new JSONObject(responseBody);

            // Add datasetId in the datasetIds
            //datasetIds.add(responseObj.getString("datasetId"));
        }

        for (String reportId : reportIds) {
            // Get Report In Group API: https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}
            StringBuilder urlStringBuilder = new StringBuilder("https://api.powerbi.com/v1.0/myorg/groups/");
            urlStringBuilder.append(workspaceId);
            urlStringBuilder.append("/reports/");
            urlStringBuilder.append(reportId);

            // Request header
            HttpHeaders reqHeader = new HttpHeaders();
            reqHeader.put("Content-Type", Arrays.asList("application/json"));
            reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

            // HTTP entity object - holds header and body
            HttpEntity<String> reqEntity = new HttpEntity<> (reqHeader);

            // REST API URL to get report details
            String endPointUrl = urlStringBuilder.toString();

            // Rest API get report's details
            RestTemplate getReportRestTemplate = new RestTemplate();
            ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);

            HttpHeaders responseHeader = response.getHeaders();
            String responseBody = response.getBody();

            // Create Object Mapper to convert String into Object
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Convert responseBody string into ReportConfig class object
            //     ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);
            ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);
            reportEmbedConfig.embedReports.add(embedReport);
        }

        // Get embed token - notice the hardcoded rouse and destination workspaceIds.  These are needed as the report can be in a different
        // workspace that points back to the dataset.  I want to make sure this is clear.  Remove the hardcoded values in place of parameters
        // when adapting.
        reportEmbedConfig.embedToken = PowerBiService.getEmbedToken(
                accessToken,
                reportIds,
                datasetIds,
                "6e5482de-8849-4ec2-b432-0939f3a15f31",  "f9ee0ebe-14f2-45ec-af3a-34e4c4a399e3");
        //reportEmbedConfig.embedToken = PowerBiService.getCreateReportEmbedToken(accessToken, workspaceId, datasetIds.get(0));
        return reportEmbedConfig;
    }

    /**
     * Get embed params for multiple reports for a single workspace
     * @param {string} accessToken
     * @param {string} workspaceId
     * @param {List<string>} reportIds
     * @return EmbedConfig object
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    public static EmbedConfig getEmbedConfig(String accessToken, String workspaceId, List<String> reportIds) throws JsonMappingException, JsonProcessingException, JSONException {

        // Note: This method is an example and is not consumed in this sample app

        if (reportIds == null || reportIds.isEmpty()) {
            throw new RuntimeException("Empty Report Ids");
        }
        if (workspaceId == null || workspaceId.isEmpty()) {
            throw new RuntimeException("Empty Workspace Id");
        }

        // Create embedding configuration object
        EmbedConfig reportEmbedConfig = new EmbedConfig();
        reportEmbedConfig.embedReports = new ArrayList<ReportConfig>();

        // Create a list of DatasetIds
        List<String> datasetIds = new ArrayList<String>();

        for (String reportId : reportIds) {

            // Get Report In Group API: https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}
            StringBuilder urlStringBuilder = new StringBuilder("https://api.powerbi.com/v1.0/myorg/groups/");
            urlStringBuilder.append(workspaceId);
            urlStringBuilder.append("/reports/");
            urlStringBuilder.append(reportId);

            // Request header
            HttpHeaders reqHeader = new HttpHeaders();
            reqHeader.put("Content-Type", Arrays.asList("application/json"));
            reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

            // HTTP entity object - holds header and body
            HttpEntity<String> reqEntity = new HttpEntity<> (reqHeader);

            // REST API URL to get report details
            String endPointUrl = urlStringBuilder.toString();

            // Rest API get report's details
            RestTemplate getReportRestTemplate = new RestTemplate();
            ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);

            HttpHeaders responseHeader = response.getHeaders();
            String responseBody = response.getBody();

            // Create Object Mapper to convert String into Object
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Convert responseBody string into ReportConfig class object
            ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);

            // Add embed config to client response object
            reportEmbedConfig.embedReports.add(embedReport);

            if (Config.DEBUG) {

                // Get the request Id
                List<String> reqIdList = responseHeader.get("RequestId");

                // Log progress
                logger.info("Retrieved report details");

                // Log Request Id
                if (reqIdList != null && !reqIdList.isEmpty()) {
                    for (String reqId: reqIdList) {
                        logger.info("Request Id: {}", reqId);
                    }
                }
            }

            // Parse JSON and get Report details
            JSONObject responseObj = new JSONObject(responseBody);

            // Add datasetId in the datasetIds
            datasetIds.add(responseObj.getString("datasetId"));
        }

        // Get embed token
        reportEmbedConfig.embedToken = PowerBiService.getEmbedToken(accessToken, reportIds, datasetIds);
        return reportEmbedConfig;
    }

    /**
     * Get embed params for multiple reports for a single workspace
     * @param {string} accessToken
     * @param {string} workspaceId
     * @param {List<string>} reportIds
     * @param {List<string>} additionalDatasetIds
     * @return EmbedConfig object
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    public static EmbedConfig getEmbedConfig(String accessToken, String workspaceId, List<String> reportIds, List<String> additionalDatasetIds) throws JsonMappingException, JsonProcessingException, JSONException {

        // Note: This method is an example and is not consumed in this sample app

        if (reportIds == null || reportIds.isEmpty()) {
            throw new RuntimeException("Empty Report Ids");
        }
        if (workspaceId == null || workspaceId.isEmpty()) {
            throw new RuntimeException("Empty Workspace Id");
        }

        // Create embedding configuration object
        EmbedConfig reportEmbedConfig = new EmbedConfig();
        reportEmbedConfig.embedReports = new ArrayList<ReportConfig>();

        for (String reportId : reportIds) {

            // Get Report In Group API: https://api.powerbi.com/v1.0/myorg/groups/{workspaceId}/reports/{reportId}
            StringBuilder urlStringBuilder = new StringBuilder("https://api.powerbi.com/v1.0/myorg/groups/");
            urlStringBuilder.append(workspaceId);
            urlStringBuilder.append("/reports/");
            urlStringBuilder.append(reportId);

            // Request header
            HttpHeaders reqHeader = new HttpHeaders();
            reqHeader.put("Content-Type", Arrays.asList("application/json"));
            reqHeader.put("Authorization", Arrays.asList("Bearer " + accessToken));

            // HTTP entity object - holds header and body
            HttpEntity<String> reqEntity = new HttpEntity<> (reqHeader);

            // REST API URL to get report details
            String endPointUrl = urlStringBuilder.toString();

            // Rest API get report's details
            RestTemplate getReportRestTemplate = new RestTemplate();
            ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);

            HttpHeaders responseHeader = response.getHeaders();
            String responseBody = response.getBody();

            // Create Object Mapper to convert String into Object
            ObjectMapper mapper = new ObjectMapper();
            mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            // Convert responseBody string into ReportConfig class object
            ReportConfig embedReport = mapper.readValue(responseBody, ReportConfig.class);

            // Add embed config to client response object
            reportEmbedConfig.embedReports.add(embedReport);

            if (Config.DEBUG) {

                // Get the request Id
                List<String> reqIdList = responseHeader.get("RequestId");

                // Log progress
                logger.info("Retrieved report details");

                // Log Request Id
                if (reqIdList != null && !reqIdList.isEmpty()) {
                    for (String reqId: reqIdList) {
                        logger.info("Request Id: {}", reqId);
                    }
                }
            }

            // Create a list of DatasetIds if it is null
            if (additionalDatasetIds == null) {
                additionalDatasetIds = new ArrayList<String>();
            }

            // Parse JSON and get Report details
            JSONObject responseObj = new JSONObject(responseBody);

            // Add datasetId in the datasetIds
            additionalDatasetIds.add(responseObj.getString("datasetId"));
        }

        // Get embed token
        reportEmbedConfig.embedToken = PowerBiService.getEmbedToken(accessToken, reportIds, additionalDatasetIds);
        return reportEmbedConfig;
    }

    /**
     * Get Embed token for single report, multiple datasetIds, and optional target workspaces
     * @see <a href="https://aka.ms/MultiResourceEmbedToken">Multi-Resource Embed Token</a>
     * @param {string} accessToken
     * @param {string} reportId
     * @param {List<string>} datasetId
     * @param {string} targetWorkspaceIds
     * @return EmbedToken
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    public static EmbedToken getEmbedToken(String accessToken, String reportId, List<String> datasetIds, String... targetWorkspaceIds) throws JsonMappingException, JsonProcessingException, JSONException {

        // Embed Token - Generate Token REST API
        final String uri = "https://api.powerbi.com/v1.0/myorg/GenerateToken";

        RestTemplate restTemplate = new RestTemplate();

        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));

        // Add dataset id in body
        JSONArray jsonDatasets = new JSONArray();
        for (String datasetId : datasetIds) {
            jsonDatasets.put(new JSONObject().put("id", datasetId));
        }

        // Add report id in body
        JSONArray jsonReports = new JSONArray();
        jsonReports.put(new JSONObject().put("id", reportId));

        // Add target workspace id in body
        JSONArray jsonWorkspaces = new JSONArray();
        for (String targetWorkspaceId: targetWorkspaceIds) {
            jsonWorkspaces.put(new JSONObject().put("id", targetWorkspaceId));
        }

        // Request body
        JSONObject requestBody = new JSONObject();
        requestBody.put("datasets", jsonDatasets);
    //    requestBody.put("reports", jsonReports);
        requestBody.put("targetWorkspaces", jsonWorkspaces);
        // newly added
       // requestBody.put("accessLevel", "Create");
      //  requestBody.put("allowSaveAs", "true");

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (requestBody.toString(), headers);

        // Call the API
        ResponseEntity<String> response = restTemplate.postForEntity(uri, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        // Create Object Mapper to convert String into Object
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert responseBody string into EmbedToken class object
        EmbedToken embedToken = mapper.readValue(responseBody, EmbedToken.class);

        if (Config.DEBUG) {

            // Get the request Id
            List<String> reqIdList = responseHeader.get("RequestId");

            // Log progress
            logger.info("Retrieved Embed token\nEmbed Token Id: {}", embedToken.tokenId);

            // Log Request Id
            if (reqIdList != null && !reqIdList.isEmpty()) {
                for (String reqId: reqIdList) {
                    logger.info("Request Id: {}", reqId);
                }
            }
        }
        return embedToken;
    }

    public static EmbedToken getCreateReportEmbedToken(String accessToken, String workspaceId, String datasetId) throws JSONException, JsonProcessingException {
        final String uri = "https://api.powerbi.com/v1.0/myorg/groups/" + workspaceId + "/reports/GenerateToken";

        RestTemplate restTemplate = new RestTemplate();

        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));

        JSONObject requestBody = new JSONObject();
        requestBody.put("accessLevel", "Create");
        requestBody.put("allowSaveAs", "true");
        requestBody.put("datasetId", datasetId);

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (requestBody.toString(), headers);

        // Call the API
        ResponseEntity<String> response = restTemplate.postForEntity(uri, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        // Create Object Mapper to convert String into Object
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert responseBody string into EmbedToken class object
        EmbedToken embedToken = mapper.readValue(responseBody, EmbedToken.class);

        if (Config.DEBUG) {

            // Get the request Id
            List<String> reqIdList = responseHeader.get("RequestId");

            // Log progress
            logger.info("Retrieved Embed token\nEmbed Token Id: {}", embedToken.tokenId);

            // Log Request Id
            if (reqIdList != null && !reqIdList.isEmpty()) {
                for (String reqId: reqIdList) {
                    logger.info("Request Id: {}", reqId);
                }
            }
        }
        return embedToken;
    }

    public static DatasetsConfig getDatasetsInGroup(String accessToken, String groupId) throws JsonProcessingException {
        final String uri = "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/datasets";

        RestTemplate restTemplate = new RestTemplate();
        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));
        headers.add("user-agent", "Application");

        JSONObject requestBody = new JSONObject();

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (headers);

        ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        DatasetsConfig dataSetsConfig = mapper.readValue(responseBody, DatasetsConfig.class);

        return dataSetsConfig;
    }

    public static GroupConfig createGroup(String accessToken, String groupName) throws JSONException, JsonProcessingException {
        final String uri = "https://api.powerbi.com/v1.0/myorg/groups";

        RestTemplate restTemplate = new RestTemplate();
        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));

        JSONObject requestBody = new JSONObject();
        requestBody.put("name", groupName);

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(uri, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        GroupConfig group = mapper.readValue(responseBody, GroupConfig.class);

        return group;
    }

    public static void deleteDataset(String accessToken, String groupId, String datasetId) throws JSONException, URISyntaxException {
        final String uri = "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/datasets/" + datasetId;

        logger.info("Inside PowerBIService.deleteDataset with a datasetId of " + datasetId);
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));
        // HTTP entity object - holds header and body
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);
        ResponseEntity resp = restTemplate.exchange(uri, HttpMethod.DELETE, httpEntity, String.class);
      //  Map<String, String> params = new HashMap<String, String>();
     //   params.put("dataSetId", datasetId);
    //    restTemplate.delete(uri, params);
        int x = 0;
    }

    public static String addUserToGroup(String accessToken, String groupId, String emailAddress, String groupUserAccessRights) throws JSONException {
        final String uri = "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/users";

        RestTemplate restTemplate = new RestTemplate();
        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));

        JSONObject requestBody = new JSONObject();
        requestBody.put("groupUserAccessRight", groupUserAccessRights);
        requestBody.put("emailAddress", emailAddress);

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (requestBody.toString(), headers);

        ResponseEntity<String> response = restTemplate.postForEntity(uri, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        return responseBody;
    }

    public static ReportConfig cloneReport(
            String accessToken,
            String sourceWorkspaceId,
            String reportId,
            String reportName,
            String targetWorkspaceId) throws JSONException, JsonProcessingException {

        logger.info("Inside cloneReport");
        final String uri = "https://api.powerbi.com/v1.0/myorg/groups/" + sourceWorkspaceId + "/reports/" + reportId + "/Clone";

        RestTemplate restTemplate = new RestTemplate();

        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));

        // Request body
        JSONObject requestBody = new JSONObject();
        requestBody.put("name", reportName);
        requestBody.put("targetWorkspaceId", targetWorkspaceId);

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (requestBody.toString(), headers);

        //ResponseEntity<String> response = getReportRestTemplate.exchange(endPointUrl, HttpMethod.GET, reqEntity, String.class);
        // Call the API
        ResponseEntity<String> response = restTemplate.postForEntity(uri, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        // Create Object Mapper to convert String into Object
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        ReportConfig clonedReport = mapper.readValue(responseBody, ReportConfig.class);

        return clonedReport;
    }

    /**
     * Get Embed token for multiple reports, multiple datasetIds, and optional target workspaces
     * @see <a href="https://aka.ms/MultiResourceEmbedToken">Multi-Resource Embed Token</a>
     * @param {string} accessToken
     * @param {List<string>} reportIds
     * @param {List<string>} datasetIds
     * @param {string} targetWorkspaceIds
     * @return EmbedToken
     * @throws JsonProcessingException
     * @throws JsonMappingException
     */
    public static EmbedToken getEmbedToken(String accessToken, List<String> reportIds, List<String> datasetIds, String... targetWorkspaceIds) throws JsonMappingException, JsonProcessingException, JSONException {

        // Note: This method is an example and is not consumed in this sample app

        // Embed Token - Generate Token REST API
        final String uri = "https://api.powerbi.com/v1.0/myorg/GenerateToken";

        RestTemplate restTemplate = new RestTemplate();

        // Create request header
        HttpHeaders headers = new HttpHeaders();
        headers.put("Content-Type", Arrays.asList("application/json"));
        headers.put("Authorization", Arrays.asList("Bearer " + accessToken));

        // Add dataset id in body
        JSONArray jsonDatasets = new JSONArray();
        for (String datasetId : datasetIds) {
            jsonDatasets.put(new JSONObject().put("id", datasetId));
        }

        // Add report id in body
        JSONArray jsonReports = new JSONArray();
        for (String reportId : reportIds) {
            jsonReports.put(new JSONObject().put("id", reportId));
        }

        // Request body
        JSONObject requestBody = new JSONObject();

        // newly added for create report
        requestBody.put("accessLevel", "Create");
        requestBody.put("allowSaveAs", "true");

        requestBody.put("datasets", jsonDatasets);
        requestBody.put("reports", jsonReports);

        // Add target workspace id in body
        JSONArray jsonWorkspaces = new JSONArray();
        for (String targetWorkspaceId: targetWorkspaceIds) {
            jsonWorkspaces.put(new JSONObject().put("id", targetWorkspaceId));
        }
        requestBody.put("targetWorkspaces", jsonWorkspaces);

        // Add (body, header) to HTTP entity
        HttpEntity<String> httpEntity = new HttpEntity<> (requestBody.toString(), headers);

        // Call the API
        ResponseEntity<String> response = restTemplate.postForEntity(uri, httpEntity, String.class);
        HttpHeaders responseHeader = response.getHeaders();
        String responseBody = response.getBody();

        // Create Object Mapper to convert String into Object
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert responseBody string into EmbedToken class object
        EmbedToken embedToken = mapper.readValue(responseBody, EmbedToken.class);

        if (Config.DEBUG) {

            // Get the request Id
            List<String> reqIdList = responseHeader.get("RequestId");

            // Log progress
            logger.info("Retrieved Embed token\nEmbed Token Id: {}", embedToken.tokenId);

            // Log Request Id
            if (reqIdList != null && !reqIdList.isEmpty()) {
                for (String reqId: reqIdList) {
                    logger.info("Request Id: {}", reqId);
                }
            }
        }
        return embedToken;
    }



    public static DatasetConfig importFile(String accessToken, String filePath, String groupId, String datasetName) throws UnsupportedOperationException, IOException {
        String bearer = "Bearer " + accessToken;
        //String fileName = "SalesReportTemplate.pbix";
        String fileName = Paths.get(filePath).getFileName().toString();
        //String filePath = Config.datasetFilePath;

        // groupId was origionally hardcoded here based on configuration value
        //String groupId = Config.workspaceId;

        HttpClient request = HttpClientBuilder.create().build();

        HttpPost post = new HttpPost( "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/imports?datasetDisplayName=" + datasetName);

        long time = (new Date()).getTime();
        String boundary = "---------------------------" + time;
        post.setHeader( "ContentType", "multipart/form-data; boundary=" + boundary );
        post.setHeader( "Authorization", bearer );

        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        builder.setBoundary( boundary );
        builder.addBinaryBody( "filename", new File( filePath ), ContentType.APPLICATION_OCTET_STREAM, fileName );
        org.apache.http.HttpEntity multipart = builder.build();

        post.setEntity( multipart );
        HttpResponse response = null;

        try {
            response = request.execute( post );
        } catch ( ClientProtocolException e ) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch ( IOException e ) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        BufferedReader rd = new BufferedReader(new InputStreamReader(response.getEntity().getContent()));

        StringBuffer result = new StringBuffer();
        String line = "";
        while ( (line = rd.readLine()) != null ) {
            result.append( line );
        }

        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // Convert responseBody string into EmbedToken class object
        DatasetConfig datasetConfig = mapper.readValue(result.toString(), DatasetConfig.class);
        return datasetConfig;
    }
}
