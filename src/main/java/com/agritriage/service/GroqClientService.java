package com.agritriage.service;

import com.agritriage.config.GroqProperties;
import com.agritriage.dto.groq.ChatCompletionRequest;
import com.agritriage.dto.groq.ChatCompletionResponse;
import com.agritriage.dto.groq.ChatMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class GroqClientService {

    private static final Logger log = LoggerFactory.getLogger(GroqClientService.class);
    private static final Pattern JSON_BLOCK_PATTERN = Pattern.compile("```(?:json)?\\s*([\\s\\S]*?)\\s*```");
    private static final Pattern BRACE_PATTERN = Pattern.compile("\\{[\\s\\S]*\\}");

    private final GroqProperties groqProperties;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GroqClientService(GroqProperties groqProperties, ObjectMapper objectMapper) {
        this.groqProperties = groqProperties;
        this.objectMapper = objectMapper;
        this.restClient = RestClient.builder().build();
    }

    public String generateCompletion(String systemPrompt, String userMessage) {
        if (groqProperties.getApiKey() == null || groqProperties.getApiKey().isBlank()) {
            throw new IllegalStateException("GROQ_API_KEY is not configured. Please set the GROQ_API_KEY environment variable.");
        }

        ChatCompletionRequest request = new ChatCompletionRequest(
                groqProperties.getModel(),
                List.of(
                        new ChatMessage("system", systemPrompt),
                        new ChatMessage("human", userMessage)
                ),
                groqProperties.getTemperature()
        );

        log.debug("Sending chat completion request to Groq API using model: {}", groqProperties.getModel());

        ChatCompletionResponse response = restClient.post()
                .uri(groqProperties.getApiUrl())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + groqProperties.getApiKey().trim())
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(ChatCompletionResponse.class);

        if (response != null && response.getChoices() != null && !response.getChoices().isEmpty()) {
            return response.getChoices().getFirst().getMessage().getContent();
        }

        throw new RuntimeException("Empty response received from Groq API");
    }

    public JsonNode parseCleanJson(String rawResponse) {
        String cleaned = cleanJsonFences(rawResponse);
        try {
            return objectMapper.readTree(cleaned);
        } catch (JsonProcessingException e) {
            // Attempt fallback to find first {...} block
            Matcher matcher = BRACE_PATTERN.matcher(cleaned);
            if (matcher.find()) {
                try {
                    return objectMapper.readTree(matcher.group());
                } catch (JsonProcessingException ex) {
                    log.warn("Failed to extract JSON object from fallback matcher: {}", ex.getMessage());
                }
            }
            log.error("Could not parse JSON response from LLM: {}", rawResponse);
            return objectMapper.createObjectNode();
        }
    }

    public String cleanJsonFences(String text) {
        if (text == null) {
            return "";
        }
        Matcher matcher = JSON_BLOCK_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        return text.replace("```json", "").replace("```", "").trim();
    }
}
