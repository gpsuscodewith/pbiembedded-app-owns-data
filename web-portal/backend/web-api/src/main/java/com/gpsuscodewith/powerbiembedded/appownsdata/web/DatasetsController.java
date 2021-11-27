package com.gpsuscodewith.powerbiembedded.appownsdata.web;

//import com.azure.core.annotation.Delete;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.gpsuscodewith.powerbiembedded.appownsdata.config.Config;
import com.gpsuscodewith.powerbiembedded.appownsdata.domain.*;
import com.gpsuscodewith.powerbiembedded.appownsdata.powerbi.commands.DeleteDatasetCommand;
import com.gpsuscodewith.powerbiembedded.appownsdata.repositories.DatasetRepository;
//import org.simpleframework.xml.Path;
import com.gpsuscodewith.powerbiembedded.appownsdata.repositories.PbiWorkspaceRepository;
import com.gpsuscodewith.powerbiembedded.appownsdata.services.AzureADService;
import com.gpsuscodewith.powerbiembedded.appownsdata.services.PowerBiService;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

@CrossOrigin(maxAge = 3600)
@RestController
@RequestMapping("/datasets")
public class DatasetsController {
    static final Logger logger = LoggerFactory.getLogger(DatasetsController.class);
    private final DatasetRepository datasetRepository;
    private final PbiWorkspaceRepository workspaceRepository;

    public DatasetsController(DatasetRepository datasetRepository, PbiWorkspaceRepository workspaceRepository) {
        this.datasetRepository = datasetRepository;
        this.workspaceRepository = workspaceRepository;
    }

    @GetMapping
    public List<Dataset> getDatasets() {
        return datasetRepository.findAll();
    }

    @GetMapping("/{id}")
    public Dataset getDataset(@PathVariable Long id, Principal principal) {
        return datasetRepository.findById(id).orElseThrow(RuntimeException::new);
    }

    @GetMapping("{id}/config")
    public EmbedConfig getDatasetConfig(@PathVariable String id, Principal principal) {
        String accessToken = null;
        try {
            accessToken = AzureADService.getAccessToken();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }

        String workspacePbiIdentifier = Config.workspaceId;

        ArrayList<String> datasetIds = new ArrayList<String>();
        datasetIds.add(id);

        ArrayList<String> reportIds = new ArrayList<String>();

        try {
            EmbedConfig embedConfig = PowerBiService.getReportEmbedConfig(accessToken, workspacePbiIdentifier, reportIds, datasetIds);
            return embedConfig;
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return null;
    }

    @PostMapping
    public ResponseEntity createDataset(@RequestBody Dataset dataset, Principal principal) throws URISyntaxException, IOException {
        // Get access token
        String accessToken;
        try {
            accessToken = AzureADService.getAccessToken();
        } catch (ExecutionException | MalformedURLException | RuntimeException ex) {
            // Log error message
            logger.error(ex.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());

        } catch (InterruptedException interruptedEx) {
            // Log error message
            logger.error(interruptedEx.getMessage());

            Thread.currentThread().interrupt();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(interruptedEx.getMessage());
        }

        PbiWorkspace workspace = workspaceRepository.findById(dataset.getWorkspaceId()).get();
        String pbiWorkspaceId = Config.workspaceId;
        if (workspace != null) {
            pbiWorkspaceId = workspace.getPbiIdentifier();
        }

        DatasetConfig result = PowerBiService.importFile(accessToken, Config.datasetFilePath, pbiWorkspaceId, dataset.getDataSetName());

        // the above result is not the correct id.  another call to GetDataSetsInGroup is required to find the actual id
        String datasetPbiId = "";
        DatasetsConfig datasetsConfig = PowerBiService.getDatasetsInGroup(accessToken, pbiWorkspaceId);
        for (DatasetConfig dataSetConfig : datasetsConfig.getValue()) {
            if (dataSetConfig.getName().equalsIgnoreCase(dataset.getDataSetName())) {
                datasetPbiId = dataSetConfig.getId();
            }
        }

        // call get report in group and grab dataset id from response
        logger.info("Inside createDataset and setting the PbiId to be " + datasetPbiId);
        dataset.setPbiId(datasetPbiId);
        dataset.setWebUrl(result.getWebUrl());
        dataset.setPbiWorkspaceId(pbiWorkspaceId);
        Dataset savedDataset = datasetRepository.save(dataset);

        return ResponseEntity.created(new URI("/datasets/" + savedDataset.getId())).body(savedDataset);
    }

    @PutMapping("{id}")
    public ResponseEntity updateDataset(@PathVariable Long id, @RequestBody Dataset dataset, Principal principal) {
        Dataset currentDataset = datasetRepository.findById(id).orElseThrow(RuntimeException::new);
        currentDataset.setDataSetName(dataset.getDataSetName());
        currentDataset.setPbiWorkspace(dataset.getPbiWorkspace());
        currentDataset.setTenantId(dataset.getTenantId());
        currentDataset = datasetRepository.save(dataset);

        return ResponseEntity.ok(currentDataset);
    }

    @DeleteMapping("{id}")
    public ResponseEntity deleteDataset(@PathVariable Long id, Principal principal) {
        Dataset dataset =  datasetRepository.findById(id).orElseThrow(RuntimeException::new);

        // Get access token
        String accessToken;
        try {
            accessToken = AzureADService.getAccessToken();
            String pbiId = dataset.getPbiId();
            String groupId = getPbiWorkspaceIdForDataset(dataset);
            logger.info("Inside deleteDataset with a pbiId of " + pbiId + " and a workspace of " + groupId);

            DeleteDatasetCommand cmd = new DeleteDatasetCommand(accessToken, groupId, pbiId);
            cmd.execute();

         //   PowerBiService.deleteDataset(accessToken, groupId, pbiId);
            datasetRepository.deleteById(id);
        } catch (Exception e) {
            logger.error(e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }

        return ResponseEntity.ok().build();
    }

    private String getPbiWorkspaceIdForDataset(Dataset dataset) {
        PbiWorkspace workspace = workspaceRepository.findById(dataset.getWorkspaceId()).get();
        if (workspace == null) {
            throw new InvalidDataAccessApiUsageException("There was no Workspace Id found for the Dataset with id of " + dataset.getId());
        }

        return workspace.getPbiIdentifier();
    }
}
