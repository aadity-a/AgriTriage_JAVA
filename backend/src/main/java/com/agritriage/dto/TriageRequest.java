package com.agritriage.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class TriageRequest {

    @NotBlank(message = "Message cannot be empty")
    private String message;

    @JsonProperty("sender_name")
    private String senderName = "Unknown";

    @JsonProperty("sender_email")
    private String senderEmail = "";

    public TriageRequest() {
    }

    public TriageRequest(String message, String senderName, String senderEmail) {
        this.message = message;
        this.senderName = senderName != null ? senderName : "Unknown";
        this.senderEmail = senderEmail != null ? senderEmail : "";
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName != null ? senderName : "Unknown";
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail != null ? senderEmail : "";
    }
}
