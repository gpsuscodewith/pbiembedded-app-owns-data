package com.gpsuscodewith.powerbiembedded.appownsdata.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gpsuscodewith.powerbiembedded.appownsdata.config.Config;
import com.gpsuscodewith.powerbiembedded.appownsdata.domain.EmbedConfig;
import com.gpsuscodewith.powerbiembedded.appownsdata.domain.EmbedToken;
import com.gpsuscodewith.powerbiembedded.appownsdata.domain.ReportConfig;
import com.gpsuscodewith.powerbiembedded.appownsdata.services.AzureADService;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
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
        requestBody.put("reports", jsonReports);
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

    public static String importFile(String accessToken, String filePath) throws UnsupportedOperationException, IOException {
        String bearer = "Bearer " + accessToken;
        //String fileName = "SalesReportTemplate.pbix";
        String fileName = Paths.get(filePath).getFileName().toString();
        //String filePath = Config.datasetFilePath;
        String groupId = Config.workspaceId;

        HttpClient request = HttpClientBuilder.create().build();

        HttpPost post = new HttpPost( "https://api.powerbi.com/v1.0/myorg/groups/" + groupId + "/imports?datasetDisplayName=" + fileName);

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

        return result.toString();
    }
}
