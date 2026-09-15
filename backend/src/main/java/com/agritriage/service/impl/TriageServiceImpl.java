package com.agritriage.service.impl;

import com.agritriage.dto.ExtractedEntities;
import com.agritriage.dto.TriageRequest;
import com.agritriage.dto.TriageResponse;
import com.agritriage.service.GroqClientService;
import com.agritriage.service.TriageService;
import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TriageServiceImpl implements TriageService {

    private static final Logger log = LoggerFactory.getLogger(TriageServiceImpl.class);

    private static final String CLASSIFY_PROMPT = """
            You are an agriculture support triage specialist.
            Analyse the incoming farmer/field message and return ONLY a JSON object (no markdown, no extra text) with exactly these keys:
            {
              "urgency": "HIGH" | "MEDIUM" | "LOW",
              "urgency_score": <integer 1-10>,
              "intent": "<concise intent label, e.g. Pest Report, Crop Disease, Irrigation Issue, Loan Query, Weather Damage, General Query>"
            }

            Rules:
            - HIGH (score 8-10): immediate crop loss risk, disease outbreak, flooding, chemical poisoning
            - MEDIUM (score 4-7): moderate pest pressure, equipment breakdown, water scarcity
            - LOW (score 1-3): general questions, status updates, documentation requests
            """;

    private static final String NER_PROMPT = """
            You are an agriculture NER engine.
            Extract entities from the farmer message and return ONLY a JSON object (no markdown):
            {
              "farmer_id": "<farmer/account ID or null>",
              "crop_type": "<crop name or null>",
              "location": "<village/district/state or null>",
              "dates": ["<any dates or time references as strings>"],
              "issue_keywords": ["<key problem words>"]
            }
            """;

    private static final String DRAFT_PROMPT = """
            You are an agricultural advisory specialist drafting a response recommendation for extension officers to review.
            Given the farmer's message, urgency level, and intent, generate a concise, grounded draft advisory recommendation in 2-3 sentences.

            MANDATORY CONSTRAINTS:
            - NO FABRICATED COMMITMENTS OR ACTIONS: The system has NO automated email, ticketing, phone call, or specialist dispatch workflow. NEVER state or promise that:
              * An email, message, or notification has been sent or will be sent
              * A case or ticket has been escalated, opened, or assigned
              * A technical team, pathologist, or officer will call, email, or visit the farmer
            - NO PREFIXES OR REPETITIVE HEADERS: Begin immediately with the actionable advisory advice (e.g. "Immediately scout...", "Check the emitter lines..."). Do NOT include labels or prefixes like "Draft Recommendation:", "Recommendation:", or "Advisory:".
            - SAFE AGRONOMIC ADVICE: Provide only safe, standard agricultural observations or preliminary checks (e.g., checking irrigation line pressure, inspecting leaf undersides, monitoring spread). Do not invent unverified chemical mixtures, home concoctions (like vinegar flushes), or uncalibrated chemical treatments.
            - REAL-WORLD ESCALATION: If the issue is severe or urgent, recommend that the farmer consult or bring a sample to their local Krishi Vigyan Kendra (KVK) or district agricultural extension office.
            - Output ONLY the direct advisory text, without preamble, labels, or quotes.
            """;

    private static final String SUMMARY_PROMPT = """
            You are an agriculture triage log analyzer.
            Write a single, factual sentence (under 20 words) describing strictly what the farmer is reporting or requesting.
            Do NOT provide advice, solutions, recommendations, or agricultural instructions.
            Answer ONLY: What is the farmer's core issue or request?
            Example format: "Farmer is reporting severe yellow rust on wheat in Ludhiana." or "Farmer is seeking guidance on Rabi mustard sowing dates and subsidized seeds in Rajasthan."
            Output ONLY the one sentence, without preamble or quotes.
            """;

    private final GroqClientService groqClientService;

    public TriageServiceImpl(GroqClientService groqClientService) {
        this.groqClientService = groqClientService;
    }

    @Override
    public TriageResponse processTriage(TriageRequest request) {
        long startTime = System.currentTimeMillis();
        String message = request.getMessage();
        String senderName = request.getSenderName() != null ? request.getSenderName() : "Unknown";

        log.info("Starting triage processing for message from '{}'", senderName);

        // 1. Classification
        String classifyRaw = groqClientService.generateCompletion(CLASSIFY_PROMPT, "Message: " + message);
        JsonNode classifyJson = groqClientService.parseCleanJson(classifyRaw);

        String urgency = classifyJson.has("urgency") ? classifyJson.get("urgency").asText("MEDIUM") : "MEDIUM";
        int urgencyScore = classifyJson.has("urgency_score") ? classifyJson.get("urgency_score").asInt(5) : 5;
        String intent = classifyJson.has("intent") ? classifyJson.get("intent").asText("General Query") : "General Query";

        // 2. Named Entity Recognition (NER)
        String nerRaw = groqClientService.generateCompletion(NER_PROMPT, "Message: " + message);
        JsonNode nerJson = groqClientService.parseCleanJson(nerRaw);

        String farmerId = nerJson.hasNonNull("farmer_id") ? nerJson.get("farmer_id").asText() : null;
        String cropType = nerJson.hasNonNull("crop_type") ? nerJson.get("crop_type").asText() : null;
        String location = nerJson.hasNonNull("location") ? nerJson.get("location").asText() : null;

        List<String> dates = new ArrayList<>();
        if (nerJson.has("dates") && nerJson.get("dates").isArray()) {
            nerJson.get("dates").forEach(d -> dates.add(d.asText()));
        }

        List<String> issueKeywords = new ArrayList<>();
        if (nerJson.has("issue_keywords") && nerJson.get("issue_keywords").isArray()) {
            nerJson.get("issue_keywords").forEach(k -> issueKeywords.add(k.asText()));
        }

        ExtractedEntities entities = new ExtractedEntities(farmerId, cropType, location, dates, issueKeywords);

        // 3. Draft Response
        String draftUserMsg = String.format("Farmer Message: %s\nUrgency: %s\nIntent: %s\nSender: %s",
                message, urgency, intent, senderName);
        String draftResponse = groqClientService.generateCompletion(DRAFT_PROMPT, draftUserMsg).trim();
        draftResponse = draftResponse.replaceAll("^(?i)(draft\\s+)?(advisory\\s+)?recommendation:\\s*", "").trim();

        // 4. Summary
        String summary = groqClientService.generateCompletion(SUMMARY_PROMPT, "Farmer Message: " + message).trim();
        summary = summary.replaceAll("^\"|\"$", "").trim();

        int elapsedMs = (int) (System.currentTimeMillis() - startTime);
        log.info("Triage processing completed in {}ms with urgency='{}' score={}", elapsedMs, urgency, urgencyScore);

        return new TriageResponse(
                urgency,
                urgencyScore,
                intent,
                entities,
                draftResponse,
                summary,
                elapsedMs
        );
    }
}
