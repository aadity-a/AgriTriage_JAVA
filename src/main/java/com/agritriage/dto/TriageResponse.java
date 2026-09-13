package com.agritriage.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TriageResponse {

    private String urgency;

    @JsonProperty("urgency_score")
    private int urgencyScore;

    private String intent;

    private ExtractedEntities entities;

    @JsonProperty("draft_response")
    private String draftResponse;

    private String summary;

    @JsonProperty("processing_time_ms")
    private int processingTimeMs;

    public TriageResponse() {
    }

    public TriageResponse(String urgency, int urgencyScore, String intent, ExtractedEntities entities,
                          String draftResponse, String summary, int processingTimeMs) {
        this.urgency = urgency;
        this.urgencyScore = urgencyScore;
        this.intent = intent;
        this.entities = entities;
        this.draftResponse = draftResponse;
        this.summary = summary;
        this.processingTimeMs = processingTimeMs;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public int getUrgencyScore() {
        return urgencyScore;
    }

    public void setUrgencyScore(int urgencyScore) {
        this.urgencyScore = urgencyScore;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public ExtractedEntities getEntities() {
        return entities;
    }

    public void setEntities(ExtractedEntities entities) {
        this.entities = entities;
    }

    public String getDraftResponse() {
        return draftResponse;
    }

    public void setDraftResponse(String draftResponse) {
        this.draftResponse = draftResponse;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public int getProcessingTimeMs() {
        return processingTimeMs;
    }

    public void setProcessingTimeMs(int processingTimeMs) {
        this.processingTimeMs = processingTimeMs;
    }
}
