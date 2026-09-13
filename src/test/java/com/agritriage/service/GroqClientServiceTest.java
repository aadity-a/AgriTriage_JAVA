package com.agritriage.service;

import com.agritriage.config.GroqProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GroqClientServiceTest {

    private GroqClientService groqClientService;

    @BeforeEach
    void setUp() {
        GroqProperties properties = new GroqProperties();
        properties.setApiKey("mock-key");
        ObjectMapper mapper = new ObjectMapper();
        groqClientService = new GroqClientService(properties, mapper);
    }

    @Test
    void testCleanJsonFences_withMarkdown() {
        String input = "```json\n{\"urgency\": \"HIGH\", \"urgency_score\": 9}\n```";
        String cleaned = groqClientService.cleanJsonFences(input);
        assertEquals("{\"urgency\": \"HIGH\", \"urgency_score\": 9}", cleaned);
    }

    @Test
    void testParseCleanJson_success() {
        String input = "```json\n{\"urgency\": \"HIGH\", \"urgency_score\": 9, \"intent\": \"Pest Report\"}\n```";
        JsonNode node = groqClientService.parseCleanJson(input);
        assertNotNull(node);
        assertEquals("HIGH", node.get("urgency").asText());
        assertEquals(9, node.get("urgency_score").asInt());
        assertEquals("Pest Report", node.get("intent").asText());
    }

    @Test
    void testParseCleanJson_withSurroundingText() {
        String input = "Here is your JSON response:\n{\"farmer_id\": \"F102\", \"crop_type\": \"Wheat\"}\nHope this helps!";
        JsonNode node = groqClientService.parseCleanJson(input);
        assertNotNull(node);
        assertEquals("F102", node.get("farmer_id").asText());
        assertEquals("Wheat", node.get("crop_type").asText());
    }
}
