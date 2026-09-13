package com.agritriage.service;

import com.agritriage.dto.TriageRequest;
import com.agritriage.dto.TriageResponse;

public interface TriageService {

    TriageResponse processTriage(TriageRequest request);
}
