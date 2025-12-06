# Checklist: Lead Capture & CRM Integration Quality

**Purpose**: Validate the quality, completeness, and clarity of requirements for the Lead Capture and CRM Integration modules.
**Context**: Validating requirements for capturing sensitive user data (CEP, Budget, etc.) via AI conversation and displaying it in a CRM.

## Requirement Completeness
- [ ] CHK001 - Are all required data fields (Name, Phone, CEP, Budget, etc.) explicitly listed in the data model specification? [Completeness, Spec §Lead Data Capture]
- [ ] CHK002 - Is the trigger condition for data extraction (e.g., "after 4 messages") clearly defined? [Completeness, Spec §Lead Data Capture]
- [ ] CHK003 - Are requirements defined for handling "Budget" when the user provides vague answers (e.g., "depends on value")? [Completeness, Edge Case]
- [ ] CHK004 - Are the specific questions or prompts the AI should use to ask for sensitive info (Budget, CEP) defined? [Completeness, Spec §AI Agents]
- [ ] CHK005 - Are requirements specified for the "Lead Scoring" algorithm? [Completeness, Gap]
- [ ] CHK006 - Is the retention policy for sensitive health data (LGPD) explicitly defined? [Completeness, Spec §Non-Functional]

## Requirement Clarity
- [ ] CHK007 - Is "natural extraction" defined with specific examples or constraints? [Clarity, Spec §Lead Data Capture]
- [ ] CHK008 - Are the "Budget Min/Max" inference rules clearly specified (e.g., how to handle "between 100 and 200")? [Clarity, Spec §Lead Data Capture]
- [ ] CHK009 - Is the distinction between "City/State" and "CEP" clear in terms of priority (which one overrides)? [Clarity, Ambiguity]
- [ ] CHK010 - Are the visual states for the CRM Dashboard (Loading, Error, Empty) clearly described? [Clarity, Spec §CRM Dashboard]

## Requirement Consistency
- [ ] CHK011 - Do the data fields in the Extraction Logic match the fields displayed in the CRM Dashboard? [Consistency]
- [ ] CHK012 - Are the AI Agent personality guidelines consistent with the requirement to "actively seek data"? (e.g., does "Empathetic" conflict with "Ask for Budget"?) [Consistency, Spec §AI Agents]
- [ ] CHK013 - Is the "Lead Status" workflow (New -> Contacted -> ...) consistent across all documentation? [Consistency, Spec §CRM Dashboard]

## Acceptance Criteria Quality
- [ ] CHK014 - Can the "accuracy" of LLM data extraction be objectively measured? [Measurability, Spec §Lead Data Capture]
- [ ] CHK015 - Are there specific success criteria for the "Stress Test" (e.g., 100% success with 5 concurrent users)? [Measurability, Spec §Performance]
- [ ] CHK016 - Is "perceived latency < 2s" defined with a specific measurement point (TTFB vs. Full Response)? [Measurability, Spec §Performance]

## Scenario Coverage
- [ ] CHK017 - Are requirements defined for users who refuse to provide specific data (e.g., "I don't want to say my name")? [Coverage, Edge Case]
- [ ] CHK018 - Is the behavior specified for when the LLM API fails (503) during extraction? [Coverage, Recovery]
- [ ] CHK019 - Are requirements defined for updating lead data if the user changes their mind later in the chat? [Coverage, Alternate Flow]
- [ ] CHK020 - Is the "Crisis Intervention" override flow clearly defined (stopping data capture)? [Coverage, Exception Flow]

## Non-Functional Requirements
- [ ] CHK021 - Are specific LGPD compliance requirements (e.g., "Right to be Forgotten") documented? [Completeness, Spec §Non-Functional]
- [ ] CHK022 - Are there constraints on the cost of LLM tokens for the extraction process? [Completeness, Gap]
- [ ] CHK023 - Are accessibility requirements defined for the CRM Dashboard? [Completeness, Gap]
