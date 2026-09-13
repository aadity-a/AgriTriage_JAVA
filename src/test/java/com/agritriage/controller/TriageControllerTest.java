package com.agritriage.controller;

import com.agritriage.dto.ExtractedEntities;
import com.agritriage.dto.TriageRequest;
import com.agritriage.dto.TriageResponse;
import com.agritriage.service.TriageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TriageController.class)
class TriageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TriageService triageService;

    @Test
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void testTriageEndpoint_success() throws Exception {
        ExtractedEntities entities = new ExtractedEntities(
                "F982", "Wheat", "Punjab", List.of("tomorrow"), List.of("rust", "pest")
        );
        TriageResponse mockResponse = new TriageResponse(
                "HIGH", 9, "Pest Report", entities,
                "Please isolate infected crops.", "Wheat rust report in Punjab", 450
        );

        when(triageService.processTriage(any(TriageRequest.class))).thenReturn(mockResponse);

        TriageRequest request = new TriageRequest(
                "Urgent: wheat rust spreading rapidly across the field",
                "Harpreet Singh",
                "harpreet@example.com"
        );

        mockMvc.perform(post("/api/triage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.urgency").value("HIGH"))
                .andExpect(jsonPath("$.urgency_score").value(9))
                .andExpect(jsonPath("$.intent").value("Pest Report"))
                .andExpect(jsonPath("$.entities.farmer_id").value("F982"))
                .andExpect(jsonPath("$.entities.crop_type").value("Wheat"));
    }

    @Test
    void testTriageEndpoint_emptyMessage_badRequest() throws Exception {
        TriageRequest request = new TriageRequest("", "Harpreet Singh", "harpreet@example.com");

        mockMvc.perform(post("/api/triage")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
