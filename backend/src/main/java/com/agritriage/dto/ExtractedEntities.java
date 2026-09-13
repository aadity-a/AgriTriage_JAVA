package com.agritriage.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExtractedEntities {

    @JsonProperty("farmer_id")
    private String farmerId;

    @JsonProperty("crop_type")
    private String cropType;

    @JsonProperty("location")
    private String location;

    @JsonProperty("dates")
    private List<String> dates = new ArrayList<>();

    @JsonProperty("issue_keywords")
    private List<String> issueKeywords = new ArrayList<>();

    public ExtractedEntities() {
    }

    public ExtractedEntities(String farmerId, String cropType, String location, List<String> dates, List<String> issueKeywords) {
        this.farmerId = farmerId;
        this.cropType = cropType;
        this.location = location;
        this.dates = dates != null ? dates : new ArrayList<>();
        this.issueKeywords = issueKeywords != null ? issueKeywords : new ArrayList<>();
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getCropType() {
        return cropType;
    }

    public void setCropType(String cropType) {
        this.cropType = cropType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getDates() {
        return dates;
    }

    public void setDates(List<String> dates) {
        this.dates = dates != null ? dates : new ArrayList<>();
    }

    public List<String> getIssueKeywords() {
        return issueKeywords;
    }

    public void setIssueKeywords(List<String> issueKeywords) {
        this.issueKeywords = issueKeywords != null ? issueKeywords : new ArrayList<>();
    }
}
