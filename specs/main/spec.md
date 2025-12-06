# Psychological Support Platform - Lead Capture & CRM Integration

## Overview
A modern psychological pre-screening platform that connects users with virtual assistants (AI Agents) to provide initial support and qualify leads for professional therapy. The system captures critical user data during natural conversation and integrates with a CRM dashboard for therapists.

## Core Features

### Lead Data Capture
- **Functionality**: AI Agents (Sofia, Carlos, Júlia, Ana, Lucas) naturally extract structured data during conversation.
- **Required Fields**:
  - **Personal**: Name, Phone, Email, Age
  - **Location**: City, State, CEP (Postal Code), Neighborhood
  - **Financial**: Budget (text description), Budget Min/Max (numeric inference)
  - **Clinical**: Main Concern, Emotional State, Symptoms, Previous Therapy
  - **Logistics**: Preferred Contact, Availability, Modality (Online/Presencial/Híbrido)
- **Mechanism**: 
  - Progressive profiling (asking naturally over time)
  - LLM-based extraction (parsing conversation history into JSON)
  - Triggered after 4+ user messages

### CRM Dashboard
- **Functionality**: Admin interface for therapists to view, manage, and prioritize leads.
- **Key Views**:
  - **Lead List**: Filterable by status (New, Contacted, Scheduled, Converted, Lost)
  - **Lead Detail**: Comprehensive view of all captured data including CEP and Budget
  - **Metrics**: Conversion rates, total leads, urgency distribution
- **Lead Scoring**: Automated scoring based on data completeness and urgency.

### AI Agents
- **Profiles**: 5 distinct personalities (Empathetic, Objective, Positive, Reflective, Balanced).
- **Behavior**: 
  - Must validate feelings first.
  - Must never diagnose.
  - Must actively but naturally seek missing data points (especially CEP and Budget).
  - Must provide crisis resources (CVV 188) when risk is detected.

## Non-Functional Requirements
- **Privacy**: Compliance with LGPD (sensitive health data).
- **Performance**: 
  - Chat response < 2s (perceived).
  - Data extraction must not block chat flow.
- **Reliability**: 
  - Retry logic for LLM API failures (503 errors).
  - Graceful degradation if extraction fails.

## Edge Cases
- **Incomplete Data**: Dashboard must handle missing fields gracefully ("Não informado").
- **Ambiguous Budget**: "Não tenho muito dinheiro" -> Low budget flag, no numeric value.
- **Crisis**: Immediate intervention overrides data capture.
